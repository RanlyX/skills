# Web Downloader Skill

An agent skill for rendering webpages with a headless browser engine and saving the complete rendered DOM as an intact HTML file.

## Installation

Install using `npx skills add`:

```bash
# Install directly from this repository
npx skills add RanlyX/skills --skill web-downloader

# Or install all skills in the repository
npx skills add RanlyX/skills
```

## Usage

Trigger the skill in your AI assistant session:

```text
/web-downloader https://www.google.com
```

Or download multiple endpoints at once (including internal IP addresses and self-signed HTTPS endpoints):

```text
/web-downloader 幫我存 https://www.google.com 跟 https://192.168.40.57:8443
```

## Output Path

Downloaded HTML files are stored in:

```text
<project>/data/webs/<web_name>_<yyyy-mm-dd_HH-mm-SS>.html
```

- `<project>`: Current project workspace root.
- `<web_name>`: Sanitized website name based on URL host and path (e.g. `google.com`, `192.168.40.57_8443`).
- `<yyyy-mm-dd_HH-mm-SS>`: Local timestamp in `YYYY-MM-DD_HH-mm-ss` format.

## Features

- **Dynamic JavaScript Rendering**: Renders Single Page Applications (SPAs) before dumping the DOM.
- **Intranet and SSL Support**: Automatically bypasses self-signed TLS/SSL warnings (`--ignore-certificate-errors`) for internal networks.
- **Zero-Dependency Script**: Uses native Node.js and pre-installed Chromium, Google Chrome, or Microsoft Edge binaries across Linux, macOS, and Windows.
