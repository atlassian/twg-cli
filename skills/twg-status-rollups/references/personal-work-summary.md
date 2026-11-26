---
description: >
  Summarize my manager's work or another person's activity for standups, OOO/return-after-time-away catch-up,
  handoffs, weekly updates, performance review evidence, appraisals, and
  year-bounded summaries across work, code, docs, meetings, and notifications.
---

# Personal Work Summary

Use this reference with `twg-status-rollups` for bounded personal or
person-scoped work summaries. This is workflow guidance, not a `twg work
summary` command. Compose the summary from existing surfaces, starting with
bounded `work query` evidence.

This reference is for person-scoped summaries. For org/team leadership readouts
based primarily on merged/open PR evidence, use the `pr-tree` fast path in
`twg-status-rollups` instead.

## Use When

- "Summarize this person's work this week."
- "What did this person work on in a time window?"
- "Give a personal work summary for this person for the last quarter."
- "Gather performance review or appraisal evidence for this person."
- "Summarize this person's annual/cycle work."
- "Give all work, PRs, PR activity, and related info for a user."
- "Weekly personal update" or "what changed since the last update?"
- "Prepare a standup" for a person, project, and short window.
- "Help me restart after time away" or prepare a person-scoped handoff.
- "Show delivery, review, docs, meetings, and planning signals together."

Use `twg-engineering-work` instead when the user asks only for PR queues, stale
reviews, review bottlenecks, repo contributors, hot areas, or PR-only status.

## First Move

Identify the subject and time window before querying:

- For "me", use exact command flags `--scope me` and set
  `SUBJECT_IS_ME=true`.
- When the person's identity matters, get the authenticated user once and
  retain their account ID and display name. The literal `me` selector is not
  identity evidence; do not recommend that the requester contact themselves.
- For "my manager", get the caller's AAID, then use
  `twg user manager --identifier '<requester-aaid>' -o json`.
  Pass `data.managerIdentifier.ari` (3P), otherwise `data.manager.accountId`
  (1P), to the person query below; stop if neither is returned. Empty
  `org-tree` ancestors do not exclude a 3P manager.
- For another person, use `--scope user` with the reference the user gave
  (`--name`, `--email`, or `--identifier <aaid-or-1p-or-3p-ari>`), and set
  `SUBJECT_IS_ME=false`. Load `../../twg/references/USER-IDENTIFIERS.md` for
  identifier, manager, and actor-set handoffs.
- If the prompt gives a relative window, use `--since <duration>`.
- If it gives an explicit calendar window, use `--from <YYYY-MM-DD>` and
  `--to <YYYY-MM-DD>` when live `twg work query` help advertises those flags.
  Treat `--from` as inclusive and `--to` as exclusive.
- If it gives only a start date, use `--from <YYYY-MM-DD>` when supported;
  otherwise convert it to the nearest supported `--since` duration or date form
  accepted by live help.
- Keep the requested window bounded to 1 year or less. If the user asks for a
  broader range, narrow to 1 year and state the boundary.
- Repeat the exact subject flags in each supported command. Do not put them in a
  scalar shell variable because shells can pass the whole selector as one
  argument or lose it across calls.
- If live help does not advertise subject flags for a follow-up command, omit
  that command or use hydrated artifacts from the baseline instead of silently
  querying the operator. Native docs, meetings, and video commands may need
  their own user/account options rather than `--scope`.

## Evidence Plan

Start broad, then hydrate only what changes the answer:

For personal project discovery, use `twg projects query --scope me --include-inferred`
(`owner` by default; use `--role contributor` for
collaborative work). Check `projectType`, `meta.coverage`, and `warnings`;
hydrate inferred evidence through its Jira or Confluence links.
`[Paid: Enriched]`; may consume Rovo credits.

