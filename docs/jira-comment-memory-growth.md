# Jira Markdown comments that hang or grow in memory

[Issue #25](https://github.com/atlassian/twg-cli/issues/25) reports a hang and
unbounded memory growth with `jira workitem update --comment` and
`--transition-comment`. An indented Markdown pipe table under a list item
reproduces the failure in TWG CLI 1.3.5 on macOS arm64.

## Workaround

End the list before the table: leave a blank line and put every table line at
column zero. Put the paragraph after the table at column zero as well. For
example:

```markdown
Close-out evidence; every acceptance criterion is met.
- **Script tests:** `scripts/check.sh`, all passed.
- **Next deploy:** green "CI Gates Passed" check, gates skipped.
- **Wall time** (start → deployed):

| Run | Version | Minutes |
|---|---|---|
| 101 | 3.24.0 | 42.9 |
| 102 | 3.25.1 | 34.8 |
| 103 | 3.26.0 | 12.3 |

A saving of 22–31 min per deploy.

No documentation affected.
```

Use `--comment-format markdown` for this example, or
`--transition-comment-format markdown` with a transition comment. Conversion
of the example above completed in the controlled CLI check described below;
posting and transition behavior were not exercised.

## Reproduction and evidence

To recreate the failing input, indent all five table lines and the saving
paragraph in the example above by two spaces. The table then becomes part of
the final list item. This input reproduces independently of the reported issue's
fields, status, or existing comments.

Controlled checks used the installed 1.3.5 executable and the command shape:

```bash
twg jira workitem update --site <site>.atlassian.net --id 0 \
  --comment "<example above>" --comment-format markdown -o json
```

Numeric issue ID `0` is deliberately nonexistent. The observed non-indented
case failed at the issue lookup with HTTP 404, before a comment could be posted.
The tests did not change a Jira issue. A process-group watchdog killed the
indented case once sampled RSS exceeded 512 MiB, with a five-second time limit
as an additional bound.

| Input | Result | Elapsed time | Peak sampled RSS |
|---|---|---|---|
| Two-space-indented table and saving paragraph | Killed at memory limit; no output | 1.41 s | 520.5 MiB |
| Same input with those lines at column zero | Expected HTTP 404 for nonexistent issue | 0.65 s | 122.5 MiB |

These measurements establish a conversion failure and a workaround for this
reproducer. They do not establish a successful live comment write, a release
containing a fix, or behavior on other operating systems. Do not run the failing
input without a memory/time watchdog.

## Implementation follow-up

Both comment options share Markdown-to-Jira rich-text conversion. The table
parser bundled with the executable uses the same cell-state pattern as the
publicly published `markdown-it-table` 2.0.6 plugin: it reuses the parent block state for each cell
and assigns `state.lineMax = 1` while tokenizing a later document line.
Separate offline tests of this table-parser pattern reproduce an ordered-list
loop that emits tokens without advancing, exhausting a bounded JavaScript heap.
Version-number cells and list indentation are relevant; an ordinary top-level
table is insufficient to reproduce it.

The implementation fix needs to isolate cell offsets and indentation, supply
valid line bounds, and preserve parser progress. It also needs to validate
whether a table can be represented in the destination list structure: simply
stopping the loop is insufficient if conversion silently drops the table.
Regression coverage should exercise the example above, the indented variant,
both comment options, and preservation of all table cells and surrounding text
or an explicit actionable validation error.

This public repository contains documentation and release artifacts, not the
CLI implementation. This note provides a verified workaround and engineering
reproducer; it does not fix the executable or resolve issue #25.
