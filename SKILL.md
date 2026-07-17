---
name: xiaoliang-html-ppt-skill
description: Create Xiaoliang-style HTML PPT decks and cards from articles, outlines, pasted long-form Chinese content, and image asset folders. Use when the user wants a warm hand-drawn AI content lab presentation, creator teaching deck, GitHub/tutorial explainer, browser-recorded 16:9 HTML slide deck, 3:4 vertical graphic cards for Xiaohongshu/WeChat/social posts, clickable/keyboard/wheel slideshow, image-heavy lecture PPT, or selectable styles such as "小亮手绘实验室", "圆润孟菲斯", or "粗黑孟菲斯" with hover-zoom screenshots and practical teaching density.
---

# Xiaoliang HTML PPT Skill

## Purpose

Turn long-form creator/tutorial content into a usable HTML PPT for either 16:9 screen-recorded teaching or 3:4 vertical graphic cards. The result should feel like a warm AI creator notebook: practical, human, image-rich, hand-drawn, and easy to narrate or read page by page.

This skill is not for generic corporate decks. It is for creator-led explainers where the audience must learn concrete concepts, interfaces, workflows, or tool usage.

## Required Workflow

1. **Read the source fully.**
   - For pasted articles, read the full file, not just the beginning.
   - Preserve the article's actual teaching depth. Do not collapse detailed writing into empty summaries.
   - Extract the real learning path: why it matters, concepts, step-by-step operations, interface walkthrough, common confusion, and final action.

2. **Inventory image assets before writing slides.**
   - List all image directories and files.
   - Make a contact sheet or inspect images one by one when the folder has many screenshots.
   - Classify each image as: cover/concept illustration, real UI screenshot, operation detail, summary diagram, case/example, or closing visual.
   - Place screenshots near the exact concept or operation they explain. Do not dump images randomly.

3. **Choose the output mode.**
   - Default to `deck`: a 16:9 horizontal teaching deck for screen recording and walkthroughs.
   - Use `cards`: a 3:4 vertical graphic-card deck when the user says 3:4, vertical, cards, graphic post, Xiaohongshu, WeChat images, social post, or asks for content suitable for image publishing.
   - Do not treat `cards` as a cropped 16:9 deck. Rewrite the information into independently readable cards.

4. **Plan a teaching deck or card series, not an article summary.**
   - For `deck`, prefer 30-50 slides for a detailed tutorial article.
   - For `cards`, prefer 8-20 cards with stronger titles, tighter body copy, and one self-contained point per card.
   - Use one slide/card per teachable unit: one concept, one UI region, one operation, one comparison, or one recap.
   - Each slide/card should answer: "What does the audience learn here?"
   - Include enough visible text for comprehension, but keep it readable during recording or standalone reading.

5. **Choose the visual style.**
   - If the user specifies a style, follow it exactly.
   - If unspecified, default to `小亮手绘实验室`.
   - Supported style triggers:
     - `小亮手绘实验室`, `xiaoliang-lab`, `default`
     - `圆润孟菲斯`, `rounded-memphis`, `candy-memphis`
     - `粗黑孟菲斯`, `bold-memphis`, `poster-memphis`
   - Read `references/style-presets.md` before implementing non-default styles.

6. **Build a static single-file HTML deck unless the user asks otherwise.**
   - Keep the deck self-contained except for local image paths.
   - Use 16:9 slide stage for `deck`; use 3:4 slide stage for `cards`.
   - Support keyboard navigation, wheel navigation, overview mode, fullscreen, and image hover zoom.
   - Use local relative image paths so the deck works inside the project folder.
   - Use bundled `deck` layouts intentionally: `image`, `imageWide`, `duo`, `imageStep`, `text`, and `steps`.
   - Use bundled `cards` layouts intentionally: `coverVertical`, `quoteCard`, `stackedImage`, and `verticalSteps`.

7. **Verify with a browser.**
   - Open with Chrome/Playwright or the available browser tool.
   - Check all images load.
   - Check all slides render in the selected aspect ratio without key text or images overflowing.
   - Test keyboard navigation, wheel navigation, overview, fullscreen, and hover zoom.

## Deck Structure

Use this default structure for tutorial/explainer decks:

1. Cover: topic, promise, main image.
2. Learning outcome: what the audience will know or be able to do.
3. Why this matters: connect to AI/content/tool workflow.
4. Concept foundation: definitions and mental models.
5. Real interface walkthrough: use screenshots with accurate placement.
6. Step-by-step operation: one decision or UI region per slide.
7. Important mechanisms: branches, commits, PR, settings, deployment, etc.
8. Practical scenarios: how this fits real creator/AI workflows.
9. Summary/action: concrete next steps.

