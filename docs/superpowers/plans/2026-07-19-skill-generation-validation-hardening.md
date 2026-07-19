# Skill Generation Validation Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden `xiaoliang-html-ppt-skill` so future 16:9 decks and 3:4 cards can be generated from the template, statically validated, and browser-checked without repeating the fragile issues found during the July 19 article test.

**Architecture:** Add explicit slide-data anchors to the HTML template, then add repository-local validation scripts that inspect generated HTML by executing the slide data in a sandboxed way instead of relying on brittle ad hoc regexes. Keep browser validation optional and dependency-light by using an installed Chrome/Edge executable when Playwright browsers are not installed.

**Tech Stack:** Single-file HTML template, vanilla JavaScript, Node.js ESM scripts, optional Playwright package with system Chrome/Edge fallback, existing `quick_validate.py`, existing `scripts/validate-template.mjs`.

## Global Constraints

- Keep the public Skill single-style only: 小亮实验室.
- Do not reintroduce alternate visual styles, style query parameters, or hidden preset variants.
- Preserve both output modes: `deck` 16:9 and `cards` 3:4.
- Preserve keyboard, wheel, overview, fullscreen, hash deep links, pointer swipe, and hover zoom.
- Keep generated HTML self-contained except for local relative image paths.
- Prefer repository-local scripts over copying one-off article test scripts into user output folders.
- Validation scripts must work on Windows paths with Chinese characters.

---

### Task 1: Add Stable Slide-Data Anchors To The Template

**Files:**
- Modify: `assets/template.html`
- Modify: `scripts/validate-template.mjs`

**Interfaces:**
- Produces: Two exact marker comments in the template: `// __SLIDE_DATA_START__` and `// __SLIDE_DATA_END__`.
- Produces: A stable replaceable block containing only `const deckSlides = [...]` and `const cardSlides = [...]`.
- Consumes: Existing template variables `deckSlides`, `cardSlides`, `params`, and `slides`.

- [ ] **Step 1: Add slide-data markers around the template sample data**

Modify `assets/template.html` so the data block starts exactly like this:

```js
// __SLIDE_DATA_START__
const deckSlides = [
```

and ends exactly like this before URL parameter handling:

```js
const cardSlides = [
  ...
];
// __SLIDE_DATA_END__
const params = new URLSearchParams(location.search);
```

- [ ] **Step 2: Add template validation checks for the markers**

In `scripts/validate-template.mjs`, add:

```js
check("template has slide data start marker", template.includes("// __SLIDE_DATA_START__"));
check("template has slide data end marker", template.includes("// __SLIDE_DATA_END__"));
check("template marker order is valid", template.indexOf("// __SLIDE_DATA_START__") < template.indexOf("// __SLIDE_DATA_END__"));
```

- [ ] **Step 3: Run template validation**

Run:

```powershell
node scripts\validate-template.mjs
```

Expected: all existing checks pass plus the new marker checks.

- [ ] **Step 4: Commit**

```powershell
git add assets/template.html scripts/validate-template.mjs
git commit -m "Add stable slide data anchors"
```

### Task 2: Add A Generic Static Generated-HTML Validator

**Files:**
- Create: `scripts/validate-generated-html.mjs`
- Modify: `README.md`
- Modify: `SKILL.md`
- Modify: `references/authoring-workflow.md`

**Interfaces:**
- Produces CLI: `node scripts/validate-generated-html.mjs <html-file> --mode deck --min-slides 20`
- Produces CLI: `node scripts/validate-generated-html.mjs <html-file> --mode cards --min-slides 8`
- Output: `PASS ...` lines, then `Generated HTML static validation passed.`
- Exit code: `0` on success, `1` on validation failure.

- [ ] **Step 1: Create the validator script**

Create `scripts/validate-generated-html.mjs` with:

