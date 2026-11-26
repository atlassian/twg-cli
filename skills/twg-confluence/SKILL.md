---
name: twg-confluence
description: >
  Use with root `twg` for Confluence pages, live docs, whiteboards, databases,
  spaces, hierarchy, authoring, editing, comments, versions, permissions,
  exports, and CQL. Applies Confluence semantics and safe write rules.
---

# twg-confluence

Use with root `twg` for Confluence-focused work. Live help owns command grammar.

`twg skills list`: load active companions, otherwise use help.

## CLI launcher fallback

Run `twg <command>`. On shell `command not found`, use `$HOME/.local/bin/twg`
(macOS/Linux) / `$env:LOCALAPPDATA\Programs\twg\bin\twg.exe` (PowerShell), then
tell user to add that directory to PATH. Do not treat auth or command errors as
PATH failures.

Agents: use host-set `TWG_AGENT_DEFAULTS=1` or `TWG_AGENT_DEFAULTS=1 twg <command>`. If assignments are blocked, pass `--mode agent` with explicit output flags. Respect host permissions. `--mode user` overrides the opt-in.

## First Route

| Intent                           | Route                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------ |
| Access-link URL                  | [Access-link workflow](references/content.md#access-links)                                 |
| Known content ID/URL             | `confluence content get`; [route embeds](references/content.md#embed-and-smart-link-reads) |
| Several known pages              | One `confluence content get <id-or-url...>` for the selected set                           |
| Exact Confluence filtering       | Confluence search with CQL                                                                 |
| Date-filtered page/blogpost list | `confluence search query --cql` with `lastmodified`; `content list` has no date filter     |
| Fuzzy page/topic discovery       | Cross-product search, then native get                                                      |
| Create or update content         | Unified `confluence content` surface                                                       |
| Current user's personal space    | `confluence space me`; reuse returned identity, never infer it from `accountId` or search  |
| Read or write comments           | `confluence content comments`; [comment rules](references/content.md#comments)             |
| Space metadata/lifecycle         | `confluence space`                                                                         |
| Hierarchy                        | `confluence tree`                                                                          |
| Export                           | `confluence content export`; [export workflow](references/content.md#exports)              |

Pass supported references and known scope/bounds in the first native call.
Use `--reference-space` for exact titles; avoid separate resolve.
Required write/auth guidance applies.

## Confluence Semantics

[Pagination](references/pagination.md).

- Search snippets are discovery candidates. Read the selected content before
  summarizing or editing it.
- Use CQL for metadata lists. Batch up to 25 known pages.
  For prose-only reads, use
  `confluence content get <id-or-url...> --detail full --format md -o json`.
  For rich, mixed, unknown, or pre-edit content, use
  `confluence content get <id-or-url...> --detail full --format html -o json`.
  Before pre-edit reads, follow `references/editing.md` for draft and snapshot-token rules.

  Singles return `data.body`; batches return ordered `data.items` with `input`,
  `ok`, and `data` or `error`. Check failures and conversion warnings.
  Read each `body.outputFile` when present, otherwise `body.value`; omitted
  text is in `output_files.stdout`.

  Search with surrounding lines for focused questions; read full bodies for
  whole-page summaries. Reuse saved content.
  `--include-metadata` adds provenance. `--body-only` and version reads are single-page.

- Read prose with `--format md`.
  Use HTML for editing or required status markers, macros, and table details.
  If `data.body.lossyConversion` is true and relevant details are missing,
  fetch `--format html` once. Keep headings and table cells together.
  Never infer missing status from prose.
- `docs get` searches a user's document activity window, not page bodies;
  it may miss accessible pages.
- Before you write any page or live doc body, run
  `twg confluence content body-formats html` and follow it.
- Page titles are supplied separately from bodies. Do not repeat the title as
  the first body heading.
- Apply Remix/Maui ownership and embedding rules in `references/content.md`;
  an asset ID/URL is not proof of a page embed.

## Authority

If live help advertises `confluence content authority`, use it when page choice can change the answer.

- Keep relevance primary. Compare only pages providing equivalent evidence.
- Prefer `VERY_HIGH`, then `HIGH`, `MEDIUM`, and `LOW`.
- Reuse Authority categories supplied by other responses.
- Batch up to 100 uncategorized canonical page ARIs per site.
- Treat JSON/JSONL items lacking `authorityCategory` as neutral existing pages. Text reports `NOT_SCORED` for no Authority relationship, `UNSUPPORTED_CATEGORY` for unrecognized categories, and `NOT_FOUND` for pages omitted from JSON/JSONL.
- Never remove a more relevant page for a higher-Authority one.
- If unavailable, continue with current evidence; never retry via raw graph query.

## Safe Authoring And Editing

- Treat user authorization and CLI confirmation as separate checks for archive,
  trash, and purge. Passing `--yes` is an execution preflight, not evidence the
  user authorized the mutation. Use `--yes` only after the user named the
  mutation and the exact target or a previously displayed bounded target set.
- Explicit instructions such as "archive page XYZ" or "archive those 15 pages"
  after a concrete list authorize execution without another confirmation. Vague
  language such as "clean up", "organize", or "take care of" does not authorize
  archive, trash, or purge.
- If the mutation or targets were inferred, identify the proposed targets,
  present the exact action and bounded target list, and wait for the user to
  affirm it. Do not generalize approval from a similar prior action; `trash`
  does not authorize a permanent purge.
- Before authoring, apply the target space's instructions once per space per
  session; see `references/spaces.md`. Empty instructions mean defaults.
- Pick the type by job ([rules](references/content.md#choose-the-content-type)):
  `whiteboard` for spatial/visual work (diagrams, flows, maps, brainstorms);
  `database` for records to filter, sort, or track; `live_doc` for narrative
  and bare "page"/"doc" asks; `page` for explicit classic intent or KB/help.
  Explicit types win; preserve a target's type.
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

- `../twg/references/KNOWLEDGE-IDENTIFIERS.md` - native selectors and first-call scope

- `references/content.md` - content types, reads, writes, and exports
- `references/editing.md` - concurrency-safe body editing
- `references/spaces.md` - space lifecycle and hierarchy
- `references/querying.md` - CQL and fuzzy discovery
- `references/body-formats.md` - HTML, markdown, mentions, and special formats
