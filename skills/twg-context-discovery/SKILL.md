---
name: twg-context-discovery
description: >
  Use with root `twg` for dependency maps, related entities, project-to-repo
  discovery, person conversations and mentions, OOO catch-ups, and
  "catch me up" requests around a concrete anchor.
---

# twg-context-discovery

Use root `twg`: plan from `twg help-map` and reuse its batched describe contracts.
Use `twg help describe <path>` only when required details are missing.

## CLI launcher fallback

Run `twg <command>`. On shell `command not found`, use `$HOME/.local/bin/twg`
(macOS/Linux) / `$env:LOCALAPPDATA\Programs\twg\bin\twg.exe` (PowerShell), then
tell user to add that directory to PATH. Do not treat auth or command errors as
PATH failures.

Agents: use host-set `TWG_AGENT_DEFAULTS=1` or `TWG_AGENT_DEFAULTS=1 twg <command>`. If assignments are blocked, pass `--mode agent` with explicit output flags. Respect host permissions. `--mode user` overrides the opt-in.

## First Move

Identify the anchor before widening:

- Stable key, URL, or ARI: use directly when the family is clear.
- Named project/service: retain qualifiers; hydrate and verify
  identity before synthesis. Use an alias/successor only with source evidence;
  report missing named evidence as a scoped gap. Broad or ambiguous topics may
  explore plausible scopes.
- Fuzzy topic/name: classify scope; compare plausible anchors before ranking,
  hydrating only those whose evidence can resolve the scope. Keep the set small,
  but do not use a fixed anchor count when a material ambiguity remains.
- Multiple same-kind anchors: batch them in one context call when supported.
- Unknown command shape: inspect focused help before calling data.

For fuzzy topics, group candidates by charter, roadmap, project, product, or
service scope; keep same-named clusters separate. Compare scope, centrality,
breadth, and recency before selecting. If unclear, show alternatives or ask
before inferring ownership. Parent/program, component/subproject, sibling, and
successor candidates require charters or relationships; reopen comparison when
evidence contradicts a provisional anchor. Exact keys and URLs keep the fast path.

If context is not advertised for an anchor type, use product-native hydration
and search evidence instead of inventing paths.

For ownership, expertise, approval authority, leadership reach-outs, or
escalation, load `../twg-responsibility-routing/SKILL.md`. Return here only
when that workflow needs relationship or dependency expansion.

## Route Selection

- Person anchors: load `../twg/references/USER-IDENTIFIERS.md` for context,
  collaborators, reporting peers, and activity routes. Check live help for 3P
  support; conversations/mentions do not imply full 1P coverage.
- Known Jira work items usually need native workitem details plus relationship
  context.
- Projects and goals need native details plus Jira, docs, search, PR, and
  meeting evidence.
- For topic onboarding, start with one knowledge search and one native-work
  search; compare formal epic, project, goal, and page anchors by source-defined
  hierarchy. Prefer the anchor linking current delivery/code; use context or
  responsibility only for dependencies or people. Reuse returned output before
  another projection and add a focused read whenever it can resolve a material
  scope, relationship, owner, freshness, or delivery gap. Do not retry synonyms
  or continue once those claims are supported or the remaining evidence is
  unavailable.
- For restart, handoff, or OOO catch-up, load
  `../twg-status-rollups/references/personal-work-summary.md` and follow its
  restart guidance. Infer priority across connected evidence and hydrate only
  anchors that change the user's next action.
- Dependency map and page/topic prompts need hydrated anchors before broad search is
  evidence. Map broad subdomains before assigning owners/experts.
- Raw graph-query/debugging surfaces are not the default dependency-map route.
  Use them only when the user explicitly asks for that query language or typed
  commands cannot express the required edge.

## Evidence Policy

Use inline or compact output first. Fetch central candidates' fields, owner,
status, body, comments, URLs, and context edges. Escalate to full output or
targeted native follow-ups only for material evidence or coverage gaps within
the established scope. Do not stop at a numeric count while such a gap remains.
Treat third-party URLs as nodes and retain relationship direction.

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
  evidence URL/key, and the requested source roles/content are present,
  synthesize instead of widening. Otherwise continue only for a candidate that
  can close the material gap.
- If a context or graph-backed command returns the same backend/coverage error
  twice, do not keep probing adjacent graph paths. Record the coverage gap and
  continue with product-native hydrated evidence.
- Stop when the next candidate would not add new entities, links, contributors,
  teams, decisions, ownership, risk, or next action.

## Answer

Explain the anchor and the relationships that answer the question, with
sources. For a catch-up, focus on priorities and next actions; for a dependency
map, make edge direction and ownership clear. Distinguish confirmed links from
inferences and note material risks or evidence gaps. Use a relationship table
only when it clarifies a multi-entity map.

## Anti-Patterns

- Do not stop at search results without hydrating anchors.
- Do not treat `stdout_shape` as a complete entity or URL inventory.
- Do not skip peer expansion for graph/dependency prompts because peers look
  "Done".
- Do not dismiss a 1-hop candidate by title alone.
