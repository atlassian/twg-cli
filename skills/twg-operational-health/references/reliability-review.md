---
description: Build a bounded leadership reliability review from representative JSM incidents, PIRs, ownership, and prevention evidence.
---

# Leadership Reliability Review

Identify platform and window. For a current open-incident handoff, query
`twg jsm incident query --jql 'issuetype = "[System] Incident" AND statusCategory != Done ORDER BY updated DESC' --limit 20`
first: `--after <window>` filters by creation date, so it misses older still-open
incidents. Use `--after` separately for the newly created cohort. Check
`isLast` and continue with the returned pagination cursor before declaring either
inventory complete; an empty new cohort does not mean there are no open
incidents. Open ticket status alone does not verify a live production outage or
service ownership: check service links and update recency before escalation.
For a windowed reliability review, start with the native operational records:
`twg jsm incident query --after <window> --limit 20` and
`twg jsm post-incident-review query --after <window> --limit 20`. Connect the
bounded results to the platform through service, owner, linked work, or record
content; do not assume its name appears in incident or PIR titles. These
commands accept natural search text when an incident-specific alias is known;
use `--jql` only for a structured JQL query.
Run without `--site` unless the user or runtime explicitly selects another
tenant. Use semantic `twg rovo search "<platform name>"` only to identify an ambiguous platform name,
not as the incident inventory.

If structured JSM records are unavailable or do not expose the verified
platform relationship, use one platform-and-window-bounded Confluence query for
reliability reviews/PIRs and one Jira query for incident actions or prevention
work. Absence from JSM alone is not proof of no incident evidence. These are
bounded fallbacks, not permission to substitute a tenant-wide search corpus.

Treat incident and PIR results as the primary corpus. Pair linked records,
cluster materially distinct themes, and hydrate only representative records
needed to establish impact, mitigation, causal confidence, recurrence, and
prevention status. Use `org-tree` once after services or owners are known when
people data is available. Query docs, Jira work, code, collaboration, or
observability only for a selected record when it resolves a cause, ownership,
or prevention gap. Do not replace sparse native incident/PIR results with a
tenant-wide inventory or force unsupported themes. Separate mitigation from
root cause, label causal confidence, and rank the prevention work that warrants
leadership attention.
