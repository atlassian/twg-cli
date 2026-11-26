---
name: twg-operational-health
description: >
  Use with the root `twg` skill for on-call handoffs, incident response and
  investigation, post-incident reviews, reliability reviews, Assets refresh,
  capacity views, meeting summaries, and operational risk readouts.
---

# twg-operational-health

Use root `twg`: plan from `twg help-map` and reuse its batched describe contracts.
Describe again only for missing details.

## CLI launcher fallback

Run `twg <command>`. On shell `command not found`, use `$HOME/.local/bin/twg`
(macOS/Linux) / `$env:LOCALAPPDATA\Programs\twg\bin\twg.exe` (PowerShell), then
tell user to add that directory to PATH. Do not treat auth or command errors as
PATH failures.

Agents: use host-set `TWG_AGENT_DEFAULTS=1` or `TWG_AGENT_DEFAULTS=1 twg <command>`. If assignments are blocked, pass `--mode agent` with explicit output flags. Respect host permissions. `--mode user` overrides the opt-in.

## Use When

- "I'm taking over on-call"
- "Reliability, incident, SEV, or post-incident review readout"
- "Investigate an active incident and find mitigation"
- "Analyze root cause or draft postmortem/PIR learning/action items"
- "Open risks, blockers, overloaded people, operational health"

## First Move

Identify scope, window, anchors, owner/escalation, status, recency, and
follow-ups before joining surfaces. For incident, PIR, reliability, or on-call
requests, start with native JSM incident, post-incident-review, or Jira
workitem records when available. Use Rovo or document search only to
disambiguate an anchor or fill a bounded gap, never as the incident inventory.
Current escalation, owner, and readiness claims need current/open evidence;
closed records provide recurrence context, not present-state proof.
Pass `--site` for the site identified by the request or anchor URL. For
multi-site requests, query each intended site explicitly. When no site is
identified, use the configured default and state that scope. Never assume a
vendor-internal incident site.

## Evidence Policy

- Rank by impact, urgency, owner clarity, recurrence risk, and actionability;
  separate live risks from historical mentions.
- Keep operational state distinct from adjacent PR, pipeline, document, or chat
  activity; missing or inaccessible state is an evidence gap.
- Cluster incident, PIR, follow-up, runbook, owner, asset, or meeting evidence
  by service, theme, owner, and recency. Hydrate highest-risk clusters and
  stop when theme, owner signal, and confidence are clear.
- Separate `working theory`, `confirmed problem`, `mitigation`, and `root
cause`; require a causal mechanism for root cause and label claims
  `confirmed`, `supported`, `candidate`, or `missing evidence`.
- After one repeated backend, auth, or schema error, report the gap and use
  remaining evidence instead of aliases or broad inventories.
- Read build health from `bitbucket pipeline query`, not per-pipeline `get`;
  raise its default `--limit 15` when needed, state the covered span, and
  hydrate ranked sets through one batched `get`.

## Recipe Cards

### Leadership Reliability Review / On-Call Handoff

Load `references/reliability-review.md`. Identify leader, platform, and window;
cluster themes, separate cause from mitigation, connect prevention work, and
rank actions. For handoffs, add a first-hour checklist and escalation map.

### Incident Investigation / Mitigation

Use for active, newly mitigated, or pre-PIR incidents. Anchor on the incident,
then gather responders, symptoms, impact, recent deploys/flags/config,
topology, alert/log/metric pointers, ownership, runbooks, and similar cases.
If fields are sparse, probe four golden-signal families with bounded follow-ups.
See `references/incident-investigation.md`. Track hypotheses, confidence,
next checks, and mitigation options. Never call mitigation root cause without a
causal mechanism.

### Post-Incident Root Cause / Learning

Use after mitigation/recovery when drafting or evaluating a PIR. Pair the
incident with the PIR, linked docs, final comms, remediation PRs, and actions;
cover mitigation, causal mechanism, 5-whys, and detection/response gaps. See
`references/pir-root-cause.md`. Output root cause, contributing factors,
mitigation-versus-cause, and prioritized actions.

### Assets / Asset Refresh

Build contributors from project/goal/Jira/PR/doc/activity evidence. Inspect
Assets schema/type metadata before AQL; join people through discovered user-like
attributes such as `Calculated user`. Rank contribution centrality plus asset
risk and report confidence/gaps. See `references/assets.md`.

### Capacity / Staffing / Meetings

For staffing, identify project/topic/org and identify people by related work,
ownership, review influence, docs, and project/goal involvement; check load
before recommending. For meetings, query scoped recordings, preview transcripts,
fetch full transcripts only for central ones, then summarize decisions, actions,
and gaps.

## Answer

- Answer the operational question directly, with material severity, urgency,
  recommendation, owner, status, recency, impact, confidence, and evidence.
- Use a matrix or incident-to-learning timeline when requested or useful for
  clarifying problem, mitigation, root-cause status, or prevention. Preserve
  requested formats and fields.
- Rank next actions with suggested owners, group useful patterns, and disclose
  material gaps: missing transcripts, ACL/auth failures, stale updates, or weak
  ownership.

## Anti-Patterns

- Do not fetch every transcript/page body or treat every incident mention as a
  live risk.
- Do not wait for chat/comments to surface directional pre-PIR hypotheses.
- Do not call mitigation root cause without a mechanism or treat workflow
  panels, bot comments, or opaque fields as RCA narrative.
- Do not use keyword matches alone as ownership; cross-check assignee, service
  owner, PIR participants, or org-tree membership.
- Do not join Assets by display-name guesses or recommend staffing from
  activity counts alone.

## References

- `references/assets.md` - schema-first Assets queries and person/device joins
- `references/reliability-review.md` - bounded incident/PIR leadership review
- `references/incident-investigation.md` - active investigation and mitigation
- `references/pir-root-cause.md` - post-mitigation root-cause and PIR workflow
