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

## Persisted Remix Infographics

A saved Remix infographic is exposed as an attachment on its owning page. Resolve
and download it with the existing content attachment commands:

```bash
twg confluence content attachments list \
  --id <content-id> \
  --filename <media-file-id> \
  --site <site> \
  -o json

twg confluence content attachments download \
  --attachment-id <id-from-list-result> \
  --out <local-path> \
  --site <site>
```

The first command's matching `id` is the Confluence attachment ID. It is not the
Remix `mediaFileId`; passing `mediaFileId` directly to `--attachment-id` fails
validation or lookup. Do not invent a Media Platform URL or substitute the
attachment result's internal `fileId`.

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
`restriction-state`: `Open, Anyone in this space can edit` -> `OPEN`; `Open,
Anyone in this space can view` -> `EDIT_RESTRICTED`; and `Restricted, Only
specific people can view or edit` -> `VIEW_RESTRICTED`. Map Specific access
through direct `permissions`: `Can edit` -> `update` and `Can view` -> `read`.
Specific access grants add access; they do not restrict other principals or
change General access. Each principal holds exactly one direct level, and
`update` already includes `read`/view.

`content create --private` already sets General access to `VIEW_RESTRICTED` and
gives the creator `update`. Do not add `read` for that creator: it is redundant
for viewing and would replace edit access. For existing content, ensure the
caller has `update` before setting General access away from `OPEN`; the server
rejects a state change that would lock the caller out.

Copy operations may copy only the selected entity rather than descendants.
Inspect the exact contract and do not imply a subtree copy without evidence.

## Comments

- `comments list` returns footer and inline comments when `--comment-type` is omitted.
- Each list invocation returns one agentic API page. `--limit` accepts 1-250 and defaults to 50;
  it is a page size, not an all-results cap. If JSON `data.nextCursor` is present, pass that value
  to the next invocation with `--cursor` and continue until `nextCursor` is absent.
- Pass `--include-replies true` to list nested replies; `comments get` includes replies by default.
- List/get `--body-format` accepts `md` or `markdown` for Markdown, and `html` for HTML.
- Create requires `--comment-type footer|inline`. Inline comments also require
  `--text-selection`; use the match index/count flags when the selected text repeats.
- Get, update, resolve, and reopen auto-detect the type when `--comment-type` is omitted.
- Use `--expected-version` on update when the current version is known. A stale version is
  returned as a structured `version_conflict` failure.
- Delete can return `blockingReplyIds` and guidance. Delete those replies before retrying.

## Exports

Export behavior depends on the requested format:

- Word export is synchronous and returns the download URL directly.
- PDF export starts an asynchronous task. Capture the returned task ID, poll
  the export-status command, and return the download URL after completion.

Do not poll Word exports, and do not treat the initial PDF task response as a
completed export.
