---
description: Choose HTML or Markdown body formats, preserve macros, encode mentions, and avoid unsafe conversions.
---

# Confluence Body Formats

Use only formats advertised by the exact command and content type.

## HTML

HTML is the preferred lossless editing format for existing page-like content.
Use real structural tags such as `<p>`, `<h2>`, `<ul>`, `<code>`, and links.

For mentions, resolve the person and use a real Atlassian account ID:

```html
<span data-type="mention" data-user-id="AAID">@Display Name</span>
```

## Markdown

Markdown is suitable for new prose and repository-authored documentation when
the command supports it. It may not preserve every macro or storage-format
construct during round trips.

## Specialized Formats

Whiteboards and databases may use specialized SVG or CSV edit envelopes and may
be restricted by build profile. Use acknowledgement flags only after reading
the exact help and understanding the format contract.

Keep title and body separate. Prefer body files over shell-inline multiline
content. Verify rendered or returned content after consequential writes.
