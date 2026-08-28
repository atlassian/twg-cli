---
description: Use repository evidence to inform any kind of Confluence space without letting code structure dictate the space's information architecture.
---

# Repository evidence for space design

Use whenever a repository is one source for a space. First determine the space's
purpose, audiences, and workflows from the brief; then find enough repository
evidence to support relevant content. Do not inventory every file or mirror
directories.

## Discovery pass

Start locally:

```bash
rg --files | head -200
git remote -v
git branch --show-current
```

Then inspect representative evidence:

- **Purpose and people:** README, product or project briefs, ownership files,
  support docs, contribution policy, AGENTS, and package descriptions.
- **Architecture and surface:** manifests, entrypoints, routes/commands/APIs,
  schemas, packages, services, adapters, workers, storage, and UI boundaries.
- **Build and verification:** package scripts, build files, test layers, CI jobs,
  lint/typecheck/contract/E2E guidance.
- **Release and operations:** deployment/release files, runbooks, alerts,
  dashboards, SLOs, incidents, and post-incident learning.
- **Decisions and reference:** design proposals, RFC/ADR/DACI/EDR collections,
  generated docs, specifications, and configuration.

Prefer primary local sources over memory. Follow implementation beneath wiring
files until behavioral claims are supportable. Never copy secrets or sensitive
configuration.

## Evidence inventory

Show source paths and counts in the proposal so the user can judge weight:

- `Purpose — README plus 2 project briefs; supports an orientation hub`
- `Decisions — 23 decision records; recommend index + links`
- `Operations — 2 runbooks plus 3 ownership records; relevant to maintainers`
- `Research — 4 findings under research/; relevant to the product workflow`

Counts explain a branch; they do not require one page per file.

## Map evidence to user workflows

- purpose, roadmap, or brief material → orientation, strategy, or outcomes
- ownership and participation policy → people, governance, or ways of working
- design records and proposals → a bounded decisions workflow
- research and customer evidence → research or learning only when appropriate
- entrypoints, boundaries, and flows → concepts or architecture only when needed
- build, release, and runbooks → delivery or operations only for those audiences
- narrow specs or generated material → bounded reference or canonical links
- directories → children only when each boundary represents a distinct user job

Top-level nodes must follow the space users' workflows, not implementation
taxonomy. Prefer roughly six to nine recognizable hubs. Do not create a page per
`src` directory, a top-level page for one flag or format, or a folder full of
thin pages that merely restate repository material.

## Choose the source relationship

For every artifact choose and disclose one mode:

- **Canonical link** for volatile code-owned policy, generated reference, or
  configuration.
- **Adapted synthesis** for stable context, decisions, policies, workflows, and
  audience-specific guidance.
- **Faithful import** only when the user wants Confluence to own the copy.
- **Attachment** when preservation matters more than native editing.

Existing Markdown is not automatically an import. A Confluence page should help
its intended audience complete a real job, connect evidence, and disclose how
claims can be verified; it should not be a repository dump.

## Scale decisions

For a very small repository, recommend a lean space or make it one supporting
source rather than inventing a full taxonomy. For a monorepo with independent
areas, ask one high-value question only if ownership or audiences may require
separate spaces. Never infer one space per package from directory structure.
