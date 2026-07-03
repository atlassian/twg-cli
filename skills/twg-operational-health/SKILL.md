---
name: twg-operational-health
description: >
  Use with the root `twg` skill for on-call handoffs, incident response and
  investigation, post-incident reviews, reliability reviews, Assets refresh,
  capacity views, meeting summaries, and operational risk readouts.
---

# twg-operational-health

Use together with the root `twg` skill. Exact command grammar comes from live
`twg help` or `twg help describe <path>`.

## Use When

- "I'm taking over on-call"
- "Reliability, incident, SEV, or post-incident review readout"
- "Investigate an active incident and find mitigation"
- "Analyze root cause or draft postmortem/PIR learning/action items"
- "Asset refresh or Windows/device asset candidates"
- "Team capacity or staffing candidates"
- "Meeting recordings weekly summary"
- "Open risks, blockers, overloaded people, operational health"

## First Move

Resolve scope, time window, canonical anchors, owner/escalation path, status,
recency, and known follow-up work. Do not start with a broad cross-product
inventory — find the operational anchor first, then join only relevant surfaces.

## Evidence Policy

- Rank by impact, urgency, owner clarity, recurrence risk, and actionability;
  keep live risks separate from historical mentions.
- Prefer compact evidence: current incidents, PIRs, follow-up work, runbooks,
  owner/escalation evidence, central assets or meetings. Cluster by service,
  failure theme, owner, and recency; hydrate highest-risk clusters first and
  summarize the rest. Stop once theme, owner signal, and confidence are clear.
- Separate `working theory`, `confirmed problem`, `mitigation`, and `root
  cause`. Do not call a mitigation the root cause, or a root cause confirmed,
  unless the causal mechanism is established; a closed incident plus a matching
  PIR is not enough. Mark each claim `confirmed`, `supported`, `candidate`, or
  `missing evidence`. For the RCA signal families, matrix, and confidence
  taxonomy, use the reference files.
- If an operational surface repeats the same backend, auth, or schema error,
  stop after one correction, report the gap, and use remaining evidence rather
  than trying nearby aliases or broader inventories.

## Recipe Cards

### On-Call Handoff / Reliability Review

Pull incidents, PIRs, follow-up work, service/component context, owners,
comments, and status. Cluster by failure theme; connect each to follow-up and
missing ownership. Prefer pattern coverage over completeness — once each theme
has an example, owner/follow-up signal, recency, and confidence, stop and
synthesize. For handoffs, add a first-hour checklist plus escalation map.

### Incident Investigation / Mitigation

Use when the incident is active, newly mitigated, or pre-PIR. Anchor on the
incident record, then pull responders, symptoms, impact, recent
deploys/flags/config, topology, alert/log/metric pointers, ownership, runbooks,
and similar incidents. If ticket fields are sparse, probe the four golden-signal
families with bounded follow-ups. See `references/incident-investigation.md`.
Output a four-signal matrix, hypotheses, confidence, next checks, and mitigation
options; never call a mitigation the root cause without the causal mechanism.

### Post-Incident Root Cause / Learning

Use after mitigation/recovery when drafting or evaluating a postmortem/PIR. Pair
the incident with the PIR, linked docs, final comms, remediation PRs, and action
items; cover confirmed mitigation, causal mechanism, 5-why chain, and
detection/response gaps. See `references/pir-root-cause.md`. Output root cause,
contributing factors, mitigation-versus-cause, and prioritized actions.

### Assets / Asset Refresh

Build contributors from project/goal/Jira/PR/doc/activity evidence. Inspect
Assets schema/type metadata before AQL; join people via discovered user-like
attributes such as `Calculated user`. Rank by contribution centrality plus asset
risk, and report confidence and gaps. See `references/assets.md`.

### Capacity / Staffing / Meetings

For staffing, resolve project/topic/org and identify people by related work,
ownership, review influence, docs, and project/goal involvement; check load
before recommending. For meetings, query recordings for the scope, preview
transcripts first, fetch full transcripts only for central ones, then summarize
decisions, action items, and gaps.

## Output Shape

- Lead with severity, urgency, or recommendation, then an inventory table with
  owner, status, recency, impact, confidence, and evidence.
- For active investigations, add a four-signal evidence matrix and an
  incident-to-learning timeline with confirmed problem, mitigation, root-cause
  status, and prevention action.
- Group patterns across artifacts, give ranked next actions with a suggested
  owner, and call out data gaps (missing transcripts, no asset match, stale
  update, ACL/auth gaps, weak ownership).

## Anti-Patterns

- Do not fetch every transcript or page body, or treat every incident mention
  as a live risk.
- Do not wait for chat/comments to label RCA before surfacing directional
  hypotheses for pre-PIR investigation.
- Do not call a mitigation the root cause, or a root cause confirmed, without an
  established causal mechanism (PIR, final comms, remediation, or 5-why). Do not
  treat workflow panels, bot comments, or opaque `customfield_*` IDs as RCA
  content unless the value itself is the narrative.
- Do not use keyword matches alone as org ownership — cross-check assignee,
  service owner, PIR participants, or org-tree membership.
- Do not join Assets by display-name guesses before inspecting schema/type
  fields, or recommend staffing from activity counts alone.

## References

- `references/assets.md` - schema-first Assets queries and person/device joins
- `references/incident-investigation.md` - active investigation and mitigation
- `references/pir-root-cause.md` - post-mitigation root-cause and PIR workflow
