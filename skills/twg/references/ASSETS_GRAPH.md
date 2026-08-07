---
description: Schema-first Assets/CMDB graph traversals — when to use assets graph vs native/AQL, type and relationship resolution, -w filters and time windows, and inline row hydration.
---

# Assets Graph — Early Intercept

Use `assets graph` **only when the task needs a relationship traversal** —
connecting two or more entities (object→owner, object→team, Jira issue→object) or
filtering one entity by a related one. For a single-type lookup, an attribute read
on a known object, or a keyword find with **no hop**, stay on `assets search` /
`assets query --aql` / `assets object get` — do **not** fetch the graph schema or
call `connections`; those need no schema download, so they are faster and are the
right default when the shape is not relational. When a traversal *is* needed,
reach for it first (before `assets search`/AQL for discovery) and aim for **one**
`connections` call covering the whole requested path — adding hops is free, adding
commands is not.

The downloaded schema is the source of truth. Resolve every type, relationship,
and field name **from it** — never from `assets search`, AQL, or the prompt's
wording verbatim.

1. **Fetch the schema once, to a file.**
   `twg assets graph schema -o json --output-file /tmp/assets-schema.json` (add
   `--workspace <id-or-ari>` / `--site <site>` for a non-default workspace). Use an
   absolute path so re-runs reuse it. It is large — piping to stdout truncates into
   invalid JSON — so always `--output-file` and `jq` the file (cached ~24h). This
   *is* discovery: do **not** `help describe` the graph subcommands first.
   Once you know the nouns, scope reads with `--node <name>` (repeatable, fuzzy):
   `twg assets graph schema --node "Maruti Suzuki" -o json` returns just that type
   plus its relationships — prefer it over re-`jq`-ing the whole file.
2. **Resolve each noun to an exact type `name`.** Nouns rarely match verbatim
   ("Maruti Suzuki Cars" → `Maruti Suzuki`, "Hyundai cars" → `Hyundai`). Enumerate
   and match — never `assets search`/AQL to find a type:
   `jq -r '.data.nodes[].name' file` (also `.data.staticNodeTypes[]` and
   `.data.staticNodeAliases|keys[]`). Match case-insensitively, substring both
   directions, and on the distinctive token after dropping qualifiers/plurals.
   **Never dump the whole schema to stdout** — do not `jq '.data.nodes'`,
   `.data.relationships`, or a whole-object projection *with `metadata`* to the
   terminal (that alone can be >1 MB and burns the context). `jq` only the fields
   you need (`.name`, keys), filter to the resolved type
   (`jq '.data.nodes[]|select(.name=="Maruti Suzuki")' file`), or use
   `schema --node`; route any broad projection to another `--output-file`.
3. **Pick the relationship for every hop from the schema; pass one `-r` per hop**
   (path order, or `--relationships r1,r2,...`). `relationships[]` = dynamic edges
   (any Assets endpoint); `staticRelationships[]` = static product↔product edges
   (e.g. `IdentityUser`→`ConfluencePage`); `JiraIssue`↔`AssetsObject` = the static
   bridge `jira-work-item-links-assets-object`. Omitting `-r` on a pair with
   multiple edges is a hard failure in agent mode — pick up front.
4. **People→team uses `AtlassianUser`/`AtlassianTeam`** via the static edge
   `atlassian_user_is_in_atlassian_team`. `IdentityUser` aliases `AtlassianUser`, so
   `… IdentityUser AtlassianTeam -r <owner-rel> -r atlassian_user_is_in_atlassian_team`.
   `IdentityTeam` has **no** membership edge.
5. **Execute the whole path:**
   `twg assets graph connections <t1> <t2> … -r <r1> -r <r2> --execute -o json`
   (`--execute` required in agent mode; `--show-cypher` to inspect; `--direction
   out|in|any`; `--optional-hop <n>` for OPTIONAL MATCH).
6. **Filter / timebound in the same call** with `-w "[N:|rN:]field[op]value"` (`N` =
   0-based node index, default 0; `rN` = hop N's relationship metadata; ops
   `= != > >= < <=`). Use the **exact graph field name, bare** (read
   dynamic-node fields from `nodes[].metadata`) — not the AQL name (`Updated`/`Created`
   hard-fail here). Node timestamps are `createdAt`/`lastUpdated`; edges expose the
   same two. **Identity and product nodes are keyed by `ari`, not `id`.** For a
   rolling window, precompute the absolute cutoff (ISO dates auto-wrap in
   `datetime()`), e.g. `-w "0:lastUpdated>2026-07-22"` or `-w "r0:lastUpdated>2026-07-22"`.

**Rows hydrate supported product types inline.** Confluence pages/blogposts, Jira
issues, Loom videos, and Atlas goals/projects come back with display fields
(name/title, key, url, status, updated) already on the row — read them, no
follow-up `content get` / `workitem get` needed. **Assets objects (cmdb) and users
are not hydratable** (OAuth scope) and return id/ARI only; resolve those names with
the product-native command (`assets object get`, `resolve`, `user search`), one
batched call per type (repeat `--account-id` / pass multiple ids), not one per row.
Because a cmdb object can't be hydrated, **any path that includes a dynamic Assets
node returns id-only for the whole row** (hydration is skipped, not failed) — so
Assets-anchored paths always need a product-native resolve for the object names.
`--no-hydrate` forces id-only everywhere.

**Trust the tool's self-correction.** A wrong type surfaces
`Unknown graph node type "…". Did you mean: …?`; a missing edge lists reachable
targets. Act on those hints — do not fall back to `assets search` or client-side joins.

**AQL is the helper, not the enemy.** Where the graph path can't answer — a bounded
object/attribute fact, or object recency (`Updated > now(-10d)`, AQL's attribute
names) — use one `twg assets query --aql "<AQL>"`. A time window alone is never a
reason to leave `connections` — use `-w` (step 6). `assets search` is only a
shallow name lookup: for owner/attribute work inspect the schema/object type
first, then batch `assets query`/`assets object query` with repeated
`--account-id` rather than one call per object.

Split into multiple commands only when a single one is truly impossible: a
non-linear shape (branch/cycle), or a hop with no edge in
`relationships[]`/`staticRelationships[]`/the Jira bridge (pick a different
intermediate type). Path length, static/product hops, and time windows are not
reasons to split.
