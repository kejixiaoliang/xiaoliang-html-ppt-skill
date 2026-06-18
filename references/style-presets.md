# Style Presets

Use this file when the user specifies a visual style or asks what styles are available. Keep the selected style consistent across the whole deck: palette, title treatment, cards, stickers, buttons, progress bar, image frames, and hover states.

## Trigger Names

| User-facing name | Aliases | Best for |
|---|---|---|
| 小亮手绘实验室 | `xiaoliang-lab`, `default`, `手绘实验室` | Warm creator tutorials, AI tool explanations, GitHub/workflow teaching |
| 圆润孟菲斯 | `rounded-memphis`, `candy-memphis`, `软糖孟菲斯` | Friendly brand stories, playful creator intros, lighter teaching decks |
| 粗黑孟菲斯 | `bold-memphis`, `poster-memphis`, `爆款孟菲斯` | High-energy launches, bold concept explainers, dramatic visual storytelling |

When the user says only "孟菲斯", ask a short clarification if possible. If acting autonomously, choose `圆润孟菲斯` for friendly/brand/creator topics and `粗黑孟菲斯` for punchy/viral/announcement topics.

## 小亮手绘实验室

The default style. It is warm, practical, notebook-like, and easy to narrate.

Use:

- Cream paper background with subtle grid texture.
- Strong but not aggressive ink borders, 3-4px.
- Tomato red, mustard yellow, mint green, pale peach.
- Sticker labels, pill tags, hand-drawn image frames.
- Slight rotations and offset shadows.
- Direct Chinese copy that sounds like a creator explaining things to viewers.

Avoid:

- Dense decoration that competes with screenshots.
- Dark cyber or blue-purple AI visual language.
- Marketing landing-page composition.

## 圆润孟菲斯

Inspired by the MIMO/CHUNKY reference: rounded, candy-colored, chunky, playful, and friendly.

This style must look obviously different from the default Xiaoliang lab style. It should feel like a toy-like creative playground, not just the default deck with brighter accents.

Use:

- Body class: `style-rounded-memphis`.
- Cream background with a visible but light 60px grid.
- Very bright accents: hot pink `#FF2D78`, yellow `#FFE500`, green `#00E676`, cyan `#00D4FF`, orange `#FF6D00`, lime `#C6FF00`.
- Rounded chunky cards: 22-30px radius, 4-5px black borders, 7-10px offset shadows.
- Friendly rounded font stack. If web fonts are unavailable, use `Trebuchet MS`, `Microsoft YaHei`, `PingFang SC`, Arial, sans-serif.
- Hero/title treatment: colored highlight blocks behind key words, rounded corners, small rotation. Avoid plain black text-only headings.
- Bubble badges, pill labels, sticker buttons, playful star/circle/triangle/diamond shapes.
- At least 1-2 visible candy geometric decorations per non-screenshot-heavy slide.
- Soft bounce/drift/hover movement, but keep screenshot readability first.

Slide adaptation:

- Titles can use large chunky words with colored highlight blocks.
- Cards should feel like soft toy blocks rather than sharp posters: large radius, colorful top strips, friendly pill labels.
- Image frames should be big, rounded, and cheerful; use rounded screenshot corners and a sticker caption.
- Use stacked colorful blocks or vertical steppers to explain workflows.
- Prefer 2-column layouts with generous breathing room. Avoid dense 4-column grids unless each card has very little text.

Minimum visual checklist:

- [ ] Background grid is 60px and visible.
- [ ] Title has at least one candy highlight block.
- [ ] Cards/shot frames are clearly rounded and chunky.
- [ ] Palette includes at least pink/yellow/cyan/green on the slide or section.
- [ ] Decorations are rounded/playful, not sharp poster marks.

Avoid:

- Too many floating shapes on image-heavy teaching slides.
- Tiny screenshots beside oversized decoration.
- Aggressive text shadows that reduce Chinese readability.

## 粗黑孟菲斯

Inspired by the DeepSeek reference: high-contrast, loud, poster-like, thick black borders, and strong Memphis shapes.

This style must look like a loud poster deck. If it still feels like the default warm notebook, the style has failed.

Use:

- Body class: `style-bold-memphis`.
- Warm beige grid background with stronger contrast than the default.
- Thick black borders: 5-6px on primary cards, screenshots, buttons, and labels.
- Heavy black shadows: 8-14px.
- Bright poster colors: yellow `#ffde17`, pink `#ff6b9d`, cyan `#00d4ff`, green `#7bed7b`, orange `#ff8a5c`, purple `#b388ff`.
- Big heavy headings, uppercase English labels where appropriate, thick stroke or poster shadow on short headings.
- Bold geometric decorations: stars, circles, triangles, diamonds, dot patterns, zigzags.
- Pressable poster buttons/cards with slight rotation and tactile hover/active states.

Slide adaptation:

- Use this when the deck needs momentum and punch.
- Titles can be more slogan-like and high-impact.
- Cards should be bigger and fewer per slide: 2-3 strong blocks beat 6 small blocks.
- Screenshots should sit in thick poster frames, often with red/yellow callout strips.
- Use asymmetric composition: big screenshot or big title, not evenly polite cards everywhere.
- Use dot/stripe/star decorations in corners, but keep dense screenshot centers clean.

Minimum visual checklist:

- [ ] Borders are visibly thicker than default.
- [ ] Shadows are heavy and poster-like.
- [ ] Title treatment uses stroke/shadow or high-impact color blocking.
- [ ] There is at least one bold Memphis shape: star, dot pattern, stripe, triangle, or diamond.
- [ ] Layout uses fewer, larger blocks rather than many small polite cards.

Avoid:

- Applying large text shadows to long Chinese paragraphs.
- Making every slide equally loud; alternate high-impact slides with calmer screenshot walkthrough slides.
- Overloading the frame with decorations around dense UI screenshots.

## Template Implementation Notes

The bundled `assets/template.html` includes body classes for these styles:

```html
<body class="style-xiaoliang-lab">
<body class="style-rounded-memphis">
<body class="style-bold-memphis">
```

When generating a deck, set the body class to the selected style and then adjust slide data/layouts. Do not merely mention a style in text; the CSS, card geometry, title treatment, and decorations must change visibly.

## Shared Style Requirements

All styles must still satisfy the core HTML PPT requirements:

- 16:9 slide stage.
- Keyboard, wheel, overview, fullscreen, hash links.
- Hover zoom for screenshots.
- Screenshot frames wrap the original image ratio; avoid fixed-height frames that create large blank areas.
- Steps beside screenshots use vertical steppers when Chinese text is long.
- Image placement must be instructional, not decorative.
- Text must not overflow.
- Browser verification before final response.
