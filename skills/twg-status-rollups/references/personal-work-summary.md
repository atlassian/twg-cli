---
description: >
  Summarize cross-product work for any person across Jira, pull requests, docs,
  meetings, planning, and notifications for performance reviews, appraisals,
  annual/cycle summaries, and week-to-year windows up to 1 year.
---

# Personal Work Summary

Use this reference with `twg-status-rollups` for bounded personal or
person-scoped work summaries. This is workflow guidance, not a `twg work
summary` command. Compose the summary from existing surfaces, starting with
bounded `work query` evidence.

## Use When

- "Summarize this person's work this week."
- "What did this person work on in a time window?"
- "Give a personal work summary for this person for the last quarter."
- "Gather performance review or appraisal evidence for this person."
- "Summarize this person's annual/cycle work."
- "Give all work, PRs, PR activity, and related info for a user."
- "Weekly personal update" or "what changed since the last update?"
- "Show delivery, review, docs, meetings, and planning signals together."

Use `twg-engineering-work` instead when the user asks only for PR queues, stale
reviews, review bottlenecks, repo contributors, hot areas, or PR-only status.

## First Move

Resolve the subject and time window before querying:

- For "me", use exact command flags `--scope me` and set
  `SUBJECT_IS_ME=true`.
- For another person, resolve their account ID first, use exact command flags
  `--scope user --account-id <id>`, and set `SUBJECT_IS_ME=false`.
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

1. Baseline activity:
   for self, run
   `twg work query --scope me --activity all --ranked --since <window> --items-per-section <n> -o json`,
   or use `--from <YYYY-MM-DD> --to <YYYY-MM-DD>` for explicit calendar windows.
   For another person, run
   `twg work query --scope user --account-id <id> --activity all --ranked --since <window> --items-per-section <n> -o json`,
   or use `--from <YYYY-MM-DD> --to <YYYY-MM-DD>` for explicit calendar windows.
2. PR state:
   use `twg pull-requests query --scope me ...` or
   `twg pull-requests query --scope user --account-id <id> ...` for authored,
   reviewed, participant, open, merged, or updated PRs when the baseline needs
   more PR coverage. Do not fall back to the current operator's PRs for another
   person. When the baseline uses `--from <YYYY-MM-DD> --to <YYYY-MM-DD>`,
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

## Stop Conditions

- Do not exhaustively hydrate every artifact in a broad window.
- Stop after the evidence identifies the main themes, blockers, and next
  actions.
- If the same backend, auth, ACL, or command-contract failure repeats twice,
  continue from available evidence and report the coverage gap.
