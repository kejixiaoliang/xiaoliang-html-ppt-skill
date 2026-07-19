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
const skill = read("SKILL.md");
const readme = read("README.md");
const removedStyleParam = "style" + "Param";
const removedStyleQuery = "params.get(" + '"style"' + ")";
const removedRoundedClass = "style-" + "roun" + "ded" + "-mem" + "phis";
const removedBoldClass = "style-" + "bo" + "ld" + "-mem" + "phis";

compileScript(templatePath, template);
compileScript(demoPath, demo);

check("template defaults to aspect-16x9", template.includes('class="style-xiaoliang-lab aspect-16x9"'));
check("skill links testing lessons", skill.includes("references/testing-lessons.md"));
check("readme links testing lessons", readme.includes("references/testing-lessons.md"));
check("template has slide data start marker", template.includes("// __SLIDE_DATA_START__"));
check("template has slide data end marker", template.includes("// __SLIDE_DATA_END__"));
check("template marker order is valid", template.indexOf("// __SLIDE_DATA_START__") < template.indexOf("// __SLIDE_DATA_END__"));
check("template supports mode=cards", template.includes('params.get("mode") === "cards"'));
check("template supports aspect=3x4", template.includes('params.get("aspect") === "3x4"'));
check("template removes alternate style query switching", !template.includes(removedStyleParam) && !template.includes(removedStyleQuery));
check("template has no alternate style classes", !template.includes(removedRoundedClass) && !template.includes(removedBoldClass));
check("template preserves query string when updating hash", template.includes("${location.pathname}${location.search}#/"));
check("template has coverVertical layout", template.includes('s.layout === "coverVertical"'));
check("template has quoteCard layout", template.includes('s.layout === "quoteCard"'));
check("template has stackedImage layout", template.includes('s.layout === "stackedImage"'));
check("template has verticalSteps layout", template.includes('s.layout === "verticalSteps"'));
check("template has hover zoom binding", template.includes("function bindImageZoom()"));
check("template bounds cards zoom to slide", template.includes("zoomViewer.classList.toggle(\"slide-bound\", isCards)") && template.includes("--zoom-width"));
check("template closes zoom before slide navigation", template.includes("function closeZoom()") && /closeZoom\(\);\r?\n  render\(\);/.test(template));
check("template blocks wheel while zoom is open", template.includes('zoomViewer.classList.contains("open")) return;'));
check("template supports pointer swipe navigation", template.includes('deck.addEventListener("pointerdown"') && template.includes('deck.addEventListener("pointerup"'));
check("template escapes card text", template.includes("${escapeHTML(card[0])}") && template.includes("${escapeHTML(card[1])}"));
check("template escapes step text", template.includes("${escapeHTML(step[0])}") && template.includes("${escapeHTML(step[1])}"));
check("coverVertical has no spacer row", !template.includes("grid-template-rows: auto 1fr auto") && !template.includes("<div></div><div class=\"cover-visual\""));
check("coverVertical uses poster image treatment", template.includes(".cover-visual .shot img { height: clamp(480px, 48vh, 700px);") && template.includes("object-fit: cover"));
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
