---
title: Claude Code + GitHub CLI
subtitle: Automating the drudgery of issue management
date: 2024-12-02
type: thinking
tags:
  - working with AI
  - software development
  - tools
description: Using Claude Code and GitHub CLI to wrangle a messy backlog into shape.
---

Here's a recent connection I've made to improve my quality of life, as far as dull repetitive tasks are concerned.

My work team is readying our project to go from alpha incubator to real-deal production application, so our well-populated but sorta sloppy basket of GitHub issues isn't going to cut it anymore. We have to whip it into shape with proper epics, features, user stories, and weighted tasks so we can actually have some idea of how our progress is coming along.

That amounts to a lot of digging around and writing inside GitHub's (pretty lackluster) Projects board. And no, I am not interested in an alternative platform—WE'RE DOING IT THIS WAY.

Well, this is a time suck and I'm already thinking of ways I can excuse myself from my desk. Hang on . . . this is absolutely something I can throw an LLM at.

## The setup

First step is to install GitHub CLI in your terminal, and if you haven't already, get Claude Code up and running on your system.

In my case, we had our overall structure worked out and somewhat organized by leadership: Epics as large chunks of ownership consisting of Features that are each roughly one sprint worth of work, made up of User Stories that define the finished feature. The core units of work are Tasks that make up the success criteria of a user story—and these are what we were missing to have our project board complete.

## Digesting the backlog

In order to skip GitHub Projects' clunky UI, I began a new Claude Code session, asked it to brush up on GitHub CLI commands using the context7 MCP, and then fed it the issue numbers for my Epics. With some back and forth strategizing and figuring out how I wanted to see my issue content, I arrived at a solid Markdown doc that showed me all the issues nested under my Epics, with their tags, types, and nested relationships all the way down.

Already this is a huge benefit. I've digested a large number of issues into a simple format, custom to my needs (and not requiring me to build one in the GH UI), and I can now direct the LLM to read deeper details on any issue.

## Brainstorming the missing pieces

Now with the context of the existing Epics, Features, and Stories, I began brainstorming all of the new issues that were missing from the current collection. I created a new "brainstorming" document and collaborated with the LLM to list all of the tasks that satisfy the user stories. This is all in Markdown so I have the opportunity to review and revise, until I reached a high-quality and comprehensive list of tasks.

## The actual entry

The absolute worst aspect of this chore was going to be the entry of the new issues. And remember, this is a bootstrapping event—I had roughly 90 issues that needed to be entered. No frikkin' thanks.

But because I had already put together a structured document with clear nesting relationships, the rest is a matter of scripting. Claude vibed out some simple JavaScript scripts to format and push through the GH CLI all of my new issues. There were still some manual steps I'll need to see if I can eliminate, but I'm really pleased with the time I saved.

Doing the reconnaissance, brainstorming, and writing all the new issues was a matter of just a couple hours. A manual approach via the GUI would have taken at least one VERY BORING day.

## The tradeoffs

And yeah, if I was really handy with the CLI I'd still save a lot of time without the use of an LLM. And because I did use the LLM, I had to be much more stringent in my review process. But this is one of the calculated tradeoffs necessary to work well with AI. I gained a ton of momentum using a CLI I have little familiarity with, and was able to study issues in a format that suits me. When it came to generating new issues, I set Claude loose, expecting that many of the core tasks are tried and true, rarely novel problems that most every web application handles. Still, being complete meant actually reading the new issue content being authored.

At the end of the day, there may be some chuff, but nothing that can't be edited or removed. And frankly, these tasks will naturally evolve and need grooming in context that doesn't exist yet, so getting too deep in the weeds now is likely wasted effort.

---

And I can now imagine a positive feedback loop: when others on my team start to get value from the Claude + GitHub CLI combo, it will encourage more thorough issue creation across the board. And you know what that is? Context. A wealth of context that any developer using Claude Code and GitHub CLI can tap into when tackling a new task.
