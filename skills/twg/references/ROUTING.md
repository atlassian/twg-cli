---
description: Choose among resolve, search, context, responsibility, product commands, and cross-product work queries.
---

# TWG Routing

Use this reference when the product or surface is uncertain. Exact command
syntax comes from live `twg help`.

For a known native command, send the original supported URL, key, ARI or exact
scoped name and all known site/parent, filter, projection, pagination and bound
arguments in its first call. Do not insert `resolve` merely to convert a form
that this command accepts. Use one targeted `describe` if the contract is
unfamiliar; discovery is for missing or ambiguous identity/scope, not routine
normalization. See the engineering skill's reference guidance for product
limits. Native internal lookups do not authorize broader scope or writes.

## Discovery Surfaces

- Native commands resolve their advertised selectors internally. Pass original
  supported references, known site/cloud/org/parent scope, projection and bounds
  in one call. Use `twg resolve` only as a last resort: no native selector
  accepts the form you have, the scope is unknown, or discovery returns more
  than one match. Add `--type` to read a bare PREFIX-N key as one Jira or Atlas
  kind, and see `twg help describe resolve` for the contract.
- Product-native commands provide authoritative fields and mutations.
- `rovo search` handles fuzzy topics, partial titles, nicknames, and unknown
  products.
- `docs query` handles a user's relationship-based document activity;
  `docs search` handles fuzzy document-only discovery across available sources.
  `docs get <id-or-ari>` looks only within the activity window of `docs query`,
  not in arbitrary search results.
- `context` provides bounded graph relationships around a resolved entity.
- `responsibility` provides declared or inferred owner, maintainer, expert,
  reviewer, and escalation candidates.
- `work query` provides relationship-based user activity. It defaults to seven
  days of authored work with full-window counts and bounded summary items.
  For other activity, add `--activity` or `--include-viewed`.
- `work search` provides fuzzy tenant-wide discovery of work artifacts via Rovo;
  documents remain on `docs search`.
- Exact Jira and Atlas keys should go to the product-native get command first:
  `jira workitem get <key>` for a Jira key, `projects get <key>` for an Atlas
  project key, or `goals get <key>` for a goal key. If the kind is unclear, use
  `twg resolve "<key>" --type jira-workitem` (or `atlas-project`, `atlas-goal`).
  Query surfaces are for discovery, filtering, or compatibility shortcuts.

Use search results as candidates, not final facts. Hydrate the few selected
anchors with native reads or typed context.

## Product Boundaries

| Product          | Use it for                                                                                                                  |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Jira             | Workitems, issue fields, comments, links, transitions, boards, sprints, filters, dashboards, and Jira project configuration |
| JSM              | Requests, portals, queues, request types, approvals, SLAs, services, incidents, and service-management workflows            |
| Confluence       | Content bodies, comments, hierarchy, spaces, versions, permissions, tasks, labels, and exports                              |
| Bitbucket        | Repositories, files, branches, commits, pull requests, reviews, and pipelines                                               |
| Atlas projects   | Cross-team initiatives, owners, contributors, updates, risks, links, and target dates                                       |
| Atlas goals      | Goals and key results, owners, health, updates, and contributing projects                                                   |
| Compass          | Components, ownership, scorecards, metrics, dependencies, packages, and operational attention                               |
| Assets           | Site-specific object schemas and CMDB data; inspect schemas and types before AQL                                            |
| People and teams | Identity, profiles, reporting structure, membership, and organization relationships                                         |

Do not confuse Jira projects with Atlas projects or Compass components. Do not
use Jira workitem commands for JSM approval semantics.

## Query Languages

- JQL: exact Jira workitem filters. See the Jira skill's querying reference.
- CQL: exact Confluence content filters. See the Confluence skill's querying
  reference.
- AQL: Assets queries after schema and attribute discovery.
- TQL or product-specific query languages: use only when advertised by live
  help for the selected surface.

## Cross-Product Handoffs

- Known Jira or Confluence object: native read plus context when relationships
  matter.
- Jira issue to implementation: `twg-engineering-work`.
- Topic, dependency, owner, or expert discovery: `twg-context-discovery`.
- Project, goal, team, or executive synthesis: `twg-status-rollups`.
- Incident, runbook, asset, capacity, or reliability question:
  `twg-operational-health`.

Stop expanding when another call would not change the answer's status, risk,
responsibility, dependency, or next action.
