# Repository Model

This public GitHub repo is not the implementation source tree. It is the public
product and community surface for TWG CLI.

## Source Of Truth

Private Bitbucket `twg-cli`:

- implementation
- tests
- release scripts
- internal build profiles
- internal docs
- pipeline configuration
- release candidate and promotion automation

Public GitHub `twg-cli`:

- public docs
- public examples and recipes
- public skill bundles
- public marketplace plugin packaging
- public changelog and release notes
- GitHub Issues and Discussions
- public roadmap and support policy

## Public Allowlist

Only these categories should be synced here:

- user-facing docs
- release-profile command references
- public skills
- public plugin packages and metadata
- changelog and release notes
- issue/discussion templates
- examples reviewed for public use
- security, support, contributing, license, and code of conduct docs

## Private Denylist

Never sync:

- internal-only commands or docs
- private Jira, Confluence, Bitbucket, Statlas, or pipeline links
- API tokens, auth files, cookies, or environment files
- customer data or site-specific logs
- benchmark/eval data
- internal support runbooks
- local cache/session files
- generated catalogs from internal or dev build profiles

## Homebrew Tap Boundary

`atlassian/homebrew-twg` remains the Homebrew tap and GitHub Pages mirror target.
This repo is the public product/community hub. Do not overload the tap with
issues, discussions, plugin packages, or broad documentation.

