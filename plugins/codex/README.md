# Codex Plugin

The Codex plugin packages the public TWG agent skills plus a runtime launcher for
the local `twg` CLI.

Current private build command:

```bash
npm run build:plugin:codex
```

Expected generated bundle:

- `.codex-plugin/plugin.json`
- `README.md`
- `runtime/manifest.json`
- `runtime/install.sh`
- `runtime/run_twg.sh`
- `skills/**`

The plugin manifest should point at this public GitHub repo and public TWG CLI
install docs. It should not point users at the private Bitbucket repo.

Before release, verify:

- plugin version matches the CLI release version
- runtime downloads from `https://teamwork-graph.atlassian.com/cli`
- checksum verification uses `SHA256SUMS-v<version>`
- skills are generated from the release/public profile
- no internal commands, local paths, or private URLs are present
- marketplace metadata matches the latest Codex marketplace requirements

