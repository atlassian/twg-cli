---
name: twg-confluence
description: >
  Use with root `twg` for Confluence content, spaces, hierarchy, authoring,
  editing, comments, versions, permissions, exports, and CQL. Applies
  Confluence semantics and safe write rules.
---

# twg-confluence

Use with root `twg` when Confluence is the primary source or mutation target.
This skill owns content-type, hierarchy, format, and concurrency semantics;
live help owns exact command grammar.

## CLI launcher fallback

Run `twg <command>`. On shell `command not found`, use `$HOME/.local/bin/twg`
(macOS/Linux) / `$env:LOCALAPPDATA\Programs\twg\bin\twg.exe` (PowerShell), then
tell user to add that directory to PATH. Do not treat auth or command errors as
PATH failures.

## Use When

- Use for Confluence-anchored content or space reads and mutations: CQL,
  bodies, hierarchy, versions, permissions, exports.
- Do not load for a supporting Confluence link in a broader workflow.

## First Route

| Intent                           | Route                                                                                  |
| -------------------------------- | -------------------------------------------------------------------------------------- |
| Known content ID or URL          | `confluence content get`                                                               |
| Several known pages              | One `docs get <id-or-url…>` for the whole set                                          |
| Exact Confluence filtering       | Confluence search with CQL                                                             |
| Date-filtered page/blogpost list | `confluence search query --cql` with `lastmodified`; `content list` has no date filter |
| Fuzzy page/topic discovery       | Cross-product search, then native get                                                  |
| Create or update content         | Unified `confluence content` surface                                                   |
| Space metadata/lifecycle         | `confluence space`                                                                     |
| Hierarchy                        | `confluence tree`                                                                      |
| Export                           | Word returns a download directly; PDF requires export-status polling                   |

Use `twg help describe "<exact path>"` before an unfamiliar or consequential
mutation.

## Confluence Semantics

[Pagination](references/pagination.md).

- Use the unified content surface for content operations advertised by live
  help; use `confluence space` for spaces and `confluence tree` for hierarchy.
- Search snippets are discovery candidates. Read the selected content before
  summarizing or editing it.
- `confluence content get` and `content versions list --id` are single-page.
  For a page set, take metadata from one `confluence search query --cql` (title,
  space, `lastmodified`, author), then hydrate bodies only for the pages whose
  content changes the answer - batched through `docs get <id-or-url…>`, which
  takes many IDs at once, with `--agent-fields @compact`. Never loop a
  single-page route over a page list, and never re-run the CQL query per page.
- Page titles are supplied separately from bodies. Do not repeat the title as
  the first body heading.
- Remix create returns an asset, not a page embed. Embed via the loaded HTML
  guide and read back the page; an ID/URL is not proof.
- Maui create uses `--content-id` only for ownership/embedding, not page
  reading. Read source first; include values, labels, narrative, and
  visualization instructions in the prompt. "This page" is not enough.

## Safe Authoring And Editing

- Treat user authorization and CLI confirmation as separate checks for archive,
  trash, and purge. Passing `--yes` is an execution preflight, not evidence the
  user authorized the mutation. Use `--yes` only after the user named the
  mutation and the exact target or a previously displayed bounded target set.
- Explicit instructions such as "archive page XYZ" or "archive those 15 pages"
  after a concrete list authorize execution without another confirmation. Vague
  language such as "clean up", "organize", or "take care of" does not authorize
  archive, trash, or purge.
- If the mutation or targets were inferred, resolve the proposed targets,
  present the exact action and bounded target list, and wait for the user to
  affirm it. Do not generalize approval from a similar prior action; `trash`
  does not authorize a permanent purge.
- Before authoring, apply the target space's instructions once per space per
  session; see `references/spaces.md`. Empty instructions mean defaults.
- Prefer `live_doc` for collaborative internal content where supported. Bare
  "page" or "doc" creation also defaults to live docs.
- Use `page` for explicit classic/non-live intent, knowledge bases, customer
  help, established classic-page spaces, or page-only operations. Preserve an
  existing target's type; a classic parent does not set a child's type.
- For non-trivial edits, read current content, save the body locally, edit the
  file, then update with the snapshot token.
- Use the lossless HTML round trip when macros or exact storage matter.
- Use `--dry-run` only for explicit preview requests or unusually risky edits
  where direct execution was not requested.
- Read back the content or space after mutation and report its URL.

## Handoffs

- Load `twg-context-discovery` for related Jira work, projects, goals, or
  dependencies; `twg-responsibility-routing` for people, ownership, authority,
  or escalation.
- Load `twg-status-rollups` when pages contribute to a broader status report.
- Load `twg-operational-health` for runbooks, incidents, or PIRs.
- Load `twg-space-creation` to create or clone a whole space.

## References

- `references/content.md` - content types, reads, writes, and exports
- `references/editing.md` - concurrency-safe body editing
- `references/spaces.md` - space lifecycle and hierarchy
- `references/querying.md` - CQL and fuzzy discovery
- `references/body-formats.md` - HTML, markdown, mentions, and special formats
