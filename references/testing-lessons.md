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
