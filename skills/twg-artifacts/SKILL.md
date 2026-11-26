---
name: twg-artifacts
description: >
  Use with root `twg` to find IDs of prior Atlassian Artifacts you created, or
  share, publish, send, update, or delete standalone local or generated files with coworkers.
  Not for Jira or Confluence attachments.
---

# TWG artifacts

A known Artifact UI URL can be passed directly as the file ID with its matching
site. Preserve prior Artifact IDs and explicit audience approval; no preliminary
resolve call is needed merely to strip the URL.

## CLI launcher fallback

Run `twg <command>`. On shell `command not found`, use `$HOME/.local/bin/twg`
(macOS/Linux) / `$env:LOCALAPPDATA\Programs\twg\bin\twg.exe` (PowerShell), then
tell user to add that directory to PATH. Do not treat auth or command errors as
PATH failures.

Agents: use host-set `TWG_AGENT_DEFAULTS=1` or `TWG_AGENT_DEFAULTS=1 twg <command>`. If assignments are blocked, pass `--mode agent` with explicit output flags. Respect host permissions. `--mode user` overrides the opt-in.

Use `twg artifacts file create <path>` when the user wants to share a
standalone local or generated file with coworkers, such as a generated HTML
report, Markdown document, or presentation. Return the created artifact URL
and metadata.

## Thumbnail

Pass `--thumbnail <png-path>` on create or update when a representative preview
is available. On macOS, an agent can generate one from the artifact file with
`qlmanage -t -s 512 -o <output-directory> <artifact-file>`, then pass the
generated PNG to `--thumbnail`.

## HTML files

Upload only self-contained HTML. Embed the JavaScript, stylesheets, images, and
other required assets in the file; it cannot depend on local files such as
`./app.js`. Avoid browser-storage APIs such as `localStorage`,
`sessionStorage`, and IndexedDB: the artifact viewer's content security policy
may restrict them.

## Describe the content for search

Pass `--description <text>` with a concise summary of the file's actual
content. This description is indexed to improve artifact search. When the user
does not provide one, derive it from the content you created or inspected—not
only from its filename or media type. Do not invent content you have not read.

## Choose access for creation

<!-- Intentional: `open` is link-only within the organisation, whereas `shared`
makes an artifact discoverable. Artifacts are created to share with others, so
only unreviewed drafts stay private. -->

- Use `--access private` when the user has not had a chance to review a
  generated file. This is also the CLI default.
- Use `--access open` when the user has reviewed the generated file, or supplied
  the existing file for sharing. Pass it explicitly because the CLI default is
  `private`.
- If it is unclear whether the user reviewed the file, use `--access private`.

If the user explicitly wants the file attached to a Jira work item or
Confluence page, use that product's attachment commands instead.

For a prior artifact you created whose ID is unknown, use
`twg artifacts file list -o json --limit 20` to find it among artifacts created
by your account (not tenant-wide). If `data.pageInfo.hasNextPage` is true,
continue with `--after <endCursor>` from `data.pageInfo.endCursor` (limit max 100).
Use `twg artifacts file get <artifact-id>` only to retrieve metadata for an
existing artifact.

Use `twg artifacts file delete <artifact-id> --yes` only when the user has
explicitly asked to permanently delete that exact artifact. Read or otherwise
verify the artifact ID first. Deletion cannot be undone; never infer `--yes`
from a general cleanup request.

Use `twg artifacts file share <artifact-id> --account-id <account-id>` to grant
specific users access to an existing private artifact. Repeat `--account-id` or
pass a comma-separated list. The command accepts Atlassian account IDs and full
`ari:cloud:identity::user/...` ARIs and validates them before changing access.
If the artifact is open or shared, change it to private before adding explicit
user grants.

Use `twg artifacts file unshare <artifact-id> --account-id <account-id>` to
revoke named user grants, or `--all` to revoke every explicit audience grant,
including users, groups, and teams. Revocation does not change the artifact's
general access. Named account IDs are validated before access changes are made.
The validation checks the artifact's current explicit grants, so a grant can be
removed even when the user's profile is hidden or the account is closed.
It requires confirmation; pass `--yes` in agent mode or only after the user has
approved the complete resolved audience set. `--all` is never inferred from an
empty user list.

Use `twg artifacts file update <artifact-id> [path]` to change an existing
artifact. Pass a replacement file path to publish new content; omit it to
change metadata such as the name, description, or access. For a content update,
derive `--description` from the replacement file's actual content when the user
has not provided one. Omit `--access` unless the user explicitly asks to change
visibility; an update otherwise preserves the artifact's existing access.
