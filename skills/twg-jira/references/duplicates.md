---
description: Detect prior duplicate Jira issues across a bounded scope with semantic comparison and explicit stopping rules.
---

# Jira Duplicate Detection

Use this decision policy with existing TWG capabilities. It does not replace
JQL querying, `jira workitem similar`, or native workitem reads.

Load `references/querying.md` when the prompt needs a bounded Jira candidate
set. Use live `twg help` for exact command grammar.

Detect whether a target Jira issue duplicates any issue created before it or
within the same calendar minute. Base the decision on semantic meaning, not an
exact text match.

## Safety Boundary

This detection phase is read only. Do not mutate Jira. Do not create, edit,
transition, comment, link, or delete Jira work while detecting duplicates.

Do not read or use issue links or comments from the target or any candidate.
They can expose an existing duplicate decision and invalidate an independent
comparison. Judge only from summary, description, created time, project, issue
type, status, and other metadata that does not reveal issue relationships.

## Prior Cutoff

Treat a candidate as prior when either condition is true:

1. Its created timestamp is earlier than the target timestamp.
2. Its created timestamp has the same year, month, day, hour, and minute as the
   target, regardless of seconds.

Round the target cutoff to the minute in JQL. Discard the target itself even
when the cutoff query returns it.

## Duplicate Meaning

A duplicate describes essentially the same underlying issue, request, need, or
event. Wording, detail, and the split between summary and description may
differ. A broad report and a specific report can be duplicates when resolving
one would resolve the other.

For monitoring alerts and incidents, require evidence that both issues concern
the same event or root cause. Repeated firing within hours or a few days can be
one event. A shared failure pattern across weeks or months is not enough
without a shared root cause or explicit event evidence in the permitted
fields.

For human written bugs, requests, service desk work, and accessibility
findings, time distance alone does not prevent a duplicate decision.

## Target Comparison

Read the target with the native Jira workitem read. Do not request or inspect
comments or issue links. Record its created time, project, issue type, summary,
description, status, and URL.

Project every native read with `--agent-fields` or an equivalent output filter
so only key, summary, description, created time, project, issue type, status,
and URL become model visible. Do not rely on a requested field list alone
because the native response can include relationship fields outside that list.

Classify the target as one of these types:

1. Alert or incident
2. IT service desk request
3. Bug
4. Feature request or improvement
5. Accessibility finding
6. Generated task family
7. Mirrored alert or tracking issue
8. Task or chore
9. Other

Extract compact comparison details. For an alert, use alert name, service,
environment, severity, and error type. For human written work, use the core
product area, component, action, problem, and affected scope. Ignore generic
terms such as issue, problem, ticket, please, need, and Jira.

For a generated task family, identify both the common template and the exact
identifier that varies between members, such as a configuration name, resource
ID, or control ID.

For a mirrored alert, identify a bracketed Jira key in the summary. A tracking
issue that embeds the target key can be a duplicate. A tracking issue that
embeds a different key cannot.

## Candidate Retrieval

Use the existing TWG capabilities within the selected Jira site and the user's
JQL scope. Confirm exact grammar with live help.

### Semantic pass

Run `jira workitem similar` exactly once for the target with a limit of 30.
Treat the returned issues as hints, not decisions. Fetch the full permitted
fields for the highest ranked results with native Jira workitem reads, then
apply every evaluation gate below.

If the command is unavailable, fails, or returns a degraded response, continue
with JQL only. Treat the result as degraded and do not report a completed no
match unless the JQL pass completes.

If at least one verified semantic result passes every gate with confidence of
0.80 or higher, select the strongest passing candidate and skip JQL retrieval.

### JQL pass

If the semantic pass has no result at 0.80 or higher, run one to three focused
JQL queries. Use semantic results as token hints when useful.

Every candidate retrieval query must include:

`created <= "YYYY-MM-DD HH:MM"`

Use only a quoted date in `YYYY-MM-DD HH:MM`, `YYYY/MM/DD HH:MM`, or
`YYYY-MM-DD` format. Never use an ISO timestamp containing `T` or `Z`.

Start in the target project when its key is known. Always include one
cross project query unless a strong semantic result already caused the early
exit. Use `ORDER BY created DESC`. Use a limit from 20 to 50, with 20 for broad
text searches.

