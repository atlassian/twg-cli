---
name: twg
description: >
  Root operating skill for the TWG CLI. Use for Atlassian work-data tasks across
  Jira, Confluence, Bitbucket, goals/projects/focus areas, JSM, Assets, Admin,
  people, teams, org structure, docs, meetings, videos, search, graph context, and
  supported mutations. Exact command syntax must come from live `twg help`.
---

# twg

First TWG routing step: choose the shortest reliable path to the data. Use a
typed TWG command when the user provides a stable key, URL, ARI, or familiar
command family; use `twg help`, `twg help <terms>`, or
`twg help describe <path>` before the data call when the command family,
arguments, flags, or output contract are uncertain.

After this skill has loaded, do not reread installed skill markdown as a
discovery step. Start with the TWG wrapper, live help, and live data outputs.

## Overview

Use this skill for TWG CLI work-data tasks. For synthesized outcomes, also load
the most specific workflow skill:

- `twg-status-rollups` for personal, team, org, project, goal, focus-area,
  leadership, quarterly, and appraisal readouts.
- `twg-context-discovery` for topic deep dives, dependency maps, context graphs,
  repo discovery, and "catch me up" prompts.
- `twg-engineering-work` for PR queues, stale reviews, repo contributors, hot
  areas, and PR-based status.
- `twg-operational-health` for on-call handoffs, reliability/HOT/PIR reviews,
  Assets/laptop refresh, staffing/capacity, meeting summaries, and operational
  risk.

## Available scripts

- `twg` - run TWG with agent defaults.

For large outputs, inspect `output_files.compact` first when present, then read
or filter `output_files.stdout` only when the compact view lacks evidence. See
`references/OUTPUT.md`.

## Command Discovery

- Use typed commands directly for familiar common families: `resolve`, `user`,
  `org-tree`, `work query`, `search`, `projects`, `goals`, `pull-requests`,
  `jira`, `confluence`, `docs`, and `context`.
- Person lookup accepts a positional name: `twg user search "<name>" --limit 1`.
  Use `--email` for exact email lookup.
- Use `twg help` for top-level compact YAML routing only when the right family is
  not clear. In namespace output, `$` lists executable child commands under the
  current namespace.
- Use `twg help <terms>` before guessing unfamiliar command names, arguments,
  flags, choices, or defaults. Treat help as discovery, not evidence: do not run
  batches of synonym help searches when one family lookup would answer the
  command-shape question.
- Use `twg help describe <path>` to inspect either a namespace map or an exact
  executable command contract when exact arguments, flags, output fields, or
  agent summaries matter. Namespace output is compact YAML; executable output is
  JSON by default.
- Do not front-load `help describe` for every known family. Use focused help
  before the first data command only when the command family or contract is
  genuinely unclear.
- Keep projection commands conceptually separate from native/federated commands:
  - Projection commands provide bounded synthesized views. Use a common mental
    model: scope, time, budget, detail, and output.
  - Native/federated commands keep product-specific options. Do not assume
    projection flags such as `--sample`, `--hydrate`, `--only-counts`, or
    `--agent-fields` exist unless `twg help describe <path>` advertises them.
- Pick starter commands by the user's anchor type: resolve names/URLs/keys
  first, use product-native `get`/`query` surfaces for known objects, and use
  projection/context surfaces when the installed help advertises the needed
  anchor and flags.
- Stable product keys do not need broad discovery when the product family is
  clear. For example, use Jira work item commands for Jira issue keys, and use
  project or goal commands for project/goal keys or URLs before falling back to
  cross-product search.
- Search/Rovo results are candidate anchors, not hydrated evidence. When a
  result provides a stable key, ID, URL, or ARI, switch to the exact executable
  product `get` command for that family. Use `query` for filters. If that exact
  child command shape is not already known, run one focused
  `twg help describe "<family> get"` or `twg help describe "<family> query"`
  first. Do not pass result keys to namespace commands or borrow flags from
  sibling commands.
- For org rollups, prefer roster and aggregate signals first, then selected
  user-scoped evidence. Do not compensate for missing org-level scope by running
  relationship context across every visible person.
- If a context surface is unavailable for an anchor type, say so as a coverage
  gap and use search plus product-native hydration for the selected candidates.
- Before writing `jq` filters for a command, inspect `help describe` output.
  Prefer the advertised `output.recommendedSummary` and
  `output.recommendedAgentFields` over trial-and-error raw JSON inspection.
- Follow `next` commands from help output exactly; do not synthesize
  unsupported help syntax.
- Do not use legacy human `--help` loops for agent discovery.
- Resolve: use `twg resolve --query "<input>"` for URLs, keys, ARIs,
  exact names, and people.
- Search: use `twg search "<query>" --limit 20` for fuzzy topics,
  partial titles, nicknames, customers/themes, or unknown products.
- When using app filters, discover valid Rovo app keys first: `twg rovo list-apps`
- Hydrate: fetch the best 1-3 candidates with exact native `get` commands for
  stable keys/IDs/URLs/ARIs, product `query` commands for filters, or `context`
  commands.
- Synthesize: answer from hydrated evidence, not search snippets.

## Rich Content Writes

For Jira/Confluence description, body, and comment writes, match the command's
format flag. If it is HTML, use real HTML such as `<h2>`, `<p>`, `<code>`, and
`<a href="https://...">label</a>`.

Do not pass Jira wiki markup such as `h2. Heading`, `[label|url]`, or `*bold*`.
If live help supports it, choose an explicit markdown/plain flag instead, such
as `--description-format markdown`, `--body-format markdown`, or
`--body-format plain`.

## Routing

