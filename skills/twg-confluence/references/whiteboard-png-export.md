---
description: Export a whiteboard screenshot as PNG, check its task status, download the image, and inspect its visual layout.
---

# Whiteboard PNG Export

Use this procedure for a whiteboard screenshot or visual review.

```bash
twg confluence content export <ID-or-URL> --format png --site <site> -o json
twg confluence content export-status <taskId> --site <same-site> -o json
```

Each start creates a new export. Do not automatically retry the start command.
Check status after two seconds, then back off up to ten seconds between checks.
Use a bounded waiting period and preserve the task ID for later continuation.
On HTTP 503, retry the status check with the same task ID. Stop on `FAILED`;
`errorCode: result-unavailable` means the result expired or was evicted, so a new
export is required if still needed. Stop on `UNKNOWN` and report that the task
may be missing or expired. If `SUCCEEDED` has no download URL, stop polling and
report the missing export result.

When status is `SUCCEEDED`, download `data.downloadUrl` promptly to a `.png`
file and inspect it before claiming visual verification. The cached URL expires
five minutes after rendering. `--output-file` saves the response JSON, not image
bytes.
