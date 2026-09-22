#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const JIRA_FIELDS = "summary,description,status,parent,issuetype";

function contentOf(node) {
  return Array.isArray(node?.content) ? node.content : [];
}

export function renderInlines(nodes = []) {
  return nodes.map((node) => renderInline(node)).join("");
}

export function renderInline(node) {
  if (node?.type === "text") {
    let text = typeof node.text === "string" ? node.text : "";
    for (const mark of Array.isArray(node.marks) ? node.marks : []) {
      if (mark.type === "code") text = `\`${text}\``;
      else if (mark.type === "strong") text = `**${text}**`;
      else if (mark.type === "em") text = `*${text}*`;
      else if (mark.type === "strike") text = `~~${text}~~`;
      else if (mark.type === "link" && mark.attrs?.href)
        text = `[${text}](${String(mark.attrs.href)})`;
    }
    return text;
  }
  if (node?.type === "hardBreak") return "\n";
  if (["mention", "emoji", "status"].includes(node?.type)) {
    return String(
      node.attrs?.text ??
        node.attrs?.displayName ??
        node.attrs?.shortName ??
        "",
    );
  }
  if (["inlineCard", "blockCard", "embedCard"].includes(node?.type))
    return String(node.attrs?.url ?? "");
  return renderInlines(contentOf(node));
}

export function renderBlock(node) {
  const content = contentOf(node);
  if (node?.type === "doc")
    return content
      .map((child) => renderBlock(child).trim())
      .filter(Boolean)
      .join("\n\n");
  if (node?.type === "heading") {
    const level = Math.min(Math.max(Number(node.attrs?.level) || 1, 1), 6);
    return `${"#".repeat(level)} ${renderInlines(content)}`;
  }
  if (node?.type === "paragraph") return renderInlines(content);
  if (node?.type === "codeBlock") {
    const language = String(node.attrs?.language ?? "");
    return `\`\`\`${language}\n${renderInlines(content)}\n\`\`\``;
  }
  if (node?.type === "blockquote") {
    const rendered = content.map((child) => renderBlock(child)).join("\n\n");
    return rendered
      .split(/\r\n|\r|\n/u)
      .map((line) => (line ? `> ${line}` : ">"))
      .join("\n");
  }
  if (node?.type === "rule") return "---";
  if (["bulletList", "orderedList"].includes(node?.type)) {
    const start = Number(node.attrs?.order) || 1;
    return content
      .map((item, index) => {
        const marker = node.type === "bulletList" ? "-" : `${start + index}.`;
        const lines = renderBlock(item).trim().split(/\r\n|\r|\n/u);
        return [
          `${marker} ${lines[0] ?? ""}`,
          ...lines.slice(1).map((line) => `  ${line}`),
        ].join("\n");
      })
      .join("\n");
  }
  if (node?.type === "listItem")
    return content
      .map((child) => renderBlock(child).trim())
      .filter(Boolean)
      .join("\n");
  if (node?.type === "table") {
    const rows = content.map((row) => renderTableRow(row));
    if (rows.length === 0) return "";
    const separator = rows[0].map(() => "---");
    return [rows[0], separator, ...rows.slice(1)]
      .map((row) => renderTableCells(row))
      .join("\n");
  }
  if (["tableCell", "tableHeader"].includes(node?.type))
    return content
      .map((child) => renderBlock(child).trim())
      .filter(Boolean)
      .join(" ");
  if (["panel", "expand", "nestedExpand"].includes(node?.type)) {
    const title = typeof node.attrs?.title === "string" ? node.attrs.title : "";
    const body = content
      .map((child) => renderBlock(child).trim())
      .filter(Boolean)
      .join("\n\n");
    return [title, body].filter(Boolean).join("\n\n");
  }
  if (content.length > 0)
    return content
      .map((child) => renderBlock(child).trim())
      .filter(Boolean)
      .join("\n\n");
  return renderInline(node);
}

function renderTableRow(row) {
  return contentOf(row).map((cell) =>
    renderBlock(cell).replaceAll("|", "\\|").replaceAll(/\r\n|\r|\n/gu, "<br>"),
  );
}

function renderTableCells(cells) {
  return `| ${cells.join(" | ")} |`;
}

function compactText(value) {
  if (value?.type === "doc") return renderBlock(value).trim();
  return typeof value === "string" ? value.trim() : undefined;
}

