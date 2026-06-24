---
description: Create, read, update, move, archive, label, comment on, version, and export Confluence pages and content.
---

# Confluence Content

Use the unified `confluence content` surface for supported content operations.
Inspect live help because available content types and operations can differ by
build profile.

## Content Types

- `live_doc`: collaborative internal documents and ordinary new team content.
- `page`: classic pages, knowledge bases, customer-facing help, and operations
  that are page-only.
- `blogpost`: dated posts and announcements.
- `folder`: hierarchy-only containers.
- `whiteboard` and `database`: specialized formats when the build advertises
  support.

For known content, use the native get command with the stable ID or URL. Request
full body, comments, versions, or permissions only when the task needs them.

## Writes

- Supply the title through the title option, not as the first body heading.
- Use body files for multiline or structured content.
- Resolve the destination space and parent before create, move, or copy.
- Read current state before update or delete.
- Verify the created or changed entity and report its stable URL.

Copy operations may copy only the selected entity rather than descendants.
Inspect the exact contract and do not imply a subtree copy without evidence.

## Exports

Export behavior depends on the requested format:

- Word export is synchronous and returns the download URL directly.
- PDF export starts an asynchronous task. Capture the returned task ID, poll
  the export-status command, and return the download URL after completion.

Do not poll Word exports, and do not treat the initial PDF task response as a
completed export.
