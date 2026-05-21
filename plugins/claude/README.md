# Claude Plugin

The Claude/Cowork plugin packages TWG command docs, a TWG skill, and a runtime
wrapper for Claude-hosted usage.

Current private build command:

```bash
npm run build:plugin:claude-cowork
```

Expected generated bundle:

- `.claude-plugin/plugin.json`
- `skills/twg/SKILL.md`
- `skills/twg/references/**`
- `commands/**`
- `scripts/install.sh`
- `scripts/run_twg.sh`
- `runtime/**`

Before release, verify:

- plugin version matches the CLI release version
- generated command docs come from the release/public command profile
- runtime setup instructions are public-safe
- auth instructions do not ask users to paste secrets into GitHub issues
- no internal commands, local paths, or private URLs are present
- marketplace metadata matches the latest Claude marketplace requirements

