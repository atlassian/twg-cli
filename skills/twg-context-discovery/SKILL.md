---
name: twg-context-discovery
description: >
  Use with root `twg` for deep context, dependency maps, responsibility,
  related entities, experts, project-to-repo discovery, OOO catch-ups, and
  "catch me up" requests around a concrete anchor.
---

# twg-context-discovery

Use the root `twg` skill. Get command grammar from live `twg help`,
`twg help <terms>`, or `twg help describe <path>`.

## CLI launcher fallback

Run `twg <command>`. On shell `command not found`, use `$HOME/.local/bin/twg`
(macOS/Linux) / `$env:LOCALAPPDATA\Programs\twg\bin\twg.exe` (PowerShell), then
tell user to add that directory to PATH. Do not treat auth or command errors as
PATH failures.

## Use When

- "Catch me up on..." or "I was out / OOO"
- "Deep context around this workitem/page/topic"
- "Dependency map" or "find upstream/downstream blockers"
- "Which repo should I change?"
- "Draw the graph" / "visualize" / "open the graph"
- "Who's involved" / "experts on X"
- "Who owns/maintains/knows/reviews this?" or "who should I ask/escalate to?"

## First Move

Resolve the anchor before widening:

- Stable key, URL, or ARI: use directly when the family is clear.
- Fuzzy topic or name: use resolve/search once, then select concrete anchors.
- Multiple same-kind anchors: batch them in one context call when supported.
- Unknown command shape: inspect focused help before calling data.

If context is not advertised for an anchor type, use product-native hydration
and search evidence instead of inventing paths.

For ownership, maintainer, expert, reviewer, or escalation questions, follow
`references/responsibility.md`.

## Route Selection

- Known Jira work items usually need native workitem details plus relationship
  context.
- Projects and goals need native details plus Jira, docs, search, PR, and
  meeting evidence.
- For OOO catch-up with a window, use the pinned site.
  Start with one bounded `collaborators` call and one ranked `work query` across
  Jira, PRs, projects/goals, docs, meetings/recordings, and comments/decisions.
  Keep the returning user, requested focus, and next actions central. Infer at
  most two priority workstreams and five material changes across them. Use up to
  three detail calls only when a missing decision, blocker, owner, or action
  changes today. Do not rerun collaborators, enumerate artifacts, or use
  org/tree routes without an org anchor; label requested surfaces with no
  material evidence.
- Pages/topics/dependency prompts need hydrated central anchors before broad
  search results become evidence.
- Raw graph-query/debugging surfaces are not the default dependency-map route.
  Use them only when the user explicitly asks for that query language or typed
  commands cannot express the required edge.

## Evidence Policy

For central candidates, use a bounded source and relationship fan-out:

- Source fetch: fields, owner, status, body, comments, and URLs.
- Context: graph edges, formal external links, related people, teams, projects,
  goals, docs, PRs, commits, and branches.

Use summary detail first. Escalate to full only for the central anchor or up to
3 high-signal related anchors when URLs, comments, body content, or provenance
are missing.

Treat third-party URLs as graph nodes. Collect remote links, context edges,
descriptions, comments, ADF links, bare URLs, and linked bodies; retain
provenance for relationship direction.

## Expansion Rules

- Expand by relationship role, not raw count.
- Hydrate parent, epic, inbound peer, blocker, consumer, central page, external
  design, PR, commit, branch, assignee, reporter, contributor, and reviewer
  signals when they change direction, risk, ownership, or next action.
- Fetch known older links directly by URL, key, ID, or ARI instead of widening
  the whole graph blindly.
- Use strong query variants rather than many synonyms.
- After the first source fetch plus context/search pass, pause and compare the
  evidence against the requested output. If owner, status, relation, recency,
  and evidence URL/key are present, synthesize instead of widening.
- If a context or graph-backed command returns the same backend/coverage error
  twice, do not keep probing adjacent graph paths. Record the coverage gap and
  continue with product-native hydrated evidence.
- Stop when the next candidate would not add new entities, links, contributors,
  teams, decisions, ownership, risk, or next action.
## Graph Visualization

For graph requests, pipe typed context output to `twg visualize`. Keep entities
that change direction, ownership, risk, or next action; collapse duplicates.

## Output Shape

- Anchor snapshot: what it is and why it matters.
- For OOO catch-ups, follow the prompt's short sections; do not add a
  relationship table. For other context work, include entity, relationship,
  owner, importance, and evidence.
- Risks and dependencies, separating confirmed edges from inferred relationships.
- Suggested next actions.
- Confidence and gaps when evidence is incomplete, access-limited, stale, or
  sampled.

## Anti-Patterns

- Do not stop at search results without hydrating anchors.
- Do not treat `stdout_shape` as a complete entity or URL inventory.
- Do not skip peer expansion for graph/dependency prompts because peers look
  "Done".
- Do not dismiss a 1-hop candidate by title alone.
- Do not hand-roll graph HTML.

## References

- `references/responsibility.md` - declared and inferred responsibility evidence
