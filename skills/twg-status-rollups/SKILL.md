---
name: twg-status-rollups
description: >
  Use with root `twg` for status rollups, personal, manager, or direct-report work
  summaries, and decision-readiness or go/no-go briefs. Person activity uses
  `work query`; org rollups use tree commands.
---

# twg-status-rollups

Use root `twg`: plan from `twg help-map` and reuse its batched describe contracts.

## CLI launcher fallback

Run `twg <command>`. On shell `command not found`, use `$HOME/.local/bin/twg`
(macOS/Linux) / `$env:LOCALAPPDATA\Programs\twg\bin\twg.exe` (PowerShell), then
tell user to add that directory to PATH. Do not treat auth or command errors as
PATH failures.

Agents: use host-set `TWG_AGENT_DEFAULTS=1` or `TWG_AGENT_DEFAULTS=1 twg <command>`. If assignments are blocked, pass `--mode agent` with explicit output flags. Respect host permissions. `--mode user` overrides the opt-in.

## Use When

- Personal/team/org work summaries, standups, handoffs, or appraisals.
- Project/goal/topic status, leadership readouts, bottlenecks, or launch readiness.

## First Move

Identify the person/roster or project/topic anchor. Preserve the requested window;
otherwise state a bounded default. Personal summaries: one year maximum.

For "my manager's work", use `user manager --identifier <requester-aaid>`,
then `references/personal-work-summary.md`. Empty `org-tree` ancestors do not
exclude a 3P manager.

## Tree Routing Matrix

Load `../twg/references/USER-IDENTIFIERS.md` for supported selectors.
Mixed-identity reporting: `user manager-chain`, `user direct-reports --identifier`,
and `user peers`, when advertised and enabled. Query each person's artifacts
separately; tree rollups remain first-party scoped.

- `pr-tree`: PR-only org activity.
- `org-tree`: 1P hierarchy/roster, not delivery evidence.
- `workitem-tree`: Jira-only org activity.
- `work-tree`: multi-surface org activity.

## Fast Path: PR-Based Leadership Rollup

1. Preserve scope/window. Split merged/open queries: `--state merged` with `--since`
   filters merge time; `--state open` with `--since` filters update time, not creation.
2. Use `pr-tree` first. It groups by reporting-tree `directReports`; add
   `org-tree` only for hierarchy context.
3. Reuse the planned `pr-tree` contract; use `twg help describe "pr-tree"` only
   for missing option details. Do not probe incompatible flag combinations.
4. Start count-first, then at most one supported sampling/full-fetch pass for
   repo or theme evidence, and synthesize at manager/team level.
   Do not issue per-person queries to populate groups; add one targeted PR
   follow-up only when a material theme lacks proof.
5. If `pr-tree` returns `graphstore_pr_query_unavailable`, do not retry the same
   call. A large root with a wide window can exceed the backend time limit. Shorten
   `--since` first. If that is not enough, split by direct report.
6. Add one secondary surface only for a named gap.

Target 2-4 calls. Missing nested evidence in compact output: read saved full
`stdout.json`; do not re-root/refetch branches already present there.

Before answering, run a local JSON calculation on the saved full responses:

- Traverse all `directReports` recursively; join states by `accountId`. Name
  zero-activity people only when both returned direct totals are zero; missing
  people are unknown. `--active-only` prunes subtrees but retains connecting
  managers: `summary.people` counts retained nodes, `activePeople` matching authors,
  neither the full roster. Use the identifier reference's roster check.
- Copy totals from `data.summary`, repo aggregates from `summary.topRepos`.
  For branch totals, group each person once; never add overlapping subtrees.
  `--samples` caps examples, not totals; label example-derived counts as samples.
  Missing top-repo entries are not zeros. Inferred themes need not partition totals.
- Extract a returned full PR URL per supported group; copy it without ellipses,
  even for UUID repos. Keep unsupported groups qualified. Use computed values
  consistently in headings and prose; disclose discrepancies rather than guessing.
  Volume establishes neither leadership nor momentum.

## Evidence Policy

- Match evidence to the requested scope; open PRs are not shipped work.
- Filter server-side by status/date/owner/tag when supported; rank broad lists,
  reuse fields, hydrate missing evidence.
- Batch ranked reads with `goals get`, `projects get`, `focus-areas get`,
  `jira workitem get`, or `pull-requests get`.
- Read Confluence page bodies with `confluence content get`, not `docs get`.
- Distinguish authored delivery from review, coordination, and influence.
- Stop when evidence is sufficient. After two identical backend failures, stop
  that path and report the gap.

## Recipe Cards

### Short-Window Personal Update / Standup

Load `references/personal-work-summary.md` for personal updates, standups, and
catch-ups. Preserve person, project, and window; separate delivery, review,
coordination, and evidence gaps.

### Team Or Org Leadership Readout

Read the first-party org-tree; state directory coverage gaps without
recursively walking the org.
Org projects: `twg projects query --scope org
--include-inferred` (`[Paid: Enriched]`). Group results; hydrate outliers
affecting momentum, blockers, or ownership.

### Project Or Goal Status

Fetch the native project/goal first, with owner, state, update, links, dates,
and recency. Hydrate only risk, progress, or dependency evidence.

### Decision Readiness / Go-No-Go

Load `references/decision-readiness.md`. Start from the native project or decision anchor;
bound scope by explicit links. Identify gates; give a recommendation with
confidence, gaps, and change conditions. Do not infer owners.

### Topic Status

Search once, select central project, goal, page, or workitem anchors,
then hydrate those before broad work/activity queries.

### Appraisal / Performance Evidence

Identify person and horizon. Separate delivery, review, collaboration,
docs/strategy, project/goal impact, and stakeholder signals. Avoid count-only
ranking; caveat weak evidence.

## Answer

Answer plainly by team/workstream, citing progress, risks, supported owners and
coverage limits. Use tables when they clarify comparisons, not by default for
standups or single-project updates.

## Anti-Patterns

- Do not infer goal/project health from issue counts alone.
- Do not use search snippets as final evidence for status or risk.
