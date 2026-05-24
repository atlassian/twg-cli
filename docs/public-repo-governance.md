# Public Repo Governance

This repository is the public front door for TWG CLI. It exists so users and
agent-tool maintainers can find public docs, public skills, release notes,
examples, issue intake, and community workflows in one place.

The private TWG CLI repository remains the source of truth for implementation,
release preparation, tests, internal planning, incident work, and private
engineering decisions.

## Intent

- Help users install, update, and troubleshoot TWG CLI.
- Publish public-safe TWG CLI skills and plugin notes for agent hosts.
- Provide a public changelog and release communication surface.
- Accept public bugs, docs gaps, command requests, feature ideas, and skill or
  plugin requests.
- Give maintainers a clear, reviewable public surface without exposing private
  implementation details.

## Non-Goals

- This repo is not a mirror of the private implementation source tree.
- GitHub Issues are not the canonical internal engineering backlog.
- Discussions or issues are not roadmap commitments.
- Public docs must not expose internal architecture, private roadmap, incidents,
  customer data, benchmark artifacts, or private release mechanics.
- Automated sync from the private repo is not approved by this document. It
  needs a separate decision record and implementation review.

## Public Content

Allowed public content includes:

- Install, setup, update, authentication, troubleshooting, and recipe docs.
- Public command examples from the release build profile.
- Public TWG agent skills and supported plugin packaging notes.
- Public changelog and release summaries.
- GitHub issue templates, PR template, support policy, security policy, and
  contribution guidance.
- Public CDN links, public installer links, and public release metadata.

## Private Content

Do not add:

- Tokens, credentials, cookies, auth stores, `.env` files, or session logs.
- Private Jira, Confluence, Bitbucket, pipeline, or customer URLs.
- Internal Atlassian runbooks, incident notes, private roadmap, or strategy.
- Customer data, proprietary content, private cloud IDs, or private ARIs.
- Internal-only commands, dev-only graph/debug surfaces, or internal build
  profile command catalogs.
- Private benchmark, evaluation, or support artifacts.
- Local developer paths or machine-specific generated output.

## Community Intake

GitHub Issues are the public intake surface for:

- bugs
- docs gaps
- feature ideas
- command requests
- public skills or plugin requests
- install, update, and setup friction

Issue templates must ask reporters to redact tokens, private URLs, customer
data, internal links, and proprietary content.

GitHub Discussions may be used for community Q&A, recipes, and agent workflows
if the feature is enabled. If Discussions are disabled, users should open an
issue with the closest matching template.

## Maintainer Workflow

Maintainers should:

- Keep public issues free of private Jira keys and internal links.
- Mirror public issues internally only when implementation planning is needed.
- Summarize public-safe status back to GitHub.
- Use CODEOWNERS review for changes that affect public positioning, support,
  security, release notes, skills, plugins, or issue intake.
- Avoid public roadmap language unless PM explicitly approves it.

## Release And Changelog Workflow

Public release updates should describe user-facing value:

- what changed
- why users or agents should care
- install or update command
- known issues or migration notes
- public docs, manifest, checksum, or plugin links when available

Private release preparation remains canonical. Public release notes should be
curated for adoption and support clarity, not copied wholesale from internal
release planning.

## Future Automation Gate

Future automation may eventually refresh public docs, skills, changelog, and
release metadata from the private repo. Before that work starts, maintainers
need a separate approved decision record covering:

- explicit allowlisted source paths
- leak checks and failure policy
- GitHub permissions and token handling
- release and non-release sync behavior
- reviewer ownership
- rollback and correction workflow

Until that approval exists, public repo updates should be manual or bot-assisted
reviewed PRs only.
