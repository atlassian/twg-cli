---
description: Write Jira descriptions, comments, mentions, links, and structured content with supported HTML, Markdown, or ADF forms.
---

# Jira Rich Content

Match the command's advertised description or comment format.

- Use real HTML tags when the format is HTML.
- Use markdown only when the command explicitly supports it.
- Do not pass Jira wiki markup such as `h2. Heading`, `[label|url]`, or
  `*bold*`.
- Use a body file for long or structured content.
- `--description-format`, `--body-format`, and `--transition-comment-format`
  convert only the matching description/comment flag. They do not convert
  values passed through `--field` or `--fields-json`.
- Rich custom fields passed through `--field` or `--fields-json` need raw ADF.
- Compact summaries can omit descriptions/comments; inspect referenced output
  before treating prose as empty.
- Jira descriptions and comments read back as ADF documents, not strings.

For HTML mentions, get the person's account ID first with
`twg user get "<exact name or email>"`. Do not invent an account ID:

```html
<span data-type="mention" data-user-id="AAID">@Display Name</span>
```

Markdown has no portable mention syntax. When the Jira write path supports the
compatibility form, `[~accountId:AAID]` can be converted to an ADF mention.
Prefer the HTML form when controlling the format.

Never invent account IDs. Read back the resulting description or comment when
format preservation matters.