```js
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

function extractConstArray(name) {
  const startToken = `const ${name} = `;
  const start = html.indexOf(startToken);
  if (start < 0) return [];
  const afterStart = start + startToken.length;
  const end = html.indexOf(`;\nconst ${name === "deckSlides" ? "cardSlides" : "params"}`, afterStart);
  if (end < 0) return [];
  const source = html.slice(afterStart, end);
  return vm.runInNewContext(source, {}, { timeout: 1000 });
}

const deckSlides = extractConstArray("deckSlides");
const cardSlides = extractConstArray("cardSlides");
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
```

- [ ] **Step 2: Add README usage**

Add this under `开发与验证` in `README.md`:

```markdown
生成具体 HTML 后，可以使用通用静态验证脚本：

```powershell
node scripts\validate-generated-html.mjs <生成的HTML路径> --mode deck --min-slides 20
node scripts\validate-generated-html.mjs <生成的HTML路径> --mode cards --min-slides 8
```
```

- [ ] **Step 3: Add Skill checklist requirement**

In `SKILL.md` Done Checklist, add:

```markdown
- 已用 `scripts/validate-generated-html.mjs` 检查页数、图片路径和核心交互代码。
```

- [ ] **Step 4: Add authoring workflow verification note**

In `references/authoring-workflow.md`, add:

```markdown
生成 HTML 后先跑 `scripts/validate-generated-html.mjs`，再做浏览器检查。不要只靠肉眼确认页面存在。
```

- [ ] **Step 5: Run checks**

Run:

```powershell
node scripts\validate-template.mjs
$env:PYTHONUTF8='1'; py C:\Users\kangt\.codex\skills\.system\skill-creator\scripts\quick_validate.py .
```

Expected: template checks pass and `Skill is valid!`.

- [ ] **Step 6: Commit**

```powershell
git add scripts/validate-generated-html.mjs README.md SKILL.md references/authoring-workflow.md
git commit -m "Add generated HTML static validator"
```

### Task 3: Add Optional Browser Validation Script

**Files:**
- Create: `scripts/browser-check-generated.mjs`
- Modify: `README.md`
- Modify: `references/interactions.md`

**Interfaces:**
- Produces CLI: `node scripts/browser-check-generated.mjs <html-file> --mode deck --expected-slides 26`
- Produces CLI: `node scripts/browser-check-generated.mjs <html-file> --mode cards --expected-slides 22`
- Behavior: tries installed Chrome first, then Edge; uses Playwright package if available in local dependency resolution.
- Output: JSON report with `slideCount`, `slideRatio`, `missingImages`, `overflowingSlides`, `overviewOpen`, `zoomOpened`, and `zoomBound`.

- [ ] **Step 1: Create browser validation script**

Create `scripts/browser-check-generated.mjs` with:

```js
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
```

- [ ] **Step 2: Document browser validation**

Add to `README.md`:

```markdown
如果本机有 Playwright 包和 Chrome/Edge，可以继续做真实浏览器检查：

```powershell
node scripts\browser-check-generated.mjs <生成的HTML路径> --mode deck --expected-slides 26
node scripts\browser-check-generated.mjs <生成的HTML路径> --mode cards --expected-slides 22
```
```

- [ ] **Step 3: Update interaction verification guidance**

Add to `references/interactions.md`:

```markdown
真实浏览器检查优先使用 `scripts/browser-check-generated.mjs`。它会验证图片加载、比例、溢出、概览、hash、hover zoom；`cards` 模式还会验证 zoom 是否被限制在 3:4 页面内。
```

- [ ] **Step 4: Run checks**

Run:

```powershell
node scripts\validate-template.mjs
$env:PYTHONUTF8='1'; py C:\Users\kangt\.codex\skills\.system\skill-creator\scripts\quick_validate.py .
```

Expected: template checks pass and `Skill is valid!`.

- [ ] **Step 5: Commit**

```powershell
git add scripts/browser-check-generated.mjs README.md references/interactions.md
git commit -m "Add optional browser generated HTML check"
```

### Task 4: Document The July 19 Test Lessons In The Skill

