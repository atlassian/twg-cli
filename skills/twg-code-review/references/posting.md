---
description: User permission, single-comment posting, duplicate checks, and re-review behavior.
---

# Code review — posting

Load only after the user requests or authorizes posting. Normal review and
artifact rendering do not require this reference.

Posting is optional. Show the complete Markdown, target PR, provider, snapshot
head SHA, content hash, plan hash, and size status before writing. A user request to review
and post authorizes the resulting single top-level comment on that target;
do not ask again. If posting was not requested, ask for permission for the
prepared plan. Posting permission authorizes no other PR mutation.

Before writing, read the snapshot and conversation hashes again. A target
change requires a refreshed review and posting plan. If permission covered only
a specific preview, a content or plan change requires fresh permission. An
existing request to review and post still applies to the refreshed review of
the same target. If the identical run marker or
content hash is already present, do not post a duplicate. A deliberate re-review
uses a new run ID and creates a new comment so earlier reviews stay visible.

Use existing credentials only:

- Bitbucket: TWG Bitbucket comment command with current Bitbucket auth.
- GitHub: an already authenticated provider-native `gh` or GitHub connector.
- Local: posting unavailable.

Never initiate login implicitly. If no writer is authenticated, keep the review
and JSON artifact, mark posting unavailable, and give the user the exact
next step without requesting credentials.

Post only the rendered review block. It includes target/head, outcome,
confidence, findings, sources used to reach the outcome, checks run, missing
evidence, remaining risks, and the retry marker. The marker hashes the provider,
repository, PR ID, URL, base, head, diff, and conversation snapshot so an old
post record cannot be reused after any of those fields changes. The separate
plan hash also binds the adapter and size limit. Retain it from the preview for
`record-post`; do not replace it from edited artifact data. Exclude local paths, command
logs, artifact location, raw external content, and review-content telemetry.
The helper renders review prose as plain text so copied headings, links, HTML,
and provider mentions cannot change the comment structure or notify people.

If the provider size check fails, do not truncate or split silently. Ask the
user whether to shorten the review, then regenerate and preview the new plan.

## Helper commands

```bash
twg skills code-review-helper posting-plan <rendered.json> -o json --output-file <posting-plan.json>
twg skills code-review-helper record-post <posting-plan.json> --comment-id <id> --comment-hash <hash> --plan-hash <preview-plan-hash> --comment-url <url> -o json --output-file <posted.json>
```

Retain the preview's `planHash` separately from the editable artifact and pass
that original value to `record-post`. It covers schema version, review run,
target snapshot, comment hash, adapter, and size limit. Do not substitute a newly
generated hash without showing the new plan. The hash detects stale previews;
it is not a signature or proof that a provider comment exists. Record a post
only after the provider confirms success.
