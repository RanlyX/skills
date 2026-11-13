---
name: web-downloader
description: Renders webpages using a headless browser and archives the fully rendered DOM as an intact HTML file under <project>/data/webs/<web_name>_<yyyy-mm-dd_HH-mm-SS>.html. Always invoke this skill whenever the user types /web-downloader, asks to download, save, snapshot, or archive a rendered webpage or URL (including dynamic SPAs, internal IPs like 192.168.x.x, or self-signed HTTPS endpoints).
---

# Web Downloader (`/web-downloader`)

## Purpose
The `web-downloader` skill enables AI agents to render dynamic webpages using a headless browser engine (evaluating JavaScript, client-side frameworks, and styles) and dump the exact, rendered DOM directly into an intact HTML file.

It natively supports public websites, intranet addresses (e.g. `192.168.x.x`, `10.x.x.x`), custom ports, and self-signed SSL certificates without failing on certificate validation errors.

---

## Invocation & Triggers
Invoke this skill whenever:
- The user enters `/web-downloader <url1> [url2 ...]`
- The user requests to download, save, or snapshot a webpage (e.g., "幫我存 https://www.google.com 跟 https://192.168.40.57:8443")
- A user wants to capture dynamic single-page applications (React, Vue, Angular) after JavaScript execution rather than raw unrendered HTTP responses

---

## Workflow & Step-by-Step Instructions

### Step 1: Parse User Input URLs and Options
1. Extract all URLs from the user prompt. Supports both HTTP and HTTPS, including IP addresses with ports (e.g., `https://192.168.40.57:8443`).
2. Identify optional user parameters:
   - Custom name prefix: e.g., `/web-downloader --name my_site https://...` or "名稱叫 my_site".
   - Output directory: Defaults to `<project>/data/webs/` where `<project>` is the active workspace root.
   - Wait time: Defaults to 5000ms virtual rendering budget to allow dynamic scripts to resolve.

### Step 2: Execute Browser Rendering
Run the bundled helper script `download.mjs`:

```bash
node <skill-path>/scripts/download.mjs <url1> [url2 ...] [options]
```

When invoked inside this repository:
```bash
node skills/web-downloader/scripts/download.mjs "https://www.google.com" "https://192.168.40.57:8443"
```

#### Script Options:
- `--out-dir <path>`: Specify destination folder (defaults to `<project>/data/webs`).
- `--name <name>`: Custom filename prefix when downloading a single URL.
- `--wait <ms>`: Milliseconds to wait for JavaScript execution and API data (default: 5000).
- `--timeout <ms>`: Maximum execution timeout in milliseconds (default: 30000).

#### Fallback Direct Browser Execution:
If running the script is not possible, execute the headless browser command directly:
```bash
google-chrome-stable --headless=new \
  --dump-dom \
  --disable-gpu \
  --no-sandbox \
  --disable-dev-shm-usage \
  --ignore-certificate-errors \
  --allow-insecure-localhost \
  --virtual-time-budget=5000 \
  "<url>" > "<project>/data/webs/<web_name>_<yyyy-mm-dd_HH-mm-SS>.html"
```

### Step 3: Verify Output Files and Report
1. Verify each generated HTML file exists and is non-empty.
2. Present the saved files to the user with clickable markdown links (`file:///...`), file sizes, and timestamps.
3. If an intranet or self-signed endpoint failed due to network unreachable status, clearly report the specific network diagnosis.

---

## Output Path and Naming Convention

```text
<project>/data/webs/<web_name>_<yyyy-mm-dd_HH-mm-SS>.html
```

- `<project>`: The root directory of the current project workspace.
- `data/webs`: The standard storage directory for downloaded web assets.
- `<web_name>`: Sanitized website identifier:
  - `https://www.google.com` -> `google.com`
  - `https://192.168.40.57:8443` -> `192.168.40.57_8443`
  - Invalid filename characters (`:`, `/`, `?`, `&`) are replaced with underscores (`_`).
- `<yyyy-mm-dd_HH-mm-SS>`: Local timestamp of the download event formatted as `YYYY-MM-DD_HH-mm-ss`.
