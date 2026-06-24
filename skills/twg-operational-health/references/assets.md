---
description: Query Assets and CMDB schemas with AQL, including a person and device join, ownership, lifecycle, age, status, and risk.
---

# Assets And CMDB Queries

Use AQL only after inspecting the site's Assets schema, object types, and
attributes. Names are site-specific.

Discovery sequence:

```bash
twg assets objectschema list --include-counts -o json
twg assets type query --schema-id <schema-id> --exclude-abstract -o json
twg assets type list-attr query --type-id <type-id> -o json
twg assets reference-type query --schema-id <schema-id> --include-all -o json
```

When an object-reference write reports that cross-schema relations are
disabled, enable them explicitly for the source schema:

```bash
twg assets objectschema settings update <schema-id> --allow-other-object-schema true
```

This settings mutation requires the OAuth scope `write:assets:twg-cli`.

Common query shapes:

```aql
objectType = Laptops
objectType = Laptops AND "Calculated user" IS NOT EMPTY
objectSchema = "<schema>" AND objectType = Laptops AND "Calculated user" = "<handle>"
objectType = Services AND Status = Active
```

For person-to-device joins, prefer discovered user-like attributes in this
order when present:

1. `Calculated user`
2. `Assigned to (user)`
3. `User`
4. `Current Owner`
5. `Owner`
6. `Name`

Once a reliable user attribute exists on the target type, stop using broad
display-name filters as the primary strategy.

Classify an empty result before retrying:

- wrong schema or object type,
- right type but wrong join field,
- true no match.

After finding a usable object, capture owner/user, model, status, lifecycle,
age, and risk fields needed for the decision. Do not fetch the entire object
graph or repeat nearby name variants.