For long tutorials, insert recap slides after major sections only when they improve pacing.

For 3:4 `cards`, use a publishing-card structure:

1. Cover card: strong topic, promise, visual signal.
2. Problem card: why readers should care.
3. Concept cards: one point per card, with self-contained wording.
4. Workflow cards: vertical steps or focused screenshots.
5. Comparison/turning-point cards when useful.
6. Summary/action card: concrete next step or checklist.

For `cards`, avoid page sequences that only work with spoken narration. Each card should be readable as a standalone image.

## Visual Style

Default to the Xiaoliang content lab aesthetic:

- Warm paper backgrounds: cream, warm gray, pale yellow, light peach.
- Subtle notebook/grid texture.
- Strong dark hand-drawn borders, offset black shadows, sticker labels, pill tags.
- Accent colors: tomato red, mustard yellow, mint green, pale peach, ink black.
- Rounded cards around 16-26px, slightly rotated only when it helps the handmade feel.
- Avoid blue-purple AI gradients, dark cyber dashboards, glassmorphism, and generic SaaS hero layouts.

See `references/design-system.md` for concrete CSS tokens, layout rules, typography, and screenshot treatment.

For selectable style variants, see `references/style-presets.md`. Use the names and aliases in that file so users can trigger styles by natural instructions.

## Interaction Requirements

Every HTML deck should support:

- Arrow keys, Space, PageUp/PageDown, Home/End.
- Mouse wheel page navigation with throttling.
- `O` overview grid.
- `F` fullscreen.
- Hash deep links like `#/12`.
- Hover zoom for images:
  - Hover original image to open an enlarged preview.
  - Keep preview open while the cursor is inside the enlarged image card.
  - In 3:4 `cards` mode, the enlarged preview must stay inside the current 3:4 slide boundary so screen recordings never crop the zoomed image.
  - Close when cursor leaves the enlarged card, on click, or on `Esc`.
  - Use soft fade/scale transitions, not a hard cut.

See `references/interactions.md` for the implementation pattern.

## Authoring Rules

- Use real screenshots large enough to inspect. If a screenshot contains UI details, avoid tiny side-by-side placement.
- In `cards` mode, use fewer screenshots and crop/focus them more aggressively so the UI remains legible in 3:4.
- Screenshot cards must wrap the original image ratio. Do not use fixed-height image frames that create large blank bands above or below the screenshot.
- For "steps + screenshot" slides, use a vertical stepper layout instead of narrow horizontal step cards when Chinese titles/descriptions are long.
- Use two-image layouts only when both images remain legible; otherwise stack images vertically or give one image a dedicated slide.
- For UI screenshots, visible text should identify what to look at: e.g. "Code button", "GitHub Pages source", "Secrets and variables".
- Use concept illustrations for mental models and transitions; use real screenshots for operations.
- Avoid vague bullets such as "improves collaboration" unless paired with a concrete UI or workflow.
- Do not make a landing page. The first screen must be the slide deck itself.

## Implementation Starting Point

When creating a new Xiaoliang-style HTML PPT from scratch:

1. Read `references/authoring-workflow.md`.
2. Read `references/design-system.md`.
3. If the user specifies a style, read `references/style-presets.md`.
4. Read `references/interactions.md`.
5. Copy or adapt `assets/template.html`.
6. Replace the slide data and image paths.
7. Verify before reporting done.

## Template Capabilities

The bundled template includes these common layouts:

Deck layouts:

- `image`: balanced text plus one image.
- `imageWide`: text plus a larger UI screenshot.
- `duo`: text plus two stacked images.
- `imageStep`: vertical stepper plus a screenshot.
- `text`: headline plus cards or checklist rows.
- `steps`: numbered operation cards.

Cards layouts:

- `coverVertical`: 3:4 cover card with strong title and optional image.
- `quoteCard`: 3:4观点/金句 card for a single memorable claim.
- `stackedImage`: 3:4 vertical text plus image or image plus text.
- `verticalSteps`: 3:4 vertical step sequence.

It also includes aspect classes, keyboard/wheel navigation, `O` overview, `F` fullscreen, hash deep links, and hover zoom. Preserve these capabilities when adapting the template.

## Done Checklist

- Source article has been fully represented at teaching depth.
- All provided useful images were inspected and intentionally placed.
- Requested style has been applied consistently, or default style was used intentionally.
- Real UI screenshots are large enough to read or have hover zoom.
- Deck uses the requested aspect ratio: 16:9 for `deck`, 3:4 for `cards`.
- Cards mode uses self-contained pages, readable vertical composition, and no squeezed horizontal layouts.
- Hover zoom is smooth; in `cards` mode it is bounded by the 3:4 slide frame.
- Browser verification confirms image loading and no key overflow.
