---
description: >
  Find source, callers, and API consumers outside the local workspace to answer
  code questions, even without an explicit search request or known repository.
---

# Code Search And Navigation

## When To Use

Use search-code when an answer needs source unavailable locally, including
follow-up questions without an explicit search request. Start from the known
service, behavior, error, API, or symbol; discover the repository if unknown.
Verify implementation claims against source. Skip when local code, supplied
context, or general knowledge answers the question.

## Search And Navigate

Choose the route from anchor precision:

- Known repository and exact path: fetch the file directly after establishing
  the required scope metadata.
- Known repository and symbol or class: run one repository-scoped lexical or
  hybrid search, then fetch only the selected files.
- Unknown repository or conceptual behavior: begin with one hybrid
  `search-code search` using the concrete topic, symbol, or behavior.
- Cross-repository or reverse-dependency question: search every available
  indexed SCM surface unless the user explicitly limits a code host.

Honor an explicitly named repository or code host as the requested scope.
Widen beyond it only when the user asks for cross-repository coverage, the
repository identity is ambiguous, or scoped evidence is demonstrably
incomplete. For unscoped discovery, omit `--app` so available indexed code
surfaces participate; do not assume Bitbucket is the only source. Preserve the
requested scope when a connector is unavailable and report the indexing gap.

Apply scope requirements by operation:

- `search-code search` may omit `--workspace` for discovery; add it when an
  established tenant boundary improves precision.
- `search-code search` and `search-code file` accept an HTTPS Bitbucket/GitHub
  repository root URL in `--repo`, deriving provider and workspace internally.
  Other code commands accept Bitbucket root URLs; GitHub provider selection is
  not supported by their existing backend contracts. With a bare repo, provide
  the established `--workspace`. Pass file path and `--commit` separately:
  never split a branch containing slashes out of a file URL.
- Derive workspace and provider only from returned repository metadata or a
  resolved repository URL. Do not guess them or call `search-code file` before
  its required scope is established. In JSON output, each `search-code search`
  hit has `repository` (`<workspace>/<repo>`), a `snippet` of matched lines, and
  `read_command`, the exact `search-code file` call for that file.

For reverse-dependency questions, search the exact API or symbol first. If that
does not establish direct consumption, search the package/import anchor, group
candidates by repository, and inspect the manifest or import plus call site
needed to verify selected consumers. Use the symbol and package/import searches
as the normal starting sequence, adding a focused search only when it can close
a material unresolved consumer or scope question. Prefer stable literal
anchors; do not invent delimiter-heavy code fragments merely to vary the query.
Keep each search to a compact result set and use returned repository/path
metadata for selection; a result cap is not a reason to claim completeness.

Treat search results as a batch. Do not rerun the same symbol separately for
each repository, code host, authorization mode, or usage pattern. Select a
small, diverse set of direct consumers, hydrate the call-site files needed to
establish each integration role, and fetch a manifest only when the call-site
evidence does not establish the package. Stop when another result would repeat
an already verified integration role, not while a material role is unverified.
After discovery establishes repository metadata and paths, hydrate independent
source files concurrently in one orchestration/tool
round when the execution environment supports it. Do not wait for one file
before requesting another unless its result determines the next path.

When the requested scope is public code, count a repository only when returned
source metadata or its stable source URL establishes public visibility. Exclude
private or ambiguous repositories rather than inferring that visibility from
the owner, host, or repository name.

Rank a bounded set of source-backed implementation locations. If the anchored
search is incomplete, returns only generated documentation, or exposes only one
part of the requested capability, widen across available indexed surfaces while
the next result can close that material gap. Fetch only selected source files
needed for symbol and behavior context. Prefer commit-pinned links. Treat
mirrors and duplicate paths as one implementation, preserve their source links,
and say which appears canonical only when the evidence supports it.

Join ownership, PR, or work-item evidence only for the selected locations and
only when it clarifies responsibility or delivery. Never infer behavior from a
filename, ownership from one commit, or completeness from one provider's empty
result. Report indexing and connector gaps instead of filling the result count.
Use the fewest calls that establish the answer. For a single known repository
and symbol, one discovery call and one hydration round are the normal starting
point; continue only while another call can resolve a material evidence gap.