Choose queries by type:

1. Alerts and incidents: search the project by identifying alert details, then by
   service or environment. Search across projects by the strongest key token.
2. Generated task families: search the project by exact identifier, then by
   template plus identifier. Search across projects by exact identifier.
3. Mirrored alerts: search all projects for the exact target key in brackets.
   When the target is a tracking issue with a bracketed key, fetch that known
   issue directly and verify its created time.
4. Human written work: search the project summary with two core tokens, then
   project text with those tokens. Search summaries across projects with the
   same tokens.

Do not run a candidate retrieval query whose only purpose is to fetch the
target key. Direct reads of known candidate keys are hydration calls, not JQL
retrieval queries.

## Evaluation Gates

Apply these gates in order to every hydrated candidate.

### Gate 0: prior and self check

The candidate must satisfy the Prior Cutoff. Its key must differ from the
target key.

### Gate 1: type compatibility

The primary type must be compatible. An incident matches an incident, a bug
matches a bug, a feature request matches a feature request, an IT request
matches an IT request, and an accessibility finding matches an accessibility
finding. A bug and a feature request about the same component are not
duplicates.

### Gate 2: semantic match

The two issues must describe the same problem, request, need, or event. Ask
whether resolving one would also resolve the other and whether the differences
are only wording, detail, or perspective.

### Gate 3: scope compatibility

Product area, feature, component, and affected user, team, resource, or system
must be compatible where specified. Clearly different scopes fail this gate.

### Gate 4: alert event proximity

Apply this gate only to alerts and incidents. Events within about 24 hours are
likely to be one occurrence when the other identifying details match. Events more
than 30 days apart fail without permitted field evidence of the same event or
root cause.

## Hard False Positive Filters

Apply these rules even when semantic similarity is high:

1. A generated task family candidate must contain the exact same varying
   identifier. A different identifier is not a duplicate.
2. Prefer the earliest original generated task. Discard summaries marked as an
   update, revision, or later version when an unmarked candidate exists. Among
   the remaining candidates, choose the lowest numbered key. If every match is
   marked as a revision, choose the lowest numbered key.
3. A mirrored tracking issue must contain the target key exactly in brackets.
4. A recurring weekly or monthly task is not a duplicate unless it represents
   the same specific instance.
5. A candidate with no meaningful summary or description is not a duplicate.
6. Different IT operations, such as grant and revoke, are not duplicates.
7. IT requests for different users, teams, or resources are not duplicates
   unless the permitted fields show that one request was submitted twice.

## Confidence and Selection

Use these ranges:

1. 0.85 to 0.95 for a near certain match, such as the same event or almost the
   same semantic content.
2. 0.70 to 0.84 for a clear semantic match with compatible scope.
3. 0.50 to 0.69 for a likely match with material ambiguity.
4. Below 0.50 for a result that must not be returned.

Select the passing candidate with the highest confidence. When confidence is
equal, prefer the earliest created candidate, then the lowest numbered key.

Never select a semantic result without hydrating and evaluating it. A hydrated
semantic result that passes Gates 0 through 3 with confidence of at least 0.50
remains eligible even when it does not reach the early exit threshold. Return
no duplicate only when every result fails a gate or has confidence below 0.50.

## Output

When duplicate detection is the user's requested result, return exactly one raw
JSON object. Do not wrap it in a code block or add text before or after it. Use
no trailing commas.

When a broader workflow consults this reference, provide the same object to the
calling workflow without ending or replacing its broader response.

When a duplicate passes every gate, return:

```text
{
  "duplicate": {
    "key": "<candidate key>",
    "title": "<candidate summary>",
    "url": "<candidate Jira URL>"
  }
}
```

Prefer the URL returned by the native Jira read. Otherwise, form the browse URL
from the selected Jira site and candidate key. Do not guess a Jira hostname.

When the workflow completes and no candidate passes, return:

```text
{
  "duplicate": null,
  "message": "No duplicate found."
}
```

Do not expose comparison details, confidence scores, JQL, semantic result keys,
or internal reasoning. Do not report a permission gap or failed search as a
completed no match. If the workflow cannot complete, return `duplicate` as null
and set `message` to `Could not complete duplicate search: <brief reason>.`.
