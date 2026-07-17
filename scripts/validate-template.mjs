import fs from "node:fs";

const checks = [];

function check(name, condition) {
  checks.push({ name, condition: Boolean(condition) });
}

function read(path) {
  return fs.readFileSync(path, "utf8");
}

function compileScript(path, html) {
  const match = html.match(/<script>([\s\S]*)<\/script>/);
  if (!match) throw new Error(`${path}: missing script block`);
  new Function(match[1]);
}

const templatePath = "assets/template.html";
const demoPath = "projects/xiaoliang-3x4-cards-demo/index.html";
const template = read(templatePath);
const demo = read(demoPath);

compileScript(templatePath, template);
compileScript(demoPath, demo);

check("template defaults to aspect-16x9", template.includes('class="style-xiaoliang-lab aspect-16x9"'));
check("template supports mode=cards", template.includes('params.get("mode") === "cards"'));
check("template supports aspect=3x4", template.includes('params.get("aspect") === "3x4"'));
check("template supports rounded style preview", template.includes('styleParam === "rounded"'));
check("template supports bold style preview", template.includes('styleParam === "bold"'));
check("template preserves query string when updating hash", template.includes("${location.pathname}${location.search}#/"));
check("template has coverVertical layout", template.includes('s.layout === "coverVertical"'));
check("template has quoteCard layout", template.includes('s.layout === "quoteCard"'));
check("template has stackedImage layout", template.includes('s.layout === "stackedImage"'));
check("template has verticalSteps layout", template.includes('s.layout === "verticalSteps"'));
check("template has hover zoom binding", template.includes("function bindImageZoom()"));
check("template bounds cards zoom to slide", template.includes("zoomViewer.classList.toggle(\"slide-bound\", isCards)") && template.includes("--zoom-width"));
check("template escapes card text", template.includes("${escapeHTML(card[0])}") && template.includes("${escapeHTML(card[1])}"));
check("template escapes step text", template.includes("${escapeHTML(step[0])}") && template.includes("${escapeHTML(step[1])}"));
check("demo uses coverVertical layout", demo.includes('layout: "coverVertical"'));
check("demo uses quoteCard layout", demo.includes('layout: "quoteCard"'));
check("demo uses stackedImage layout", demo.includes('layout: "stackedImage"'));
check("demo uses verticalSteps layout", demo.includes('layout: "verticalSteps"'));
check("demo has hover zoom binding", demo.includes("function bindImageZoom()"));
check("demo bounds cards zoom to slide", demo.includes("zoomViewer.classList.add(\"slide-bound\")") && demo.includes("--zoom-width"));
check("demo preserves query string when updating hash", demo.includes("${location.pathname}${location.search}#/"));

const failed = checks.filter(item => !item.condition);

for (const item of checks) {
  console.log(`${item.condition ? "PASS" : "FAIL"} ${item.name}`);
}

if (failed.length) {
  console.error(`\n${failed.length} validation check(s) failed.`);
  process.exit(1);
}

console.log(`\n${checks.length} validation checks passed.`);
