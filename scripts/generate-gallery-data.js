#!/usr/bin/env node
/**
 * Scans assets/images/* and assets/videos/* and regenerates gallery-data.js,
 * which the gallery page renders itself from (see script.js -> renderGallery()).
 *
 * Add or remove photos/videos in the asset folders, then push - the GitHub
 * Action in .github/workflows/update-gallery.yml runs this automatically and
 * commits the updated gallery-data.js. No manual HTML editing needed.
 *
 * Run locally with: node scripts/generate-gallery-data.js
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const IMAGES_DIR = path.join(ROOT, "assets", "images");
const VIDEOS_DIR = path.join(ROOT, "assets", "videos");
const THUMBS_DIR = path.join(VIDEOS_DIR, "thumbnail");
const OUTPUT_FILE = path.join(ROOT, "gallery-data.js");

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const VIDEO_EXTENSIONS = [".mp4"];
const THUMB_EXTENSIONS = [".png", ".jpg", ".jpeg"];

// Folders under assets/images/ that are NOT gallery photos (site chrome, etc.)
const EXCLUDED_IMAGE_FOLDERS = new Set(["hero"]);

// Folders shown first, in this exact order. Anything else is appended
// after these, sorted alphabetically.
const PRIORITY_FOLDERS = ["GeneralPhotos"];

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function humanizeFolderName(name) {
  if (name === "GeneralPhotos") return "General photo";
  const spaced = name.replace(/([a-z0-9])([A-Z])/g, "$1 $2").trim();
  return `${spaced} catering photo`;
}

function listImageFolders() {
  if (!fs.existsSync(IMAGES_DIR)) return [];
  const entries = fs
    .readdirSync(IMAGES_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !EXCLUDED_IMAGE_FOLDERS.has(e.name))
    .map((e) => e.name);

  const priority = PRIORITY_FOLDERS.filter((f) => entries.includes(f));
  const rest = entries
    .filter((f) => !PRIORITY_FOLDERS.includes(f))
    .sort(naturalSort);
  return [...priority, ...rest];
}

function buildImageItems() {
  const items = [];
  for (const folder of listImageFolders()) {
    const folderPath = path.join(IMAGES_DIR, folder);
    const files = fs
      .readdirSync(folderPath)
      .filter((f) => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()))
      .sort(naturalSort);

    const label = humanizeFolderName(folder);
    files.forEach((file, idx) => {
      items.push({
        type: "image",
        src: `assets/images/${folder}/${file}`,
        alt: `${label} ${idx + 1}`,
      });
    });
  }
  return items;
}

function buildVideoItems() {
  if (!fs.existsSync(VIDEOS_DIR)) return [];
  const videoFiles = fs
    .readdirSync(VIDEOS_DIR, { withFileTypes: true })
    .filter(
      (e) =>
        e.isFile() && VIDEO_EXTENSIONS.includes(path.extname(e.name).toLowerCase())
    )
    .map((e) => e.name)
    .sort(naturalSort);

  const items = [];
  for (const file of videoFiles) {
    const base = path.basename(file, path.extname(file));
    const thumbFile = THUMB_EXTENSIONS.map((ext) => `${base}${ext}`).find(
      (name) => fs.existsSync(path.join(THUMBS_DIR, name))
    );

    if (!thumbFile) {
      console.warn(
        `Skipping "assets/videos/${file}" - no matching thumbnail in assets/videos/thumbnail/ (add "${base}.png" to include it).`
      );
      continue;
    }

    items.push({
      type: "video",
      src: `assets/videos/${file}`,
      previewSrc: `assets/videos/thumbnail/${thumbFile}`,
      alt: "Video preview",
    });
  }
  return items;
}

function main() {
  const items = [...buildImageItems(), ...buildVideoItems()];

  const banner = `// AUTO-GENERATED FILE - do not edit by hand.
// Regenerated automatically by .github/workflows/update-gallery.yml whenever
// files change under assets/images/ or assets/videos/.
// To regenerate locally: node scripts/generate-gallery-data.js
`;

  const content = `${banner}window.FLAVOURFEAST_GALLERY_ITEMS = ${JSON.stringify(
    items,
    null,
    2
  )};\n`;

  fs.writeFileSync(OUTPUT_FILE, content, "utf8");
  console.log(`Wrote ${items.length} gallery items to ${path.relative(ROOT, OUTPUT_FILE)}`);
}

main();
