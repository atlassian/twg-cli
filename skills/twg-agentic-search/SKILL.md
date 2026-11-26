---
name: twg-agentic-search
description: >
  Use with root `twg` for deep iterative enterprise/company knowledge search and
  internal research with Rovo Search across connected apps/connectors including
  Confluence, Jira, Drive, Slack, Bitbucket, and GitHub.
---

# twg-agentic-search

Use the root `twg` skill's **Fast path for common simple commands** table for simple searches and reads.
Choose the command that fits; the rows are alternatives, not a required sequence.
For other commands or unclear inputs or flags, follow its **Plan First** steps.
Use `twg help describe "rovo search"` for unclear Rovo flags during that plan.

## CLI launcher fallback

Run `twg <command>`. On shell `command not found`, use `$HOME/.local/bin/twg`
(macOS/Linux) / `$env:LOCALAPPDATA\Programs\twg\bin\twg.exe` (PowerShell), then
tell user to add that directory to PATH. Do not treat auth or command errors as
PATH failures.

Agents: use host-set `TWG_AGENT_DEFAULTS=1` or `TWG_AGENT_DEFAULTS=1 twg <command>`. If assignments are blocked, pass `--mode agent` with explicit output flags. Respect host permissions. `--mode user` overrides the opt-in.

## Workflow

1. Classify the request as fuzzy or cross-product internal research. Prefer this
   skill when the source is unclear, current company knowledge is needed, or the
   answer may span Confluence, Jira, Drive, Slack, Bitbucket, GitHub, or other
   Rovo-connected apps.
   When the user supplies an exact key, URL, title, or named canonical source,
   preserve that anchor: hydrate and verify the returned identity before
   considering similarly named results. A similar title is not a substitute for
   the requested source.
2. Confirm or infer the Atlassian site. Ask only when no configured or explicit
   site is available and the ambiguity would change the search.
3. For unanchored work or knowledge, run the default search with no `--app`: it
   covers Jira, Confluence and the ready connectors. Complete or skip-only recovery
   exits 0 (`skipped` names excluded sources). Other partial results exit 3 with ≤10
   returned items, otherwise 0; count after duplicate removal and the requested limit.
   Use retained results and follow failure guidance; exit 0 does not prove full coverage.
   Retry temporary failures at most once after a delay. Report access gaps;
   do not repeat the search to fix permissions. Narrow with `--app` only when the
   request names that source. If availability is unknown, run
   `twg rovo list-apps -o json` once. Do not list apps before every query, start
   setup/login, or fabricate an empty result for a skipped connector.
4. Start with one query combining the topic and requested artifact or decision.
   Put exact identifiers such as issue keys or error codes in double quotes; leave ordinary words and phrases unquoted.
   Add a focused canonical/authoritative or recent refinement when results mix
   scopes, lack primary sources, or miss the requested time signal. Continue
   only while it can change identity, scope, authority, or freshness. Do not fan
   out exact-title searches for every returned candidate. Follow canonical,
   moved, or superseding source relationships while retaining requested semantics.
5. Choose filters deliberately. Use app, type,
   recency, owner/contributor/assignee/reporter/status, title-only, label/space,
   and site filters when they narrow evidence without hiding likely answers.
6. Search with the default scope and a small limit:

```bash
twg rovo search "<query>" --limit 10
twg rovo search "<query>" --limit 10 -o json --agent-fields @evidence
```

For one recall retry, increase `--limit` from 10 to 20 when the first results leave
a gap that could change the answer. Otherwise, do not repeat a query with only a different `--app` or
`--limit`. Use `@evidence` only when snippets and provenance need more detail.
Public web-crawler hits rank below internal sources unless the prompt asks
about public docs.

7. After 2–3 semantic misses, switch to CQL (`twg confluence search query --cql
   'type=page AND title ~ "<term>"' --limit 50`, space-scoped when hits cluster) and
   JQL (`twg jira workitem query --jql 'text ~ "<term>"'`) with short entity and
   feature terms.

## Evidence Rules

- Treat search snippets as candidates, not facts.
- Treat ranking, recency, activity volume, and similarity as discovery signals,
  not proof of authority, identity, validity, or currentness. Verify the
  selected source's key/URL/title and canonical or supersession relationship
  from hydrated evidence before replacing an explicit anchor.
- Hydrate a small, diverse primary-source set before final claims. For document
  discovery, cover distinct roles such as requirements, architecture/design,
  and current delivery rather than redundant pages. Use product-native
  commands such as `twg confluence content get` (≤3 IDs per call), `twg jira workitem get`,
  `twg jira workitem query`, `twg bb pull-requests get <id>`,
  `twg bb repo get`, or the relevant product command for the result URL/type.
  When a native key or URL is known, hydrate it directly; use another search or
  a document-body fetch only when the native result lacks a material field or
  narrative needed for the answer.
- For document or PRD discovery, select a small, diverse set across needed
  roles. Hydrate one per role; add another only for a material conflict, missing
  field, current-delivery question, or requested relationship. Stop when roles,
  current delivery, and conflicts are supported or unavailable.
- Prefer official spaces, owned project pages, current Jira issues, and recent
  decision records over personal drafts or stale chat mentions, unless the user
  explicitly asked for informal signal.
- Compare hydrated evidence for conflicts, recency, ownership, and authority.
- Use one authoritative source when it fully supports the claim. Treat the
  source-count limit as a default, not a quota: add a narrow follow-up only for
  a material unresolved conflict, missing field, or requested relationship.
- Do not rerun an `@evidence` search for a candidate that can be hydrated through
  its product-native URL or ID, or refetch one source under another projection
  merely to increase context. Use a different native projection when it supplies
  a missing material field or relationship, and explain the remaining gap.
  Call out ACL gaps, unavailable connectors, low recall, and unresolved
  contradictions instead of flattening them into a single claim.

## Output

Lead with the answer or best-supported conclusion. Cite hydrated titles/URLs and
include the source app, date or status when available, and why each source was
trusted. Separate confirmed facts, likely interpretations, conflicts, and gaps.
