# Products And Surfaces

This reference explains durable product concepts and common routing traps. Use
`twg help` for exact command syntax.

## Discovery Surfaces

- `resolve` is for IDs, URLs, keys, exact names, and canonical entity lookup.
- `search` / `rovo search` is for fuzzy topics, nicknames, partial titles, and
  cross-product discovery.
- Product-native commands are for final evidence, exact filters, mutations,
  comments, page bodies, PR diffs, and product-specific semantics.
- `context` commands are for explicit graph relationships around a known entity.
  They do not replace native `get` commands for source fields.
- Advanced raw graph-query commands are for debugging or gaps in typed surfaces,
  not first-line discovery for normal status, dependency, or context tasks.

Use search results as candidates, not final facts. Hydrate important hits with
native or context commands before synthesis.

## Product Mental Model

| Product | Durable guidance |
| --- | --- |
| Jira | "Workitem" and "issue" mean the same thing. Use Jira for issue fields, comments, transitions, links, boards, sprints, and Jira project spaces. |
| JSM | Use JSM for service-management concepts: services, incidents, queues, portals, request types, SLAs, and knowledge. If the user wants the underlying issue record, use Jira workitem commands. |
| Confluence | Use search/Rovo for fuzzy page discovery. For content operations, use the unified `confluence content` surface (see routing table below). Use `twg confluence space <verb>` for space-scoped operations. **Do not use `twg confluence page`, `twg confluence blog`, `twg confluence whiteboard`, `twg confluence database`, or `twg confluence folder` — these are deprecated aliases that emit a redirect banner.** |
| Bitbucket | Most PR/repo operations require workspace and repo. Resolve them from URLs, local checkout, search results, or prior output. Do not guess slugs. |
| Atlas projects | Cross-team initiatives with owners, contributors, status updates, linked goals, risks, and target dates. Do not confuse them with Jira projects/spaces. |
| Atlas goals | OKRs/key results with owners, health/status, updates, and contributing projects. Goal status should be compared to linked project signals. |
| Focus areas | Planning hierarchy. Tree/count options can be expensive; use status/scope/depth deliberately. |
| Assets | Schema-first. Object type names, schema names, and attributes are site-specific. Inspect schemas/types before writing AQL filters. |
| People/teams | Account IDs are required for many user-scoped commands. Resolve by email/name; use org-tree for reporting structure and teams for team membership. |
| Meetings/videos/docs | Discovery can be broad and slow. Query with time windows and people filters; fetch full transcripts only for selected recordings. |

## Confluence Command Routing

**Always use these commands for Confluence content operations.** The content type
is auto-inferred from the ID — you do NOT need `--type` on `get`/`update`/`delete`/
`archive`/`unarchive`/`move`. Lifecycle verbs take the content ID as a positional
argument (e.g. `update 12345`, not `update --id 12345`).

| Task | Command |
| --- | --- |
| Get content by ID (any type) | `twg confluence content get <ID> --site <site>` |
| Get content by URL | `twg confluence content get <PAGE_URL> --site <site>` (URLs are accepted directly) |
| List pages in a space | `twg confluence content list --type page --space <KEY> --site <site>` |
| List blogposts in a space | `twg confluence content list --type blogpost --space <KEY> --site <site>` |
| List whiteboards/databases/folders in a space | `twg confluence content list --type {whiteboard,database,folder} --space <KEY> --site <site>` |
| Create a page | `twg confluence content create --content-type page --title "..." --parent-id <PARENT_ID> --space-id <SPACE_ID> --site <site>` |
| Update content | `twg confluence content update <ID> --title "..." --body "..." --site <site>` |
| Delete content | `twg confluence content delete <ID> --site <site>` |
| Archive a page | `twg confluence content archive <ID> --site <site>` |
| Unarchive (restore from archived) a page | `twg confluence content unarchive <ID> --site <site>` |
| Move a page | `twg confluence content move <ID> --parent-id <NEW_PARENT_ID> --site <site>` |
| List labels on content | `twg confluence content labels list --id <ID> --site <site>` |
| Add a label | `twg confluence content labels add --id <ID> --label <label> --site <site>` |
| Remove a label | `twg confluence content labels remove --id <ID> --label <label> --site <site>` |
| List permissions/restrictions | `twg confluence content permissions list --id <ID> --site <site>` |
| Add/remove a permission | `twg confluence content permissions {add,remove} --id <ID> --user <USER> --site <site>` |
| List comments | `twg confluence content comments list --id <ID> --site <site>` |
| Add a comment | `twg confluence content comments create --id <ID> --body "..." --site <site>` |
| Reply to a comment | `twg confluence content comments reply --id <ID> --comment-id <CID> --body "..." --site <site>` |
| Resolve a comment | `twg confluence content comments resolve --id <ID> --comment-id <CID> --site <site>` |
| List tasks on a page | `twg confluence content tasks list --id <ID> --site <site>` |
| Complete/reopen a task | `twg confluence content tasks {complete,reopen} --id <ID> --task-id <TID> --site <site>` |
| List versions / history | `twg confluence content versions list --id <ID> --site <site>` (page-only) |
| Restore a page to a previous version | `twg confluence content versions restore --id <ID> --version <N> --site <site>` |
| List spaces | `twg confluence space list --site <site>` |
| Get a space | `twg confluence space get --key <KEY> --site <site>` |
| Archive / unarchive a space | `twg confluence space {archive,unarchive} --key <KEY> --site <site>` |

