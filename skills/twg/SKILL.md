---
name: twg
description: >
  Root TWG CLI skill for Atlassian work-data tasks. Use typed commands for known
  anchors; use live `twg help` only when command shape or output contract is
  uncertain.
---

# twg

First TWG routing step: use typed commands for stable keys, URLs, ARIs, and
familiar families. If uncertain, inspect `twg help <terms>` or
`twg help describe <path>`. For specialized guidance, run
`twg help discover-skills "<intent>"`.

## Overview

For synthesis, load the narrowest workflow skill:

- `twg-status-rollups` for person, team, org, project, goal, leadership, and appraisal readouts.
- `twg-context-discovery` for topic deep dives, dependency maps, context graphs, repo discovery, and catch-ups.
- `twg-engineering-work` for PR queues, stale reviews, repo contributors, hot
  areas, and PR status.
- `twg-jira-resolve-merged-work` for dry-run-first Jira board/sprint/epic/space cleanup where merged PR evidence can safely resolve stale workitems.
- `twg-operational-health` for handoffs, reliability/incidents, Assets,
  staffing, meeting summaries, and risk.
- `twg-bench-lite` for read-only single-prompt A/B comparisons.


## Invocation And Output

Run TWG directly:

```bash
twg <command>
```

Agent hosts may set `TWG_AGENT_DEFAULTS=1`; do not add per-command env prefixes unless requested.

For large outputs, inspect `output_files.compact` first when present. Read or
filter `output_files.stdout` only when compact output lacks evidence.

## Auth/Setup Guard

Do not run setup, login, logout, install, update, upkeep, or credential commands
from ordinary TWG requests. Only run them for explicit setup/auth/repair
asks or setup/auth skills. If missing, report remediation and wait for user direction.

## Bounded Evidence Loop

For synthesized answers, converge instead of exhaustively hunting; prefer typed
commands or product-native paths with stronger evidence.

1. Classify the anchor: person, team, project, goal, workitem, page, repo,
   service, asset, or topic.
2. Resolve IDs once, then fetch only evidence that can change owner, status,
   risk, decision, relationship, priority, or next action.
3. Group large candidate sets; hydrate representative top items.
4. Prefer compact/evidence output. Inspect full stdout only for missing fields.
5. After each batch, synthesize once evidence, recency, and confidence hold.
6. Stop a path after the same auth, ACL, contract, or backend error twice.

## Command Discovery

- Use typed commands directly for familiar families: `resolve`, `search`,
  `user`, `org-tree`, `work query`, `work search`, `pull-requests`, `jira`,
  `confluence`, `docs`, `context`, `responsibility`, `goals`, `projects`,
  `assets`, and `trello`.
- Use `twg search "<topic>" [--limit <n>]` for relevance-ranked top-K discovery
  across built-ins and ready connectors. Implicit unavailable connectors warn;
  explicit `--app` preflights and fails.
- For fuzzy Trello board/card discovery, use `twg trello search "<query>" --limit 20`; no workspace scoping.
- For Rovo connector searches, use `twg rovo list-apps -o json`
  (`list-connectors` is an alias) to discover site-visible `--app` filters.
  Explicit `twg rovo search ... --app <connector>` preflights connector auth;
  follow the returned action or run `twg rovo auth <app>`, then retry.
- Keep document relationship history and fuzzy discovery separate:
  - Use `twg docs query --since <duration> [--account-id <id>] [--first <n>]`
    for documents related to a user through activity, not title/content search.
  - Use `twg docs search "<topic>" [--limit <n>]` for fuzzy Rovo search across
    Confluence and ready document connectors.
  - Never pass topic text to `docs query`; route that intent to `docs search`.
- Keep user activity and fuzzy work discovery separate:
  - `twg work query` defaults to seven days of authored work, full-window counts, and five summary items.
  - Other activity is opt-in through `--activity` / `--include-viewed`.
  - `twg work search "<topic>"` is tenant-wide work discovery; use `docs search` for documents.
  - If fuzzy topic text reaches `work query`, the CLI redirects to `work search`; prefer direct calls.
- Use `twg help <terms>` before guessing grammar and `twg help describe <path>` for contracts.
- Namespace help is not an executable contract. Follow advertised child commands
  before adding flags.
- Resolve URLs, keys, ARIs, names, and people first; hydrate stable IDs with
  product-native commands.
- For Jira discovery, keep the three search modes distinct: use
  `jira workitem search <text...>` for Jira-only fuzzy text backed by JQL,
  `jira workitem query --jql <jql>` for explicit structured filters, and
  `search <text...> --app jira` for semantic Rovo discovery.
- Command shape guardrails:
  - Known Jira/Atlas keys are positional for `jira workitem get`, `goals get`,
    and `projects get`; query `--key` forms are compatibility shortcuts.
  - `work query` is user activity only (`--scope me|user`); use `work search`
    for topic discovery and never use `--scope global`.
  - `work search "<topic>"` is fuzzy work discovery. Use advertised filters such as `--types`.
  - `assets search` is shallow. For device/person joins, inspect schemas/types,
    shortlist owners, then batch `assets query`/`assets object query` with repeated `--account-id`.
- Keep projection commands and product-native commands separate. Do not borrow
  flags across surfaces unless live help advertises them.
- Use `search-code` for indexed code. `--app` selects `bbc`, `github`, or
  `gitlab`; `--workspace` maps to workspace/org/group.

## Load The Narrowest Companion

Use a concrete key, URL, ARI, slug, account ID, name, topic, `me`, or window.

Load companion skills for detailed semantics:

- `../twg-jira/SKILL.md` for Jira semantics.
- `../twg-confluence/SKILL.md` for Confluence semantics and safe body editing.
- `../twg-status-rollups/SKILL.md` for personal/team/org/project/goal/leadership status.
- `../twg-context-discovery/SKILL.md` for context, dependencies, responsibility, and graphs.
- `../twg-engineering-work/SKILL.md` for PRs, reviews, contributors, and bottlenecks.
- `../twg-jira-resolve-merged-work/SKILL.md` for board/sprint/epic/space stale Jira workitems whose implementation appears complete from merged PR evidence.
- `../twg-operational-health/SKILL.md` for handoffs, reliability, incidents, assets, staffing, and risk.


## Rules

- Never guess IDs, flags, account IDs, page IDs, repo slugs, ARIs, object IDs,
  or mutation contracts.
- For product-specific writes or rich body formats, load the relevant product
  skill first and follow exact live help.
- Do not route normal TWG prompts through local workspace inspection,
  cached-output spelunking, raw schema probing, or process diagnostics unless the
  user asks about local state.
- For writes, read current state first and state the intended mutation unless
  the user explicitly asked you to execute it.

