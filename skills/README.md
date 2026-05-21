# TWG Agent Skills

This directory contains the public TWG agent skills exported from the TWG CLI
release source.

- `twg` - root operating skill and live-command discovery rules.
- `twg-context-discovery` - deep context pickup, dependency maps, and graph-style
  discovery.
- `twg-engineering-work` - pull requests, stale reviews, repos, contributors,
  and engineering bottlenecks.
- `twg-operational-health` - on-call, reliability, incident, Assets, staffing,
  and operational-risk workflows.
- `twg-status-rollups` - personal, team, org, project, goal, focus-area, and
  leadership status readouts.
- `_shared/scripts/twg` - wrapper used by the skills to invoke TWG CLI with
  agent-oriented defaults.

These files should be refreshed from the private release/export pipeline, not
hand-edited here except for public-safety fixes.

