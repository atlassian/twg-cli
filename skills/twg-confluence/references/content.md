---
description: Create, read, update, move, archive, label, comment on, version, and export Confluence pages and content.
---

# Confluence Content

Use the unified `confluence content` surface for supported content operations.
Inspect live help because available content types and operations can differ by
build profile.

## Access Links

For `/wiki/access-link/` URLs, first run `twg confluence content resolve-access-link "<url>" -o json` with the full URL.
Use its returned content ID.
Keep the same `--access-link` on EVERY later supported command, including retries, pagination, and comment-type queries.
Never probe without the link.
Never use the token as an ID or this URL as a regular content URL.

## Choose The Content Type

Pages, whiteboards, and databases are peers. Before creating, classify the
request by the job the content does, then pick the matching type. Do not fall
back to a page just because a page can hold the same words.

1. **Explicit type wins.** When the user names a type ("whiteboard," "database,"
   "live doc," "classic page," "blog post") or an exact `--content-type`, use it.
   Preserve an existing mutation target's type.
2. **Spatial or visual intent -> `whiteboard`.** Meaning comes from position,
   connection, or grouping on a canvas. Signals: diagram, flowchart, flow,
   process map, journey map, mind map, org chart, architecture or system map,
   dependency map, timeline or roadmap drawn as a visual, brainstorm, affinity
   map, retro board, sticky notes, 2x2 or matrix, canvas, workshop, "visualize,"
   "sketch," "map out," or "lay out."
3. **Structured record intent -> `database`.** The content is a set of records
   with a stable schema that people will add to, filter, sort, group, or update
   by field over time. Signals: tracker, register, inventory, catalog, log,
   backlog, list of items with status, owner, priority, date, rating, or other
   per-row fields, and any ask to filter, sort, group, or track entries.
4. **Narrative intent -> `live_doc`.** The content explains, decides, teaches,
   plans, or reports in prose: working docs, specs, plans, meeting notes, status
   updates, and one-pagers. Bare "page," "test page," "doc," and "Confluence
   page" requests also default here. Asking for the resulting URL does not
   imply classic content.
5. **Classic intent -> `page`.** Use only for explicit classic/non-live intent,
   such as "classic page," "non-live page," or "not a live doc," or for
   knowledge bases, customer-facing help, established classic-page spaces, and
   verified page-only operations.

Tie-breakers:

- A table that supports a narrative stays inside a page. A standalone set of
  records that people will maintain or filter is a database, even if the
  user says "table" or "list."
- A diagram that illustrates a narrative page is still a whiteboard when the
  request is mainly for the diagram. When the request needs both a narrative
  and a visual or a record set, create the page and the whiteboard or database,
  and link them. Exception: if `twg confluence content body-formats html` has
  the section `## TWG inline whiteboard workflow`, embed a flowchart in the new
  page or live doc as that section tells you.
- A parent, sibling, or reference page's type does not set a new child's type.
- If the request is genuinely ambiguous between types, pick the one whose job
  matches best and state the choice in the final answer; do not ask unless the
  wrong type would be costly to redo.

Load `twg confluence content body-formats --content-type whiteboard` or
`--content-type database` before authoring those bodies.

## Other Content Types

- `blogpost`: dated posts and announcements.
- `folder`: hierarchy-only containers.
- `embed` and `smart_link`: a stored destination URL.

For known content, use the native get command with the stable ID or URL. Request
full body, comments, versions, or permissions only when the task needs them.

## Persisted Remix Infographics

A saved Remix infographic is exposed as an attachment on its owning page. Find
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

To read the generated AI summary for document content, request the dedicated
detail mode:

```bash
twg confluence content get <ID-or-URL> --detail ai_summary -o json --site <site>
```

Read `data.aiSummary`. It is a string when a generated summary exists and
`null` when one is unavailable; this mode never falls back to the standard
page excerpt. Do not use it for whiteboards, databases, embeds, folders, or
smart links because non-document content rejects `--detail`.

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

Embedded whiteboards and databases (`native-embed:whiteboard`,
`native-embed:database`) are read and changed at their own URL with the commands
above, not through page edits. Keep the embed as fetched when you edit the page;
see `body-formats.md`.

Do not add `--detail` to whiteboard, database, embed, or smart-link body reads;
those content types reject it. Use SVG for whiteboard content reads and edits.
For a screenshot or a review of a whiteboard's quality, layout, readability,
spacing, overlap, or clipping, follow the
[asynchronous PNG export workflow](whiteboard-png-export.md). Open the exported
image before giving visual conclusions. SVG does not verify the rendered appearance.

## Embed And Smart Link Reads

An `embed` or `smart_link` stores a destination URL rather than the destination's
content. Route the destination URL to its product or provider, and verify any
connector result by provider identity.

1. Read the Confluence item with `--format url`. Keep its title and destination
   from `data.body.value`.

   ```bash
   twg confluence content get <content-ID> --format url --site <site> \
     -o json --agent-fields data.title,data.body
   ```

   Omit `--detail`; embed and smart-link reads reject it. If a browser URL form
   fails validation, pass the numeric content ID from it.

