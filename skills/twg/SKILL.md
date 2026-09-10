---
name: twg
description: >
  Use TWG whenever Atlassian or company context would help:
  Jira workitems and issues; Confluence pages and PRDs; Bitbucket PRs;
  project or goal status and launch readiness; owners, SMEs,
  approvers, or escalation; personal, org, or leadership work rollups and out-of-office
  catch-ups; dependency maps; code search, repository, or PR discovery; incidents,
  on-call, or reliability;
  and deep internal research across connected sources, docs, work, and people.
---

# twg

Run TWG for requests needing Atlassian or company context; do not merely
recommend it or ask the user to run it. Start from a specific anchor: Jira
key or URL, page, person, project, goal, repo, or time window. Answer from
read-only command results. If the route is unclear: `twg help <terms>`, `twg help describe <path>`,
`twg help discover-skills "<intent>"`.

## Overview

Load the narrowest companion, then use its TWG route:

- `../twg-jira/SKILL.md` for Jira workitems, projects, boards, sprints, and writes.
- `../twg-confluence/SKILL.md` for Confluence content, spaces, and authoring.
- `../twg-space-creation/SKILL.md` to create or clone Confluence spaces.
- `../twg-status-rollups/SKILL.md` for project/goal status, launch/go-no-go readiness,
  and org/leadership rollups; it precedes `../twg-engineering-work/SKILL.md` for PRs.
- `../twg-context-discovery/SKILL.md` for dependency maps, repos, and OOO catch-ups.
- `../twg-agentic-search/SKILL.md` for deep internal research with Rovo.
- `../twg-responsibility-routing/SKILL.md` for owners/SMEs, approvers, escalation.
- `../twg-engineering-work/SKILL.md` for code/repo discovery, PRs, and contributors.
- `../twg-jira-resolve-merged-work/SKILL.md` for stale Jira work with merged PRs.
- `../twg-operational-health/SKILL.md` for incidents/on-call, handoffs, Assets, and risk.
- `../twg-bench-lite/SKILL.md` for read-only single-prompt A/B comparisons.
- `../twg-code-review/SKILL.md` only when named or asked for additional code-review context.


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

Do not run setup, login, install, upgrade, upkeep, or credential commands unless
explicitly requested for setup/auth/repair. Otherwise report remediation and wait for user direction.

## Sandboxed Pipeline Logs

Pipeline logs can redirect to S3. A sandboxed `twg bb pipeline get`, `wait`, `grep`, or
`tail` log request that shows a network-blocked message, S3 hostname, or log-only HTTP 403
while metadata succeeds is a sandbox restriction, not an auth failure. Request an approved
unsandboxed retry of that command only, or give the user the exact terminal command. Never
request credentials.

## Bounded Evidence Loop

1. Classify the anchor: person, team, project, goal, workitem, page, repo, service, or asset.
2. Resolve once; fetch evidence that changes status, risk, decision, or action.
3. Rank candidates, hydrate the set in one batched call, then synthesize.
4. Stop after the first policy denial; stop after the same auth, ACL, contract, or backend error twice.

## Batch Reads

One call per entity is the costliest mistake: every call re-submits the whole
conversation. When a `get` accepts a repeated identifier - live help marks these
"one or more" - pass the whole set in one call with `--agent-fields @compact`,
about twenty IDs at a time. Otherwise answer from a query or tree route
(`... query`, `pr-tree`, `work-tree`, `workitem-tree`, `org-tree`, `context`)
rather than hydrating each entity, or hydrate a ranked sample and say what was
omitted. Pick the projection before the batch call; re-running one batch to
change `--agent-fields` pays for the set twice. After five same-subcommand
calls with different IDs, stop and re-route.

## Command Discovery

- Use `twg rovo search "<topic>" [--limit <n>]` for top-K discovery; explicit `--app` preflights.
- Trello: `twg trello search "<query>"`; no workspace scope.
- Run `twg rovo list-apps -o json` before an explicit Rovo `--app`; follow the returned auth action.
- Activity history and fuzzy discovery are separate surfaces:
  - `twg docs query --since <duration>` is user document activity, not title/content search.
  - `twg work query` defaults to seven days of authored work; other activity requires `--activity` / `--include-viewed`.
  - `twg docs search "<topic>"` is fuzzy document discovery; `twg work search "<topic>"` is tenant-wide work discovery.
  - Never pass topic text to `docs query` or `work query`; use the matching search.
- Resolve URLs, keys, ARIs, and names, then hydrate stable IDs.
- Jira: `jira workitem search <text...>` for fuzzy text, `jira workitem query --jql` for structured JQL, `rovo search <text...> --app jira` for semantic.
- Command shape guardrails:
  - `work query` uses `--scope me|user`, never `--scope global`.
  - Inferred teams (`ari:cloud:graph-store::inferred-team/...`) need explicit `--include-inferred`; see `references/inferred-teams.md`.
- Use `search-code`; omit `--app` so all available indexed SCM surfaces are searched; use `--repo` only as a discovery anchor; widen after generated-doc or incomplete hits.

## Assets / CMDB graph

Traversal (object↔owner/team, Jira↔object) → `assets graph`; see
`references/ASSETS_GRAPH.md`. No hop → `assets search`, `assets query --aql`,
`assets object get`.

## Load The Narrowest Companion

See Overview.

## Rules

- Never guess IDs, flags, slugs, ARIs, or mutation contracts.
- For writes, load the product skill and follow live help.
- Avoid local inspection, caches, or schema probes unless local state is requested.
- For writes, read current state and state the mutation unless execution was requested.
