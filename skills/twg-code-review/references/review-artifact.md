---
description: Versioned JSON artifact format and helper commands.
---

# Code review — artifact

Write schema version 1 JSON to a uniquely named file in the operating system
temp directory. Do not place review artifacts in the repository. Use the field
guide below and let the helper validate against its bundled schema; do not load
the raw schema into normal review context.

The artifact records the snapshot, outcome, confidence, summary, finding status,
source IDs, checks run, missing evidence, remaining risks, and posting state.
Never include secrets, access tokens, raw external documents,
command logs, or machine-local paths in content intended for a provider.

## Required fields

All fields below are required unless marked optional. Prose fields are plain
text, not Markdown. Use empty arrays when there are no entries.

- Root: `schemaVersion: 1`, `reviewRunId` (letters/digits/`._:-`), `createdAt`
  (ISO timestamp), `target`, `outcome`, `confidence`, `summary`, `findings`,
  `strengths`, `sources`, `validation`, `missingEvidence`, `residualRisks`, `posting`.
- `target`: `kind` (`bitbucket_pr`, `github_pr`, `local`), matching `provider`
  (`bitbucket`, `github`, `local`), `repository`, `baseSha`, `headSha`, `diffHash`,
  `conversationHash`, `acquiredAt` (ISO). Include string `pullRequestId` and `url` for PRs.
  Commit hashes are hex; diff and conversation hashes are SHA-256 hex.
- Each finding: `status`, `severity`, `title`, `anchor` (`path`, optional positive
  integer `line`, optional string `side`), `evidenceSource`, `detail`, `impact`, `suggestion`, `proof`,
  `confidence`, `sourceIds` (IDs from `sources`), optional `fingerprint` (SHA-256).
  Use outcome, severity, and status values from `review-method.md`.
- Each source: `id`, `type`, `title`, `retrievedAt` (ISO), `confidence`; optional
  `key` and `url`. IDs must be unique.
- Each validation entry: `command`, `status` (`passed`, `failed`, `not_run`,
  `unavailable`), `summary`.
- Confidence values: `high`, `medium`, `low`. `strengths`, `missingEvidence`,
  and `residualRisks` are arrays of non-empty strings.
- Initial `posting`: `adapter` (`bitbucket`, `github`, or `none`), `readiness`
  (`not_ready`, or `unavailable` for no writer/local target). Let the helper
  derive rendered content, hashes, size, and posting readiness; do not invent receipts.

## Validate and render

Use the binary helper; do not assume Node or another script runtime:

```bash
twg skills code-review-helper validate <draft.json> -o json
twg skills code-review-helper render <draft.json> -o json --output-file <rendered.json>
```

`render` computes finding fingerprints, the complete Markdown
body, a content hash, a plan hash, byte count, and size decision without truncation. The
helper accepts either a raw artifact or the `.data.artifact` in its prior command
envelope. Use a new `reviewRunId` for a deliberate re-review. Copy the prior
`fingerprint` when a re-review updates the status or explanation for the same
finding. Omit it for a new finding so the helper creates one from its location
and title.

Show the full Markdown and exact posting target to the user. Any artifact edit,
target change, comment-body change, or posting-plan change invalidates the preview
and requires regeneration. Keep the rendered envelope ready for a later posting
request. Load `posting.md` only when posting is requested or authorized.

For a schema-specific validation error or consumer implementation, load
[`review-artifact.schema.json`](review-artifact.schema.json) by exact path:
`twg help describe skill:twg-code-review/references/review-artifact.schema.json`.
SDK callers use `help.loadSkill("twg-code-review", "references/review-artifact.schema.json")`.
