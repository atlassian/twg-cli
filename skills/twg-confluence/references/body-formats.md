---
description: Choose HTML or Markdown body formats, load the database CSV and whiteboard SVG specs, preserve macros, encode mentions, diagrams, and avoid unsafe conversions.
---

# Confluence Body Formats

Use only formats advertised by the exact command and content type.

## HTML

HTML is the preferred lossless editing format for existing page-like content.
Use real structural tags such as `<p>`, `<h2>`, `<ul>`, `<code>`, and links. For the full compact schema, run `twg confluence content body-formats html`.

Before creating or editing a page, live doc, or blog post body, load and read
the body format help for the exact content type. Pass `--ack-body-formats` only
to attest that you read and will follow that help; never pass it otherwise:

```bash
twg confluence content body-formats html
```

If the response includes `nextCommand`, run it too before you write a new page,
live doc, or blog post. It returns the embeddings guide for Remix, whiteboards,
and databases. Choose features after you read both guides.

The Remix selection policy is the `Generation policy` section under `## Remix embeds`:
in the embeddings guide when `nextCommand` returns it, otherwise in the `--help` of the
Remix create command named below. Following it, decide before drafting whether
the new page carries a Remix; honor any count or family the user asked for, otherwise
infer at most one. When the page carries a Remix, create the page, read the Remix guide if you have not
already read it in the embeddings guide, then run
`twg confluence remix infographic create --content-id <new-id> --prompt "<brief>" --ack-remix-guide`
or `twg confluence remix maui create --content-id <new-id> --prompt "<brief>" --ack-remix-guide`
for each Remix, and embed the results with `content update` before reporting completion.

For mentions, get the person's account ID first with
`twg user get "<exact name or email>"`. Do not invent an account ID:

```html
<span data-type="mention" data-user-id="AAID">@Display Name</span>
```

For arbitrary macros, use extension HTML — never storage XML like `<ac:structured-macro>`. Native Confluence macros use `data-extension-type="com.atlassian.confluence.macro.core"`; third-party/app macros use the same pattern with the exact type/key/params captured from an existing page. Omit `macroId`; Confluence generates it.

```html
<div
  data-type="extension"
  data-extension-key="toc"
  data-extension-type="com.atlassian.confluence.macro.core"
  data-parameters='{"macroParams":{"maxLevel":{"value":"3"}},"macroMetadata":{"schemaVersion":{"value":"1"},"title":"Table of Contents"}}'
></div>
```

Use `bodied-extension` for body macros (`excerpt`, `details`) and `inline-extension` inside `<p>` for inline macros (`anchor`, `pagetree`). Popular native `macroParams`: `toc` `{minLevel,maxLevel}`, `children` `{all,depth}`, `include` `{"":"Page title"}`, `excerpt` `{name}`, `details` `{label}`, `detailssummary` `{cql,headings}`, `contentbylabel` `{cql,max}`, `attachments` `{patterns,labels}`, `jira` `{jqlQuery,showSummary}`, `viewpdf` `{name}`.

Do not invent opaque IDs for media, sync blocks, mentions, or embedded resources. Copy `data-id`, `data-collection`, `data-media-id`, `data-media-collection`, `data-resource-id`, and `data-local-id` only from existing content or tool output; omit `data-local-id` on new nodes.

## Markdown

Use `--format md` (preferred); `--format markdown` is also supported. Before
acknowledging the body format, load:

```bash
twg confluence content body-formats md
```

Markdown is suitable for new prose and repository-authored documentation when
the command supports it. It may not preserve every macro or storage-format
construct during round trips.

## Specialized Formats

Whiteboards and standalone databases (`--content-type database`) use their own
specialized helper information. Do not reuse page/blog/live-doc HTML or markdown
guidance for these content types.

For whiteboards, load the whiteboard body-format helper before creating or
editing SVG content:

```bash
twg confluence content body-formats --content-type whiteboard
```

For databases, load the database body-format helper before creating CSV payloads
or edit envelopes:

```bash
twg confluence content body-formats --content-type database
```

A page embeds a whiteboard, database, or Remix app as `native-embed:whiteboard`,
`native-embed:database`, or a Maui extension (HTML: URL in `data-parameters`
`macroParams.url.value`; Markdown: a `<url>` link). Page edits do not change
embedded content, so keep each embed as fetched. To read or change a whiteboard
or database, load its helper above, then run
`twg confluence content get --id "<URL>" --format svg` (or `csv`) and
`twg confluence content update --id "<URL>"` in the same format. For a Remix
app, read `twg confluence remix maui edit --help` first.

Each helper returns an index and follow-up `--reference` paths for that content
type. Use the whiteboard helper only for whiteboards and the database helper
only for databases, then follow the referenced format contract exactly. Use
`--ack-body-formats` only after reading the exact helper output and
understanding the format contract.

## Document Size Limit

Confluence caps a page, live doc, or blog post body at a fixed JSON node budget
(50000-100000 nodes depending on the site; the rejection reports the exact
limit). Every paragraph, list item, table row, table cell, and text run adds
several nodes, so table-heavy pages (roughly 400 KB of HTML) hit it first. The
write fails with `validation_failed` and nothing is saved; `--dry-run` only
reports it once the cap is crossed. Keep long-running pages under the cap by
moving sections to child pages and linking to them. For small changes to a large
page, use `update --edits` / `--edits-file` instead of resending the full body.

Keep title and body separate. Prefer body files over shell-inline multiline
content. Verify rendered or returned content after consequential writes.
