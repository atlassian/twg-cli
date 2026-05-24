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
- `docs/public-repo-governance.md` - public repo intent, boundaries, and
  pre-automation operating model.
- `docs/release-integration.md` - release and changelog integration notes.
- `plugins/` - Codex and Claude marketplace packaging notes.
- `skills/` - public TWG agent skills and shared `twg` wrapper.
- `.github/ISSUE_TEMPLATE/` - public issue intake forms.
- `.github/pull_request_template.md` - public-safety checklist for changes.

## Issue Triage

Use labels consistently:

- `bug` - reported behavior defect.
- `docs` - public documentation issue.
- `feature-request` - public workflow or capability request.
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

## Release Update Expectations

Public updates should come through reviewed public PRs until an explicit
automation decision record is approved. A release update should change only
public-safe artifacts:

- README/support/security/contributing docs when changed.
- `CHANGELOG.md` and GitHub Release notes.
- public release metadata and CDN links.
- Codex and Claude plugin metadata or release attachments.
- issue templates or PR template changes.

Future automation and Pages migration require a separate approved design. Do not
add scheduled jobs, private-system credentials, release publishing, or automatic
sync wiring from this repo alone.

Run leak checks before publishing public changes. GitHub auth for automation must
avoid token-bearing remote URLs.