1. Baseline activity:
   for self, run
   `twg work query --scope me --activity all --ranked --since <window> --items-per-section 2 -o json`,
   or use `--from <YYYY-MM-DD> --to <YYYY-MM-DD>` for explicit calendar windows.
   For self restart/catch-up after time away, use the same unrestricted query;
   omitting `--types` previews every supported person-scoped work section in one
   batch. Do not narrow it to `assigned` or create source quotas. Stop on a
   policy/organization denial. If the query hits a relationship/safety limit,
   recoverable source failure, or returns partial coverage, follow the
   command's repair guidance with supported person-scoped sections or a
   material-gap query while preserving the same person, window, and explicit
   scope. Do not silently shrink the requested window or types, treat a
   counts-only response as an inventory, or switch to a tenant-wide query.
   Record omitted, unavailable, and still-uncovered sections.
   For another person, run
   `twg work query --scope user --identifier <aaid-or-user-ari-or-3p-user-ari> --activity all --ranked --since <window> --items-per-section 2 -o json`,
   or use `--from <YYYY-MM-DD> --to <YYYY-MM-DD>` for explicit calendar windows.
   When a supporting tool returns the subject's bounded pre-expanded actor set,
   use its exact `actorIdentifiers[].ari` values as repeated
   `--actor-identifier` flags instead of `--identifier`, `--account-id`, or
   `--assignee`; do not mix those selectors. Repeat `--actor-identifier` at
   most 25 times per call.
   Inspect the returned inline/compact evidence before opening details; a shape
   or stats summary is not a complete inventory. Each item carries `activityAt`,
   the timestamp of the relationship that matched the window — use it for
   recency and to show why an item is in the window, not `createdAt`. Treat
   per-section limits as a preview, track sections or relationships not covered,
   and hydrate candidates whose detail could change identity, scope, priority,
   freshness, decisions, blockers, or next actions. Use supported scoped native
   evidence for a material uncovered gap; do not turn a partial preview into a
   tenant-wide inventory.
2. PR state:
   use `twg pull-requests query --scope me ...` or
   `twg pull-requests query --scope user --account-id <id> ...` for authored,
   reviewed, participant, open, merged, or updated PRs when the baseline needs
   more PR coverage. This command currently accepts only 1P AAIDs or
   `IdentityUser` ARIs via repeatable `--account-id`; run
   `twg help describe "pull-requests query"` before use. Do not pass a 3P
   identity or substitute the current operator. Do not fall back to the current
   operator's PRs for another person. When the baseline uses
   `--from <YYYY-MM-DD> --to <YYYY-MM-DD>`,
   propagate the same exclusive calendar window to PR follow-ups as
   `--updated-since <from> --updated-before <to>`.
3. PR activity:
   for selected central PRs only, hydrate provider-native details when a
   supported route exists. Use Bitbucket PR detail/activity/comment/task commands
   for Bitbucket PRs. For GitHub or other third-party PRs surfaced from exact
   URLs, ARIs, or existing evidence, hydrate metadata by the TWG GraphPullRequest
   ARI when available. Treat that as metadata coverage unless a provider-native
   route or verified TWG activity relationship returns comments, reviews,
   checks, or timeline activity. If detailed PR activity is unavailable for that
   provider or tenant, report it as a coverage gap instead of substituting
   Bitbucket commands.
4. Notifications:
   use `twg notifications` only when `SUBJECT_IS_ME=true`. Notifications are
   operator-scoped and private; for another person, mark notification coverage as
   unavailable instead of mixing in the operator's notifications.
5. Related signals:
   add docs/query or docs/search, meetings/videos, Jira workitem details,
   projects, goals, or context commands only when they explain momentum,
   blockers, decisions, ownership, or stakeholder impact.
   Follow the per-surface recipes in `../../twg/references/USER-IDENTIFIERS.md`:
   artifact queries accept canonical selectors or exact hierarchy actor sets,
   whereas `context user` takes one positional identity and has narrow 3P
   conversation/mention coverage when its installed help advertises 3P support.
   Do not assume provider or relationship parity
   with a 1P account. Other people's viewed history is not available.
   For current or ongoing priorities, combine activity with active project/goal
   state and recorded commitments, deadlines, risks, or decisions. Absence from
   a recent activity window is not evidence that an active project is irrelevant.

