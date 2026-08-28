---
name: twg-space-creation
description: >
  Create, design, bootstrap, or clone a whole Confluence space for any domain
  from a brief, existing space, repository evidence, or another source. Use for
  space creation or structure adaptation, not individual edits.
metadata:
  spaceCreation:
    existingSpaceAdaptation: same-site
    spaceInstructions: best-effort
---

# twg-space-creation

Use with root `twg`. Turn a source into an approved information architecture
and Confluence mix, then create and verify it. `twg-confluence` owns content
semantics and write safety; live help owns mutation grammar.

## CLI launcher fallback

Run `twg <command>`. On shell `command not found`, use `$HOME/.local/bin/twg`
(macOS/Linux) / `$env:LOCALAPPDATA\Programs\twg\bin\twg.exe` (PowerShell), then
tell user to add that directory to PATH. Do not treat auth or command errors as
PATH failures.

## Guiding principle

Build a navigable space, not an object quota. Favor useful hubs, ask only
material questions, and show cost before substantial work.

## Workflow

1. **Resolve.** Infer target, source, purpose, audiences, and workflows. Existing
   spaces are same-site only; reject mismatches before source reads or writes.
2. **Configure.** Load `references/proposal-flow.md`. Ask one compact batch only
   for missing identity/access, scale/richness, truth-boundary, or plan/build choices.
3. **Gather evidence.** For a repository, load `references/repo-discovery.md`;
   for an existing space, inspect its tree, instructions, and a bounded body sample.
4. **Design.** Load `references/blueprints.md` and `references/page-archetypes.md`.
   Present the tree, node jobs, companions, type counts, body modes/sources,
   instructions, exclusions, and a representative vertical slice.
5. **Approve.** A precise request that already authorizes the displayed scope
   may proceed. Otherwise require create/refine/cancel confirmation. Always
   confirm a large, ambiguous, private, or synthetic build. Approval bounds the
   build; it does not authorize archive, delete, overwrite, or public links.
6. **Create in stages.** Load `references/twg-confluence-space.md`. Ledger the
   build; set/read instructions when supported; verify one branch and one of
   every selected type. Expand only families matching the approved semantics.
7. **Verify and hand off.** Reconcile hierarchy, bodies, every structured/visual
   artifact, and supported instructions. Report URLs, counts, gaps, omitted
   instructions, and truncated verification.

## Composition rules

- Use **folders** only for navigation, **pages/live docs** for narrative and
  decisions, **databases** for recurring structured work, **whiteboards** for
  spatial understanding. Keep time-based publishing outside space creation.
- Give each database or whiteboard an owning page; add a type only for a clear job.
- Scaffolds may use prompts, layouts, tables, and templates, but must not invent
  owners, decisions, dates, metrics, customer evidence, or system behavior.
- Adapt source material for its audience; choose a canonical link, synthesis,
  faithful import, or attachment rather than dumping a repository.
- Load `twg confluence content body-formats` just in time for every selected
  authoring format. This skill never restates raw HTML, CSV, SVG, or ADF rules.

## Stop conditions

Stop before writes for unresolved sites/sources, cross-site adaptation, material
scope ambiguity, or proposal-only requests. Missing instructions support does
not stop creation. Stop expansion on slice mismatch; never replace an unresolved
parent with the space root.

## References

- `references/proposal-flow.md` — intake, space contract, approval, instructions.
  **Load every run.**
- `references/blueprints.md` — workflow-first starting shapes and scale choices.
- `references/page-archetypes.md` — rich composition by page purpose.
- `references/repo-discovery.md` — repository evidence without repo-shaped IA.
- `references/twg-confluence-space.md` — stable creation and verification flow.

Body-format syntax belongs exclusively to live `body-formats` guidance.
