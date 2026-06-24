---
description: Find declared or inferred owners, maintainers, experts, reviewers, and escalation paths for an entity.
---

# Responsibility Discovery

Use this reference for "who owns, maintains, knows, reviews, or escalates this?"
around one concrete entity.

## Route

- Use `twg responsibility get <reference>` for explicit declared owners,
  assignees, teams, or reviewers.
- Use `twg responsibility infer <reference>` for ranked role candidates.
- Repeat the advertised role option when the user requests specific roles.
- `twg ownership` is a discovery alias; prefer the canonical responsibility
  path in examples.

## Evidence

Reuse the command's ranked candidates before performing broader investigation.
Preserve:

- people and teams as distinct candidate types,
- confidence bands and reason codes,
- declared versus observed evidence,
- the activity window for behavioral evidence,
- gaps and partial failures.

Declared responsibility does not expire merely because recent activity is
absent. Maintainer, expert, and reviewer evidence may be time-bounded.

Hydrate native Jira, Confluence, project, goal, Bitbucket, or Compass details
only when they explain or corroborate a selected candidate. Do not independently
recompute ownership from raw context unless the command reports a coverage gap
and the user asks for a broader investigation.

Never widen until an individual appears when the evidence identifies a team.
Do not turn gaps into guesses from search snippets or broad activity counts.