## Short Window And Restart Rules

For a standup or short project update, use one bounded account-scoped work
query for the person, project, and window. Hydrate only a blocker, decision, or
ownership gap that changes today's action. If it finds no qualifying work, make
at most one project-identity lookup, then stop. Report the person, project,
window, and relationship scope checked. Do not replace an empty personal result
with tenant-wide Jira, Confluence, context, or PR inventories, and do not claim
there was no work when coverage was incomplete.

For restart, OOO catch-up, or handoff, treat counts, returned projects, status,
and recorded owners as context—not proof of personal priority. Establish
priority from explicit priority, supported commitments or deadlines, risk,
decisions, and direct execution or discussion evidence. Reviewer activity,
comment volume, and counts do not override an explicit priority or create a
second priority when the evidence supports only one. Cluster by outcome and
rank across the combined preview by recency and decision pressure.
When the request asks for current or ongoing priorities, pair the activity
preview with active owned project/goal state and its recorded updates before
ranking; do not infer that an active project is irrelevant because it had no
matching activity in the requested window.
Prefer two complementary signals for a selected cluster when available, but do
not require them. Use a bounded batch of targeted hydrations and continue while
each read can change identity, scope, priority, freshness, a decision, blocker,
or next action. Use `collaborators` only when it can close a material ownership
or discussion gap for a verified 1P AAID; preserve that AAID explicitly for
another person. For a 3P-only conversation/mention gap, use `context user <3p-ari>`
instead, without presenting those relationships as collaboration scores.
Stop when those claims are supported or a remaining gap is
unavailable, and disclose incomplete coverage. Do not reopen broad inventories,
hydrate every PR, force one candidate per source section, or invent a second
workstream with weak support.

Common command shapes when a summary also covers a team:

- Person: `twg people search --name "<name>"` for the account ID.
- Team: `twg teams query -q "<team>"`, then `twg teams members list <team-ari>`. It returns
  up to 100 members per page; follow `--after` until the list is complete.
- Several people's work: `twg work query --scope user --identifier <id> --identifier <id> --types <types> --since <window>`,
  one `--identifier` per member and at most 25 per call. Split larger teams into batches,
  check each person's result for errors, and report any members left uncovered.

## Synthesis

Group by outcome, theme, or workstream first. Attach Jira, PR, doc, meeting,
planning, and notification evidence inside each workstream so one initiative is
not split across raw signal buckets.

Use cross-cutting sections only when they materially change the readout:

- Review and coordination: reviewed PRs, comments, requested changes, approvals,
  unresolved tasks, stakeholder follow-ups, and notifications.
- Knowledge and artifacts: docs, pages, blogs, whiteboards, videos, decisions,
  and meeting outputs.
- Gaps: auth, ACL, missing PR activity, unavailable notifications for another
  person, unsupported full `from/to` ranges, and sampled evidence boundaries.

Always include stable IDs or URLs for key artifacts. Distinguish authored
delivery from review/coordination. Reviewed PR counts mean PRs matched through
reviewer relationships where the user is added as a reviewer; do not treat them
as comments, approvals, or requested changes without PR activity evidence.
Counts are useful context, not impact.
Different results across canonical, actor-set, or artifact queries establish
different observed coverage, not the cause. Report the scopes checked; do not
attribute a discrepancy to a missing alias without supporting evidence.

## Stop Conditions

- Do not exhaustively hydrate every artifact in a broad window.
- Stop after the evidence identifies the main themes, blockers, and next
  actions.
- If the same backend, auth, ACL, or command-contract failure repeats twice,
  continue from available evidence and report the coverage gap.
