#!/usr/bin/env node

/**
 * Cross-platform rendered webpage downloader.
 * Uses headless Chromium/Chrome/Edge to fully render dynamic webpages (including SPA, JS execution,
 * and intranet/self-signed SSL endpoints) and save the rendered DOM as an intact HTML document.
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const DEFAULT_WAIT_MS = 5000;
const DEFAULT_TIMEOUT_MS = 30000;

function findBrowserBinary() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  if (process.env.BROWSER_PATH && fs.existsSync(process.env.BROWSER_PATH)) {
    return process.env.BROWSER_PATH;
  }

  const platform = os.platform();
  const candidates = [];

  if (platform === "linux") {
    candidates.push(
      "/usr/bin/google-chrome-stable",
      "/usr/bin/google-chrome",
      "/usr/bin/chromium-browser",
      "/usr/bin/chromium",
      "/usr/bin/microsoft-edge-stable",
      "/usr/bin/microsoft-edge",
      "/opt/google/chrome/google-chrome",
      "/snap/bin/chromium"
    );
  } else if (platform === "darwin") {
    candidates.push(
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
      "/Applications/Chromium.app/Contents/MacOS/Chromium",
      "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
    );
  } else if (platform === "win32") {
    const programFiles = process.env["ProgramFiles"] || "C:\\Program Files";
    const programFilesX86 = process.env["ProgramFiles(x86)"] || "C:\\Program Files (x86)";
    const localAppData = process.env["LOCALAPPDATA"] || "";

    candidates.push(
      path.join(programFiles, "Google\\Chrome\\Application\\chrome.exe"),
      path.join(programFilesX86, "Google\\Chrome\\Application\\chrome.exe"),
      path.join(programFilesX86, "Microsoft\\Edge\\Application\\msedge.exe"),
      path.join(programFiles, "Microsoft\\Edge\\Application\\msedge.exe"),
      path.join(localAppData, "Google\\Chrome\\Application\\chrome.exe")
    );
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  // Fallback to checking PATH via 'which' or 'where'
  const lookupCmd = platform === "win32" ? "where" : "which";
  const binaryNames = platform === "win32" 
    ? ["chrome.exe", "msedge.exe"] 
    : ["google-chrome-stable", "google-chrome", "chromium-browser", "chromium", "microsoft-edge-stable"];

  for (const name of binaryNames) {
    const res = spawnSync(lookupCmd, [name], { encoding: "utf8" });
    if (res.status === 0 && res.stdout.trim()) {
      const foundPath = res.stdout.split(/\r?\n/)[0].trim();
      if (fs.existsSync(foundPath)) {
        return foundPath;
      }
    }
  }

  return null;
}

function getFormattedTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

function deriveWebName(urlStr, customName) {
  if (customName) {
    return customName.replace(/[^a-zA-Z0-9_-]/g, "_");
  }

  try {
    const parsed = new URL(urlStr);
    let host = parsed.hostname;
    if (parsed.port) {
      host += `_${parsed.port}`;
    }
    let pathname = parsed.pathname.replace(/^\/+|\/+$/g, "").replace(/\//g, "_");
    let name = pathname ? `${host}_${pathname}` : host;
    name = name.replace(/[^a-zA-Z0-9._-]/g, "_");
    return name || "webpage";
  } catch {
    return urlStr.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 50) || "webpage";
  }
}

function downloadPage(browserPath, targetUrl, outputDir, customName, waitMs, timeoutMs) {
  const webName = deriveWebName(targetUrl, customName);
  const timestamp = getFormattedTimestamp();
  const filename = `${webName}_${timestamp}.html`;
  const outputPath = path.resolve(outputDir, filename);

  const args = [
    "--headless=new",
    "--dump-dom",
    "--disable-gpu",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--ignore-certificate-errors",
    "--allow-insecure-localhost",
    `--virtual-time-budget=${waitMs}`,
    "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    targetUrl,
  ];

  const result = spawnSync(browserPath, args, {
    encoding: "utf8",
    timeout: timeoutMs,
    maxBuffer: 50 * 1024 * 1024, // 50MB
  });

  if (result.error) {
    throw new Error(`Failed to execute browser process: ${result.error.message}`);
  }

  if (result.status !== 0) {
    const errorDetail = result.stderr ? result.stderr.trim() : `Process exited with code ${result.status}`;
    throw new Error(`Browser failed to render ${targetUrl}: ${errorDetail}`);
  }

  const html = result.stdout;
  if (!html || html.trim().length === 0) {
    throw new Error(`Rendered HTML for ${targetUrl} was empty.`);
  }

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, html, "utf8");

  return {
    url: targetUrl,
    outputPath,
    filename,
    sizeBytes: Buffer.byteLength(html, "utf8"),
    timestamp,
  };
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log("Usage: node download.mjs <url1> [url2 ...] [options]");
    console.log("");
    console.log("Options:");
    console.log("  --out-dir <dir>    Destination directory (default: <cwd>/data/webs)");
    console.log("  --name <name>      Custom name prefix (for single URL download)");
    console.log("  --wait <ms>        Render wait budget in milliseconds (default: 5000)");
    console.log("  --timeout <ms>     Process timeout in milliseconds (default: 30000)");
    process.exit(args.length === 0 ? 1 : 0);
  }

  let outDir = path.resolve(process.cwd(), "data", "webs");
  let customName = null;
  let waitMs = DEFAULT_WAIT_MS;
  let timeoutMs = DEFAULT_TIMEOUT_MS;
  const urls = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--out-dir" && i + 1 < args.length) {
      outDir = path.resolve(args[++i]);
    } else if (arg === "--name" && i + 1 < args.length) {
      customName = args[++i];
    } else if (arg === "--wait" && i + 1 < args.length) {
      waitMs = parseInt(args[++i], 10) || DEFAULT_WAIT_MS;
    } else if (arg === "--timeout" && i + 1 < args.length) {
      timeoutMs = parseInt(args[++i], 10) || DEFAULT_TIMEOUT_MS;
    } else if (!arg.startsWith("--")) {
      urls.push(arg);
    }
  }

  if (urls.length === 0) {
    console.error("Error: No URLs provided.");
    process.exit(1);
  }

  const browserPath = findBrowserBinary();
  if (!browserPath) {
    console.error("Error: Could not locate a compatible Chromium/Chrome/Edge browser binary on this system.");
    process.exit(1);
  }

  console.log(`Using browser: ${browserPath}`);
  console.log(`Target directory: ${outDir}`);

  const results = [];
  let hasError = false;

  for (const url of urls) {
    console.log(`Rendering: ${url} ...`);
    try {
      const res = downloadPage(
        browserPath,
        url,
        outDir,
        urls.length === 1 ? customName : null,
        waitMs,
        timeoutMs
      );
      console.log(`Saved: ${res.outputPath} (${(res.sizeBytes / 1024).toFixed(1)} KB)`);
      results.push(res);
    } catch (err) {
      console.error(`Failed to download ${url}: ${err.message}`);
      hasError = true;
    }
  }

  if (hasError && results.length === 0) {
    process.exit(1);
  }
}

main();
