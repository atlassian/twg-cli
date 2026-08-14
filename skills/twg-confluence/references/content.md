---
description: Create, read, update, move, archive, label, comment on, version, and export Confluence pages and content.
---

# Confluence Content

Use the unified `confluence content` surface for supported content operations.
Inspect live help because available content types and operations can differ by
build profile.

## Content Types

- `live_doc`: use for collaborative or likely co-authored internal content when
  supported, including working docs, plans, meeting notes, and status updates.
  Bare "page," "test page," and "Confluence page" requests also default here;
  asking for the resulting page URL does not imply classic content.
- `page`: use only for explicit classic/non-live intent, including "classic
  page," "non-live page," "not a live doc," or an exact `--content-type page`
  instruction; also use for knowledge bases, customer-facing help, established
  classic-page spaces, and verified page-only operations.
- `blogpost`: dated posts and announcements.
- `folder`: hierarchy-only containers.
- `whiteboard` and `database`: specialized formats when the build advertises
  support.

Preserve an existing mutation target's type. A classic parent or reference page
does not determine a new child's type.

For known content, use the native get command with the stable ID or URL. Request
full body, comments, versions, or permissions only when the task needs them.

## Non-doc Read-back And Whiteboard Rendering

Non-doc body formats hydrate their bodies through `--format`, not `--detail`:

```bash
# Editable persisted whiteboard SVG.
twg confluence content get <ID-or-URL> \
  --format svg \
  -o json \
  --output-file /tmp/whiteboard.json \
  --site <site>
jq -r '.data.body.value' /tmp/whiteboard.json > /tmp/whiteboard.svg

# Persisted database rows and fields.
twg confluence content get <ID-or-URL> \
  --format csv \
  -o json \
  --output-file /tmp/database.json \
  --site <site>
jq -r '.data.body.value' /tmp/database.json > /tmp/database.csv
```

Do not add `--detail` to whiteboard, database, embed, or smart-link body reads;
those content types reject it. For whiteboard visual verification, request the
rendered PNG explicitly:

```bash
twg confluence content get <ID-or-URL> \
  --format png \
  --output json \
  --site <site> > /tmp/whiteboard-png.json
```

The response contains a short-lived signed media URL, normally in
`data.body.value`. Download the bytes behind that URL to a `.png` file, open the
file, and inspect the rendered layout before claiming visual verification.
`--output-file` writes the full command payload, including the returned PNG URL.
A URL alone is not visual proof.

## Writes

- Supply the title through the title option, not as the first body heading.
- Use body files for multiline or structured content.
- Resolve the destination space and parent before create, move, or copy.
- Read current state before update or delete.
- Verify the created or changed entity and report its stable URL.

For Share dialog access changes, map General access through
`restriction-state`: `Open / Can edit` -> `OPEN`, `Open / Can view` ->
`EDIT_RESTRICTED`, and `Restricted` -> `VIEW_RESTRICTED`. Map Specific access
through direct `permissions`: `Can edit` -> `update` and `Can view` -> `read`.

Copy operations may copy only the selected entity rather than descendants.
Inspect the exact contract and do not imply a subtree copy without evidence.

## Exports

Export behavior depends on the requested format:

- Word export is synchronous and returns the download URL directly.
- PDF export starts an asynchronous task. Capture the returned task ID, poll
  the export-status command, and return the download URL after completion.

Do not poll Word exports, and do not treat the initial PDF task response as a
completed export.
