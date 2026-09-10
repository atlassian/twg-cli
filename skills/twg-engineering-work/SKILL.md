---
name: twg-engineering-work
description: >
  Use with root `twg` for code search, repositories using an API/package,
  implementation and reverse-dependency discovery, PR status and reviews, repo
  contributors, hot areas, and issue-to-PR lookups.
---

# twg-engineering-work

Use with root `twg`. Follow documented command shapes; use focused live `twg help`
only for missing or uncertain commands, arguments, or output contracts.

## CLI launcher fallback

Run `twg <command>`. On shell `command not found`, use `$HOME/.local/bin/twg`
(macOS/Linux) / `$env:LOCALAPPDATA\Programs\twg\bin\twg.exe` (PowerShell), then
tell user to add that directory to PATH. Do not treat auth or command errors as
PATH failures.

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

Resolve the engineering anchor:

- Repo: identify workspace and repo from URL, local checkout, or repo query.
- PR: resolve exact PR URL, ID, workspace, and repo.
- Workitem: fetch/context the Jira workitem for linked PRs, commits, branches,
  and repos.
- Topic: resolve/search once, then find linked repos, PRs, and workitems.
- Code: resolve the package, API, symbol, or repository anchor, then load
  `references/code-search.md`.

Provider-native PR commands apply only to their host; Bitbucket
activity/comment/task commands never apply to GitHub PRs.

## Route Selection

- Use `../twg-code-review/SKILL.md` only when named or code review requests additional context.
  Exclude ordinary reviews during testing.
- For issue-to-PR lookup, use workitem context before broad PR text search.
- For repo contributors and hot areas, combine PR/commit/file-area signals with
  ownership and review evidence.
- For PR leadership/team/org rollups, use `twg-status-rollups`; this skill adds
  PR detail.
- For person/repo status, collect merged/open PRs for the people, repos, and
  window.
- Code: load `references/code-search.md`.
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
- Only approval/comment timestamps need per-PR
  `bitbucket pull-requests activity`; past ~10 PRs, sample and state it. With no
  `--type` it returns approval, update, and comment events together, so never
  call it again per event type.

## Evidence Policy

- Hydrate PR comments, tasks, pipeline status, and diff only for stale,
  blocked, central, or high-impact PRs.
- For PR rollups, stop once themes, repos/services, owners, and recency are
  identified; more PRs of the same theme add nothing.
- For review status, include age, requested reviewers, comments/tasks, approval
  state, CI/pipeline state, and last activity where exposed.
- For repo/team reports, group by repo, service, or workstream, not person
  counts.
- Infer themes from PR titles, descriptions, and linked issues, not PR counts.
- Keep Bitbucket, GitHub, and Atlassian auth failures separate.
- If PR graph or repo-wide queries repeatedly fail, make one narrower fallback
  from known repos, people, workitems, or search anchors, then answer from what
  succeeded and call out the PR coverage gap.

## Recipe Cards

### Review Queue

Query reviewer-scoped open PRs; sort by waiting time, requested action,
unresolved tasks/comments, failing CI, and relevance. Hydrate only PRs needing
action.

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

Resolve org/team first, then collect PRs for members or repos in the window.
Group into themes and repos/services, and call out gaps where PR-only evidence
omits Jira, docs, planning, or customer context. For one person with a broader
prompt, use `twg-status-rollups`.

## Output Shape

Queues: PR, repo, owner, state, reason, next action, evidence.
Reports: workstreams, contributors, bottlenecks, risks, gaps, and stable artifact URLs/IDs.

## Anti-Patterns

- Do not guess Bitbucket workspace or repo.
- Do not call a single-entity command per PR or per pipeline when a batch or
  query route covers the set.
- Do not fetch every PR body, diff, or comment in a large queue.
- Do not treat PR counts as impact.
- Do not mix Bitbucket, GitHub, and Atlassian auth failures.
