# Micro Posts (Signals)

Short-form notes that appear alongside full blog posts in the main feed, and on a dedicated `/signals` page.

## Frontmatter Schema

```yaml
---
date: 2026-03-10T14:32:00-07:00       # required — ISO 8601 datetime
tags: [ai, orchestration]              # optional — array of tag strings
archetype: "AI Process Engineer"       # optional — see values below
---

Content goes here. No title needed. Just 1-5 sentences.
```

## Archetype Values

| Archetype              | Color   |
|------------------------|---------|
| Product Mind           | Indigo  |
| Systems Architect      | Cyan    |
| AI Process Engineer    | Purple  |
| Domain Expert          | Orange  |
| Quality & Trust        | Green   |

When present, the archetype renders as a small colored pill badge next to the date.

## File Location & Naming

Micro posts live in `src/content/micro/` with the naming convention:

```
YYYY-MM-DD-HHMMSS-micro.md
```

Examples:
- `2026-03-10-143200-micro.md`
- `2026-03-09-091500-micro.md`

The timestamp in the filename prevents collisions for multiple micro posts on the same day.

## Creating a New Micro Post

1. Create a new file in `src/content/micro/` following the naming convention above.
2. Add the frontmatter with at least a `date` field.
3. Write the content below the frontmatter — no title needed.
4. Commit and push. The post will appear in both the main feed and the `/signals` page.

## URL Structure

- **Main feed:** `/` — micro posts appear chronologically alongside full posts
- **Signals feed:** `/signals` — only micro posts, reverse chronological
- **Tag filter:** `/signals/tag/{tag-name}` — micro posts filtered by tag

## Design

- Micro posts have a left border accent and smaller type to distinguish them from full posts
- No comments, no share buttons — read-only stream
- Tags are clickable and filter the signals feed