| Area           | Surfaces                                                                                        |
| -------------- | ----------------------------------------------------------------------------------------------- |
| Product-native | Jira, Confluence, Bitbucket, goals/projects/focus areas, JSM, Assets, Admin                     |
| People/org     | users, teams, org-tree, collaborators                                                           |
| Cross-product  | Rovo search, docs, meetings, videos, work activity                                              |
| Graph/context  | resolve, context, visualization                                                                 |
| Workflows      | `twg-status-rollups`, `twg-context-discovery`, `twg-engineering-work`, `twg-operational-health` |

Concrete scope matters: use a Jira key, page URL, PR URL, repo slug, account ID,
team/project/goal/focus-area name, customer/topic name, "me", or a time window.
If there is no concrete or partial scope, ask before running broad searches.

## Rules

- Never guess IDs, flags, Jira keys, project keys, account IDs, page IDs,
  workspace/repo slugs, ARIs, or object IDs.
- For Jira workitem custom fields, first discover metadata with
  `twg jira workitem field create-metadata` before create, or
  `twg jira workitem field update-metadata` before update. Use returned
  `customfield_*` IDs in `--field`/`--fields-json`; display names are only for
  readability and may conflict. Do not pass the same field key in both
  `--field` and `--fields-json`; the command rejects collisions. `--field`
  values parse as JSON when valid, so quote JSON strings to force string IDs.
- To read back custom field values, use `twg jira workitem get <KEY> --field customfield_*`
  or `--fields customfield_*,summary`; do not use admin `twg jira field` commands
  for value reads.
- Do not use `twg jira field create/update/delete` for workitem field values.
  That namespace is admin CRUD for global Jira custom field definitions.
- Atlassian Admin operations use `twg admin`. Admin commands use a separate
  Admin API key via `twg admin auth login`; never reuse or expose normal user
  auth tokens for admin workflows.
- If an Atlassian URL includes `https://<site>.atlassian.net/...`, pass
  `--site <site>` on the first related typed command.
- Treat search/Rovo results as candidate anchors only.
- Fan-out is bounded: resolve scope first, then hydrate selected artifacts.
- For broad reports, prefer summary output and local filtering over flooding
  stdout.
- Avoid using `rg` to inspect TWG JSON payloads. Use `output_files.compact` when
  present, or targeted `jq` against `output_files.stdout`.
- For multi-file or multi-field evidence, batch local projection or inspect
  compact summaries directly instead of repeating one-field filters.
- If a command returns a deterministic contract or validation error, make one
  focused correction from the error. If the same failure persists, report the CLI
  limitation instead of trying repeated variants.
- For personal, user, or org pull-request queues, prefer `twg pull-requests query`
  with the requested scope and role. `--state` is the canonical lifecycle filter;
  `--status` is accepted as an alias.
- For Jira board or "what should I pick next" prompts, do not use broad work
  activity as the ranking source. If the board name is a Jira project key, query
  open Jira work directly with JQL and order by priority/rank; use board/backlog
  commands when the user supplies or asks for a concrete board backlog.
- Use `context user` for the root manager, explicit review subject, or another
  central collaborator whose graph changes the answer. For sampled org members,
  prefer `work query`, `pr-tree`, docs/search, and product-native artifacts over
  per-person `context user` calls. If a `context user` call fails with a backend
  GraphStore error or "No relationships match", record that as a coverage gap
  and continue instead of retrying nearby filters.
- For org/team rollups, avoid exhaustive per-person fanout across every surface.
  Resolve the roster, pull aggregate/team/project/goal signals first, then sample
  representative people or outliers before synthesizing.
- For writes, read current state first and state the intended mutation unless the
  user explicitly asked you to execute it.

## Anti-Patterns

- Do not use local workspace inspection, cached-output spelunking, or process
  diagnostics as the first move for work-data prompts unless the user asks about
  local files or process state.
- Prefer canonical command paths in examples and plans when live help shows both
  a canonical path and a compatibility alias. Compatibility aliases such as
  `user-search`, `page`, `blog`, `whiteboard`, `database`, `folder`, or `issue`
  mainly rescue stale prompts; ergonomic singular/plural names and flag aliases
  may still be advertised by live help. For Confluence content, the canonical
  surface is `twg confluence content <verb>` (type auto-inferred from the
  positional ID, e.g. `content get <ID>`, `content update <ID>`); for spaces,
  use `twg confluence space <verb>`.
- Do not route normal work-data tasks through raw graph-query or debugging
  surfaces just because the task says "graph" or "dependency." Use typed
  context, project, goal, Jira, Confluence, docs/search, PR, and visualization
  surfaces first. Use raw graph-query surfaces only when the user explicitly
  asks for that query language or typed commands cannot express the requested
  graph edge.
- Do not start an org or topic report by fanning out `work query` for dozens of
  people. Resolve the scope and sample the most relevant anchors first.
- Do not stop at the wrapper YAML summary when the answer requires item names,
  owners, status, URLs, or evidence. Inspect `output_files.compact` first; if it
  is absent or insufficient, use targeted `jq` on `output_files.stdout`.

## References

- `references/HELP.md` - help discovery and exact-command schemas
- `references/OUTPUT.md` - output envelopes and large payload handling
- `references/PRODUCTS.md` - product caveats and mental model
- `references/QUERY-LANGUAGES.md` - JQL, CQL, AQL, and TQL
- `../twg-status-rollups/SKILL.md` - status, leadership, project/goal, and appraisal readouts
- `../twg-context-discovery/SKILL.md` - deep context, dependency maps, and graph visualization
- `../twg-engineering-work/SKILL.md` - PR, review, repo, and engineering work recipes
- `../twg-operational-health/SKILL.md` - handoff, reliability, assets, staffing, and operational health recipes
