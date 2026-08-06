---
description: Guidance for inferred teams.
---

# Inferred Teams

Default teams commands return canonical TeamV2 teams. Use inferred teams only when
the user explicitly asks for inferred teams, project/space-backed teams, or gives
an inferred-team ID from a previous result.

- Query canonical teams: `twg teams query --query <query>`.
- Include inferred teams: `twg teams query --query <query> --include-inferred --site <site>`.
- Follow up on an inferred team: pass the returned `teamIdForFollowUp` to
  `twg teams get <teamIdForFollowUp> --include-inferred --site <site>` or
  `twg teams members list <teamIdForFollowUp> --include-inferred --site <site>`.
- Follow-up IDs may be either:
  - Legacy masked: `ari:cloud:graph::jiraTeam/<base64(jiraProjectAri)>`
  - Hydrated: `ari:cloud:graph-store::inferred-team/workspace/<workspaceId>/<teamId>`
    Both forms require `--include-inferred` on `teams get` and `teams members list`.
- Inferred teams are project/space-backed semantic handles (JiraProject or
  ConfluenceSpace), not canonical teams. Treat fields such as
  `semanticType: "inferred_team"`, `backingEntityType`, `backingEntityAri`,
  `backingEntityKey`, `backingEntityName`, `backingEntityUrl`,
  `traversalRelationship: "inferred_team_collaborates_on_inferred_project"`,
  and `fallbackReason: "include_inferred"` as provenance.
- `--include-inferred` cannot be combined with `--all` because inferred teams
  are member-scoped.
- Inferred lookups require a resolved site context (`--site` or configured site).
- Path tier stays Basic for `teams`. `--include-inferred` is a
  `[Paid: Intelligence]` opt-in (may consume credits). Billing stays on the
  command path (no separate inferred event); backend Cypher costing covers the
  inferred pathway without reclassifying canonical teams reads as Intelligence.
