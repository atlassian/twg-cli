---
name: twg-agentic-search
description: >
  Use with root `twg` for deep iterative enterprise/company knowledge search and
  internal research with Rovo Search across connected apps/connectors including
  Confluence, Jira, Drive, Slack, Bitbucket, and GitHub.
---

# twg-agentic-search

Use together with the root `twg` skill. Exact command grammar comes from live
`twg help`, especially `twg help describe "rovo search"` when filter or output
options matter.

## CLI launcher fallback

Run `twg <command>`. On shell `command not found`, use `$HOME/.local/bin/twg`
(macOS/Linux) / `$env:LOCALAPPDATA\Programs\twg\bin\twg.exe` (PowerShell), then
tell user to add that directory to PATH. Do not treat auth or command errors as
PATH failures.

## Workflow

1. Classify the request as fuzzy or cross-product internal research. Prefer this
   skill when the source is unclear, current company knowledge is needed, or the
   answer may span Confluence, Jira, Drive, Slack, Bitbucket, GitHub, or other
   Rovo-connected apps.
2. Confirm or infer the Atlassian site. Ask only when no configured or explicit
   site is available and the ambiguity would change the search.
3. If app/source availability changes the plan, run
   `twg rovo list-apps -o json` or `twg search list-apps -o json`. Use the
   returned built-ins, connectors, readiness, and auth/setup actions to decide
   scope; do not start setup or login unless the user asked for it.
4. Generate two or three keyword query variants before searching:
   - direct topic phrasing from the user's request,
   - canonical or authoritative phrasing for official pages/issues,
   - recent or update-oriented phrasing for announcements, decisions, or changes.
5. Choose filters deliberately. Default to Confluence and Jira built-ins for
   official/internal knowledge. Broaden to Slack, Google Drive, Bitbucket,
   GitHub, or other connectors only when useful and available. Use app, type,
   recency, owner/contributor/assignee/reporter/status, title-only, label/space,
   and site filters when they narrow evidence without hiding likely answers.
6. Search with bounded output:

```bash
twg rovo search "<query>" --output json --output-summary auto --agent-fields @compact
twg rovo search "<query>" --output json --output-summary auto --agent-fields @evidence
```

Use `@compact` to shortlist candidates and `@evidence` when snippets, URLs, and
provenance need more detail.

## Evidence Rules

- Treat search snippets as candidates, not facts.
- Hydrate one to three selected results before final claims. Use product-native
  commands such as `twg confluence content get`, `twg jira workitem get`,
  `twg jira workitem query`, `twg bb prs`, `twg bb repo`, or the relevant
  product command for the result URL/type.
- Prefer official spaces, owned project pages, current Jira issues, and recent
  decision records over personal drafts or stale chat mentions, unless the user
  explicitly asked for informal signal.
- Compare hydrated evidence for conflicts, recency, ownership, and authority.
  Call out ACL gaps, unavailable connectors, low recall, and unresolved
  contradictions instead of flattening them into a single claim.

## Output

Lead with the answer or best-supported conclusion. Cite hydrated titles/URLs and
include the source app, date or status when available, and why each source was
trusted. Separate confirmed facts, likely interpretations, conflicts, and gaps.
