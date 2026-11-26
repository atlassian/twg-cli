---
description: Native Confluence and Atlas goal/project, Focus area and Talent position selectors; pass supported original references and known scope in the first call.
---

# Knowledge selectors

Reuse an applicable contract from the current CLI/version. When unfamiliar,
read one targeted describe. Supply the original supported reference and all
known site/cloud/org/parent scope, fields, limits and cursors in the first
native call; the SDK resolves internally and shares pending lookups within
that invocation. Internal HTTP reads are not additional harness model turns.

- Confluence content selectors accept advertised IDs, matching ARIs and URLs.
  Exact titles additionally require `--reference-space` (space ID/key/ARI/URL/name).
  Use native batches for several known pages. Inspect ordered failures.
- Confluence space selectors accept IDs, keys, matching ARIs/URLs or exact names
  in the selected site. Docs/Rovo space filters use the same space selectors.
- Atlas project/goal gets accept repeatable `--id` as well as existing positionals:
  keys, UUIDs, matching ARIs/Home URLs and exact selected-site names.
- Focus gets accept repeatable `--id` and existing ARI forms. UUID/Home URL
  resolution uses the selected Focus workspace; exact names require a site.
- Talent position get accepts position keys, UUIDs, ARIs/Home URLs. `--worker`
  instead accepts a person reference and requires exactly one complete position;
  multiple positions require an explicit position selector.

Forms differ by resource; use the actual command contract. Display names of
new resources are values to create, not selectors. Review/task/template/macro/
export handles, group/access-class/role IDs and raw query text keep their native
contracts. Embedded target conflicts, ambiguous matches, missing scope or
incomplete lookup stop dispatch. Separate discovery only when a reference cannot
uniquely identify the intended resource. Never choose the first fuzzy result,
probe another tenant, or rewrite JQL/CQL/TQL/RQL automatically.

Code is optional. Planning, authoring, confirmation and auth guidance remain
unchanged. No token or turn savings are measured by selector fixture tests.
