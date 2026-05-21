---
name: twg-engineering-work
description: >
  Use with the root `twg` skill for pull-request queues, stale reviews, repo
  contributors, repo hot areas, PR-based status, issue-to-PR lookups, and
  engineering review bottleneck analysis.
---

# twg-engineering-work

Use together with the root `twg` skill. Exact command grammar must come from
live `twg help`, `twg help <terms>`, or `twg help describe <path>`.

## Use When

- "Which PRs are waiting for my review?"
- "Latest PRs for this issue"
- "Who contributed most to this repo/topic?"
- "Repos I created PRs in"
- "Stale reviews"
- "Review flow or bottlenecks"
- "PR-only leadership readout"
- "Open bugs/tasks with PRs in flight"

## First Move

Resolve the engineering anchor:

- Repo prompt: identify workspace and repo from URL, local checkout, or repo query.
- PR prompt: resolve exact PR URL, ID, workspace, and repo.
- Workitem prompt: fetch/context the Jira workitem to discover linked PRs,
  commits, branches, and repos.
- Topic prompt: resolve/search once, then find linked repos, PRs, and workitems.

Use typed Bitbucket, Jira, context, and search command families when they clearly
match the prompt. Use focused help only when the route or exact contract is
unclear.

## Route Selection

- For queues, query candidate PRs first, then hydrate selected PRs needing action.
- For stale reviews, group by repo, author, reviewer, and stage before fetching
  detailed comments or diffs.
- For issue-to-PR lookup, use workitem context before broad PR text search.
- For repo contributors and hot areas, combine PR/commit/file-area signals with
  ownership and review evidence.
- For PR-based status, resolve org/team first, then collect merged or open PRs
  for the relevant members, repos, and time window.

## Evidence Policy

- Hydrate PR details, comments, tasks, pipeline status, and diff only for stale,
  blocked, central, or high-impact PRs.
- For review status, include age, requested reviewers, comments/tasks, approval
  state, CI/pipeline state, and last activity.
- For repo/team reports, group by repo, service, or workstream rather than only
  person counts.
- Inspect PR titles/descriptions and linked issues to infer themes; do not rank
  solely by PR count.
- Keep Bitbucket auth failures separate from Atlassian auth failures.

## Recipe Cards

### Review Queue

Query reviewer-scoped open PRs. Sort by waiting time, requested action,
unresolved tasks/comments, failing CI, and project relevance. Hydrate only PRs
that need action.

### Stale Reviews / Review Bottlenecks

Find PRs open or waiting beyond the threshold. Group by repo, author, reviewer,
and stage. Identify bottleneck patterns such as missing reviewer, unresolved
tasks, failing CI, repeated request-changes, or owner unavailable.

### Issue PRs

Use workitem context to find linked PRs, commits, branches, and repos. Fetch PRs
only if the user asks for details, status, or next action.

### Repo Contributors / Hot Areas

Query PRs/commits for the repo and time window. Group by files/areas, authors,
reviewers, and themes. For hot areas, prioritize changed area plus frequency and
ownership signals.

### PR-Based Status Rollup

Resolve org/team first, then collect PRs for members or repos in the time window.
Group into themes and repos/services. Call out gaps where PR-only evidence omits
Jira, docs, planning, or customer context.

## Output Shape

- Queue/action tasks: table with PR, repo, owner, state, why it needs attention,
  next action, and evidence.
- Engineering reports: executive summary, repo/workstream table, contributors,
  review bottlenecks, risks, and gaps.
- Always include URLs or stable IDs for key artifacts.

## Anti-Patterns

- Do not guess Bitbucket workspace or repo.
- Do not fetch every PR body, diff, or comment in a large queue.
- Do not treat PR counts as impact.
- Do not mix Bitbucket auth failures with Atlassian auth failures.
