---
description: Build a bounded named-person standup for one project and window with traceable positive or negative evidence.
---

# Named Daily Standup

Resolve the named person once. Use one bounded account-scoped `work query` for
the requested window and project; prefer advertised Jira/PR types and
authored/updated/assigned/owned activity filters. Rank the most material work
first. Hydrate only a selected blocker, decision, or ownership gap that changes
the standup.

If the query finds no qualifying work, make at most one project-identity lookup,
then stop. Report the exact person, project, window, and relationship scope
checked; include stable person/project anchors when available. Do not replace an
empty personal result with tenant-wide Jira, Confluence, context, or PR
inventories. Do not claim there was no work when the query was incomplete or
untraceable.
