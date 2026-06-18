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

## Image Hover Zoom

Use an overlay that opens when hovering the original image, then keeps the open/close boundary on the enlarged card, not on the original thumbnail.

Required behavior:

- Enter original image: open zoom overlay.
- Move within enlarged card: stay open.
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
```

JS:

```js
const zoomViewer = document.querySelector("#zoomViewer");
const zoomImage = document.querySelector("#zoomImage");
const zoomFrame = document.querySelector(".zoom-frame");
let zoomCloseTimer = 0;

function bindImageZoom() {
  document.querySelectorAll(".shot img").forEach(image => {
    image.addEventListener("mouseenter", () => {
      clearTimeout(zoomCloseTimer);
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

## Verification

Browser-check:

- All images have `naturalWidth > 0`.
- Each slide activates correctly through hash navigation.
- Wheel changes slide once per intentional scroll.
- Hovering an image opens zoom; moving to enlarged edge keeps it open; moving outside enlarged card closes it.
