# Interaction Pattern

Implement interactions in plain JavaScript unless the repo already uses a slide framework.

## Navigation

Support:

- ArrowRight, Space, PageDown: next slide.
- ArrowLeft, PageUp: previous slide.
- Home/End: first/last slide.
- `O`: overview grid.
- `F`: fullscreen.
- `Esc`: close overview and zoom.
- Hash links: `#/1`, `#/2`, etc.
- Mouse wheel with throttling:

```js
let lastWheelAt = 0;
document.addEventListener("wheel", event => {
  if (overview.classList.contains("open")) return;
  const now = Date.now();
  if (now - lastWheelAt < 520 || Math.abs(event.deltaY) < 18) return;
  lastWheelAt = now;
  go(index + (event.deltaY > 0 ? 1 : -1));
}, { passive: true });
```

These interactions apply to both `deck` 16:9 mode and `cards` 3:4 mode. Do not remove navigation, overview, hash links, or hover zoom when switching aspect ratio.

The bundled template may also switch preview mode from URL parameters:

- `?mode=cards` or `?aspect=3x4`: use 3:4 `cards`.
- `?mode=deck` or `?aspect=16x9`: use 16:9 `deck`.
- `?style=rounded` or `?style=rounded-memphis`: preview rounded Memphis.
- `?style=bold` or `?style=bold-memphis`: preview bold Memphis.

## Image Hover Zoom

Use an overlay that opens when hovering the original image, then keeps the open/close boundary on the enlarged card, not on the original thumbnail.

For 3:4 `cards`, the overlay must be bounded to the active slide rectangle. This is required for Xiaohongshu-style recording: the enlarged image cannot exceed the 3:4 canvas, otherwise the screen recording will crop useful content.

Required behavior:

- Enter original image: open zoom overlay.
- Move within enlarged card: stay open.
- In `cards` mode: enlarged preview stays inside the active 3:4 slide frame.
- Leave enlarged card: close after a short delay.
- Click overlay or press Esc: close.
- Use fade/scale transition.

CSS:

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
.zoom-frame {
  max-width: min(94vw, 1500px);
  max-height: 88vh;
  padding: 14px;
  border: var(--line);
  border-radius: 22px;
  background: #fffdf4;
  box-shadow: 12px 12px 0 var(--ink);
  opacity: 0;
  transform: rotate(-.4deg) scale(.965);
  transition: opacity .16s ease, transform .18s cubic-bezier(.2, .8, .2, 1);
}
.zoom-viewer.slide-bound .zoom-frame {
  max-width: calc(var(--zoom-width, 100vw) - 64px);
  max-height: calc(var(--zoom-height, 100vh) - 64px);
}
.zoom-viewer.open .zoom-frame {
  opacity: 1;
  transform: rotate(-.4deg) scale(1);
}
.zoom-frame img {
  display: block;
  max-width: calc(94vw - 42px);
  max-height: calc(88vh - 42px);
  object-fit: contain;
}
.zoom-viewer.slide-bound .zoom-frame img {
  max-width: calc(var(--zoom-width, 100vw) - 106px);
  max-height: calc(var(--zoom-height, 100vh) - 106px);
}
```

JS:

```js
const zoomViewer = document.querySelector("#zoomViewer");
const zoomImage = document.querySelector("#zoomImage");
const zoomFrame = document.querySelector(".zoom-frame");
let zoomCloseTimer = 0;

function bindImageZoom() {
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
  document.querySelectorAll(".shot img").forEach(image => {
    image.addEventListener("mouseenter", () => {
      clearTimeout(zoomCloseTimer);
      applyZoomBounds();
      zoomImage.src = image.currentSrc || image.src;
      zoomViewer.classList.add("open");
      zoomViewer.setAttribute("aria-hidden", "false");
    });
  });
  zoomFrame.addEventListener("mouseenter", () => clearTimeout(zoomCloseTimer));
  zoomViewer.addEventListener("mousemove", event => {
    if (zoomViewer.classList.contains("open") && !zoomFrame.contains(event.target)) {
      clearTimeout(zoomCloseTimer);
      zoomCloseTimer = setTimeout(() => {
        zoomViewer.classList.remove("open");
        zoomViewer.setAttribute("aria-hidden", "true");
      }, 110);
    }
  });
  zoomViewer.addEventListener("click", () => {
    clearTimeout(zoomCloseTimer);
    zoomViewer.classList.remove("open");
    zoomViewer.setAttribute("aria-hidden", "true");
  });
}
```

## Overview

Overview should show one thumbnail button per slide with page number and title. Clicking a thumbnail should close overview and navigate to the slide.

The bundled template should build these buttons from `slides` after rendering:

```js
overview.innerHTML = slides.map((slide, i) => `
  <button class="overview-card" type="button" data-index="${i}">
    <b>${i + 1}</b>
    <span>${slide.title || slide.headline || `Slide ${i + 1}`}</span>
  </button>
`).join("");
```

Each button should call `go(i)` and close overview. Overview must not be an empty overlay.

## Hash Links

Hash deep links are part of the deck contract. On load, parse `location.hash` values like `#/12` and activate that slide. Also listen for `hashchange` so copied links work during recording and review.

For `cards`, hash links are useful when reviewing a specific graphic card before exporting images.

## Image Export Consideration

The template is still an HTML slideshow first. If exporting `cards` to PNG later, preserve the same slide DOM and capture one active slide at a time. Do not redesign the `cards` mode as a separate static long page.

## Verification

Browser-check:

- All images have `naturalWidth > 0`.
- Each slide activates correctly through hash navigation.
- Both `aspect-16x9` and `aspect-3x4` preserve navigation behavior.
- Wheel changes slide once per intentional scroll.
- Hovering an image opens zoom; moving to enlarged edge keeps it open; moving outside enlarged card closes it.
- In `cards`, opened zoom has `.slide-bound` and its bounding box matches the active 3:4 slide.
