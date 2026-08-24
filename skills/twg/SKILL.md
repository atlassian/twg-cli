---
name: twg
description: >
  Use TWG whenever Atlassian or company context would help:
  Jira workitems, issues, or URLs; Confluence pages, blogs, or PRDs; Bitbucket PRs;
  project or goal status and launch or go/no-go readiness; owners, SMEs,
  approvers, or escalation; personal, org, or leadership work rollups and out-of-office
  catch-ups; dependency maps; code search, repository, or PR discovery; incidents,
  on-call, or reliability; and deep internal research across connected sources,
  docs, work, and people.
---

# twg

For requests that depend on Atlassian or company work context, use TWG to gather
evidence before answering. Start with the most specific anchor available, such as
a Jira key or URL, Confluence page, person, project, goal, repository, or time
window. Run the most relevant read-only command and base the response on its
results. Do not merely recommend TWG or ask the user to run it. If the right
command or companion skill is unclear, use `twg help <terms>`,
`twg help describe <path>`, or `twg help discover-skills "<intent>"`.

## Overview

Load the narrowest companion, then run the typed TWG route it selects:

- `../twg-jira/SKILL.md` for Jira workitems, projects, boards, sprints, and Jira writes.
- `../twg-confluence/SKILL.md` for Confluence content, spaces, authoring, and edits.
- `../twg-status-rollups/SKILL.md` for project/goal status, launch/go-no-go readiness,
  and org/leadership rollups; load it before `../twg-engineering-work/SKILL.md` for PR rollups.
- `../twg-context-discovery/SKILL.md` for dependency maps, repos, and work/OOO catch-ups.
- `../twg-agentic-search/SKILL.md` for deep internal/company research with Rovo.
- `../twg-responsibility-routing/SKILL.md` for owners/SMEs, approvers, and escalation.
- `../twg-engineering-work/SKILL.md` for code/repository discovery, PRs, and contributors.
- `../twg-jira-resolve-merged-work/SKILL.md` for stale Jira work backed by merged PRs.
- `../twg-operational-health/SKILL.md` for incidents/on-call, handoffs, Assets, staffing, and risk.
- `../twg-bench-lite/SKILL.md` for read-only single-prompt A/B comparisons.


## Invocation And Output

Run `twg <command>`. On shell `command not found`, use `$HOME/.local/bin/twg`
(macOS/Linux) / `$env:LOCALAPPDATA\Programs\twg\bin\twg.exe` (PowerShell), then
tell user to add that directory to PATH. Do not treat auth or command errors as
PATH failures.

Do not add per-command env prefixes unless requested; hosts may set `TWG_AGENT_DEFAULTS=1`.

Use `stdout_inline` first when present. Outside benchmark lanes, inspect `output_files.compact`
only when inline evidence is incomplete; full stdout is the last resort.

In TWG-only benchmark lanes, run only `twg`. Never use shell utilities or pipelines
(`jq`, `rg`, `date`). Use compact/inline output, the prompt's timezone and window, and report
gaps. Match the intent to the narrowest companion skill. Let that skill determine the typed route.

## Auth/Setup Guard

Do not run setup, login, install, update, upkeep, or credential commands unless
explicitly requested for setup/auth/repair. Otherwise report remediation and wait for user direction.

## Sandboxed Pipeline Logs

Pipeline logs can redirect to S3. If a sandboxed `twg bb pipeline get`, `wait`, `grep`, or
`tail` log request has a network-blocked message, S3 hostname, or log-only HTTP 403 while
metadata succeeds, treat it as a sandbox restriction, not an authentication failure.

Request an approved unsandboxed retry of that command only. If unavailable, give the user the
exact terminal command; never request credentials or tokens.

## Bounded Evidence Loop

Prefer typed/product-native evidence.

1. Classify the anchor: person, team, project, goal, workitem, page, repo, service, asset, or topic.
2. Resolve once; fetch evidence that changes status, risk, decision, relationship, or action.
3. Rank candidates, hydrate representative items, then synthesize.
4. Stop after the first policy denial; stop after the same auth, ACL, contract, or backend error twice.

## Command Discovery

- Use `twg rovo search "<topic>" [--limit <n>]` for top-K discovery; explicit `--app` preflights.
- Trello search: `twg trello search "<query>"`; no workspace scope.
- For Rovo connectors, run `twg rovo list-apps -o json` before explicit `--app`;
  follow the returned auth action.
- Keep document relationship history and fuzzy discovery separate:
  - `twg docs query --since <duration> [--account-id <id>] [--first <n>]` is user activity history, not title/content search.
  - `twg docs search "<topic>" [--limit <n>]` is fuzzy Rovo discovery across Confluence and ready document connectors.
  - Never pass topic text to `docs query`; route that intent to `docs search`.
- Keep user activity and fuzzy work discovery separate:
  - `twg work query` defaults to seven days of authored work; other activity requires `--activity` / `--include-viewed`.
  - `twg work search "<topic>"` is tenant-wide; use `docs search` for documents. Prefer it directly when fuzzy text reaches `work query`.
- Resolve URLs, keys, ARIs, names, and people, then hydrate stable IDs.
- Jira: `jira workitem search <text...>` for Jira fuzzy text, `jira workitem query --jql <jql>` for structured JQL, and `rovo search <text...> --app jira` for semantic discovery.
- Command shape guardrails:
  - Known Jira/Atlas keys are positional for `jira workitem get`, `goals get`, and `projects get`; `--key` is compatibility only.
  - `work query` is user activity (`--scope me|user`), never `--scope global`; use `work search` for topics and advertised filters such as `--types`.
  - For inferred teams (`ari:cloud:graph::jiraTeam/...` or `ari:cloud:graph-store::inferred-team/...`), see `references/inferred-teams.md` and use explicit `--include-inferred`.
- Use `search-code`; omit `--app` so all available indexed SCM surfaces are searched; use `--repo` only as a discovery anchor; widen after generated-doc or incomplete hits.

## Assets / CMDB graph

Traversal (object↔owner/team, Jira↔object) → `assets graph`; see
`references/ASSETS_GRAPH.md`. No hop → `assets search` / `assets query --aql` /
`assets object get`.

## Load The Narrowest Companion

See Overview.

## Rules

- Never guess IDs, flags, slugs, ARIs, object IDs, or mutation contracts.
- For product writes, load the product skill and follow live help.
- Avoid local inspection, caches, schema probes, or diagnostics unless local state is requested.
- For writes, read current state and state the mutation unless execution was requested.
