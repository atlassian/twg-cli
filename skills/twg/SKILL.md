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

- `twg-status-rollups` for personal summaries for any person, team, org,
  project, goal, focus-area, leadership, annual/cycle appraisal readouts.
- `twg-context-discovery` for topic deep dives, dependency maps, context graphs,
  repo discovery, and "catch me up" prompts.
- `twg-engineering-work` for PR queues, stale reviews, repo contributors, hot
  areas, and PR-based status.
- `twg-operational-health` for on-call handoffs, reliability and incident
  reviews, Assets/asset refresh, staffing/capacity, meeting summaries, and
  operational risk.


## Invocation And Output

Run TWG directly:

```bash
twg <command>
```

Agent hosts may set `TWG_AGENT_DEFAULTS=1`. Do not add per-command environment
prefixes unless requested; runtimes may authorize `twg ...` differently.

For large outputs, inspect `output_files.compact` first; read full stdout only
when compact output lacks evidence. See `references/OUTPUT.md`.

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
  across built-ins and ready connectors. The global limit defaults to 20,
  accepts 1-100, and is not pageable; JSON includes `resultInfo` and
  `sourceCounts`. Implicit unavailable connectors warn; explicit `--app`
  preflights and fails.
- For fuzzy Trello board/card discovery, use
  `twg trello search "<query>" --limit 20`; it is backed by Rovo Search and
  does not support workspace/location scoping.
- For Rovo connector searches, use `twg rovo list-apps -o json` to discover
  site-visible `--app` filters and readiness. Explicit
  `twg rovo search ... --app <connector>` preflights auth; follow the returned
  action or run `twg rovo auth <app>`, then retry.
- Keep document relationship history and fuzzy discovery separate:
  - `twg docs query --since <duration>` lists documents related to a user; it
    does not search titles or content.
  - `twg docs search "<topic>" [--limit <n>]` does fuzzy Rovo search across
    Confluence and ready document connectors.
  - Never pass topic text to `docs query`; use `docs search`.
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
- Do not route normal work-data prompts through local workspace inspection,
  cached-output spelunking, raw schema probing, or process diagnostics unless the
  user asks about local state.
- For writes, read current state first and state the intended mutation unless
  the user explicitly asked you to execute it.

## References

- `references/HELP.md` - help discovery and exact-command schemas
- `references/OUTPUT.md` - output envelopes and large payload handling
- `../twg-status-rollups/SKILL.md` - status and rollup recipes
- `../twg-context-discovery/SKILL.md` - context and dependency recipes
- `../twg-engineering-work/SKILL.md` - PR and engineering recipes
- `../twg-operational-health/SKILL.md` - operational health recipes

