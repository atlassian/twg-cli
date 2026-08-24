---
description: Read and mutate Jira workitems, comments, links, watchers, attachments, fields, and relationships.
---

# Jira Workitems

Use this reference after `twg-jira` has selected the Jira workitem surface.
Inspect live help for the exact command contract.

## Reads

- Use native `get` for authoritative fields, status, assignee, reporter, and
  URL. Plain `get` avoids supplemental Jira requests.
- Add `--comments` for complete paginated comments or `--remote-links` for Jira
  remote links. Combine those two flags when both enrichments are needed.
- Use `--full` by itself for all Jira issue fields, complete comments, and remote
  links. Do not combine `--full` with `--comments` or `--remote-links`.
- Request only the extra fields needed for the answer.
- Use typed context alongside the native read when relationships to documents,
  PRs, projects, goals, people, or external URLs matter.
- Treat search snippets as discovery evidence only.

Custom field values are read through the workitem command:

```bash
twg jira workitem get <KEY> --field customfield_12345
twg jira workitem get <KEY> --fields customfield_12345,summary
twg jira workitem get <KEY> --comments
twg jira workitem get <KEY> --remote-links
twg jira workitem get <KEY> --comments --remote-links
twg jira workitem get <KEY> --full
```

Do not use Jira administration field commands to read values from a workitem.

## Mutations

Before a create or update:

1. Resolve the site and project/workitem.
2. Read the current item for updates.
3. Discover the applicable field metadata.
4. Prepare the smallest mutation that satisfies the request.
5. Run the mutation after approval.
6. Read back the item and report the stable key and URL.

For links, resolve both endpoints and discover the supported link type before
writing. For comments and descriptions, follow `rich-content.md`.

Do not combine unrelated field, transition, link, and comment changes in one
opaque operation. Keep each result independently verifiable.
