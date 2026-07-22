---
description: Discover and navigate implementations across available indexed code surfaces, then hydrate a bounded source-backed result set.
---

# Code Search And Navigation

Start with one hybrid `search-code search` using the concrete topic, symbol, or
known repository anchor. Unless the user explicitly limits a code host, omit
`--app` so the command searches every available indexed SCM surface. Add
`--workspace` only when a known tenant boundary improves precision; a workspace
is not required. A named repository is a starting anchor, not an instruction to
ignore related implementations elsewhere.

Rank at most five source-backed implementation locations. If the anchored
search is incomplete, returns only generated documentation, or exposes only one
part of the requested capability, widen once across the available indexed
surfaces. Fetch only selected source files needed for symbol and behavior
context. Prefer commit-pinned links. Treat mirrors and duplicate paths as one
implementation, preserve their source links, and say which appears canonical
only when the evidence supports it.

Join ownership, PR, or work-item evidence only for the selected locations and
only when it clarifies responsibility or delivery. Never infer behavior from a
filename, ownership from one commit, or completeness from one provider's empty
result. Report indexing and connector gaps instead of filling the result count.
