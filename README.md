# Teamwork Graph CLI

Teamwork Graph CLI (`twg`) gives coding agents and terminal users access to
Atlassian work context across Jira, Confluence, Bitbucket, Jira Service
Management, Assets, Atlas projects and goals, people, teams, and the Atlassian
Teamwork Graph. This repository is the public home for CLI feedback, release
notes, and bundled public agent skills.

## Install and update

From a terminal on macOS or Linux:

```bash
curl -fsSL --retry 2 https://teamwork-graph.atlassian.com/cli/install | bash
```

From Windows PowerShell:

```powershell
curl.exe -fsSL https://teamwork-graph.atlassian.com/cli/install.ps1 -o twg-install.ps1
powershell -ExecutionPolicy Bypass -File .\twg-install.ps1
```

The hosted scripts guide you through sign-in and agent skill setup. If you
installed a standalone package, run `twg setup` to configure it. Use
`twg doctor` to verify setup and `twg upgrade` to update.

See the [installation guide](https://developer.atlassian.com/cloud/twg-cli/getting-started/installation/)
for macOS packages, Windows MSI installers, and troubleshooting links.

## Use with agents

After setup, ask your coding agent to summarize open Jira work, pull requests
awaiting review, or Confluence pages related to a project.

The [public skills](skills/README.md) cover first-time setup, core CLI use, and
workflows across Jira, Confluence, search, engineering, and other products.
For marketplace installation instructions, see
[the TWG plugins repository](https://github.com/atlassian-labs/twg-plugins).
For help installing or refreshing skills through the CLI, see the
[agent skills guide](https://developer.atlassian.com/cloud/twg-cli/agents/skills/).

## Discover commands

Use the CLI's help to check the syntax supported by your installed version:

```bash
twg help describe "jira workitem get"
twg help describe "confluence content get"
```

See the [stable command catalog](https://developer.atlassian.com/cloud/twg-cli/commands/commands-catalog/)
for the public command list.

## Releases

- [Changelog](CHANGELOG.md) for stable and public beta release notes.
- [Stable release manifest](https://teamwork-graph.atlassian.com/cli/manifest.json)
  for release artifacts and checksums.
- [Release integration](docs/release-integration.md) for how this repository is updated.

## Community

[Open a GitHub issue](https://github.com/atlassian/twg-cli/issues/new/choose)
for public bugs, docs gaps, or command, skill, and plugin requests. Remove
credentials, private links, and customer data from examples and logs.

See [SUPPORT.md](SUPPORT.md), [SECURITY.md](SECURITY.md), and
[CONTRIBUTING.md](CONTRIBUTING.md) for support, vulnerability reporting, and
contributions. Agents working in this repo should start with
[AGENTS.md](AGENTS.md). [llms.txt](llms.txt) provides a compact index.

## License

This repository is licensed under the Apache License 2.0. See [LICENSE](LICENSE).
