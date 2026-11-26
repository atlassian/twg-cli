---
description: Mixed-identity manager chains, direct reports, reporting peers, and exact actor identifiers for work, docs, meetings, and videos. Third-party user conversations/mentions, collaborator boundaries, and partial person documents pagination.
---

# User Identifiers And Hierarchy Handoffs

Keep the IDs, site, and time window that a command returns, and reuse them. Replace placeholders
with returned values. Check focused `twg help describe "<command>"` for availability.

[Routes](#routes) · [Hierarchy](#hierarchy) · [Actor sets](#exact-actor-sets) ·
[Partial results](#partial-results) · [Context/collaborators](#context-and-collaborators)

## Routes

1P = Atlassian identity, not employment class or workstream;
3P = `IdentityThirdPartyUser` ARI.

| Intent | Command / selector | Handoff or boundary |
| --- | --- | --- |
| Immediate manager | `user manager --identifier` | 1P requester; manager may be 1P or 3P |
| 1P direct reports, one level | `user direct-reports --account-id` or `people describe '<aaid>' --direct-reports` | No 3P gate needed; check facet status |
| 1P reporting subtree, all levels | `org-tree --account-id --down-only --depth` | One tree query, not recursive direct-report calls; disclose depth/coverage limits |
| 1P ancestors | `org-tree --account-id --up-only` | Also `--name`/`--email`; no `--identifier` |
| Mixed manager chain | `user manager-chain --identifier --depth 1–4` | `data.managers[]`: `identifier`, `actorIdentifiers` |
| Mixed direct reports | `user direct-reports --identifier` | `data.directReports[]`; mixed identities |
| Mixed reporting peers | `user peers --identifier` | `data.manager`, `data.peers[]`; excludes subject |
| Activity | `work/docs/meetings/videos query --identifier` | AAID, `IdentityUser` ARI, or gated 3P ARI |
| Conversations/mentions | `context user '<identifier>'` | One positional identity; narrow 3P coverage below |
| Collaborators | `collaborators --account-id '<aaid>'` | 1P subject; ranking, not reporting peers |

For 1P-only requests, use 1P routes directly; do not probe mixed routes first.
Do not reconstruct a reporting subtree by querying each person's direct reports.
Org activity uses tree/batched rollups, not per-person activity loops.

- Reporting routes require enriched availability. Mixed chains, peers,
  identifier reports, and 3P queries also require third-party identity access for
  the authenticated caller and tenant. Native 1P manager lookup works without
  third-party identity access.
- Never evade denial through account/site/gate/env changes or substitute 1P-only
  coverage for mixed results.
- Never mix canonical, legacy, or actor selectors; fabricate an ARI from an email;
  put 3P ARIs in `--account-id`; or substitute the caller.
- `user get` has no `--identifier`; `user bulk-lookup` rejects 3P ARIs. Keep
  returned identities instead of naming them through unsupported profile lookups.

## Ambiguous Names

If a name matches several people and one of them is in `twg collaborators --limit 50`,
do not stop to ask. Answer for that candidate, and list the others at the end.

## Hierarchy

```bash
twg user get --site '<site>' -o json
twg user manager --identifier '<returned-data.accountId>' --site '<site>' -o json
twg work query --scope user --identifier '<manager-identifier>' --activity all --since 14d --site '<site>' -o json
```

| Manager response | Downstream `--identifier` |
| --- | --- |
| `data.managerIdentifier.ari` present | That exact 3P ARI, even if `data.manager` is null |
| Otherwise `data.manager.accountId` present | That 1P AAID |
| Neither present in a successful response | No manager returned; stop this handoff |

| Returned evidence | Say | Do not infer |
| --- | --- | --- |
| Null profile, manager identifier present | “No 1P profile returned”; query the identity | No 1P account exists; identity unqueryable |
| Document relationship + update date | “Document updated; personal activity date unknown” | Personal activity date, authorship, impact |

Empty 1P facets or `org-tree` ancestors do not exclude a 3P manager; check `user manager`.

First-party hierarchy: `--down-only` retrieves descendants; `--up-only` retrieves
ancestors. Choose descendant depth for the requested scope; disclose any remaining
boundary or partial result rather than claiming an unlimited tree.

For org-tree counts, calculate locally from the saved full `stdout.json`, not
rendered bullets or `stdout.compact.json`. With `--include-counts`, use an
available local JSON tool; this Node example checks the returned tree:

```bash
node - '<saved-stdout.json>' <<'JS'
const r = JSON.parse(require('node:fs').readFileSync(process.argv[2], 'utf8'));
const root = r.data.tree;
const walk = n => [n, ...n.directReports.flatMap(walk)];
const nodes = walk(root);
const counts = {
  immediateReports: root.directReports.length,
  descendants: nodes.length - 1,
  totalPeople: nodes.length,
};
const subtreeCount = root.subtreeCount === undefined && counts.immediateReports === 0
  ? 0 : root.subtreeCount;
if (new Set(nodes.map(n => n.accountId)).size !== nodes.length ||
    subtreeCount !== counts.descendants ||
    r.meta.resultCount !== counts.totalPeople) throw Error('Roster counts disagree');
console.log(JSON.stringify(counts));
JS
```

Copy computed totals consistently into the answer; `subtreeCount` excludes the
root. On disagreement, disclose it rather than guessing or refetching. For
one-level reports, calculate `data.directReports.length` instead. Empty child
arrays mean no further reports **returned**, not independently verified leaves.
Coverage describes returned sources, not independent directory completeness.
Active, selected, and discarded reconciliation rows differ; report their counts
without inventing discard reasons or historical status.

```bash
twg org-tree --account-id '<aaid>' --down-only --depth '<depth>' --include-counts --site '<site>' -o json
twg org-tree --account-id '<aaid>' --up-only --site '<site>' -o json
twg user direct-reports --account-id '<aaid>' --site '<site>' -o json
twg people describe '<aaid>' --direct-reports --site '<site>' -o json
```

Mixed-identity hierarchy, when advertised and enabled:

```bash
twg user manager-chain --identifier '<person-id>' --depth 2 --site '<site>' -o json
twg user direct-reports --identifier '<person-id>' --site '<site>' -o json
twg user peers --identifier '<person-id>' --site '<site>' -o json
```

Chain depth defaults to 1; `data.truncated: true` means more levels, not
incomplete actor sets. Reports/peers cap at 25 logical people. Overflow,
ambiguity, cycles, or incomplete scans fail closed; never shrink the roster to bypass them.

## Exact Actor Sets

Pass one logical person's complete `actorIdentifiers[].ari` set in one call:

```bash
twg docs query --actor-identifier '<actor-ari-1>' --actor-identifier '<actor-ari-2>' --since 14d --site '<site>' -o json
```

- Supported by work/docs/meetings/videos queries, even when hidden from help.
  Without an actor set, use canonical `--identifier` on those queries.
- Maximum 25 actors; deduplicate exact ARIs only. No same-email re-expansion,
  merging people, dropping aliases, or per-alias queries.
- Never combine with `--identifier`, `--account-id`, `--assignee`, `--participant`,
  topic search, or `--include-viewed`. Unsupported on context, collaborators, and artifact get.

## Partial Results

`docs query` without `--first` scans pages automatically. Manual pagination
(`--first`) and partial scans include `data.pageInfo`; complete automatic scans omit it.

| Evidence | Action |
| --- | --- |
| Exit 3 / `meta.partial` / `meta.failures` | Keep usable data; disclose failed/uncovered sections and people |
| Policy/organization denial | Stop that route; neither empty evidence nor proof the identity gate is off; no unchanged retry or automatic relogin |
| Docs automatic scan: exit 0, no partial/truncation signal, no `data.pageInfo` | Requested scan complete; do not rescan merely to obtain pagination metadata |
| Docs manual page: `data.pageInfo.hasNextPage: true`, no partial signal | Continue with its returned cursor; preserve exact person/actors, site, window |
| Docs manual page: `data.pageInfo.hasNextPage: false`, no partial signal | No further pages for this query |
| Docs partial/truncated scan | Follow `meta.failures` recovery guidance; resume only with a returned safe cursor |
| Missing pagination metadata in manual mode or an unknown contract | Pagination completeness unverified; do not invent a terminal page |
| Empty/partial/access-limited results | Describe scope and gaps, not “this person did no work” |

```bash
twg docs query --identifier '<person-ari>' --since 14d --site '<site>' -o json
twg docs query --identifier '<person-ari>' --since 14d --first 100 --after '<returned-cursor>' --site '<site>' -o json
```

Docs rows are `data.documents[]`. Never invent cursors; report unfinished pagination.
Scan completion covers the requested scope (from `--after`, if supplied), not
complete source indexing or permissions. Missing metadata alone is not a reason to retry.
Work defaults to authored activity; use `--activity all` for broader coverage.
Other people's viewed history is unavailable. Attribute roles from returned
relationships; counts do not prove impact.

## Context And Collaborators

Check `context user` help for 3P support; absence is a capability gap, not permission to coerce an AAID.

```bash
twg context user '<returned-3p-ari>' --since 14d --detail summary --site '<site>' -o json
twg collaborators --account-id '<verified-aaid>' --limit 10 --site '<site>' -o json
```

| 3P context contract | Returned value |
| --- | --- |
| Relationships | `user_member_of_conversation` → `ExternalConversation`; `user_mentioned_in_message` → `ExternalMessage` |
| Subject | `data.object.ari` preserves input; type `IdentityThirdPartyUser`; no alias expansion |
| Summary | `data.relationshipSummary[]`: `relationshipName`, `count`, `targets[]` |
| Full detail / continuation | `data.relationships[]` / `data.pagination`, not docs' `pageInfo` |

Membership alone does not establish recent activity. Keep collaborators separate from
reporting peers; preserve IDs/scores. Names or ID formats prove neither identity
equivalence nor distinctness. Never infer providers from opaque IDs or treat scores
as confidence without a documented definition. Collaborators and PR queries require
1P subjects; see `../../twg-status-rollups/references/personal-work-summary.md` for PRs.
