# 交互模式

除非项目已经使用现成幻灯片框架，否则使用原生 JavaScript 实现交互。

## 翻页导航

必须支持：

- `ArrowRight`、空格、`PageDown`：下一页。
- `ArrowLeft`、`PageUp`：上一页。
- `Home` / `End`：第一页 / 最后一页。
- `O`：打开或关闭概览。
- `F`：进入全屏。
- `Esc`：关闭概览和图片放大。
- Hash 深链：`#/1`、`#/2`。
- 鼠标滚轮翻页，并做节流。
- 触摸屏或触控板上的横向滑动翻页。

参考实现：

```js
let lastWheelAt = 0;
document.addEventListener("wheel", event => {
  if (overview.classList.contains("open") || zoomViewer.classList.contains("open")) return;
  const now = Date.now();
  if (now - lastWheelAt < 520 || Math.abs(event.deltaY) < 18) return;
  lastWheelAt = now;
  go(index + (event.deltaY > 0 ? 1 : -1));
}, { passive: true });
```

这些交互同时适用于 `deck` 16:9 和 `cards` 3:4。切换比例时，不能丢掉导航、概览、hash 深链或图片悬停放大。

当图片放大层打开时，滚轮和滑动不应继续翻页；导航到其它页时应自动关闭图片放大层。

模板允许通过 URL 参数切换输出模式：

- `?mode=cards` 或 `?aspect=3x4`：使用 3:4 图文卡片。
- `?mode=deck` 或 `?aspect=16x9`：使用 16:9 横版课件。

不要加入 `?style=` 参数。公开版只支持小亮实验室风格。

## 图片悬停放大

图片放大使用 overlay。鼠标移入原图时打开，打开后由放大卡片本身控制保持和关闭，而不是由原缩略图控制。

`cards` 模式下，overlay 必须被限制在当前 3:4 页面矩形内。这样录屏或导出时，放大截图不会超过竖版画布边界。

必需行为：

- 鼠标移入原图：打开 overlay。
- 鼠标在放大卡片内：保持打开。
- `cards` 模式：放大预览限制在当前 3:4 页面内。
- 鼠标离开放大卡片：短暂延迟后关闭。
- 点击 overlay 或按 `Esc`：关闭。
- 使用透明度和缩放过渡。

CSS 参考：

```css
.zoom-viewer {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  padding: 34px;
  background: rgba(32, 27, 23, .42);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity .16s ease, visibility .16s ease;
}
.zoom-viewer.slide-bound {
  inset: auto;
  left: var(--zoom-left, 0px);
  top: var(--zoom-top, 0px);
  width: var(--zoom-width, 100vw);
  height: var(--zoom-height, 100vh);
  padding: 24px;
  border-radius: 24px;
  overflow: hidden;
}
.zoom-viewer.open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}
```

JS 参考：

```js
function applyZoomBounds() {
  const isCards = document.body.classList.contains("aspect-3x4");
  zoomViewer.classList.toggle("slide-bound", isCards);
  if (!isCards) return;
  const rect = slideEls[index].getBoundingClientRect();
  zoomViewer.style.setProperty("--zoom-left", `${rect.left}px`);
  zoomViewer.style.setProperty("--zoom-top", `${rect.top}px`);
  zoomViewer.style.setProperty("--zoom-width", `${rect.width}px`);
  zoomViewer.style.setProperty("--zoom-height", `${rect.height}px`);
}
```

## 概览模式

概览模式应该为每页生成一个缩略按钮，包含页码和标题。点击缩略按钮后关闭概览，并跳到对应页面。

参考实现：

```js
overview.innerHTML = slides.map((slide, i) => `
  <button class="overview-card" type="button" data-index="${i}">
    <b>${i + 1}</b>
    <span>${slide.title || slide.headline || `第 ${i + 1} 页`}</span>
  </button>
`).join("");
```

概览不能是空遮罩。

## Hash 深链

Hash 深链是模板契约的一部分。加载时解析 `#/12`，并激活对应页面。也要监听 `hashchange`，让复制出来的链接在录屏和 review 时可用。

`cards` 模式也需要 hash，因为它方便定位某一张待导出的图文卡片。

## 导出图片注意事项

模板仍然首先是 HTML 幻灯片。如果之后把 `cards` 导出为 PNG，应复用同一套 slide DOM，一次截取一张 active slide。不要把 `cards` 另做成长图页面。

## 验证

浏览器检查：

- 所有图片 `naturalWidth > 0`。
- 每页都能通过 hash 正确激活。
- `aspect-16x9` 和 `aspect-3x4` 都保留导航能力。
- 鼠标滚轮每次意图滚动只翻一页。
- 悬停图片会打开 zoom。
- 鼠标移动到放大图边缘时保持打开。
- 鼠标离开放大卡片后关闭。
- `cards` 模式下，zoom 有 `.slide-bound`，并且边界匹配当前 3:4 页面。
