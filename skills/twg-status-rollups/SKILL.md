---
name: twg-status-rollups
description: >
  Use with the root `twg` skill for personal, team, org, project, goal,
  focus-area, executive, quarterly, appraisal, and leadership status rollups.
  Resolve scope first, collect bounded evidence, and synthesize a readout with
  confidence and gaps.
---

# twg-status-rollups

Use together with the root `twg` skill. Exact command grammar must come from
live `twg help`, `twg help <terms>`, or `twg help describe <path>`.

## Use When

- "What did I/person/team/org work on?"
- "Status of project/goal/topic/focus area"
- "Leadership readout"
- "Weekly/monthly/quarterly review"
- "APEX/performance appraisal evidence"
- "Goal alignment audit"
- "Org bottlenecks, priorities, stale goals, project risks"

## First Move

Resolve the reporting scope before broad retrieval:

- Person: resolve email, name, or account ID, then user/activity/context as needed.
- Team: resolve the team and member roster.
- Org: use org-tree deep enough to reach useful manager or team groups.
- Project, goal, or focus area: resolve the native key, ARI, URL, or name first.
- Topic: resolve/search once, then select concrete project, goal, page, or workitem anchors.

Establish the time window from the prompt. If absent, ask when precision matters;
otherwise use a small recent window such as 7d or 30d and state that choice.

## Route Selection

- Start from typed command families named in the root `twg` skill: users,
  org-tree, teams, projects, goals, focus areas, work activity, search, Jira,
  Confluence/docs, meetings/videos, and Bitbucket.
- Pull planning state first for project, goal, and org reports: owners, latest
  updates, status, target dates, linked goals, and linked projects.
- For engineering output, use pull-request or work-activity surfaces before broad
  text search.
- For large orgs, use aggregate team/project/goal/work signals first, then
  hydrate representative people, leaders, or outliers.
- Use `context user` only for the manager, explicit review subject, or another
  central collaborator whose graph changes the answer.
- Do not apply projection flags to every evidence surface. Native/federated
  commands should use only flags advertised by their own help contracts.

## Evidence Policy

- Balance quantitative activity signals with representative qualitative
  evidence: docs, comments, blockers, project/goal updates, PRs, and stakeholder
  interactions.
- Distinguish authored delivery from review, coordination, and influence.
- Sample when the scope is broad. State the sample boundary instead of trying to
  exhaust every person and every product surface.
- Treat search/Rovo results as candidate anchors only; hydrate central candidates
  before using them as evidence.
- For PR load, start count-first. If a rollup warns that full fetch is too broad,
  narrow once or switch to count-only.

## Recipe Cards

### Person Or Personal Update

Resolve the person, then pull recent authored/assigned Jira work,
authored/reviewed PRs, docs/pages, meetings, and project/goal involvement.
Separate delivery, review, docs/strategy, coordination, and influence.

### Team Or Org Leadership Readout

Resolve org-tree first. Group by manager, team, or workstream before per-person
details. Use org-level PR/project/goal/work signals, then hydrate people or
outliers that explain momentum, blockers, review load, or ownership.

### Project Or Goal Status

Fetch the native project or goal first. Include owner, state, latest update,
linked goals/projects, target dates, and status recency. Hydrate only Jira,
docs, PRs, or meetings that explain risk, progress, or dependency.

### Topic Status

Resolve/search once, select central project, goal, page, or workitem anchors,
then hydrate those before using broad work/activity queries.

### Appraisal / Performance Evidence

Resolve the person and time horizon. Separate authored delivery, review,
collaboration, docs/strategy, project/goal impact, and stakeholder signals.
Avoid ranking solely by counts; add calibration caveats when evidence is weak or
biased.

## Output Shape

- Executive summary first, with 3-6 high-signal observations.
- Table with owner/team/workstream, positive signals, risk signals, current focus,
  confidence, and evidence.
- Risks and leadership attention ranked by impact and owner.
- Confidence and gaps, including stale updates, missing product coverage, ACL
  gaps, or sampled evidence boundaries.

## Anti-Patterns

- Do not make a status report a list of every artifact.
- Do not infer goal/project health from issue counts alone.
- Do not fan out across every org member if manager/team-level grouping answers
  the prompt.
- Do not use search snippets as final evidence for status or risk.
