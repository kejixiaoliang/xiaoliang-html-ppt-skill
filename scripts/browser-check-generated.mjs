import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import Module from "node:module";
import { createRequire } from "node:module";

const args = process.argv.slice(2);
const htmlFile = args[0];

function argValue(name, fallback = "") {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
}

if (!htmlFile) {
  console.error("Usage: node scripts/browser-check-generated.mjs <html-file> --mode deck|cards --expected-slides <n>");
  process.exit(1);
}

const mode = argValue("--mode", "deck");
const expectedSlides = Number(argValue("--expected-slides", "0"));
const htmlPath = path.resolve(htmlFile);
const url = pathToFileURL(htmlPath).href;

process.env.NODE_PATH = [
  process.env.NODE_PATH || "",
  path.resolve("node_modules"),
  "C:\\Users\\kangt\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules",
  "C:\\Users\\kangt\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules\\.pnpm\\node_modules"
].filter(Boolean).join(";");
Module._initPaths();

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.error("Playwright package not found. Install it or run this inside Codex desktop bundled runtime.");
  process.exit(1);
}

const executableCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
];
const executablePath = executableCandidates.find(candidate => fs.existsSync(candidate));
const browser = await chromium.launch(executablePath ? { headless: true, executablePath } : { headless: true });
const viewport = mode === "cards" ? { width: 1080, height: 1440 } : { width: 1440, height: 900 };
const page = await browser.newPage({ viewport });
await page.goto(url, { waitUntil: "load" });

const report = await page.evaluate(async () => {
  const slides = [...document.querySelectorAll(".slide")];
  const active = document.querySelector(".slide.active");
  const images = [...document.querySelectorAll(".shot img")];
  await Promise.all(images.map(image => image.complete ? true : new Promise(resolve => {
    image.addEventListener("load", resolve, { once: true });
    image.addEventListener("error", resolve, { once: true });
  })));
  const missingImages = images.filter(image => image.naturalWidth <= 0).map(image => image.getAttribute("src"));
  const slideRect = active.getBoundingClientRect();
  const overflowingSlides = slides.filter(slide => {
    const rect = slide.getBoundingClientRect();
    return slide.scrollWidth > Math.ceil(rect.width) + 2 || slide.scrollHeight > Math.ceil(rect.height) + 2;
  }).map(slide => slide.dataset.title);
  return {
    slideCount: slides.length,
    activeTitle: active?.dataset.title,
    bodyClass: document.body.className,
    slideRatio: Math.round((slideRect.width / slideRect.height) * 1000) / 1000,
    imageCount: images.length,
    missingImages,
    overflowingSlides
  };
});

await page.keyboard.press("ArrowRight");
const afterNext = await page.locator(".slide.active").getAttribute("data-title");
await page.keyboard.press("KeyO");
const overviewOpen = await page.locator("#overview.open").count() > 0;
await page.keyboard.press("Escape");

let zoomOpened = false;
let zoomBound = false;
const imageLocator = page.locator(".slide.active .shot img").first();
if (await imageLocator.count()) {
  await imageLocator.hover();
  zoomOpened = await page.locator("#zoomViewer.open").count() > 0;
  zoomBound = await page.locator("#zoomViewer.slide-bound").count() > 0;
}

await browser.close();

const fullReport = { ...report, afterNext, overviewOpen, zoomOpened, zoomBound };
console.log(JSON.stringify(fullReport, null, 2));

const expectedRatio = mode === "cards" ? 0.75 : 1.778;
const failed = [
  expectedSlides > 0 && report.slideCount !== expectedSlides,
  Math.abs(report.slideRatio - expectedRatio) > 0.02,
  report.missingImages.length > 0,
  report.overflowingSlides.length > 0,
  !afterNext,
  !overviewOpen,
  !zoomOpened,
  mode === "cards" && !zoomBound
].some(Boolean);

if (failed) process.exit(1);
