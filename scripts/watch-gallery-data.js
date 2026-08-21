#!/usr/bin/env node
/**
 * Watches gallery asset folders and regenerates gallery-data.js when they change.
 * Run with: node scripts/watch-gallery-data.js
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const ROOT = path.join(__dirname, "..");
const WATCH_PATHS = [
  path.join(ROOT, "assets", "images"),
  path.join(ROOT, "assets", "videos"),
];
const GENERATOR = path.join(__dirname, "generate-gallery-data.js");

let timer;
let running = false;
let pending = false;

function regenerate() {
  if (running) {
    pending = true;
    return;
  }

  running = true;
  const child = spawn(process.execPath, [GENERATOR], {
    cwd: ROOT,
    stdio: "inherit",
  });

  child.on("close", (code) => {
    running = false;
    if (code !== 0) process.exitCode = code;
    if (pending) {
      pending = false;
      regenerate();
    }
  });
}

function scheduleRegeneration() {
  clearTimeout(timer);
  timer = setTimeout(regenerate, 250);
}

for (const watchPath of WATCH_PATHS) {
  fs.watch(watchPath, { recursive: true }, (eventType, filename) => {
    if (filename) {
      console.log(`[gallery] ${eventType}: ${filename}`);
      scheduleRegeneration();
    }
  });
}

regenerate();
console.log("Watching gallery images, videos, and thumbnails...");
