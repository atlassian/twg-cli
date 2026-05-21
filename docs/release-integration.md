# Release Integration

This repo is updated from the private TWG CLI release process. Bitbucket remains
the source of truth for implementation, release scripts, tests, and internal
builds. GitHub is the public engagement and distribution surface.

## Current Private Release Shape

The private `twg-cli` repo already has these release responsibilities:

- `bash bin/release/prepare.sh` prepares the release version, `src/version.ts`,
  lockfile, and `CHANGELOG.md`.
- The `main` pipeline builds internal and external binaries after a version bump.
- Step C publishes the external public release candidate under
  `https://teamwork-graph.atlassian.com/cli/candidates/<version>/`.
- The `promote-public-rc` pipeline promotes the already-tested candidate to the
  stable public manifest and installers.
- `GITHUB_TAP_TOKEN`, when present, updates `atlassian/homebrew-twg`.
- `npm run docs:github-pages:publish` publishes the generated GitHub Pages docs
  mirror for the Homebrew tap.
- `npm run build:plugin:codex` and `npm run build:plugin:claude-cowork` already
  build plugin zip artifacts under `release/plugins`.

## Proposed Public Repo Sync

Add one explicit public export stage to the private repo:

```bash
npm run public:export
npm run public:leak-check
npm run public:sync-github
```

The export stage should generate a clean directory, for example
`release/public-github/twg-cli`, from allowlisted sources only.

Exported content:

- `README.md`, `SUPPORT.md`, `SECURITY.md`, `CONTRIBUTING.md`,
  `CODE_OF_CONDUCT.md`, `ROADMAP.md`, and `CHANGELOG.md`.
- Public DAC docs and generated public command reference.
- Public skill bundles from the release build profile.
- Codex plugin zip and manifest metadata.
- Claude/Cowork plugin zip and manifest metadata.
- Safe examples, recipes, prompts, and output-shape docs.
- GitHub issue and discussion templates.
- Release metadata linking to the stable CDN manifest, installers, checksums,
  Homebrew formula, and marketplace artifacts.

Do not copy the private repo wholesale. Every exported path should be allowlisted.

## Release Flow

1. Prepare release in the private repo with `bash bin/release/prepare.sh`.
2. Merge the release commit to private `main`.
3. Private pipeline tags the release, builds binaries, signs macOS artifacts, and
   publishes the hidden public candidate.
4. Build marketplace artifacts:

   ```bash
   npm run build:plugin:codex
   npm run build:plugin:claude-cowork
   ```

5. Generate the public GitHub export from the same release commit:

   ```bash
   npm run public:export
   npm run public:leak-check
   ```

6. Open a bot PR to this GitHub repo with docs, skills, plugins, changelog, and
   release metadata for the candidate version.
7. Validate the candidate installer and plugin packages.
8. Promote the public candidate with `promote-public-rc`.
9. Merge the GitHub public repo PR and create/update the GitHub Release for the
   same version.

## Non-Release Docs Sync

DAC documentation changes should also refresh GitHub, even when no binary
release is cut. In that case:

- Export only docs, examples, issue templates, and public metadata.
- Do not create a GitHub Release.
- Do not move installer, manifest, plugin, or Homebrew stable pointers.

## Leak Checks

The private export pipeline should fail before pushing GitHub changes if it finds:

- Tokens, API keys, cookies, `.env` files, auth stores, or session logs.
- Internal Bitbucket, Jira, Confluence, Statlas, or pipeline URLs not explicitly
  approved for public docs.
- Internal build-profile command catalogs.
- Internal-only commands, dev-only commands, or private graph/debug surfaces.
- Customer data, private cloud IDs, ARIs, or site-specific examples.
- Private benchmark/eval artifacts.
- Generated files that reference local developer paths.

Authentication for GitHub sync must use a token-free remote plus `GIT_ASKPASS` or
an equivalent environment-backed credential helper. Do not put GitHub tokens in
clone URLs, process arguments, logs, or stored remotes.

## GitHub Release Content

Each public GitHub Release should be generated from the release changelog but
rewritten for adoption:

- What changed.
- Why users or agents should care.
- Install/update command.
- Candidate validation status.
- Checksums and manifest links.
- Plugin package links for Codex and Claude.
- Known issues or migration notes.
- Links to docs and a release discussion.

