# Public Plugins

TWG CLI should publish public agent plugin artifacts alongside each release.

Private release builds currently support:

```bash
npm run build:plugin:codex
npm run build:plugin:claude-cowork
```

Those commands should produce release-scoped plugin zip artifacts that can be
attached to GitHub Releases, submitted to marketplace review, or referenced from
public docs.

## Targets

- `codex/` - Codex plugin marketplace notes and expected public artifact shape.
- `claude/` - Claude/Cowork plugin marketplace notes and expected public artifact
  shape.

The generated plugin bundles should come from the same private release commit as
the published CLI binaries. Do not hand-edit generated plugin package contents in
this repo.

## Publication Rule

The public repo should store stable metadata and docs. Large generated plugin
zips should normally be attached to GitHub Releases, not committed to Git, unless
marketplace submission requires a checked-in source package.

