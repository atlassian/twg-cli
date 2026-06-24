---
name: twg-context-discovery
description: >
  Use with root `twg` for deep context, dependency maps, responsibility,
  related entities, experts, project-to-repo discovery, and "catch me up"
  requests around a concrete anchor.
---

# twg-context-discovery

Use together with the root `twg` skill. Exact command grammar must come from
live `twg help`, `twg help <terms>`, or `twg help describe <path>`.

## Use When

- "Catch me up on..."
- "Deep context around this workitem/page/topic"
- "Dependency map" or "find upstream/downstream blockers"
- "Which repo should I change?"
- "Which people/repos/projects are related?"
- "Draw the graph" / "visualize" / "open the graph"
- "Who's involved" / "experts on X"
- "Who owns/maintains/knows/reviews this?" or "who should I ask/escalate to?"

## First Move

Resolve the anchor before widening:

- Stable key, URL, or ARI: use it directly when the command family is clear.
- Fuzzy topic or name: use resolve/search once, then select concrete anchors.
- Multiple same-kind anchors: batch them in one context call when supported so
  edges return together.
- Unknown command shape: inspect one focused help contract before calling data.

If a context command is not advertised for an anchor type, treat that as a
coverage gap. Use product-native hydration and search evidence instead of
inventing unsupported command paths.

For ownership, maintainer, expert, reviewer, or escalation questions, follow
`references/responsibility.md`.

## Route Selection

- Known Jira work items usually need native workitem details plus relationship
  context.
- Projects and goals usually need native project/goal details plus selected
  Jira, Confluence/docs, search, PR, and meeting evidence.
- Pages/topics/dependency prompts need hydrated central anchors before broad
  search results become evidence.
- Raw graph-query/debugging surfaces are not the default dependency-map route.
  Use them only when the user explicitly asks for that query language or typed
  commands cannot express the required edge.

## Evidence Policy

For every central candidate, run source fetch and relationship context as one
bounded fan-out:

- Source fetch: fields, owner, status, body, comments, and URLs.
- Context: graph edges, formal external links, related people, teams, projects,
  goals, docs, PRs, commits, and branches.

Use summary detail first. Escalate to full only for the central anchor or up to
3 high-signal related anchors when URLs, comments, body content, or provenance
are missing.

Read `output_files.stdout` before selecting entities for graph/context answers;
`stdout_shape` is only a structural sample and can miss relationship tails.

Third-party URLs are first-class graph nodes. Collect URLs from remote links,
formal context external edges, descriptions, comments, ADF link marks, bare URL
text, and linked target bodies. Track provenance because it determines
relationship direction.

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

When the user asks to visualize, draw, or open a graph, prefer piping typed
context output to `twg visualize`. The viewer can auto-detect context envelopes
and project them to graph shape. Hand-author graph JSON only when typed
projection cannot express the needed labels or merged multi-anchor graph.

Keep rendered graphs focused on directly relevant people, teams, and artifacts.
Collapse duplicate signals and keep peripheral items out of the graph when they
do not change direction, ownership, risk, or next action.

## Output Shape

- Anchor snapshot: what it is and why it matters.
- Relationship table: entity, type, direction, owner, importance, and evidence.
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
