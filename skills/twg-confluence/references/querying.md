---
description: Find Confluence pages with CQL, exact filters, titles, creators, labels, spaces, and modified dates.
---

# Confluence Querying

Use CQL when the target is definitely Confluence and exact constraints are
needed.

Example shapes:

```text
space = "ENG" AND type = page ORDER BY lastmodified DESC
type in (page, blogpost) AND space = ENG AND lastmodified >= now("-7d") ORDER BY lastmodified DESC
creator = currentUser() AND lastmodified >= now("-30d")
title ~ "release" AND type in (page, blogpost)
```

Guidance:

- Use CQL for space, type, title, creator, contributor, label, and modified-time
  filters.
- `confluence content list` has no date filter. For pages and blog posts updated
  since a point in time, use `twg confluence search query --cql '<CQL>'` with a
  `lastmodified` clause. `twg confluence search text "<term>" --updated-since
  <date>` also filters by date, but it requires a text term and always
  constrains `type in (page, blogpost)`, so it cannot list a whole space by date.
- That CQL route is established for pages and blog posts only; it does not
  replace `content list` for whiteboards, databases, folders, or the other
  specialized types it supports.
- Use fuzzy cross-product search when the page title, product, or location is
  uncertain.
- Treat search results as candidates; fetch selected IDs or URLs natively.
- Verify author/creator metadata when the answer depends on who wrote content.
- Bound broad content lists and state truncation.
- Fetch full bodies only for the few pages central to the answer.

Do not assume every content type is represented by the same CQL `type` value.
Use the exact help and returned metadata for specialized content.
