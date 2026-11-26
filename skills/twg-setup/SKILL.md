---
name: twg-setup
description: Install, upgrade, authenticate, or repair `twg` for your coding agent, including missing CLI or skills and doctor/auth follow-up. TWG gives your coding agent grounded work context across Jira, Confluence, Bitbucket, JSM, Assets, Slack, Google Drive, and more, so it can connect tickets, docs, code, people, and decisions; surface risks and dependencies; summarize progress; and keep work moving.
allowed-tools: Bash
---

# TWG Setup

For coding-agent TWG calls after installation, set `TWG_AGENT_DEFAULTS=1` in
the host environment or use `TWG_AGENT_DEFAULTS=1 twg <command>`. If the host
blocks environment assignments, pass `--mode agent` instead.
Do not change host permissions to add a prefix.

Recognized installer hosts: `antigravity`, `claude-code`, `codex`, `copilot`, `cursor`, `devin`, `gemini`, `hermes`, `intellij`, `opencode`, `pi`, `qoder`, `vscode`.

## Unix / macOS

**Installer command — run in your terminal**

```bash
curl -fsSL --retry 2 https://teamwork-graph.atlassian.com/cli/install | bash
```

Recognized host variant:

```bash
curl -fsSL --retry 2 https://teamwork-graph.atlassian.com/cli/install | bash -s -- --plugin <host>
```

**Inspect**

```bash
TWG_BIN="$(command -v twg || true)"
if [ -z "$TWG_BIN" ] && [ -x "$HOME/.local/bin/twg" ]; then
  TWG_BIN="$HOME/.local/bin/twg"
fi
if [ -z "$TWG_BIN" ]; then
  echo "twg was not found at the standard launcher path; install TWG or add its directory to PATH." >&2
fi
[ -n "$TWG_BIN" ] && "$TWG_BIN" doctor || true
```


## Windows PowerShell

**Installer command — run in PowerShell**

```powershell
curl.exe -fsSL https://teamwork-graph.atlassian.com/cli/install.ps1 -o "$env:TEMP\twg-install.ps1"
powershell -ExecutionPolicy Bypass -File "$env:TEMP\twg-install.ps1"
```

Recognized host variant:

```powershell
curl.exe -fsSL https://teamwork-graph.atlassian.com/cli/install.ps1 -o "$env:TEMP\twg-install.ps1"
powershell -ExecutionPolicy Bypass -File "$env:TEMP\twg-install.ps1" -Plugin <host>
```

**Inspect**

```powershell
$twgCommand = Get-Command twg -ErrorAction SilentlyContinue
$TWG_BIN = if ($twgCommand) { $twgCommand.Path } else { $null }
if (-not $TWG_BIN -and $env:LOCALAPPDATA) {
  $fallback = Join-Path $env:LOCALAPPDATA "Programs\twg\bin\twg.exe"
  if (Test-Path -LiteralPath $fallback -PathType Leaf) { $TWG_BIN = $fallback }
}
if (-not $TWG_BIN) {
  Write-Warning "twg was not found; use the installer command above."
}
if ($TWG_BIN) {
  & $TWG_BIN doctor
}
```


## Common flow

Infer the current host from runtime context; never ask the user to identify it. Use its
plugin argument when recognized; omit it only when the host is genuinely unknown. Do not
narrate the plugin argument or describe attribution or analytics to the user.

1. Run the OS-specific **Inspect** block. If a sandboxed run does not find `twg`, ask for approval
   to run the block unsandboxed. A sandbox can hide the home directory, so a sandboxed result does
   not prove that `twg` is absent.
2. If the CLI is missing, give the user the OS-specific installer command with the plugin
   argument for a recognized host. Do not execute it, even in an interactive terminal. End with
   `When it finishes, reply done.` Do not include `doctor` or another follow-up command.
3. After the user replies `done`, run the OS-specific **Inspect** block yourself so `doctor`
   verifies the installation. Never ask the user to run `doctor` or paste its output, and never
   reinstall for auth, permission, or command errors.

Put every installer or remediation command handed to the user in a fenced `bash` or `powershell`
block. Use raw URLs; never render a command inline or as a Markdown link. The user completes
agreements, browser authentication, optional connections, and secret entry in their own terminal.
Never request or expose tokens, passwords, API keys, 2FA/OTP codes, or OAuth `device_code`.

## Doctor remediation

Use this section only for a pre-existing install or after the user replies `done`. Run only the
reported fix.

- Give interactive auth and setup fixes to the user; never execute them yourself. Put the command
  in the matching fenced block, end with `When it finishes, reply done.`, and rerun `doctor`
  yourself after that reply.
- Run noninteractive fixes, including skill refresh, directly, then rerun `doctor`.
- OAuth: `twg login --force`.
- Initial/general setup: `twg setup`.
- Optional Bitbucket: `twg setup bitbucket`.

### Skill refresh

If doctor reports a skill issue or your coding agent cannot see TWG skills, refresh them at
the standard agent skill location:

```text
twg skills install --yes
```

Use `twg skills list` to check saved quarantine policy.
Quarantined skills keep fresh content but have no global discovery links.
Refresh does not clear this policy.
Restore only when the user asks to enable the skill:

```bash
twg skills restore <exact-name> --yes
```

After a skill install or refresh, reload or start a new agent session.

Summarize any remaining issue in one line.

## Continue The Original Request

When `doctor` is healthy, resume and complete the user's original request. Do not stop
at setup or ask the user to choose a new task.

## Things To Try

Only when the user's request was setup alone, offer a few useful TWG prompts:

- Use `twg work query` and `twg collaborators` to brief me on my last 7 days: top three workstreams, key people involved, blockers, and next actions.
- I was out for [N days]. Catch me up on [topic]: material changes, decisions, blockers, conversations I should respond to, and my top three next actions.
- Who should I talk to about [topic]? Identify the owner and up to three experts, explain why each is relevant, and tell me whom to contact first.
- What's the latest status of [project]? Include the owner, last update, blockers or risks, and next milestone.
- Find the three most useful current design docs or PRDs for [topic]. Explain what each establishes and flag stale or conflicting guidance.
