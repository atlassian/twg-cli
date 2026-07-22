---
description: Build a bounded leadership reliability review from representative JSM incidents, PIRs, ownership, and prevention evidence.
---

# Leadership Incident Reliability Review

Resolve leader, platform, and window. Use `org-tree` once when people data is
available. Discover the operational corpus with one time-bounded native search
per product: `twg confluence search query --cql '<platform + window>'` for
reliability reviews and PIRs, and `twg jira workitem query --jql '<platform +
window>'` for incidents, PIR actions, and prevention work. Use semantic
`twg search` only to resolve an ambiguous platform name, not as the primary
incident inventory. Prefer `jsm incident query` or
`jsm post-incident-review query` when discovery exposes structured JSM records
or a verified service field. Absence from JSM alone is not proof that the
platform has no in-window incident evidence.

Use up to three central in-window review/PIR pages to map major services and
candidate themes. Cluster up to three supported themes, then hydrate at most six
representative incident/PIR records or two per theme. Add ownership or
prevention evidence only for a selected record missing it. Mark genuinely sparse
results as a gap; do not widen beyond the platform or force a theme. Stop when
the selected evidence establishes impact, mitigation, cause confidence,
recurrence, owner, and prevention status. Report org-scope confidence from the
available roster and ownership evidence rather than widening solely to prove
membership. Rank three leadership actions.
