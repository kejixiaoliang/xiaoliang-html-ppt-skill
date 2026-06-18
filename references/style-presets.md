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

Use:

- Cream background with faint 60px grid.
- Very bright accents: hot pink `#FF2D78`, yellow `#FFE500`, green `#00E676`, cyan `#00D4FF`, orange `#FF6D00`, lime `#C6FF00`.
- Rounded chunky cards: 18-24px radius, 3.5-5px black borders, 5-10px offset shadows.
- Friendly rounded fonts when available; otherwise use system rounded/sans fonts with heavy weights.
- Bubble badges, pill labels, sticker buttons, playful star/circle/triangle/diamond shapes.
- Soft bounce/drift/hover movement, but keep screenshot readability first.

Slide adaptation:

- Titles can use large chunky words with colored highlight blocks.
- Cards should feel like soft toy blocks rather than sharp posters.
- Image frames should be big, rounded, and cheerful.
- Use stacked colorful blocks to explain workflows or feature lists.

Avoid:

- Too many floating shapes on image-heavy teaching slides.
- Tiny screenshots beside oversized decoration.
- Aggressive text shadows that reduce Chinese readability.

## 粗黑孟菲斯

Inspired by the DeepSeek reference: high-contrast, loud, poster-like, thick black borders, and strong Memphis shapes.

Use:

- Warm beige grid background.
- Thick black borders: 5-6px.
- Heavy black shadows: 6-10px.
- Bright poster colors: yellow `#ffde17`, pink `#ff6b9d`, cyan `#00d4ff`, green `#7bed7b`, orange `#ff8a5c`, purple `#b388ff`.
- Big heavy headings, uppercase English labels where appropriate, strong text-shadow only for large decorative English/short title words.
- Bold geometric decorations: stars, circles, triangles, diamonds, dot patterns, zigzags.
- Pressable poster buttons/cards with slight rotation and tactile hover/active states.

Slide adaptation:

- Use this when the deck needs momentum and punch.
- Titles can be more slogan-like and high-impact.
- Cards should be bigger and fewer per slide.
- Screenshots should sit in thick poster frames, often with red/yellow callout strips.

Avoid:

- Applying large text shadows to long Chinese paragraphs.
- Making every slide equally loud; alternate high-impact slides with calmer screenshot walkthrough slides.
- Overloading the frame with decorations around dense UI screenshots.

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
