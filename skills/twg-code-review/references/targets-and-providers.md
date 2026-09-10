---
description: Target selection, fixed review snapshots, and provider read rules.
---

# Code review — targets and providers

## Resolution

Ask the user if there is any ambiguity about the target, destination/base, or
whether local uncommitted changes belong in scope. Never infer between multiple
open PRs, remotes, branches, or plausible merge bases.

Do not switch the user's checkout. Prefer provider reads for a remote PR. When
local execution is required, follow repository worktree policy and use an
isolated worktree.
Provider reads do not require a worktree. Fetching Git refs must not reset,
clean, or switch the user's checkout.

## Snapshot

Record the base SHA, head SHA, diff hash, conversation hash, and read time before
analysis. Read them again immediately before finalizing. If they changed, fetch
the new snapshot once and repeat the review. If they change again, stop with
`incomplete` and name what kept changing.

For a local target, default to the committed `merge-base...HEAD` diff. Record the
merge-base, HEAD, branch/upstream, and worktree state. If the worktree is dirty,
show the changed paths and ask whether staged, unstaged, and untracked content
belongs in scope before reviewing it.

## Bitbucket

Use TWG Bitbucket reads for PR metadata, diff, activity, comments, tasks, commits,
and relevant pipeline state. Keep Bitbucket auth separate from general Atlassian
auth. A posting plan may use existing TWG Bitbucket auth only after permission.

## GitHub

Use TWG search/context to discover linked company evidence. Use an already
authenticated provider-native GitHub reader for the diff, review, and
conversation data. Posting may use an existing `gh` or GitHub connector session;
never start an authentication flow implicitly.

## Local

Use Git for repository state. Local reviews have no provider
writer; produce Markdown and JSON but mark posting unavailable unless the user
later supplies an unambiguous supported PR target.
