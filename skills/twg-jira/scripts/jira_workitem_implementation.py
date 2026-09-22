#!/usr/bin/env python3

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path


JIRA_FIELDS = "summary,description,status,parent,issuetype"


def render_inlines(nodes):
    return "".join(render_inline(node) for node in nodes or [])


def render_inline(node):
    node_type = node.get("type")
    if node_type == "text":
        text = node.get("text", "")
        for mark in node.get("marks", []):
            mark_type = mark.get("type")
            if mark_type == "code":
                text = f"`{text}`"
            elif mark_type == "strong":
                text = f"**{text}**"
            elif mark_type == "em":
                text = f"*{text}*"
            elif mark_type == "strike":
                text = f"~~{text}~~"
            elif mark_type == "link":
                href = mark.get("attrs", {}).get("href")
                if href:
                    text = f"[{text}]({href})"
        return text
    if node_type == "hardBreak":
        return "\n"
    if node_type in {"mention", "emoji", "status"}:
        attributes = node.get("attrs", {})
        return (
            attributes.get("text")
            or attributes.get("displayName")
            or attributes.get("shortName")
            or ""
        )
    if node_type in {"inlineCard", "blockCard", "embedCard"}:
        return node.get("attrs", {}).get("url", "")
    return render_inlines(node.get("content"))


def render_block(node):
    node_type = node.get("type")
    content = node.get("content", [])
    if node_type == "doc":
        return "\n\n".join(filter(None, (render_block(child).strip() for child in content)))
    if node_type == "heading":
        level = min(max(int(node.get("attrs", {}).get("level", 1)), 1), 6)
        return f"{'#' * level} {render_inlines(content)}"
    if node_type == "paragraph":
        return render_inlines(content)
    if node_type == "codeBlock":
        language = node.get("attrs", {}).get("language", "")
        return f"```{language}\n{render_inlines(content)}\n```"
    if node_type == "blockquote":
        rendered = "\n\n".join(render_block(child) for child in content)
        return "\n".join(f"> {line}" if line else ">" for line in rendered.splitlines())
    if node_type == "rule":
        return "---"
    if node_type in {"bulletList", "orderedList"}:
        start = int(node.get("attrs", {}).get("order", 1))
        rendered_items = []
        for index, item in enumerate(content):
            marker = "-" if node_type == "bulletList" else f"{start + index}."
            body = render_block(item).strip()
            lines = body.splitlines() or [""]
            rendered_items.append(
                "\n".join([f"{marker} {lines[0]}", *(f"  {line}" for line in lines[1:])])
            )
        return "\n".join(rendered_items)
    if node_type == "listItem":
        return "\n".join(filter(None, (render_block(child).strip() for child in content)))
    if node_type == "table":
        rows = [render_table_row(row) for row in content]
        if not rows:
            return ""
        separator = "| " + " | ".join("---" for _ in rows[0]) + " |"
        rendered = [render_table_cells(rows[0]), separator]
        rendered.extend(render_table_cells(row) for row in rows[1:])
        return "\n".join(rendered)
    if node_type in {"tableCell", "tableHeader"}:
        return " ".join(filter(None, (render_block(child).strip() for child in content)))
    if node_type in {"panel", "expand", "nestedExpand"}:
        title = node.get("attrs", {}).get("title")
        body = "\n\n".join(filter(None, (render_block(child).strip() for child in content)))
        return "\n\n".join(filter(None, (title, body)))
    if content:
        return "\n\n".join(filter(None, (render_block(child).strip() for child in content)))
    return render_inline(node)


def render_table_row(row):
    return [render_block(cell).replace("|", "\\|").replace("\n", "<br>") for cell in row.get("content", [])]


def render_table_cells(cells):
    return "| " + " | ".join(cells) + " |"


def compact_text(value):
    if isinstance(value, dict) and value.get("type") == "doc":
        return render_block(value).strip()
    if isinstance(value, str):
        return value.strip()
    return None


def named_value(value):
    if isinstance(value, dict):
        return value.get("name")
    return value if isinstance(value, str) else None


def project_workitem(workitem):
    parent = workitem.get("parent")
    projected_parent = None
    if isinstance(parent, dict):
        parent_fields = parent.get("fields") if isinstance(parent.get("fields"), dict) else {}
        projected_parent = compact_object(
            {
                "key": parent.get("key"),
                "summary": parent.get("summary") or parent_fields.get("summary"),
            }
        )
    return compact_object(
        {
            "key": workitem.get("key"),
            "summary": workitem.get("summary"),
            "status": named_value(workitem.get("status")),
            "issueType": named_value(workitem.get("issuetype")),
            "parent": projected_parent,
            "description": compact_text(workitem.get("description")),
            "url": workitem.get("url"),
        }
    )


def compact_object(value):
    return {key: item for key, item in value.items() if item not in (None, "", {}, [])}


def normalize_payload(payload):
    if isinstance(payload, list):
        return payload
    if isinstance(payload, dict):
        data = payload.get("data", payload)
        if isinstance(data, list):
            return data
        if isinstance(data, dict) and isinstance(data.get("items"), list):
            return [
                item.get("data", item) if isinstance(item, dict) else item
                for item in data["items"]
            ]
        if isinstance(data, dict):
            return [data]
    raise ValueError("Unexpected TWG Jira payload shape")


def build_command(binary, keys):
    return [
        binary,
        "jira",
        "workitem",
        "get",
        *keys,
        "--fields",
        JIRA_FIELDS,
        "-o",
        "json",
        "--output-summary",
        "none",
    ]


def fetch_workitems(keys):
    binary = shutil.which("twg")
    if binary is None:
        fallback = Path.home() / ".local/bin/twg"
        if not fallback.is_file():
            raise RuntimeError("Required command not found: twg")
        binary = str(fallback)
    result = subprocess.run(
        build_command(binary, keys),
        capture_output=True,
        check=False,
        text=True,
    )
    if result.returncode != 0:
        detail = result.stderr.strip() or "TWG command failed without diagnostic output"
        raise RuntimeError(detail)
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError as error:
        raise RuntimeError("TWG did not return JSON") from error


def parse_arguments():
    parser = argparse.ArgumentParser(
        description="Fetch Jira workitems and emit implementation-bearing fields with ADF as Markdown."
    )
    parser.add_argument("keys", nargs="*", help="Jira workitem keys")
    parser.add_argument(
        "--input",
        type=Path,
        help="Read an existing TWG JSON payload instead of calling TWG",
    )
    arguments = parser.parse_args()
    if arguments.input is None and not arguments.keys:
        parser.error("provide at least one Jira key or --input")
    if arguments.input is not None and arguments.keys:
        parser.error("Jira keys cannot be combined with --input")
    return arguments


def main():
    arguments = parse_arguments()
    try:
        payload = (
            json.loads(arguments.input.read_text(encoding="utf-8"))
            if arguments.input is not None
            else fetch_workitems(arguments.keys)
        )
        projected = [project_workitem(item) for item in normalize_payload(payload)]
    except (OSError, ValueError, RuntimeError, json.JSONDecodeError) as error:
        print(f"jira-workitem-implementation: {error}", file=sys.stderr)
        return 1
    print(json.dumps({"items": projected}, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
