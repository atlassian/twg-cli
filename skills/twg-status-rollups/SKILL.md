---
name: twg-status-rollups
description: >
  Use with root `twg` for personal updates, appraisal evidence, and
  team/org/project/goal/executive/annual/cycle status rollups.
---

# twg-status-rollups

Use with the root `twg` skill. Get exact command grammar from live `twg help`,
`twg help <terms>`, or `twg help describe <path>`.

## Use When

- "What did I/person/team/org work on?" or weekly personal update
- "Status of project/goal/topic/focus area"
- Leadership, monthly, annual, cycle, appraisal, or goal-alignment readout
- Org bottlenecks, priorities, stale goals, or project risks

## First Move

Resolve scope before retrieval:

- Person/team/org: resolve identity, roster, or org-tree groups.
- Project, goal, focus area, or topic: resolve native key, ARI, URL, name, or
  central project/page/workitem anchors.

Establish the time window. If absent, ask when precision matters; otherwise use
a recent bounded window and state it. Keep personal summaries to 1 year or less.

## Route Selection

- Start from typed command families named in the root `twg` skill.
- Pull planning state first for project, goal, and org reports: owners, updates,
  status, dates, linked goals, and linked projects.
- For engineering output, use pull-request or work-activity surfaces before broad
  text search.
- For personal/person work summaries, load `references/personal-work-summary.md`.
- For large orgs, use aggregate team/project/goal/work signals first, then
  hydrate representative people, leaders, or outliers.
- For broad team/org rollups, group first by manager, team, project, or
  workstream. Hydrate representative leaders, people, or outliers unless the
  prompt asks for a roster audit. If slow, use summary/count signals and state
  the sample boundary.
- Use `context user` only for the manager, explicit review subject, or another
  central collaborator whose graph changes the answer.
- Do not apply projection flags to every evidence surface. Native/federated
  commands should use only flags advertised by their own help contracts.
- For importance-ordered rollups, use
  `twg work query --ranked --since <window> --items-per-section <N>`. Ranking is
  heuristic; omit `--ranked` for chronological timelines.

## Evidence Policy

- Balance activity signals with representative evidence: docs, comments,
  blockers, project/goal updates, PRs, and stakeholder interactions.
- Default to a bounded set: resolve scope, collect planning/activity signals,
  hydrate only artifacts that change owner, status, risk, priority, or
  confidence, then answer.
- For broad doc, PR, repo, or person lists, rank first and hydrate only the few
  examples needed. Use titles, summaries, counts, owners, and recency for the
  rest.
- Re-check sufficiency after each evidence family. Once planning, delivery, and
  risk signals are covered, synthesize.
- Distinguish authored delivery from review, coordination, and influence.
- Sample when the scope is broad. State the sample boundary instead of trying to
  exhaust every person and every product surface.
- Treat search/Rovo results as candidate anchors only; hydrate central candidates
  before using them as evidence.
- For PR load, start count-first. If a rollup warns that full fetch is too broad,
  narrow once or switch to count-only.
- If org/context/PR graph calls fail twice with the same backend or coverage
  error, stop that path. Use available evidence and list the failed path as a
  gap.

## Recipe Cards

### Person Or Personal Update

Resolve the person, then pull recent Jira work, PRs, docs/pages, meetings, and
project/goal involvement. Load `references/personal-work-summary.md` for exact
subject, notification, PR hydration, and outcome-first rules.
Separate delivery, review, docs/strategy, coordination, and influence.

### Team Or Org Leadership Readout

Resolve org-tree first. Group before per-person details. Use org-level signals,
then hydrate only outliers that change momentum, blockers, review load, or
ownership.

### Project Or Goal Status

Fetch the native project/goal first. Include owner, state, update,
links, dates, and recency. Hydrate only risk, progress, or dependency evidence.

### Topic Status

Resolve/search once, select central project, goal, page, or workitem anchors,
then hydrate those before using broad work/activity queries.

### Appraisal / Performance Evidence

Resolve person and horizon. Separate delivery, review, collaboration,
docs/strategy, project/goal impact, and stakeholder signals. Avoid count-only
ranking; add caveats when evidence is weak.

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
