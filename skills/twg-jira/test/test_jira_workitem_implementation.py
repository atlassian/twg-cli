import importlib.util
import unittest
from pathlib import Path


SCRIPT_PATH = (
    Path(__file__).parents[1] / "scripts/jira_workitem_implementation.py"
)
SPEC = importlib.util.spec_from_file_location(
    "jira_workitem_implementation", SCRIPT_PATH
)
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class JiraWorkitemImplementationTest(unittest.TestCase):
    def test_projects_implementation_fields_and_renders_adf(self):
        workitem = {
            "expand": "renderedFields,names,schema",
            "self": "https://api.example.invalid/issue/123",
            "key": "PROJ-123",
            "summary": "Trace rate limits",
            "status": {"name": "Open", "self": "https://api.example.invalid/status/1"},
            "issuetype": {"name": "Story", "iconUrl": "https://example.invalid/icon"},
            "parent": {
                "key": "PROJ-100",
                "fields": {"summary": "Rate limiting", "priority": {"name": "Medium"}},
            },
            "description": {
                "type": "doc",
                "version": 1,
                "content": [
                    {
                        "type": "heading",
                        "attrs": {"level": 2},
                        "content": [{"type": "text", "text": "Outcome"}],
                    },
                    {
                        "type": "paragraph",
                        "content": [
                            {"type": "text", "text": "Trace "},
                            {
                                "type": "text",
                                "text": "Redis",
                                "marks": [{"type": "code"}],
                            },
                            {"type": "text", "text": " commands."},
                        ],
                    },
                    {
                        "type": "heading",
                        "attrs": {"level": 2},
                        "content": [{"type": "text", "text": "Acceptance criteria"}],
                    },
                    {
                        "type": "bulletList",
                        "content": [
                            {
                                "type": "listItem",
                                "content": [
                                    {
                                        "type": "paragraph",
                                        "content": [
                                            {
                                                "type": "text",
                                                "text": "Keep keys private",
                                                "marks": [{"type": "strong"}],
                                            }
                                        ],
                                    }
                                ],
                            }
                        ],
                    },
                    {
                        "type": "table",
                        "content": [
                            {
                                "type": "tableRow",
                                "content": [
                                    {
                                        "type": "tableHeader",
                                        "content": [
                                            {
                                                "type": "paragraph",
                                                "content": [{"type": "text", "text": "Tag"}],
                                            }
                                        ],
                                    },
                                    {
                                        "type": "tableHeader",
                                        "content": [
                                            {
                                                "type": "paragraph",
                                                "content": [{"type": "text", "text": "Value"}],
                                            }
                                        ],
                                    },
                                ],
                            },
                            {
                                "type": "tableRow",
                                "content": [
                                    {
                                        "type": "tableCell",
                                        "content": [
                                            {
                                                "type": "paragraph",
                                                "content": [
                                                    {"type": "text", "text": "decision"}
                                                ],
                                            }
                                        ],
                                    },
                                    {
                                        "type": "tableCell",
                                        "content": [
                                            {
                                                "type": "paragraph",
                                                "content": [
                                                    {
                                                        "type": "text",
                                                        "text": "allowed",
                                                        "marks": [
                                                            {
                                                                "type": "link",
                                                                "attrs": {
                                                                    "href": "https://example.invalid/docs"
                                                                },
                                                            }
                                                        ],
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        }

        projected = MODULE.project_workitem(workitem)

        self.assertEqual(
            projected,
            {
                "key": "PROJ-123",
                "summary": "Trace rate limits",
                "status": "Open",
                "issueType": "Story",
                "parent": {"key": "PROJ-100", "summary": "Rate limiting"},
                "description": (
                    "## Outcome\n\n"
                    "Trace `Redis` commands.\n\n"
                    "## Acceptance criteria\n\n"
                    "- **Keep keys private**\n\n"
                    "| Tag | Value |\n"
                    "| --- | --- |\n"
                    "| decision | [allowed](https://example.invalid/docs) |"
                ),
            },
        )
        self.assertNotIn("self", projected)
        self.assertNotIn("expand", projected)

    def test_normalizes_single_and_batch_payloads(self):
        issue = {"key": "PROJ-123"}

        self.assertEqual(MODULE.normalize_payload([issue]), [issue])
        self.assertEqual(MODULE.normalize_payload({"data": issue}), [issue])
        self.assertEqual(
            MODULE.normalize_payload({"data": {"items": [{"data": issue}]}}),
            [issue],
        )

    def test_builds_a_bounded_json_command(self):
        command = MODULE.build_command("/usr/local/bin/twg", ["PROJ-123", "PROJ-124"])

        self.assertEqual(
            command,
            [
                "/usr/local/bin/twg",
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
            ],
        )


if __name__ == "__main__":
    unittest.main()
