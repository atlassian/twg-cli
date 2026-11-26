---
description: >
  Find and read pull requests - PR lists by repository or person, linked and
  mentioned PRs, and one PR's checks, tasks, comments, diffs, and review activity.
---

# Finding And Reading PRs

Use this reference to find pull requests and read their state, checks, and
review activity. For PR-only status summaries of a person or repository, use
`pr-only-status.md`.

Work in two steps: find the PR set with one list route, then read detail only
for the PRs that change the answer. List routes accept
`-o json --output-summary auto --agent-fields <preset>`; use live help for
options not shown here.

## Workspace And Repository Context

Individual Bitbucket PR commands require a resolved workspace and repository;
PR numbers are local to a repository. Prefer explicit targeting for agent calls
and scripts:

- `--workspace <ws> --repo <repo>` supplies both values.
- `--repo <ws>/<repo>` supplies both values in one reference. A Bitbucket
  repository URL also works.
- A native PR selector also accepts its Bitbucket PR URL and derives those
  coordinates; all PRs in a native batch must share a repository. Pass that URL
  and needed status/comment/diff flags together.
- With neither flag, the local CLI can infer both from a Bitbucket Git remote.
  It checks `origin` first, then the remaining remotes. Remote SDK hosts do not
  automatically inspect the caller's checkout.

For `bb prs mergeability`, Git detection runs only when both flags are omitted:
a bare `--repo <repo>` alone or `--workspace <ws>` alone fails even in a checkout.
Missing context fails before the product API request. Login and `--site` do not
select a default Bitbucket workspace. A 404 after context resolves does not
establish whether the target is missing, inaccessible, or unavailable.

IdentityUser ARIs/profile URLs work for native author/reviewer account filters;
Bitbucket UUIDs and nicknames remain distinct. Do not reinterpret an email or
display name as a Bitbucket UUID.

## Find PRs

| Starting point                    | Route                                                                                                                                                                                                                                         |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Jira issue                        | `twg context jira workitem <KEY> --types ExternalPullRequest` returns PRs linked to or mentioning the issue, grouped by relationship name; only linked PRs belong to the issue. `--since` defaults to `7d`; widen it in days, such as `365d`. |
| Text or key in a repository       | `twg bitbucket pull-requests query <text>` searches titles and descriptions.                                                                                                                                                                  |
| One repository                    | `twg bitbucket pull-requests query` with `--state` (one per call, default `OPEN`), `--author`, `--reviewer`, branch, and created, updated, or merged dates.                                                                                   |
| Person or org across repositories | `twg pull-requests query --scope user` or `--scope org` with `--account-id`, `--role`, `--state`, and date filters. `--only-counts` cannot be combined with merge-date filters; see `twg help describe "pull-requests query"` for alternatives. |
| Known PR URLs                     | `twg pull-requests get <pr-url...>` returns state, reviewers, approvals, and readable repository links for the whole set in one call. Use it to present PRs found through `context`, which returns UUID-based links.                          |

`twg pull-requests query --state open` and `twg pr-tree --state open` include
draft PRs. Use `twg pull-requests query --state draft` for drafts only.

For a known person and topic, start with one query:

```bash
twg pull-requests query auth --author "Jane Doe" --state all
```

Use `--account-id <id> --role author` when the account ID is already known.
Query results include the repository name and the PR URL; hydrate with
`pull-requests get` only when you need reviewers or approvals.
Use returned repository coordinates for further reads; do not substitute a
checkout's remote. Read detail only when the returned evidence leaves a gap.

For changed file paths, use `diffstat` directly. For JSON pipelines, use
`-o json --output-summary none`; agent summaries can otherwise be YAML.
Do not truncate evidence with `head` before selecting the required fields.

`twg pull-requests query --scope all` can fail with `graphstore_pr_query_unavailable`.
For a large org root, keep the window short, or query each direct report.

## Read One PR

| Need                                     | Route                                                                                                                          |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Summary, build and check results         | `twg bitbucket pull-requests get <id> --statuses`                                                                              |
| Mergeability checks and current blockers | `twg bitbucket pull-requests mergeability <id>`; `blocking=true` identifies a current blocker, and `UNKNOWN` means unevaluated |
| Open tasks                               | `twg bitbucket pull-requests task query <id>`                                                                                  |
| Review discussion                        | `twg bitbucket pull-requests comment query <id>`                                                                               |
| Changed files                            | `twg bitbucket pull-requests diffstat <id>`                                                                                    |
| Line changes                             | `twg bitbucket pull-requests diff <id>`, after diffstat narrows the files                                                      |
| Approval and update timeline             | `twg bitbucket pull-requests activity <id>`; `--type` filters one event kind                                                   |

## Native batch evidence

Group selected PR IDs by repository before reading current checks or review history:

```bash
twg bitbucket pull-requests get 101 102 --workspace "<workspace>" --repo "<repo>" --statuses --comments --agent-fields @compact
twg bitbucket pull-requests activity 101 102 --workspace "<workspace>" --repo "<repo>" --limit 50 --agent-fields @compact
```

Each accepts up to 25 IDs. Options apply to each PR; history limits are per PR.
Batch output retains ordered `items` with `input`, `ok`, and `data` or `error`,
plus `summary` and `partial`. Keep successful evidence when another PR fails;
report failed PRs and failed sub-resource reads. `--batch-concurrency` can lower
parallelism (default/maximum 5); `--strict` returns a failure exit code for
incomplete batches while retaining the results. A single ID keeps its existing
output shape. Use the general `pull-requests get <url...>` when its reviewer and
state evidence already answers the question.