function namedValue(value) {
  if (value && typeof value === "object") return value.name;
  return typeof value === "string" ? value : undefined;
}

function compactObject(value) {
  return Object.fromEntries(
    Object.entries(value).filter(
      ([, item]) =>
        item !== undefined &&
        item !== null &&
        item !== "" &&
        !(Array.isArray(item) && item.length === 0) &&
        !(
          typeof item === "object" &&
          !Array.isArray(item) &&
          Object.keys(item).length === 0
        ),
    ),
  );
}

export function projectWorkitem(workitem) {
  const parent = workitem?.parent;
  const parentFields =
    parent?.fields && typeof parent.fields === "object" ? parent.fields : {};
  const projectedParent =
    parent && typeof parent === "object"
      ? compactObject({
          key: parent.key,
          summary: parent.summary ?? parentFields.summary,
        })
      : undefined;
  return compactObject({
    key: workitem?.key,
    summary: workitem?.summary,
    status: namedValue(workitem?.status),
    issueType: namedValue(workitem?.issuetype),
    parent: projectedParent,
    description: compactText(workitem?.description),
    url: workitem?.url,
  });
}

export function normalizePayload(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object")
    throw new TypeError("Unexpected TWG Jira payload shape");
  const data = payload.data ?? payload;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items))
    return data.items.map((item) => item?.data ?? item);
  if (data && typeof data === "object") return [data];
  throw new TypeError("Unexpected TWG Jira payload shape");
}

export function buildArguments(keys) {
  return [
    "jira",
    "workitem",
    "get",
    ...keys,
    "--fields",
    JIRA_FIELDS,
    "-o",
    "json",
    "--output-summary",
    "none",
  ];
}

function twgCandidates() {
  const fallback =
    process.platform === "win32" && process.env.LOCALAPPDATA
      ? path.join(
          process.env.LOCALAPPDATA,
          "Programs",
          "twg",
          "bin",
          "twg.exe",
        )
      : path.join(homedir(), ".local", "bin", "twg");
  return ["twg", fallback];
}

function fetchWorkitems(keys) {
  for (const binary of twgCandidates()) {
    if (binary !== "twg" && !existsSync(binary)) continue;
    const result = spawnSync(binary, buildArguments(keys), {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    if (result.error?.code === "ENOENT") continue;
    if (result.error) throw result.error;
    if (result.status !== 0)
      throw new Error(
        result.stderr.trim() || "TWG command failed without diagnostic output",
      );
    try {
      return JSON.parse(result.stdout);
    } catch (error) {
      throw new Error("TWG did not return JSON", { cause: error });
    }
  }
  throw new Error("Required command not found: twg");
}

function parseArguments(arguments_) {
  const keys = [];
  let inputPath;
  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index];
    if (argument === "--input") {
      inputPath = arguments_[index + 1];
      if (!inputPath || inputPath.startsWith("-"))
        throw new Error("--input requires a path");
      index += 1;
    } else if (argument === "-h" || argument === "--help") {
      return { help: true, keys: [] };
    } else if (argument.startsWith("-")) {
      throw new Error(`Unknown option: ${argument}`);
    } else {
      keys.push(argument);
    }
  }
  if (inputPath && keys.length > 0)
    throw new Error("Jira keys cannot be combined with --input");
  if (!inputPath && keys.length === 0)
    throw new Error("Provide at least one Jira key or --input");
  return { help: false, inputPath, keys };
}

export async function run(arguments_ = process.argv.slice(2)) {
  try {
    const options = parseArguments(arguments_);
    if (options.help) {
      process.stdout.write(
        "Usage: jira-workitem-implementation.mjs <KEY...> | --input <payload.json>\n",
      );
      return 0;
    }
    const payload = options.inputPath
      ? JSON.parse(await readFile(options.inputPath, "utf8"))
      : fetchWorkitems(options.keys);
    const items = normalizePayload(payload).map((item) =>
      projectWorkitem(item),
    );
    process.stdout.write(`${JSON.stringify({ items }, null, 2)}\n`);
    return 0;
  } catch (error) {
    process.stderr.write(
      `jira-workitem-implementation: ${
        error instanceof Error ? error.message : String(error)
      }\n`,
    );
    return 1;
  }
}

const invokedPath = process.argv[1];
if (
  invokedPath &&
  import.meta.url === pathToFileURL(path.resolve(invokedPath)).href
) {
  process.exitCode = await run();
}
