# 小亮实验室设计系统

## 视觉意图

页面应该像一份创作者的实用实验笔记：温暖、手绘、清楚、略微有点玩心，同时保留足够的信息密度来完成教学。避免做成通用 AI 创业公司模板。

公开版只有一个视觉风格：小亮实验室。不要添加其它 style class、风格切换器或隐藏预设。

## 色彩

CSS 变量建议接近：

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

主背景应是暖纸色，而不是蓝色、紫色、黑色或玻璃渐变。深色 UI 截图可以出现在截图框里，但页面主题仍应保持温暖。

## 幻灯片舞台

使用居中的 slide。默认 `deck` 为 16:9；`cards` 为 3:4。

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

底部保留一条细进度条，方便录屏时知道当前进度。

## 字体

- 使用系统中文无衬线字体：Microsoft YaHei、PingFang SC、Noto Sans CJK SC、Arial。
- 封面/章节大标题：52-78px。
- 常规标题：44-58px。
- 正文/lead：21-28px。
- 卡片文字：17-24px。
- 字距保持 0。
- 强调用番茄红和下划线/高亮，不使用渐变字。

`cards` 模式可以更紧一点：

- 封面标题：50-68px。
- 常规卡片标题：38-52px。
- 正文/lead：20-26px。
- 卡片文字：17-22px。
- 标题尽量控制在 2-3 行。

## 组件

常用组件：

- `pin`：左上角轻微旋转的章节标签。
- `mark`：薄荷色胶囊标签，标识页面角色。
- `card`：白色或暖纸卡片，墨色边框，错位投影。
- `check`：带绿色圆形勾选符号的清单行。
- `step`：带编号的操作步骤卡。
- `shot`：截图卡片，墨色边框、白色衬纸、错位投影和贴纸 caption。
- `caption`：番茄红贴纸标签，告诉观众这张图应该看哪里。

除非确实是截图框内部结构，不要把卡片再套进卡片里。

## 图片策略

按用途放图：

- 封面/概念图：用于章节开场和建立视觉信号。
- 真实 UI 截图：用于操作证据，必须足够大。
- 细节截图：配合短说明，使用大区域或单页。
- 流程图/结构图：用于心智模型和总结。

规则：

- 含小字的 UI 截图通常应占页面 45-60%。
- 截图框必须包裹原图比例。不要强制 `height: 100%`、固定图片高度，或制造大块上下空白。
- 截图图片使用 `width: 100%; height: auto; max-height: ...; object-fit: contain;`。
- 宽图或长图要选择能给足空间的布局，不要硬拉伸。
- 双图布局只有在两张图都清楚时使用；否则上下堆叠或拆成单页。
- 每张截图都应该有 caption，指出观众要看的 UI 目标。
- 截图必须支持悬停放大。
- `cards` 模式下，悬停放大必须限制在当前 3:4 页面内。

`cards` 模式下，截图通常需要聚焦裁切或只放一张大图。完整桌面截图加长文字在 3:4 里会变得不可读。

## 布局模式

横版布局：

- `image`：左文右图。
- `imageWide`：左侧文字，右侧大截图。
- `duo`：左侧文字或清单，右侧两张上下堆叠图片。
- `imageStep`：左侧纵向步骤，右侧截图。中文步骤较长时优先使用。
- `text`：标题 + 信息卡片或清单。
- `steps`：编号操作卡片。

不要过度使用纯居中标题页。小亮实验室风格最适合“每页都讲清楚一个具体东西”。

竖版布局：

- `coverVertical`：大标题、短承诺、紧跟主题的主视觉。标题区和主视觉之间不能插入大块空白；不要用 `auto 1fr auto` 把图片硬推到底部。
- `quoteCard`：一个强观点或金句，少量辅助文字。
- `stackedImage`：文字块和图片上下堆叠，可文字在前或图片在前。
- `verticalSteps`：全宽竖向步骤行，每一步要短到能扫读。

`cards` 应优先从上到下组织信息，不要把横版左右分栏硬塞进竖版。

3:4 封面卡尤其要像一张完整海报，而不是被拉高的横版封面：主视觉应在标题和 lead 后自然出现，并占据足够面积。封面图可以使用轻微 `object-fit: cover` 裁切来获得海报感，但生成后必须检查人物、界面和关键信息没有被切掉。截图里的关键人物、界面或概念图不要沉到底部，也不要让页面中段空出来。

## “步骤 + 图片”布局

当一页同时有操作步骤和截图时：

- 优先使用纵向步骤条，一行一个步骤。
- 给步骤列足够宽度，避免长中文挤压。
- 步骤标题尽量一行，但说明可以自然换行。
- 截图卡片居中或靠右，按原图比例包裹。

推荐 CSS：

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

避免在密集中文步骤旁使用：

```css
.shot img { height: 100%; }
.steps.four { grid-template-columns: repeat(4, 1fr); }
```

这会让截图比例和中文排版都变差。
