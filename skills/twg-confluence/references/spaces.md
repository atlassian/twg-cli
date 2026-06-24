---
description: Create and manage Confluence spaces, keys, visibility, folders, page trees, and hierarchy.
---

# Confluence Spaces And Hierarchy

Use `confluence space` for space metadata and lifecycle. Use `confluence tree`
for graph-backed hierarchy reads.

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
