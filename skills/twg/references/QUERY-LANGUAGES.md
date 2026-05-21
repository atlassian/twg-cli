# Query Languages

Use this reference for durable query semantics that help records cannot fully
teach. Exact command names and flags still come from `twg help`.

## Contents

- JQL - Jira Workitems
- CQL - Confluence
- AQL - Assets
- TQL / Planning Queries
- Native Query Vs Rovo Search

## JQL - Jira Workitems

Use JQL when the target is definitely Jira and the user needs exact issue filters.

Common patterns:

```jql
assignee = currentUser() AND statusCategory != Done ORDER BY updated DESC
project = PROJ AND statusCategory != Done ORDER BY priority DESC, updated DESC
project = PROJ AND issuetype in (Bug, Task) AND statusCategory != Done
parent = PROJ-123 ORDER BY updated DESC
key in (PROJ-1, PROJ-2, PROJ-3)
text ~ "customer name" AND statusCategory != Done
updated >= -14d ORDER BY updated DESC
```

Guidance:

- Prefer `statusCategory != Done` for open work when exact statuses vary.
- Use `updated >= -14d` or similar windows for recent activity.
- For "top items from a board" where the supplied board name is also a Jira
  project key, start with project-key JQL and limit the output before hydrating
  individual issues. Use `jira board backlog` when exact board backlog order is
  required or a numeric board ID is supplied.
- Agile sprint functions can require board permissions; if denied, fall back to
  date/status filters.
- For issue relationships and linked artifacts, use Jira context in addition to
  JQL.

## CQL - Confluence

Use CQL when the target is definitely Confluence and you need exact page/blog/task
search.

Common patterns:

```cql
type = page AND title ~ "runbook"
type = page AND text ~ "customer name" ORDER BY lastmodified DESC
space = "ENG" AND type = page AND lastmodified >= now("-30d")
creator = "<account-id>" AND type = page ORDER BY created DESC
label = "strategy" AND type = page
```

Guidance:

- Prefer Rovo search for fuzzy discovery across products.
- Use CQL for Confluence-only constraints such as space, label, title, creator,
  and modified time.
- Fetch full page body only for the selected central page.

## AQL - Assets

Use AQL when querying Jira Assets/CMDB. Schema and attribute names are
site-specific, so inspect the schema/type first.

Common patterns:

```aql
objectType = Laptops
objectType = Laptops AND "Calculated user" IS NOT EMPTY
objectSchema = "<schema>" AND objectType = Laptops AND "Calculated user" = "<handle>"
objectType = Services AND Status = Active
```

Laptop/person join guidance:

- Prefer discovered user-like attributes in this order when present:
  `Calculated user`, `Assigned to (user)`, `User`, `Current Owner`, `Owner`, `Name`.
- Once `Calculated user` exists on the target type, stop using broad display-name
  filters as the main strategy.
- Classify failures as wrong schema/type, right type but wrong join field, or true no match.

## TQL / Planning Queries

Use planning filters for Atlas goals, projects, and focus areas when exact fields
matter.

Common patterns:

```text
phase = in_progress AND status = off_track
phase = in_progress AND status = at_risk
name ~ "migration"
owner = "<account-id>"
```

Guidance:

- Prefer first-class flags when live help exposes them, such as scope, status,
  role, owner, account ID, and updated-since.
- For goal status, compare goal health with linked project status and latest
  status updates.
- For project reviews, lead with current state, owner, update recency, risks, and
  linked goals.

## Native Query Vs Rovo Search

| Situation | Prefer |
| --- | --- |
| Fuzzy topic, nickname, unknown product | `resolve`, then `search` / `rovo search` |
| Exact Jira filters | JQL |
| Exact Confluence filters | CQL |
| Asset inventory or CMDB joins | AQL |
| Atlas planning health/status | planning flags or TQL |
| Final evidence or mutations | product-native get/query/mutate commands |
