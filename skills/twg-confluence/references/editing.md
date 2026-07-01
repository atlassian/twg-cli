---
description: Safely edit Confluence content with body files, snapshot tokens, lossless HTML, and read-back verification.
---

# Confluence Editing

For any non-trivial body edit, use:

```text
read -> save to file -> edit locally -> update from file -> verify
```

## Safe Workflow

1. Fetch the current content at full detail in the format you will edit.
2. Save `data.body.value` to a local file.
3. Capture the response's snapshot token.
4. Modify the file without reconstructing unrelated content.
5. Update with the body file, matching format, and snapshot token; use
   `--dry-run` first only for explicit preview or validation requests, or for
   unusually risky edits where direct execution was not requested.
6. Read back the result.

HTML is the safest round-trip format for macros and exact storage content.
Markdown is easier for prose but may not preserve every Confluence construct.

Do not replace a long existing body with an inline string unless the user
explicitly intends a complete rewrite. Do not omit optimistic-concurrency
tokens when the command requires them.

For targeted edits, prefer an advertised edits-file operation over rewriting
the entire body. Title-only changes should not resend body content.

If the snapshot is stale, refetch and reconcile. Never silently overwrite newer
content.
