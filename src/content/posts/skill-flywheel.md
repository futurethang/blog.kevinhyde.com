---
title: The Skill Flywheel
subtitle: A Tiny Claude Hook That Pays You Back Over Time
date: 2026-04-08
type: AI
tags:
  - AI
  - Claude Code
  - Workflow
description: Explanation of a. new Claude Code hook I am testing to gather continual intel to inform future workflow enhancements.
---

# The Skill Flywheel: A Tiny Claude Hook That Pays You Back Over Time

One of the most underrated aspects of working with an AI coding assistant is the compounding return on workflow automation. Every time you turn a multi-step pattern into a skill, you get that time back forever. The problem is knowing *which* patterns deserve to become skills.

I built a hook that solves this — passively, with zero cognitive overhead.

## The Problem

I develop Claude Code skills for things I do repeatedly: shipping a patch, kicking off a feature, running a bug sweep. Each skill started as a multi-step workflow I noticed myself doing manually, over and over, before I finally sat down and codified it.

That "noticing" step is the bottleneck. You can't automate what you haven't identified. And by the time you've identified it, you've already wasted the time.

What I wanted was a way to capture my workflows as they happened, without thinking about it, so I could review them later and ask: *what pattern is hiding in here?*

## The Solution: A Workflow Logger Hook

Claude Code supports hooks — shell scripts that fire on events like session start, prompt submission, tool use. Most people use them for enforcement (block this, require that). But they're equally useful for **observation**.

I added two hooks to my global Claude config that silently append to a JSONL log file on every session and every prompt:

- `SessionStart` — writes a session boundary marker with timestamp, working directory, git branch
- `UserPromptSubmit` — writes each prompt with metadata

Zero tokens consumed. Zero context injected. Just a file append.

## The Log Format

Each entry is a JSON line:

```jsonl
{"ts":"2026-04-08T14:30:00Z","type":"session","sid":"a1b2c3d4","cwd":"/Users/me/project","project":"my-project","branch":"feature/new-thing"}
{"ts":"2026-04-08T14:32:05Z","type":"prompt","sid":"a1b2c3d4","cwd":"/Users/me/project","project":"my-project","branch":"feature/new-thing","prompt":"rush build --to graph-editor","len":33,"skill":false}
{"ts":"2026-04-08T14:33:12Z","type":"prompt","sid":"a1b2c3d4","cwd":"/Users/me/project","project":"my-project","branch":"feature/new-thing","prompt":"/commit","len":7,"skill":true}
```

The enrichment fields I chose — and why each one earns its place:

| Field | Why |
|-------|-----|
| `sid` | Groups prompts into sessions without relying on log ordering |
| `branch` | Links workflows to feature context ("every time I start a feature branch, I do X, Y, Z") |
| `project` | Enables cross-repo pattern detection |
| `len` | Proxy for prompt complexity — short = commands, long = instructions |
| `skill` | Tracks whether you invoked a skill or did it manually (a gap = skill candidate) |

## The Code

**`~/.claude/hooks/log-workflow.sh`**

```bash
#!/bin/bash
# Workflow logger hook for Claude Code
# Usage: log-workflow.sh session  (SessionStart hook)
#        log-workflow.sh prompt   (UserPromptSubmit hook, reads JSON from stdin)

LOG_FILE="$HOME/.claude/workflow-log.jsonl"
SID_FILE="/tmp/claude-sid"

ts=$(date -u +%Y-%m-%dT%H:%M:%SZ)
cwd=$(pwd)
project=$(basename "$cwd")
branch=$(git branch --show-current 2>/dev/null || echo "")

case "$1" in
    session)
        sid=$(uuidgen | tr '[:upper:]' '[:lower:]' | cut -c1-8)
        echo "$sid" > "$SID_FILE"
        entry=$(jq -cn \
            --arg ts "$ts" \
            --arg sid "$sid" \
            --arg cwd "$cwd" \
            --arg project "$project" \
            --arg branch "$branch" \
            '{ts: $ts, type: "session", sid: $sid, cwd: $cwd, project: $project, branch: $branch}')
        echo "$entry" >> "$LOG_FILE"
        ;;
    prompt)
        sid=$(cat "$SID_FILE" 2>/dev/null || echo "unknown")
        prompt=$(jq -r '.prompt // empty' 2>/dev/null)
        [ -z "$prompt" ] && exit 0
        len=${#prompt}
        skill=false
        [[ "$prompt" == /* ]] && skill=true
        entry=$(jq -cn \
            --arg ts "$ts" \
            --arg sid "$sid" \
            --arg cwd "$cwd" \
            --arg project "$project" \
            --arg branch "$branch" \
            --arg prompt "$prompt" \
            --argjson len "$len" \
            --argjson skill "$skill" \
            '{ts: $ts, type: "prompt", sid: $sid, cwd: $cwd, project: $project, branch: $branch, prompt: $prompt, len: $len, skill: $skill}')
        echo "$entry" >> "$LOG_FILE"
        ;;
esac

exit 0
```

**`~/.claude/settings.json`** — add a `hooks` key:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/log-workflow.sh session",
            "timeout": 5
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/log-workflow.sh prompt",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

Then:

```bash
mkdir -p ~/.claude/hooks
chmod +x ~/.claude/hooks/log-workflow.sh
```

## The Review Process

This is the "log now, automate later" approach. The log runs silently. Once a week (or whenever you're curious), you crack it open:

```bash
# See your last 20 prompts
tail -20 ~/.claude/workflow-log.jsonl | jq .

# Find prompts where you didn't use a skill (skill=false)
# across a type of work you do often
grep '"skill":false' ~/.claude/workflow-log.jsonl | jq '.prompt' | sort | uniq -c | sort -rn | head -20

# Group by session to see workflow sequences
jq -s 'group_by(.sid) | .[] | {sid: .[0].sid, project: .[0].project, prompts: [.[] | select(.type=="prompt") | .prompt]}' ~/.claude/workflow-log.jsonl
```

What you're looking for: **multi-prompt sequences that repeat across sessions** where `skill=false`. Those are the gaps — workflows you're doing manually that could be a skill.

## The Thesis

Most productivity tools optimize for *doing* faster. This optimizes for *knowing what to automate*. The log is passive intelligence: it tells you where your time actually goes, not where you think it goes.

The skill flywheel looks like this:

1. Log captures your natural workflows
2. Weekly review surfaces a repeated pattern
3. You build a skill
4. The skill shows up in the log (`skill=true`)
5. The log reveals the *next* gap

The expected outcome isn't a single win — it's compound interest. Each skill you build based on this data is grounded in real usage, not speculation about what *might* be useful. Over months, the percentage of your sessions that are skill-driven goes up, and the friction of feature work goes down.

## What's Next

The logging foundation is intentionally dumb. Once you have a few weeks of data, there are obvious places to take it:

- A `/review-workflows` skill that reads the log and clusters sessions by similarity, surfacing candidates automatically
- A scheduled weekly agent that writes findings directly to memory
- Tag enrichment — a simple regex pass that categorizes prompts (build, debug, review, ship) for higher-level analysis

But none of that matters until you have the data. Start with the hook.
