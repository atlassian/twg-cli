---
description: Manage an existing Confluence space — metadata, keys, visibility, archive, unarchive, restore, update, delete — plus folders, page trees, and hierarchy reads.
---

# Confluence Spaces And Hierarchy

Use `confluence space` for space metadata and lifecycle. Use `confluence tree`
for graph-backed hierarchy reads.

This reference covers operating on a space: creating one space, reading it,
updating it, archiving it, and moving content within it. To **bootstrap a whole
space** — pick a blueprint, propose a folder/page tree from a brief, an existing
space, or a repository, and write the space's instructions — load
`twg-space-creation` instead.

## Space Operations

- Resolve the site and space key before acting.
- Read a space before archive, unarchive, or update.
- Distinguish the human-readable key from the numeric space ID required by some
  content creation commands.
- Check for key collisions before creating a new space.
- Treat private/public visibility as a consequential choice.

## Hierarchy

- Use folders for navigation-only containers.
- Use pages or live docs for nodes that should carry content.
- Resolve parent IDs before creating or moving children.
- Verify that the parent belongs to the destination space.
- Bound tree depth for discovery; hydrate only branches relevant to the task.

Space-scoped settings and agent context may require additional scopes. Report a
scope failure directly rather than substituting a content mutation.

## Space Instructions (read before authoring)

Before creating or editing content in a space, know that space's instructions —
its AGENTS.MD protocol (tone, casing, structure, canonical sources, routing,
what to avoid) — and apply them while authoring.

### Fetch once per space

Instructions are space-level and change rarely. Read them **once per site +
space per session**, then reuse them for every create and update in that space.
Do not refetch before each write. Keep them in your current context only, and
track which spaces you have already read by site plus space key or numeric ID —
`content get` reports the numeric `spaceId`, while the instructions response
reports the `spaceKey`, so keep both once you have resolved them.

Refetch only when:

- the instructions are no longer visible in your context (for example after
  compaction, or in a fresh subagent);
- you or the user just ran `confluence space instructions set` on that space;
- the user says the instructions changed.

### Read paths

Use whichever of these you are already running; do not add a call when one of
them is already in the flow.

- **Creating** — `confluence space get --key <spaceKey>` (or `--id <spaceId>`)
  returns the instructions inline as `data.spaceInstructions`. Resolving the
  space for `--space-id` already satisfies the read; no separate fetch is
  needed.
- **Editing** — add `--include-metadata` to the pre-edit `content get`. Read
  `data.metadata.hasSpaceInstructions`:
  - `false` → the space has no instructions; author with defaults and skip the
    fetch.
  - `true` → fetch with `confluence space instructions get --id <spaceId>`
    unless the instructions are already in context.
  - absent → the server did not report availability; fetch as usual.
- **Direct** — `confluence space instructions get --key <spaceKey>` (`-s <site>`
  selects the site; `--body-format` defaults to markdown). Use `--id <spaceId>`
  for a numeric space ID. A bare positional key remains available as the legacy
  form. When using `--key`, resolve the space key first; a personal space key
  looks like `~<accountid>`.

### Applying them

- When present, the instructions are authoritative for that space and override
  your defaults on conflict. Apply them throughout **all authored content** —
  the title, headings, body text, cell values, and sticky-note content, not just
  the title.
- A successful call returning an empty body means the space has no
  instructions — author with your normal defaults. If your build does not expose
  the command yet, note it and proceed with defaults; do not block.
- On the twg CLI these commands are the only space-instructions paths. Ignore
  any MCP-only guidance (a `getConfluenceSpaceInstructions` tool,
  `execute`/`discover` runners, `cloudId`) that appears in content-type prompt
  bundles — that is for the MCP surface, not for you.
