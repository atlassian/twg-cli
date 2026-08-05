---
description: Discover and navigate implementations across available indexed code surfaces, then hydrate a bounded source-backed result set.
---

# Code Search And Navigation

Choose the route from anchor precision:

- Known repository and exact path: fetch the file directly after establishing
  the required scope metadata.
- Known repository and symbol or class: run one repository-scoped lexical or
  hybrid search, then fetch only the selected files.
- Unknown repository or conceptual behavior: begin with one hybrid
  `search-code search` using the concrete topic, symbol, or behavior.
- Cross-repository or reverse-dependency question: search every available
  indexed SCM surface unless the user explicitly limits a code host.

Honor an explicitly named repository as the requested scope. Widen beyond it
only when the user asks for cross-repository coverage, the repository identity
is ambiguous, or scoped evidence is demonstrably incomplete. For unscoped
discovery, omit `--app` unless the user explicitly limits the code host.

Apply scope requirements by operation:

- `search-code search` may omit `--workspace` for discovery; add it when an
  established tenant boundary improves precision.
- `search-code file` requires the established `--workspace` when `--repo` is
  supplied.
- Derive workspace and provider only from returned repository metadata or a
  resolved repository URL. Do not guess them or call `search-code file` before
  its required scope is established.

For reverse-dependency questions, search the exact API or symbol first. If that
does not establish direct consumption, search the package/import anchor once,
group candidates by repository, and inspect only the manifest or import plus
call site needed to verify selected consumers. Prefer stable literal anchors;
do not invent delimiter-heavy code fragments merely to vary the query.
Use no more than two search calls for one reverse-dependency map: the symbol,
then the package/import only if needed. Keep each search to 20 compact results
or fewer; use the returned repository and path metadata for selection.

Treat search results as a batch. Do not rerun the same symbol separately for
each repository, code host, authorization mode, or usage pattern. Select a
small, diverse set of direct consumers, hydrate at most one call-site file per
selected repository, and fetch a manifest only when the call-site evidence does
not establish the package. Stop when another result would repeat an already
verified integration role. After discovery establishes repository metadata and
paths, hydrate independent source files concurrently in one orchestration/tool
round when the execution environment supports it. Do not wait for one file
before requesting another unless its result determines the next path.

When the requested scope is public code, count a repository only when returned
source metadata or its stable source URL establishes public visibility. Exclude
private or ambiguous repositories rather than inferring that visibility from
the owner, host, or repository name.

Rank a bounded set of source-backed implementation locations. If the anchored
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
Use the fewest calls that establish the answer. For a single known repository
and symbol, aim for one discovery call and one hydration round. Treat four
`search-code` calls as a ceiling unless a documented evidence gap requires more.
