# Teamwork Graph CLI

Teamwork Graph CLI (`twg`) is an agent-first command line interface for Atlassian
work context. It helps AI agents and developer tools discover, summarize, and act
across Jira, Confluence, Bitbucket, Atlas projects and goals, Jira Service
Management, Assets, people, teams, and the Atlassian Teamwork Graph.

This repository is the public home for TWG CLI users, agent integrations,
release notes, and issue tracking. The private engineering source of truth
remains Atlassian's internal TWG CLI repository; this repo is a curated public
front door for release-ready artifacts and community feedback.

## Install

```bash
bash <(curl -fsSL https://teamwork-graph.atlassian.com/cli/install)
twg login
twg setup
```

On Windows:

```powershell
iwr https://teamwork-graph.atlassian.com/cli/install.ps1 -UseBasicParsing -OutFile install.ps1
.\install.ps1
twg login
twg setup
```

## Use With Agents

TWG CLI is designed for agents first. After setup, ask your agent for outcomes
instead of memorizing command syntax:

- "Catch me up on this Jira issue."
- "Find pull requests waiting on me."
- "Summarize my team's work this week."
- "Draft a Confluence update from the current project state."

The public agent surfaces for this repo are:

- `docs/` - public repo governance and release-integration notes.
- `plugins/` - public marketplace packaging notes for Codex and Claude.
- `skills/` - public TWG agent skills for Codex-style skill installers.
- `AGENTS.md` and `llms.txt` - compact guidance for agents and LLM crawlers.
- GitHub Issues - public bug reports, docs gaps, command requests, and
  skill/plugin requests.

## Public Repo Scope

This repo should contain only public-safe artifacts:

- Install, setup, update, auth, troubleshooting, and recipe docs.
- Public command examples generated from the release build profile.
- Public skills and plugin packages for supported agent marketplaces.
- Changelog and human-readable release notes.
- GitHub Issues for public feedback and workflow requests.

It must not contain internal-only command docs, private Jira or Confluence URLs,
customer data, internal runbooks, private benchmark data, tokens, auth files, or
generated catalogs from internal build profiles.

## Release Channels

- Stable installer: `https://teamwork-graph.atlassian.com/cli/install`
- Stable manifest: `https://teamwork-graph.atlassian.com/cli/manifest.json`
- Release notes: `https://teamwork-graph.atlassian.com/cli/CHANGELOG.md`
- Homebrew tap: `atlassian/homebrew-twg`

The release process that updates this repo is described in
[`docs/release-integration.md`](docs/release-integration.md).

## Agent Guidance

Agents working in this repo should start with [`AGENTS.md`](AGENTS.md). LLM
crawlers and tools can use [`llms.txt`](llms.txt) for a compact repo map.

## Community

Use GitHub Issues for bugs, docs gaps, command requests, and skill/plugin
requests.

Use Discussions only if they are enabled for this repo. Until then, open an
issue with the closest matching template.

Before filing anything, remove tokens, private URLs, customer data, internal
Jira/Confluence links, and proprietary content from logs or examples.

For repo intent, public/private boundaries, and the pre-automation operating
model, see [`docs/public-repo-governance.md`](docs/public-repo-governance.md).
