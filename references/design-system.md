# Xiaoliang PPT Design System

## Visual Intent

The deck should feel like a creator's practical experiment notebook. It is warm, hand-drawn, clear, and slightly playful, but still dense enough for teaching. Avoid the feeling of a generic AI startup template.

## Palette

Use CSS variables close to:

```css
:root {
  --paper: #fff4dc;
  --paper-soft: #fff9ea;
  --ink: #201b17;
  --muted: #685f55;
  --tomato: #f35b3f;
  --mustard: #f2c84b;
  --mint: #8bd6af;
  --sky: #93c9d8;
  --peach: #f3ad83;
  --green: #a9d66f;
  --line: 4px solid var(--ink);
  --shadow: 9px 9px 0 var(--ink);
}
```

Dominant backgrounds should be warm paper, not blue, purple, black, or glassy gradients. Dark UI screenshots can appear inside framed image cards, but the slide theme should remain warm.

## Slide Stage

Use a centered 16:9 slide:

```css
.deck { width: 100vw; height: 100vh; display: grid; place-items: center; }
.slide {
  width: min(calc(100vw - 44px), calc((100vh - 44px) * 16 / 9));
  aspect-ratio: 16 / 9;
  border: var(--line);
  border-radius: 24px;
  box-shadow: var(--shadow);
  background: notebook-grid over var(--paper-soft);
}
```

Keep a thin progress bar outside or near the bottom of the stage.

## Typography

- Use system Chinese sans fonts: Microsoft YaHei, PingFang SC, Noto Sans CJK SC, Arial.
- Hero/major slide titles: 52-78px.
- Standard titles: 44-58px.
- Body/lead: 21-28px.
- Card text: 17-24px.
- Use 0 letter spacing.
- Emphasize with tomato red and underline highlight, not gradients.

## Components

Use these recurring pieces:

- `pin`: small rotated section label at top-left.
- `mark`: mint pill tag for the slide role.
- `card`: white/warm paper card with 3px ink border and offset shadow.
- `check`: checklist row with green circle check.
- `step`: numbered operation card.
- `shot`: image/screenshot card with ink border, white matte, offset shadow, caption sticker.
- `caption`: tomato sticker label naming what the audience should inspect.

Avoid cards inside cards unless it is a meaningful screenshot frame.

## Image Strategy

Use image types intentionally:

- Cover/concept illustrations: big visual signal for section openers.
- Real UI screenshots: operation evidence, should be large enough to read.
- Detail screenshots: pair with a short explanation; use full-width or tall layouts.
- Diagrams: use for mental models and recap.

Rules:

- UI screenshots with small text should usually occupy 45-60% of the slide.
- Two-image layouts should stack vertically if side-by-side makes text unreadable.
- Every screenshot should have a caption sticker naming the UI target.
- Hover zoom is required for screenshots.

## Layout Patterns

Default patterns:

- `image`: text left, image right.
- `imageWide`: text left, large screenshot right.
- `duo`: text/checklist left, two stacked images right.
- `text`: title plus cards/checklist.
- `steps`: numbered action cards.

Do not overuse centered title-only pages; this style works best when each slide teaches something concrete.