**Files:**
- Create: `references/testing-lessons.md`
- Modify: `SKILL.md`
- Modify: `README.md`
- Modify: `scripts/validate-template.mjs`

**Interfaces:**
- Produces reference file: `references/testing-lessons.md`.
- Produces Skill instruction: read `references/testing-lessons.md` when generating or validating real decks/cards after article tests.
- Produces validation check: `README.md` and `SKILL.md` mention `testing-lessons.md`.

- [ ] **Step 1: Create lessons reference**

Create `references/testing-lessons.md` with:

```markdown
# 真实生成测试教训

## 2026-07-19：AI 时代就别再手绘框架图了

这次用同一篇文章生成了两种 HTML：

- `deck`：26 页 16:9 横版讲解课件。
- `cards`：22 张 3:4 竖版图文卡片。

## 必须保留的经验

- 单风格更稳定：公开版只使用小亮实验室。
- `cards` 不是 `deck` 的裁剪版，要重新组织成可独立阅读的卡片。
- 先做图片盘点或 contact sheet，再安排图片位置。
- 生成脚本必须使用稳定模板锚点，不要用脆弱正则替换 slide 数据。
- 静态验证脚本要理解实际生成格式，不能只猜字符串。
- 真实浏览器验证必须检查图片加载、比例、溢出、hash、overview 和 hover zoom。
- Playwright 浏览器缺失时，优先 fallback 到系统 Chrome/Edge。
- 截图预览只做辅助判断，页码、active slide 和交互状态以 DOM 验证为准。

## 生成前检查

- 已完整阅读文章。
- 已列出图片素材。
- 已决定 `deck` 或 `cards`。
- 已确认输出风格只用小亮实验室。

## 生成后检查

- 运行 `scripts/validate-generated-html.mjs`。
- 条件允许时运行 `scripts/browser-check-generated.mjs`。
- 额外导出 1-2 张预览图人工检查。
```

- [ ] **Step 2: Link lessons from Skill**

In `SKILL.md`, add `references/testing-lessons.md` to the implementation starting point:

```markdown
4. 读 `references/testing-lessons.md`。
```

Renumber the following items.

- [ ] **Step 3: Link lessons from README**

Add to `README.md` under `开发与验证`:

```markdown
真实生成遇到的问题和处理方式记录在 `references/testing-lessons.md`，后续修改 Skill 时应先读它。
```

- [ ] **Step 4: Add template validation checks**

In `scripts/validate-template.mjs`, add:

```js
const skill = read("SKILL.md");
const readme = read("README.md");
check("skill links testing lessons", skill.includes("references/testing-lessons.md"));
check("readme links testing lessons", readme.includes("references/testing-lessons.md"));
```

- [ ] **Step 5: Run checks**

Run:

```powershell
node scripts\validate-template.mjs
$env:PYTHONUTF8='1'; py C:\Users\kangt\.codex\skills\.system\skill-creator\scripts\quick_validate.py .
```

Expected: template checks pass and `Skill is valid!`.

- [ ] **Step 6: Commit**

```powershell
git add references/testing-lessons.md SKILL.md README.md scripts/validate-template.mjs
git commit -m "Document real generation testing lessons"
```

## Final Verification

Run:

```powershell
node scripts\validate-template.mjs
$env:PYTHONUTF8='1'; py C:\Users\kangt\.codex\skills\.system\skill-creator\scripts\quick_validate.py .
git status --short --branch
```

Expected:

- Template validation passes.
- Skill validation reports `Skill is valid!`.
- Working tree is clean after commits.

## Self-Review

- Spec coverage: Tasks cover stable template replacement, generated HTML static validation, browser validation, and real-test lesson documentation.
- Placeholder scan: No `TBD`, `TODO`, or unspecified implementation steps remain.
- Type consistency: Script CLIs consistently use `<html-file> --mode deck|cards`; browser validation uses `--expected-slides`; static validation uses `--min-slides`.
