# Help Discovery

TWG command grammar is discovered at runtime. Static skill docs explain strategy;
`twg help` explains exact commands, arguments, flags, choices, defaults, and
examples.

## Primary Flow

Use `twg help` directly. Do not extract a help file path from stdout. With no
arguments it emits the compact YAML command map for routing.

```bash
twg help
twg help jira
twg help jira workitem
twg help jira workitem link goal
twg help confluence page get
twg help describe "jira"
twg help describe "jira workitem"
```

`twg help describe <namespace>` emits compact YAML. The `$` key lists executable
child commands directly under that namespace; other keys are child namespaces.
Use the returned `next.describe` commands to inspect exact executable contracts.
Do not infer flags or arguments from namespace YAML.

```yaml
kind: help_namespace
path: [jira]
depth: 2
next:
  describe:
    - "twg help describe \"jira workitem get\""
legend:
  $: executable child commands
tree:
  workitem:
    $: [create, get, query, update]
    link: {}
```

The default output for loose search is JSONL. The first record is `type: "meta"`
and matching command records are `type: "idx"`.

Use `describe` when you are about to inspect a namespace or execute an
unfamiliar command. Exact executable commands return JSON by default:

```bash
twg help describe "jira workitem query"
twg help describe "confluence page get"
twg help describe "user search"
```

The `output` object in `help describe` is the first place to look before
filtering JSON. If present, use its `recommendedSummary`,
`recommendedAgentFields`, and `agentFieldPresets` instead of probing raw payloads
with repeated `jq` calls:

```bash
twg help describe "context user"
twg context user <accountId> --output json --output-summary auto --agent-fields @compact
```

Only use `jq` after reading that contract and only against the bounded stdout
file named by the summary envelope. Prefer the documented preset paths over
trial-and-error filters.

Use rendered text help only when the user specifically asks for human help:

```bash
twg -o text help describe "jira workitem query"
```

## Command Selection Rules

- If a command name is uncertain, run `twg help <terms>` first.
- If you need exact arguments, options, choices, defaults, or agent output
  guidance, run `twg help describe <path>`. If the path is a namespace, follow
  its `next.describe` suggestions to an exact command.
- Follow the `next` commands returned by help; do not invent unsupported help
  syntax.
- If the command grammar changed, trust live help over every skill reference.
- If help says a command requires a workspace, repo, page ID, account ID, ARI, or
  project key, resolve that value before executing the command.
- Keep experimental commands out of parallel batches until help confirms the
  shape.
- After search/Rovo returns candidates, hydrate selected candidates through the
  exact executable `get` contract for that surface. Use `query` for filters; do
  not pass candidate keys to namespace commands.

## Common Discovery Patterns

| Need | Discovery path |
| --- | --- |
| Person lookup | `twg help user search`, then use positional name, `--name`, or `--email` |
| Jira workitem detail or JQL | `twg help describe "jira workitem"`, then inspect the chosen exact command |
| Jira required/custom fields on create/update | `twg help jira custom fields`, then use `jira workitem field create-metadata` or `update-metadata`; prefer returned `customfield_*` IDs; do not duplicate keys across `--field` and `--fields-json` |
| Jira custom field value readback | `twg jira workitem get <KEY> --field customfield_*`, or `--fields customfield_*,summary` for comma-separated REST fields |
| Confluence page by title, ID, or URL | `twg help confluence page` and `twg help describe "confluence page get"` |
| Bitbucket PR/repo | `twg help bitbucket`, then `twg help describe "bitbucket"` |
| Project/goal/focus area key or search result | `twg help projects`, `twg help goals`, `twg help focus-areas`, then describe the exact `get` or `query` command |
| Relationships or dependencies | `twg help context`, then `twg help describe "context"` |
| Assets / CMDB | `twg help assets`, then inspect object schema/type help before AQL |

## Compatibility Alias Guard

Compatibility aliases such as `user-search`, `page`, and `issue` may exist to
rescue stale prompts. Do not use them in examples or plans. Prefer the canonical
command path shown by live help.
