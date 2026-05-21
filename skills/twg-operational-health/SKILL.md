---
name: twg-operational-health
description: >
  Use with the root `twg` skill for on-call handoffs, HOT/reliability reviews,
  incident/PIR analysis, Assets and laptop refresh, capacity/staffing views,
  meeting summaries, and operational risk readouts.
---

# twg-operational-health

Use together with the root `twg` skill. Exact command grammar must come from
live `twg help`, `twg help <terms>`, or `twg help describe <path>`.

## Use When

- "I'm taking over on-call"
- "Reliability/HOT/incidents/PIR readout"
- "Laptop refresh candidates"
- "Windows laptops for testing"
- "Team capacity or staffing candidates"
- "Meeting recordings weekly summary"
- "Open risks, blockers, overloaded people, operational health"

## First Move

Resolve the operational scope and time window:

- Service, component, team, customer, project, person, org, or asset domain.
- Canonical anchors such as service/component records, HOT/incident/PIR issues,
  runbooks, projects/goals, meeting recordings, or Assets object types.
- Current owner, escalation path, status, recency, and known follow-up work.

Do not start with a broad cross-product inventory. Find the operational anchor
first, then join only surfaces that answer the question.

## Route Selection

- On-call handoff: incidents/HOTs/PIRs, recent Jira follow-up, runbooks/docs,
  linked projects, owners, and escalation paths.
- Reliability review: HOT/incident/PIR records, linked follow-up, service or
  component context, owners, comments, and current status.
- Assets/laptop refresh: build the contributor list from work evidence first,
  then inspect Assets schema/type metadata before AQL.
- Capacity/staffing: combine related recent work, ownership, review influence,
  docs, project/goal involvement, assigned open work, review queue, blockers,
  and current risks.
- Meeting summaries: query recordings for the requested people/time scope, fetch
  transcript preview first, and fetch full transcript only for central meetings.

## Evidence Policy

- Rank by impact, urgency, owner clarity, recurrence risk, and actionability.
- Group incidents, HOTs, PIRs, blockers, and follow-up work into patterns rather
  than listing every artifact independently.
- Separate live risks from historical mentions.
- For Assets, discover schema and object type first. Join people to devices using
  discovered user-like attributes such as `Calculated user` before broad display
  name filters.
- For staffing, do not recommend people solely from recent activity counts; blend
  contribution centrality, ownership, expertise, availability/load signals, and
  project risk.

## Recipe Cards

### On-Call Handoff

Resolve team/service/component. Pull incidents/HOTs/PIRs, recent Jira follow-up,
runbooks/docs, linked projects, and owners. Cluster symptoms into patterns and
produce a first-hour checklist plus escalation map.

### HOT / Reliability Review

Search/query HOTs, incidents, PIRs, linked follow-up work, service/component
context, owners, comments, and status. Cluster by failure theme. Connect each
theme to concrete follow-up and missing ownership.

### Assets / Laptop Refresh

Build the contributor list from project/goal/Jira/PR/doc/activity evidence.
Query Assets schema/type metadata before AQL. Join people to laptops using
discovered user-like attributes, then rank by contribution centrality plus asset
risk.

### Windows Asset Candidates

Use Assets schema-first discovery. Confirm site, schema, object type, and owner
or contact fields. Report confidence and gaps for each candidate.

### Capacity / Staffing Candidates

Resolve project/topic/org. Identify people with related recent work, ownership,
review influence, docs, and project/goal involvement. Check current load signals
before recommending candidates.

### Meeting Recording Summary

Query meetings/videos for the requested time window and people scope. Fetch
transcript preview first. Fetch full transcript only for central recordings and
write it to a file when needed. Summarize decisions, action items, themes, and
gaps.

## Output Shape

- Lead with severity, urgency, or recommendation summary.
- Inventory table with owner, status, recency, impact, confidence, and evidence.
- Patterns/themes grouped across artifacts.
- Ranked next actions and suggested owner for each.
- Data gaps: missing transcripts, no asset match, stale update, ACL/auth gaps, or
  weak ownership evidence.

## Anti-Patterns

- Do not fetch every transcript or page body.
- Do not treat every incident mention as a live risk.
- Do not join Assets by display-name guesses before inspecting schema/type fields.
- Do not recommend staffing solely from recent activity counts.
