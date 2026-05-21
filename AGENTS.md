# Agent Instructions

This repository is the public TWG CLI engagement and release-artifact surface.
It is not the private implementation source tree.

## Work Safely

- Treat everything in this repo as public.
- Do not add tokens, auth files, cookies, `.env` files, private URLs, customer
  data, internal Atlassian links, local machine paths, or proprietary content.
- Do not copy files wholesale from the private TWG CLI implementation repo.
- Keep generated content allowlist-based and release-profile only.
- Prefer small, reviewable documentation and metadata changes.

## Repo Map

- `README.md` - public overview, install commands, and support entrypoints.
- `CHANGELOG.md` - public release notes synced from the private release process.
- `docs/release-integration.md` - how the private release process should update
  this public repo.
- `plugins/` - Codex and Claude marketplace packaging notes.
- `.github/ISSUE_TEMPLATE/` - public issue intake forms.
- `.github/pull_request_template.md` - public-safety checklist for changes.

## Issue Triage

Use labels consistently:

- `bug` - reported behavior defect.
- `docs` - public documentation issue.
- `command-request` - request for a command or output shape.
- `skill-request` - request for agent skill behavior.
- `plugin-request` - request for Codex or Claude plugin behavior.
- `install` - install, update, or setup problem.
- `agent-workflow` - agent prompt, recipe, or workflow feedback.
- `needs-triage` - new issue that has not been reviewed.
- `needs-info` - reporter needs to provide more public-safe detail.
- `exploring`, `planned`, `released` - lifecycle status.

If an issue needs internal engineering work, keep the public issue free of
internal Jira keys or private links. Summarize public-safe status back to GitHub.

## Release Sync Expectations

Public updates should come from the private release/export pipeline. A proper
release sync should update only public-safe artifacts:

- README/support/security/contributing docs when changed.
- `CHANGELOG.md` and GitHub Release notes.
- public release metadata and CDN links.
- Codex and Claude plugin metadata or release attachments.
- issue templates or PR template changes.

Run leak checks before publishing public changes. GitHub auth for automation must
avoid token-bearing remote URLs.

