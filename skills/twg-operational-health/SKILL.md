---
name: twg-operational-health
description: >
  Use with the root `twg` skill for on-call handoffs, reliability reviews,
  incident and post-incident analysis, Assets and asset refresh,
  capacity/staffing views, meeting summaries, and operational risk readouts.
---

# twg-operational-health

Use together with the root `twg` skill. Exact command grammar must come from
live `twg help`, `twg help <terms>`, or `twg help describe <path>`.

## Use When

- "I'm taking over on-call"
- "Reliability, incident, or post-incident review readout"
- "Asset refresh candidates"
- "Windows or device assets for testing"
- "Team capacity or staffing candidates"
- "Meeting recordings weekly summary"
- "Open risks, blockers, overloaded people, operational health"

## First Move

Resolve the operational scope and time window:

- Service, component, team, customer, project, person, org, or asset domain.
- Canonical anchors such as service/component records, incident or
  post-incident records, runbooks, projects/goals, meeting recordings, or Assets
  object types.
- Current owner, escalation path, status, recency, and known follow-up work.

Do not start with a broad cross-product inventory. Find the operational anchor
first, then join only surfaces that answer the question.

## Route Selection

- On-call handoff: incidents, post-incident records, recent Jira follow-up,
  runbooks/docs, linked projects, owners, and escalation paths.
- Reliability review: incident and post-incident records, linked follow-up,
  service or component context, owners, comments, and current status.
- Assets/asset refresh: build the contributor list from work evidence first,
  then inspect Assets schema/type metadata before AQL.
- Capacity/staffing: combine related recent work, ownership, review influence,
  docs, project/goal involvement, assigned open work, review queue, blockers,
  and current risks.
- Meeting summaries: query recordings for the requested people/time scope, fetch
  transcript preview first, and fetch full transcript only for central meetings.

## Evidence Policy

- Rank by impact, urgency, owner clarity, recurrence risk, and actionability.
- Group incidents, post-incident records, blockers, and follow-up work into
  patterns rather than listing every artifact independently.
- Separate live risks from historical mentions.
- Prefer a compact operational evidence set: current incidents, post-incident
  records, linked follow-up work, runbook/doc anchors, owner/escalation evidence,
  and a small number of central assets or meetings. Stop once those support the
  handoff, ranking, or recommendation.
- For Assets, discover schema, object type, and user-like attributes first. Use
  `--person` or the discovered `--person-field` for fields such as
  `Calculated user` before broad display-name filters.
- For staffing, do not recommend people solely from recent activity counts; blend
  contribution centrality, ownership, expertise, availability/load signals, and
  project risk.
- If an operational surface repeats the same backend, auth, or schema error,
  stop that path after one correction. Report the gap and use the remaining
  evidence instead of trying nearby aliases or broader inventories.

## Recipe Cards

### On-Call Handoff

Resolve team/service/component. Pull incidents, post-incident records, recent
Jira follow-up, runbooks/docs, linked projects, and owners. Cluster symptoms
into patterns and produce a first-hour checklist plus escalation map.

### Incident / Reliability Review

Search/query incidents, post-incident records, linked follow-up work,
service/component context, owners, comments, and status. Cluster by failure
theme. Connect each theme to concrete follow-up and missing ownership.

Prefer pattern coverage over artifact completeness. Once each recurring failure
theme has an example, owner/follow-up signal, recency, and confidence, stop
expanding and synthesize.

### Assets / Asset Refresh

Build the contributor list from project/goal/Jira/PR/doc/activity evidence.
Query Assets schema/type metadata before AQL. Join people to assets using
discovered user-like attributes. Once a hit has owner/user, model, status,
lifecycle, age, or refresh-risk fields, rank by contribution centrality plus asset
risk from that hit and selected contributor evidence.

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
- Do not repeat nearby AQL/name variants after the asset/person join is good
  enough for a recommendation.
- Do not recommend staffing solely from recent activity counts.

## References

- `references/assets.md` - schema-first Assets queries and person/device joins
