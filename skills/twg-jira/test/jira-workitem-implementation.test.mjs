import assert from "node:assert/strict";
import test from "node:test";
import {
  buildArguments,
  normalizePayload,
  projectWorkitem,
} from "../scripts/jira-workitem-implementation.mjs";

test("projects implementation fields and renders ADF", () => {
  const workitem = {
    expand: "renderedFields,names,schema",
    self: "https://api.example.invalid/issue/123",
    key: "PROJ-123",
    summary: "Trace rate limits",
    status: {
      name: "Open",
      self: "https://api.example.invalid/status/1",
    },
    issuetype: {
      name: "Story",
      iconUrl: "https://example.invalid/icon",
    },
    parent: {
      key: "PROJ-100",
      fields: {
        summary: "Rate limiting",
        priority: { name: "Medium" },
      },
    },
    description: {
      type: "doc",
      version: 1,
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Outcome" }],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Trace " },
            {
              type: "text",
              text: "Redis",
              marks: [{ type: "code" }],
            },
            { type: "text", text: " commands." },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Acceptance criteria" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Keep keys private",
                      marks: [{ type: "strong" }],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "table",
          content: [
            {
              type: "tableRow",
              content: [
                {
                  type: "tableHeader",
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "Tag" }],
                    },
                  ],
                },
                {
                  type: "tableHeader",
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "Value" }],
                    },
                  ],
                },
              ],
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "decision" }],
                    },
                  ],
                },
                {
                  type: "tableCell",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "text",
                          text: "allowed",
                          marks: [
                            {
                              type: "link",
                              attrs: {
                                href: "https://example.invalid/docs",
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  };

  assert.deepEqual(projectWorkitem(workitem), {
    key: "PROJ-123",
    summary: "Trace rate limits",
    status: "Open",
    issueType: "Story",
    parent: {
      key: "PROJ-100",
      summary: "Rate limiting",
    },
    description: [
      "## Outcome",
      "",
      "Trace `Redis` commands.",
      "",
      "## Acceptance criteria",
      "",
      "- **Keep keys private**",
      "",
      "| Tag | Value |",
      "| --- | --- |",
      "| decision | [allowed](https://example.invalid/docs) |",
    ].join("\n"),
  });
});

test("normalizes single and batch payloads", () => {
  const issue = { key: "PROJ-123" };

  assert.deepEqual(normalizePayload([issue]), [issue]);
  assert.deepEqual(normalizePayload({ data: issue }), [issue]);
  assert.deepEqual(
    normalizePayload({ data: { items: [{ data: issue }] } }),
    [issue],
  );
});

test("builds a bounded JSON command", () => {
  assert.deepEqual(buildArguments(["PROJ-123", "PROJ-124"]), [
    "jira",
    "workitem",
    "get",
    "PROJ-123",
    "PROJ-124",
    "--fields",
    "summary,description,status,parent,issuetype",
    "-o",
    "json",
    "--output-summary",
    "none",
  ]);
});
