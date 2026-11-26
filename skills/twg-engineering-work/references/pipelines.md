---
description: Read Bitbucket pipeline runs - recent and failed builds for a repository or branch, one run's steps, logs, and test reports, and coverage of a time window.
---

# Pipelines

Use this reference for build and CI questions about a repository: recent runs,
failures, flaky or recurring steps, and the checks behind a PR. For the checks on
one PR, `twg bitbucket pull-requests get <id> --statuses` is usually enough.
If the conclusion depends on which tests ran, read the linked pipeline's steps:
an overall successful result can include skipped checks. Match the run to the
relevant branch and commit; keep passed, failed, skipped, and unknown separate.

Work in two steps: list runs with one query, then read only the runs whose
details change the answer. Both commands take `--workspace <ws> --repo <repo>`.

## List Runs

`twg bitbucket pipeline query` returns runs newest first. Filter with
`--status` (for example `FAILED`), `--state`, `--branch`, `--trigger`, or
`--pattern`. It has no date filter and returns 15 runs by default: for a time
window, raise `--limit` and check the returned timestamps before claiming the
window is covered.

For outstanding failures, check later runs of the same relevant workflow before
recommending a repair. A successful unrelated workflow or a skipped step does not
prove recovery. Reuse the run history already fetched; historical failure
summaries do not need a current-state check.

Use `--output json --output-summary auto`. Read `stdout_inline` when present;
otherwise read `output_files.compact`. The compact view keeps every returned
build's identity, status, timing, target, trigger and commit. Saved query JSON
is a top-level array: use `.[]`, not `.values[]`. Calculate counts, durations
and selected build details together from that saved file. Use
`--agent-fields @evidence` for creator or run details; `output_files.stdout`
retains every original field.

The returned Bitbucket build link already includes the build number and
opens the results directly. Repeat `--repo` for a combined history;
`--limit` applies to the combined result, so query separately for equal samples
per repository.

## Read One Run

`twg bitbucket pipeline get --pipeline <build-number>` returns the run and its
steps. Add `--logs --failed-steps` for failing-step logs, `--lines` to cap log
length, `--step` for one step, and `--test-reports` or `--test-cases` for test
results. Group failures by step and cause before hydrating more runs.
