---
description: Paginate Confluence content lists with opaque cursors and recover from invalid cursors without unbounded retries.
---

# Pagination

- For automated `confluence content list` pagination, use `-o json` and pass the
  exact returned `nextCursor` as the next request's `--cursor` value. Keep the
  original space, content type, and other filters unchanged.
- Treat cursors as opaque values. Do not use help placeholders such as `<value>`,
  append punctuation from prose, or invent or repair a cursor.
- Stop when `nextCursor` is absent or repeats. On an invalid-cursor HTTP 400,
  never retry the same cursor. If restarting is appropriate, request the original
  first page without `--cursor` once and use its new cursor. If pagination still
  fails, stop and report the error instead of restarting in a loop.
