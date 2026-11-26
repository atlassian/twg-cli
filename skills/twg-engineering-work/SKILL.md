---
name: twg-engineering-work
description: >
  Use with `twg` for code search, API/package consumers, implementations, reverse dependencies,
  PR status/reviews, repo contributors, hot areas, issue-to-PR links; answer code questions when source is missing locally
---

# twg-engineering-work

Follow documented command shapes; use live `twg help` for missing or uncertain
commands, arguments, or output contracts.

## CLI launcher fallback

Run `twg <command>`. On shell `command not found`, use `$HOME/.local/bin/twg`
(macOS/Linux) / `$env:LOCALAPPDATA\Programs\twg\bin\twg.exe` (PowerShell), then
tell user to add that directory to PATH. Do not treat auth or command errors as
PATH failures.

Agents: use host-set `TWG_AGENT_DEFAULTS=1` or `TWG_AGENT_DEFAULTS=1 twg <command>`. If assignments are blocked, pass `--mode agent` with explicit output flags. Respect host permissions. `--mode user` overrides the opt-in.

## Use When

- "Which PRs are waiting for my review?"
- "Where is this API implemented or used?"
- "Which repositories depend on this package?"
- "Latest PRs for this issue"
- "Who contributed most to this repo/topic?"
- "Repos I created PRs in"
- "Stale reviews"
- "Review flow or bottlenecks"
- "PR-only status for a user, team, or repo", "this person's PRs", "my PRs
  this week"
- "Open bugs/tasks with PRs in flight"

## First Move

Identify the engineering anchor:

- Repo: identify workspace and repo from URL, local checkout, or repo query.
- PR: pass supported URLs directly with known filters and hydration flags.
- Workitem: fetch/context the Jira workitem for linked PRs, commits, branches,
  and repos.
- Topic: search once, then find linked repos, PRs, and workitems.
- Code: start from the known service, behavior, error, API, or symbol. Pass
  repository URLs with explicit file/ref and bounds when known. Load
  `references/code-search.md`.

Provider-native PR commands apply only to their host; Bitbucket
activity/comment/task commands never apply to GitHub PRs.

## Route Selection

- Use `../twg-code-review/SKILL.md` only if the user explicitly invokes `twg-code-review`.
- For issue-to-PR lookup, use workitem context before broad PR text search.
- For repo contributors and hot areas, combine PR/commit/file-area signals with
  ownership and review evidence.
- For PR leadership/team/org rollups, use `twg-status-rollups`; this skill adds
  PR detail.
- For person/repo status, collect merged/open PRs for the people, repos, and
  window.
- Code: load `references/code-search.md`.
- PRs: load `references/pull-requests.md`.
- Pipelines and builds: load `references/pipelines.md`.
- For person-scoped summaries beyond PRs (Jira, docs, meetings, planning,
  notifications), use `twg-status-rollups` plus
  `../twg-status-rollups/references/personal-work-summary.md`.

## Batch The PR Set

Hydrate a PR set in one call, never one call per PR.

- Reviewers, approvals, age, merge state: one `pull-requests get <pr-url…>`
  covers the whole set. Use PR URLs (`url` in query results); ARIs give
  `approved: null`.
- Candidates: `bitbucket pull-requests query` (author, reviewer, state, window)
  or `pull-requests query` (user/org).
- `pr-tree` reviewer counts mean "listed as reviewer", not approved.
- Pipelines: `bitbucket pipeline query` lists recent runs only (`--limit`
  default 15); raise it and check returned timestamps before claiming window
  coverage. `pipeline get` only for failures whose logs matter.
  `commits`/`deployments` batch by ARI.
- Native checks/comments: `bitbucket pull-requests get <id...> --statuses --comments`.
- Review history: `bitbucket pull-requests activity <id...>`. Omit `--type` to
  include all event types; `--limit` applies per PR.
- Group IDs by repository. Both accept 25 IDs with shared `--workspace` and
  `--repo`. Use `--agent-fields @compact`; report per-PR errors and `partial`.

## Evidence Policy

- Hydrate PR comments, tasks, pipeline status, and diff only for stale,
  blocked, central, or high-impact PRs.
- Stop PR rollups once themes, repos/services, owners, and recency are identified.
- For review status, include age, requested reviewers, comments/tasks, approval
  state, CI/pipeline state, and last activity where exposed.
- Group repo/team reports by service or workstream.
- Infer themes from PR titles, descriptions, and linked issues, not PR counts.
- Keep Bitbucket, GitHub, and Atlassian auth failures separate.
- If PR graph or repo-wide queries repeatedly fail, make one narrower fallback
  from known repos, people, workitems, or search anchors, then answer from what
  succeeded and call out the PR coverage gap.

## Recipe Cards

### Review Queue

Classify reviewer-scoped PRs: reviewable now (requested, unapproved, unblocked),
fix-before-review/merge (blocking feedback, tasks or failing CI), already
reviewed. Rank reviewable first; distinguish pre-merge-only tasks, avoid
assumed approvals.

### Stale Reviews / Review Bottlenecks

Find PRs open or waiting beyond the threshold; group by repo, author, reviewer,
and stage. Bottleneck patterns: missing reviewer, unresolved tasks, failing CI,
repeated request-changes, owner unavailable.

### Issue PRs

Use workitem context for linked PRs, commits, branches, and repos. Fetch PRs
only when the user asks for details, status, or next action.

### Repo Contributors / Hot Areas

Query PRs/commits for the repo and window; group by files/areas, authors,
reviewers, and themes. Hot areas rank changed area, frequency, and ownership.

### PR-Based Status Rollup

Identify org/team first, then collect PRs for members or repos in the window.
Group into themes and repos/services, and call out gaps where PR-only evidence
omits Jira, docs, planning, or customer context. For one person with a broader
prompt, use `twg-status-rollups`.

## Answer

Answer directly with links, blockers, next actions, and gaps. Use tables
only when comparison helps.

## Anti-Patterns

- Do not guess Bitbucket workspace or repo.
- Do not call a single-entity command per PR or per pipeline when a batch or
  query route covers the set.
- Do not fetch every PR body, diff, or comment in a large queue.
- Do not treat PR counts as impact.