Note: subresource verbs (`labels`, `permissions`, `comments`, `tasks`, `versions`)
keep the `--id <ID>` flag for the parent content because a secondary entity ID
(`--comment-id`, `--task-id`, `--version`) is also passed — named flags avoid
positional ambiguity. Only the lifecycle verbs use positional `<ID>`.

## Cross-Product Search Rules

- Start with `resolve --query "<input>"` when the input could already be a URL,
  key, exact entity name, or account/person identifier.
- When the prompt already names the product family and provides a stable key,
  URL, or ARI, go directly to that product's native `get` or `query` command.
  Use cross-product search only if the typed read fails or the prompt is fuzzy.
- If resolve is weak, use `search "<query>" --limit 20` or app/type filters from
  live help.
- For sensitive or people-heavy searches, narrow by app, type, time window,
  contributor, assignee, owner, or space when available.
- Hydrate 1-3 top candidates. Avoid treating snippets as authoritative.

## Context And Graph Rules

For a known entity, pair source fetch and graph context:

| Entity | Source fields | Graph context |
| --- | --- | --- |
| Jira workitem | native Jira workitem get | context Jira workitem |
| Confluence content | `twg confluence content get <ID>` (type auto-inferred for pages, blogposts, whiteboards, databases, folders) | context Confluence page |
| User | user lookup / org-tree | context user |
| Atlas project/goal | native project/goal get | search/context where supported |

Default to summary detail. Escalate to full detail only for the central artifact.
When drawing a graph, produce validated graph JSON and use the TWG visualization
command discovered from help.

For dependencies, prefer typed context and product-native links over raw graph
schema exploration. If a typed surface does not expose a relationship, state the
coverage gap and use hydrated search/product candidates as inferred evidence.

## Mutation Safety

- Read current state before updating, linking, unlinking, commenting, or deleting.
- Resolve both source and target to stable IDs/ARIs/keys before relationship writes.
- For Jira workitem create/update with custom or required fields, discover the
  workitem field metadata first and use returned `customfield_*` IDs. Avoid
  display names in mutations unless metadata shows they are unambiguous. Do not
  provide the same key in both `--field` and `--fields-json`; `--field` values
  parse as JSON when valid, so quote JSON strings to force string IDs.
- For Jira custom field value readback, use `twg jira workitem get <KEY>
  --field customfield_*` or `--fields customfield_*,summary`.
- Use `--body-file` for multiline page/comment bodies.
- For relationship mutations, report the source, target, relationship type, and
  resulting key/URL.
- Do not mutate if the source entity identity is ambiguous.

## Operational Caveats

- Bitbucket auth can fail independently of Atlassian/Jira auth.
- Some graph/context endpoints can be ACL-sensitive or slower than product-native
  reads. Fall back to native surfaces when graph hydration fails.
- Recently viewed data is current-user scoped and time-limited.
- Meeting recordings and transcripts are not guaranteed to exist for every meeting.
- Assets joins often fail because of wrong schema/type/attribute assumptions; inspect
  the schema first.
