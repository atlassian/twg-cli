---
name: twg
description: >
  Root TWG CLI skill for Atlassian work-data tasks. Use typed commands for known
  anchors; use live `twg help` only when command shape or output contract is
  uncertain.
---

# twg

First TWG routing step: use typed commands for stable keys, URLs, ARIs, and
familiar families. If unsure, inspect `twg help <terms>` or
`twg help describe <path>` first.

## Overview

Use this skill for TWG CLI work-data tasks. For synthesized outcomes, also load
the most specific workflow skill:

- `twg-status-rollups` for person, team, org, project, goal, leadership, and
  appraisal readouts.
- `twg-context-discovery` for topic deep dives, dependency maps, context graphs,
  repo discovery, and catch-ups.
- `twg-engineering-work` for PR queues, stale reviews, repo contributors, hot
  areas, and PR status.
- `twg-operational-health` for handoffs, reliability/incidents, Assets,
  staffing, meeting summaries, and risk.
- `twg-bench-lite` for read-only single-prompt A/B comparisons of free
  Atlassian/local MCP context vs TWG graph context.


## Invocation And Output

Run TWG directly:

```bash
twg <command>
```

Agent hosts may set `TWG_AGENT_DEFAULTS=1`. Do not add per-command environment
prefixes unless requested; runtimes may authorize `twg ...` differently.

For large outputs, inspect `output_files.compact` first; read full stdout only
when compact output lacks evidence. See `references/OUTPUT.md`.

## Auth/Setup Guard

Do not run setup, login, logout, install, update, upkeep, or credential commands
from ordinary TWG requests. Only run them for explicit setup/auth/repair
asks or setup/auth skills. If missing, report remediation and wait for user direction.

## Bounded Evidence Loop

For synthesized answers:

1. Classify the anchor: person, team, project, goal, workitem, page, repo,
   service, asset, or topic.
2. Resolve IDs once; hydrate only evidence that changes the answer.
3. Prefer compact output; inspect full stdout only for missing evidence.
4. Stop after the same auth, ACL, contract, or backend error twice.

## Command Discovery

- Use typed commands directly for familiar families: `resolve`, `search`,
  `user`, `org-tree`, `work query`, `work search`, `pull-requests`, `jira`,
  `confluence`, `docs`, `context`, `responsibility`, `goals`, `projects`,
  `assets`, and `trello`.
- Use `twg search "<topic>" [--limit <n>]` for relevance-ranked top-K discovery
  across built-ins and ready connectors. Implicit unavailable connectors warn;
  explicit `--app` preflights and fails.
- For fuzzy Trello board/card discovery, use
  `twg trello search "<query>" --limit 20`; it does not support workspace
  scoping and is backed by Rovo Search.
- For Rovo connector searches, use `twg rovo list-apps -o json`
  (`list-connectors` is an alias) to discover site-visible `--app` filters.
  Explicit `twg rovo search ... --app <connector>` preflights connector auth;
  follow the returned action or run `twg rovo auth <app>`, then retry.
- Keep document relationship history and fuzzy discovery separate:
  - Use `twg docs query --since <duration> [--account-id <id>] [--first <n>]`
    to list documents related to a user through Teamwork Graph activity. It
    does not search document titles or content.
  - Use `twg docs search "<topic>" [--limit <n>]` for fuzzy Rovo search across
    Confluence and ready third-party document connectors. Document result types
    are fixed automatically; `--limit` is global across ready sources and
    defaults to 20. Unavailable optional connectors do not block ready sources.
  - Never pass topic text to `docs query`; route that intent to `docs search`.
- Keep user activity and fuzzy work discovery separate:
  - `twg work query` defaults to seven days of authored work, full-window counts,
    and five summary items per section. `--counts-only` omits items.
  - Other activity is opt-in through `--activity` / `--include-viewed`.
  - `twg work search "<topic>"` is tenant-wide work-artifact discovery. It
    excludes documents; use `docs search` for those.
- Use `twg help <terms>` before guessing grammar and
  `twg help describe <path>` for exact contracts.
- Namespace help is not an executable contract. Follow advertised child commands
  before adding flags.
- Resolve URLs, keys, ARIs, names, and people first; hydrate stable IDs with
  product-native commands.
- For Jira discovery, keep the three search modes distinct: use
  `jira workitem search <text...>` for Jira-only fuzzy text backed by JQL,
  `jira workitem query --jql <jql>` for explicit structured filters, and
  `search <text...> --app jira` for semantic Rovo discovery.
- Keep projection commands and product-native commands separate. Do not borrow
  flags across surfaces unless live help advertises them.
- Use `search-code` for indexed code across Bitbucket Cloud, GitHub, and
  GitLab. `--app` selects Code Search apps (`bbc`, `github`, `gitlab`);
  `--workspace` means Bitbucket workspace, GitHub org, or GitLab group. Code
  Search still needs the BBC-scoped token as transport auth today.

## Load The Narrowest Companion

Use a concrete key, URL, ARI, slug, account ID, name, topic, `me`, or time
window. Ask before an unbounded search.

Load companion skills for detailed semantics:

- `../twg-jira/SKILL.md` for Jira workitems, fields, transitions, comments,
  boards, and JQL.
- `../twg-confluence/SKILL.md` for Confluence content, spaces, hierarchy,
  comments, versions, permissions, exports, CQL, and safe body editing.
- `../twg-status-rollups/SKILL.md` for personal, team, org, project, goal, and
  leadership status. Use
  `../twg-status-rollups/references/personal-work-summary.md` for bounded
  personal work summaries for any person.
- `../twg-context-discovery/SKILL.md` for deep context, dependency maps,
  responsibility, and graph visualization.
- `../twg-engineering-work/SKILL.md` for PRs, review queues, repo contributors,
  and engineering bottlenecks.
- `../twg-operational-health/SKILL.md` for handoffs, reliability, incidents,
  assets, staffing, and operational health.


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

## References

- `references/HELP.md` - help discovery and exact-command schemas
- `references/OUTPUT.md` - output envelopes and large payload handling
- `../twg-status-rollups/SKILL.md` - status, leadership, project/goal, appraisal, and personal summary readouts
- `../twg-status-rollups/references/personal-work-summary.md` - bounded personal work summaries for any person
- `../twg-context-discovery/SKILL.md` - deep context, dependency maps, and graph visualization
- `../twg-engineering-work/SKILL.md` - PR, review, repo, and engineering work recipes
- `../twg-operational-health/SKILL.md` - handoff, reliability, assets, staffing, and operational health recipes
- `../twg-bench-lite/SKILL.md` - benchmark-lite single-prompt A/B comparisons