2. Route the destination by product or provider before searching. Embeds commonly
   point at Atlassian content or ordinary web pages, and neither is a connector
   lookup.

   | Destination                                                                                    | Action                                                                                         |
   | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
   | A Confluence path such as `<site>.atlassian.net/wiki/...`                                      | Read it with `twg confluence content get "<url>"`. Do not search Rovo.                         |
   | A Jira issue path such as `<site>.atlassian.net/browse/<KEY>`                                  | Read it with `twg jira workitem get <KEY> --site <site>`. Do not search Rovo.                  |
   | Another Atlassian product                                                                      | Hand off to that product's native skill and command when available; otherwise report and stop. |
   | A connector-backed provider such as `docs.google.com` or `drive.google.com` for `google-drive` | Continue to step 3.                                                                            |
   | Anything else, including public sites                                                          | Report the destination as an external link and stop. Do not search Rovo.                       |

3. Search that connector by the exact title as stored in Confluence. Preserve
   the whole title, including prefixes such as `Copy of `. If the quoted search
   returns no canonical match, retry once unquoted with the same complete title.
   Do not broaden further. Raw provider URLs and document IDs have poor search
   recall.

   ```bash
   twg rovo search '"<title>"' --app <connector> --limit 20 \
     -o json --agent-fields @evidence
   ```

4. Compare each candidate's stable provider resource ID with the destination.
   Ignore query parameters and fragments. Compare recognizable path IDs
   directly with known scope and bounds; use `twg resolve "<url>"` only when the native contract cannot accept the supplied form or expose a
   clear identifier. A matching title alone is insufficient.

For a read-only summary request, an exact provider resource ID match is
sufficient to summarize that result's indexed text or snippets. Explicitly say
that the summary may be partial or stale; do not present it as a full live read
of the provider document.

Keep the Confluence title and provider title as separate evidence. If they
differ, report both and do not rewrite either title.

Treat returned Rovo text or snippets as indexed, potentially partial or stale
content. `twg docs get` is not a direct provider lookup: it scans the caller's
recent-activity projection and may return metadata instead of the body.

For a connector destination with no canonical match after the bounded title
retry, report that connector availability, indexing, permissions, or search
recall may be incomplete; indexing also lags document creation, so a recently
added document may resolve on a later attempt. Do not substitute a similar
result.

Smart Folder children each carry their own destination and route independently.
Children of one folder routinely land in different branches of step 2, so
classify every child on its own rather than inferring its kind from a sibling.

## Writes

- Supply the title through the title option, not as the first body heading.
- Use body files for multiline or structured content.
- Identify the destination space and parent before create, move, or copy.
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
  Each top-level comment's `replies` lists all its descendants flat; a nested reply's
  `parentCommentId` is the reply it answers. Count the entries in `comments list` or `comments get`
  output: `replyCount` counts direct replies.
- `--resolution-status open|resolved` covers footer and inline comments; `open` includes reopened
  comments and inline comments whose highlighted text an edit removed.
- Inline comments carry `inlineOriginalSelection` and `inlineMarkerRef` (the highlight's
  `data-annotation-id`). If the page HTML lacks that marker, the highlight is gone.
- List/get `--body-format` accepts `md` or `markdown` for Markdown, and `html` for HTML.
- Create requires `--comment-type footer|inline`. Inline comments also require
  `--text-selection`; use the match index/count flags when the selected text repeats.
- Get, update, resolve, and reopen auto-detect the type when `--comment-type` is omitted.
- `comments reply`, `comments resolve` and `comments reopen` take a top-level comment, not a reply.
- Use `--expected-version` on update when the current version is known. A stale version is
  returned as a structured `version_conflict` failure.
- Delete can return `blockingReplyIds` and guidance. Delete those replies before retrying.

## Exports

Export accepts a content ID or URL and a format. The backend resolves the content
type from the ID. Supported combinations:

| Format | Content types             |
| ------ | ------------------------- |
| `png`  | Whiteboard                |
| `pdf`  | Page, blog post, live doc |
| `word` | Page                      |

Unsupported combinations are rejected by the backend. Export behavior depends
on the requested format:

- Word export is synchronous and returns the download URL directly.
- PDF and whiteboard PNG exports start asynchronous tasks. Capture the returned
  task ID and check export status on the same site until complete.

### Whiteboard PNG Export

For a whiteboard screenshot or visual review, follow
[Whiteboard PNG export](whiteboard-png-export.md).

Do not poll Word exports, and do not treat the initial PDF or PNG task response
as a completed export.

## Downloading A Persisted Remix Infographic

Use the existing attachment commands. List the owning page's attachments with
`confluence content attachments list --id <content-id> --filename <media-file-id>`,
then pass the matching result's attachment `id` to
`confluence content attachments download --attachment-id <attachment-id> --out <path>`.
Do not pass `mediaFileId` directly as `--attachment-id`; the two IDs are different.
