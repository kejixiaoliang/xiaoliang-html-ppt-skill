# Authoring Workflow

## 1. Read And Segment The Article

For each section, identify:

- Core point.
- Audience confusion it resolves.
- Concrete example or operation.
- Screenshot or illustration needed.
- What the user should remember after the slide.

Do not compress detailed article content into generic bullets. If the article explains a concept carefully, reflect that teaching detail in multiple slides.

## 2. Build An Image Inventory

For each image file, record:

- Filename.
- Type: concept, screenshot, detail, diagram, cover, closing.
- Visible UI/content.
- Best slide placement.
- Whether it needs hover zoom.

For many images, create a contact sheet using browser rendering or inspect with the available image viewer.

## 3. Decide Slide Count

Use this rough density:

- 1 cover slide.
- 1 learning outcome slide.
- 1-2 slides for why this matters.
- 2-4 slides per major concept.
- 1 slide per UI page or important control.
- 1-2 closing/action slides.

Detailed tutorials commonly need 30-50 slides.

## 4. Write Slide Copy

Use warm direct Chinese. A good slide has:

- A section pin.
- A short role tag.
- A headline with one clear claim.
- A lead paragraph or 3-5 concrete checklist/cards.
- A screenshot/visual that directly supports the claim.

Avoid empty phrases:

- "提升效率"
- "方便协作"
- "更好管理"

Replace with concrete teaching:

- "PR 页面会显示哪些文件被改了，绿色是新增，红色是删除。"
- "Settings > Pages 里选择分支和目录后，GitHub 会生成 github.io 地址。"

## 5. Place Images

Use the image where the audience needs it:

- Definition slide: concept illustration.
- Operation slide: real screenshot.
- Summary slide: diagram.
- Closing slide: human/open-source/community visual.

If a screenshot contains dense UI, give it a large right panel or a full slide. Avoid making key screenshots too small.

For screenshots in framed cards, preserve the original image ratio. Do not create a fixed-height frame that leaves large blank bands around a wide screenshot. The image card should wrap the rendered screenshot, with only a small matte/padding and caption sticker.

For "steps + screenshot" pages, use a vertical stepper rather than several narrow horizontal cards. Long Chinese step titles and explanations should have enough width to wrap naturally.

## 6. Implement

Prefer a data-driven single HTML file:

- Define `slides = [...]`.
- Render layout templates with JavaScript.
- Keep CSS tokens at the top.
- Keep interactions at the bottom.
- Use relative asset paths.

Use `assets/template.html` as a starting point when useful.

## 7. Verify

Run browser verification before final response:

- Count slides.
- Check every referenced image exists and loads.
- Check no key text/image element overflows the slide.
- Test keyboard navigation.
- Test wheel navigation.
- Test overview.
- Test hover zoom boundary and smooth transition.

In the final response, report the file path, slide count, image coverage, and verification outcome.
