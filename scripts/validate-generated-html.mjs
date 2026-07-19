import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const args = process.argv.slice(2);
const htmlFile = args[0];

function argValue(name, fallback = "") {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
}

const mode = argValue("--mode", "deck");
const minSlides = Number(argValue("--min-slides", mode === "cards" ? "8" : "20"));

if (!htmlFile) {
  console.error("Usage: node scripts/validate-generated-html.mjs <html-file> --mode deck|cards --min-slides <n>");
  process.exit(1);
}

const htmlPath = path.resolve(htmlFile);
const root = path.dirname(htmlPath);
const html = fs.readFileSync(htmlPath, "utf8");
const checks = [];

function check(name, condition) {
  checks.push({ name, condition: Boolean(condition) });
}

function extractSlideArrays() {
  const markerStart = html.indexOf("// __SLIDE_DATA_START__");
  const markerEnd = html.indexOf("// __SLIDE_DATA_END__");
  const fallbackStart = html.indexOf("const deckSlides =");
  const fallbackEnd = html.indexOf("const params = new URLSearchParams(location.search);");
  const start = markerStart >= 0 ? markerStart : fallbackStart;
  const end = markerEnd >= 0 ? markerEnd : fallbackEnd;
  if (start < 0 || end < 0 || end <= start) {
    throw new Error("Cannot locate slide data block.");
  }
  const source = `${html.slice(start, end)}
result = { deckSlides, cardSlides };`;
  const sandbox = { result: null };
  vm.runInNewContext(source, sandbox, { timeout: 1000 });
  return sandbox.result;
}

let deckSlides = [];
let cardSlides = [];
try {
  ({ deckSlides = [], cardSlides = [] } = extractSlideArrays());
} catch (error) {
  console.error(error.message);
}

const slides = mode === "cards" ? cardSlides : deckSlides;
const images = [...new Set(slides.flatMap(slide => {
  const direct = slide.image ? [slide.image] : [];
  const multi = Array.isArray(slide.images) ? slide.images.map(item => item.src || item.image).filter(Boolean) : [];
  return [...direct, ...multi];
}))];
const missingImages = images.filter(imagePath => !fs.existsSync(path.join(root, imagePath)));

check("html file exists", fs.existsSync(htmlPath));
check("mode is deck or cards", mode === "deck" || mode === "cards");
check("body aspect matches mode", mode === "cards" ? html.includes("aspect-3x4") : html.includes("aspect-16x9"));
check("slide count meets minimum", slides.length >= minSlides);
check("uses expected slide array", mode === "cards" ? cardSlides.length > 0 : deckSlides.length > 0);
check("all referenced images exist", missingImages.length === 0);
check("has keyboard navigation", html.includes('event.key === "ArrowRight"') && html.includes('event.key === "PageDown"'));
check("has wheel navigation", html.includes('document.addEventListener("wheel"'));
check("has overview mode", html.includes("function renderOverview()"));
check("has hover zoom", html.includes("function bindImageZoom()"));
check("has hash deep links", html.includes("readHashIndex()") && html.includes("hashchange"));

for (const item of checks) {
  console.log(`${item.condition ? "PASS" : "FAIL"} ${item.name}`);
}

console.log(`\nmode=${mode}`);
console.log(`slides=${slides.length}`);
console.log(`images=${images.length}`);
if (missingImages.length) {
  console.log(`missingImages=${JSON.stringify(missingImages, null, 2)}`);
}

const failed = checks.filter(item => !item.condition);
if (failed.length) {
  console.error(`\n${failed.length} validation check(s) failed.`);
  process.exit(1);
}

console.log("\nGenerated HTML static validation passed.");
