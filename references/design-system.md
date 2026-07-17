# Xiaoliang HTML PPT Design System

## Visual Intent

The deck should feel like a creator's practical experiment notebook. It is warm, hand-drawn, clear, and slightly playful, but still dense enough for teaching. Avoid the feeling of a generic AI startup template.

For selectable variants such as `圆润孟菲斯` and `粗黑孟菲斯`, first read `style-presets.md`, then adapt the tokens and components below to the selected style.

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

Use a centered slide. Default to 16:9 for `deck`; switch to 3:4 for `cards`.

```css
.deck { width: 100vw; height: 100vh; display: grid; place-items: center; }
body.aspect-16x9 .slide {
  width: min(calc(100vw - 44px), calc((100vh - 44px) * 16 / 9));
  aspect-ratio: 16 / 9;
}
body.aspect-3x4 .slide {
  width: min(calc(100vw - 44px), calc((100vh - 44px) * 3 / 4));
  aspect-ratio: 3 / 4;
}
.slide {
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

For `cards`, use slightly tighter vertical typography:

- Cover titles: 50-68px.
- Standard card titles: 38-52px.
- Body/lead: 20-26px.
- Card text: 17-22px.
- Keep titles to 2-3 lines whenever possible.

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
- Screenshot frames must wrap the image's natural aspect ratio. Do not force `height: 100%`, fixed image heights, or large empty matte areas above/below the screenshot.
- Use `width: 100%; height: auto; max-height: ...; object-fit: contain;` for screenshot images, and let the `.shot` card size itself from the rendered image.
- If a screenshot is very wide or very tall, choose a slide layout that gives it enough width/height instead of stretching a fixed frame.
- Two-image layouts should stack vertically if side-by-side makes text unreadable.
- Every screenshot should have a caption sticker naming the UI target.
- Hover zoom is required for screenshots.
- In `cards` mode, hover zoom must be constrained to the active 3:4 slide frame. Do not let the enlarged screenshot exceed the recording canvas.

For `cards`, screenshots should usually be focused crops or a single large image. Avoid placing a full desktop screenshot beside long text in 3:4; it will become unreadable.

## Layout Patterns

Default patterns:

Deck patterns:

- `image`: text left, image right.
- `imageWide`: text left, large screenshot right.
- `duo`: text/checklist left, two stacked images right.
- `imageStep`: vertical stepper on the left, screenshot on the right. Use this instead of horizontal step cards when step titles or descriptions are long Chinese text.
- `text`: title plus cards/checklist.
- `steps`: numbered action cards.

Do not overuse centered title-only pages; this style works best when each slide teaches something concrete.

Cards patterns:

- `coverVertical`: large vertical title, short promise, optional visual near the bottom.
- `quoteCard`: one strong claim, optional supporting sentence, minimal decoration.
- `stackedImage`: text block and image stacked vertically. Use either text-first or image-first depending on the teaching path.
- `verticalSteps`: full-width vertical step rows. Keep each step short enough to scan.

For `cards`, prefer top-to-bottom composition over left/right composition. A 3:4 card should feel like a publishable image, not a squeezed landscape slide.

## Stepper Layout For "Steps + Image"

When a slide combines operation steps and a screenshot:

- Prefer a vertical stepper: one full-width row per step, number badge on the left, text on the right.
- Give the stepper column enough width for Chinese text; avoid narrow multi-column cards.
- Keep step titles to one line when possible, but allow descriptions to wrap naturally.
- Align the screenshot card to the center/right and let it wrap the original image ratio.

Recommended CSS pattern:

```css
.layout.image-step {
  grid-template-columns: minmax(460px, .9fr) minmax(560px, 1.1fr);
  align-items: center;
}
.stepper {
  display: grid;
  gap: 12px;
  margin-top: 20px;
}
.step-row {
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 12px;
  align-items: start;
  padding: 13px 15px;
  border: 3px solid var(--ink);
  border-radius: 15px;
  background: #fff;
  box-shadow: 4px 4px 0 var(--ink);
}
.step-row b { font-size: 22px; line-height: 1.2; }
.step-row p { margin-top: 5px; font-size: 17px; line-height: 1.35; }
```

Avoid:

```css
.shot img { height: 100%; }
.steps.four { grid-template-columns: repeat(4, 1fr); }
```

for dense Chinese operation steps beside screenshots.
