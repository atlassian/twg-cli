# Release Integration

This repo is updated through reviewed public changes that originate from the TWG
CLI release process. Bitbucket remains the source of truth for implementation,
release scripts, tests, and internal builds. GitHub is the public engagement and
distribution surface.

Automation is not approved by this document. Any automated sync from the private
repo needs a separate decision record, leak-check design, permission review, and
implementation PR.

## Private Release Boundary

The private release process is responsible for versioning, building, signing,
validating, and publishing TWG CLI artifacts. This public repo should only show
release-ready information that is safe for users:

- public install and update instructions
- public changelog and GitHub Release notes
- public CDN, manifest, checksum, and Homebrew links
- public skills and plugin package notes
- public issue and support links

## GitHub Pages Mirror

GitHub Pages for TWG CLI docs is published from this repo:

- Pages URL: `https://atlassian.github.io/twg-cli/`
- Source repo: `atlassian/twg-cli`
- Source branch: `gh-pages`

The Homebrew tap repo, `atlassian/homebrew-twg`, owns only the generated
Homebrew formula. It is not the documentation mirror.

The private `twg-cli` publishing flow should keep the GitHub Pages publish
target pointed at `atlassian/twg-cli`, use a dedicated `GITHUB_PAGES_TOKEN`, and
avoid token-bearing remote URLs. That token needs **Contents: read and write**
and **Pages: read-only** on `atlassian/twg-cli`.

## Manual Public Repo Update Checklist

Until automation is approved, public repo updates should be made through reviewed
PRs. For each release or docs update:

- Update only public-safe docs, skills, plugin notes, changelog, issue
  templates, or release metadata.
- Confirm every copied path is allowlisted.
- Review the diff for private links, customer data, internal command docs,
  private build output, local paths, and credentials.
- Keep GitHub Release content human-readable and adoption-focused.
- Do not add scripts, scheduled jobs, publish credentials, or private-system
  access as part of a manual update.

## Release Flow

1. Prepare and validate the release in the private source-of-truth workflow.
2. Prepare public changelog text and GitHub Release notes from release-ready
   information only.
3. Prepare a reviewed public PR with docs, skills, plugins, changelog, and
   release metadata for the candidate version.
4. Validate the public installer, manifest, checksums, Homebrew link, and plugin
   package references.
5. Promote the public release through the approved private release workflow.
6. Merge the GitHub public repo PR and create/update the GitHub Release for the
   same version.

## Non-Release Docs Updates

DAC documentation changes should also be reflected in GitHub, even when no
binary release is cut. In that case:

- Export only docs, issue templates, and public metadata.
- Do not create a GitHub Release.
- Do not move installer, manifest, plugin, or Homebrew stable pointers.

## Leak Checks

Manual review and any future approved automation should block GitHub changes if
they find:

- Tokens, API keys, cookies, `.env` files, auth stores, or session logs.
- Internal Bitbucket, Jira, Confluence, private infrastructure, or pipeline URLs
  not explicitly approved for public docs.
- Internal build-profile command catalogs.
- Internal-only commands, dev-only commands, or private graph/debug surfaces.
- Customer data, private cloud IDs, ARIs, or site-specific examples.
- Private benchmark/eval artifacts.
- Generated files that reference local developer paths.

Authentication for any future GitHub sync must avoid putting tokens in clone
URLs, process arguments, logs, or stored remotes.

## Future Public Repo Sync Design

A later design may introduce an export, leak-check, and GitHub update workflow,
but that workflow is intentionally not part of this repo today. Before
implementation, the design must define:

- allowlisted source paths
- public/private denylist and review ownership
- release and non-release sync behavior
- GitHub permissions and token handling
- failure and rollback behavior
- evidence required before public publishing

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
- Links to docs and the relevant public issue tracker entry when applicable.
