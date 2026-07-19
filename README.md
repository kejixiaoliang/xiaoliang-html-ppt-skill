# xiaoliang-html-ppt-skill

一个用于制作“小亮实验室风格 HTML PPT”的 Codex Skill。

它适合把长文、教程、讲稿、公众号文章和图片素材目录，制作成适合录屏讲解的 16:9 HTML 翻页 PPT，也可以生成适合图文发布的 3:4 竖版 HTML 卡片。重点不是做普通摘要，而是做一份观众能跟着学、读者能逐页读懂的教学型内容。

公开版只保留一种视觉风格：**小亮实验室**。不再提供多风格选择。

## 能做什么

- 把长文章拆成 30-50 页左右的 16:9 讲解型 HTML PPT。
- 把文章提炼成 8-20 页左右的 3:4 图文卡片。
- 自动理解图片素材目录，把截图放到合适的讲解位置。
- 生成 16:9 或 3:4 单文件 HTML 幻灯片。
- 支持键盘翻页、鼠标滚轮翻页、概览模式、全屏。
- 支持图片悬停柔和放大，方便录屏时展示截图细节。
- 使用统一的小亮实验室风格：暖纸背景、手绘线框、贴纸标签、错位黑色投影。

## 当前能力状态

这个 Skill 是教学型 HTML PPT 工作流，不是普通摘要型 PPT 模板。使用时应先完整阅读文章和图片素材，再按概念、界面、操作步骤、常见误区和行动总结拆页。

当前模板内置能力：

- 一种视觉风格：小亮实验室。
- 两种输出模式：`deck` 16:9 横版课件、`cards` 3:4 竖版图文。
- 横版常用布局：图文页、大图页、双图页、文字卡片页、步骤页、步骤加截图页。
- 竖版常用布局：竖版封面、观点卡、上文下图、竖向步骤。
- 录屏交互：键盘翻页、滚轮翻页、概览模式、全屏、hash 深链、图片悬停放大。

## 输出模式

### deck：16:9 横版课件

默认模式。适合录屏讲解、教程演示、界面 walkthrough、视频课程和横屏分享。

触发方式：

```text
做成 16:9 HTML PPT
横版课件
录屏讲解用
```

### cards：3:4 竖版图文

适合小红书图文、公众号配图、朋友圈图文、知识卡片和可逐页发布的内容。

触发方式：

```text
做成 3:4 图文版
适合小红书图文
竖版卡片
不要横屏录屏，用图文发布比例
```

3:4 模式不是 16:9 的裁剪版。它会把内容改写成更适合逐页阅读的图文卡片：标题更强、正文更凝练、截图更少但更聚焦。

模板预览时可以用 URL 参数临时切换输出比例：

```text
index.html?mode=cards
index.html?aspect=3x4
index.html?mode=deck
index.html?aspect=16x9
```

## 唯一风格：小亮实验室

适合 AI 工具讲解、GitHub 教程、产品拆解、工作流分享和创作者内容。

特点：

- 暖纸背景。
- 手绘粗线框。
- 贴纸标签和胶囊标签。
- 略微旋转的卡片。
- 错位黑色投影。
- 番茄红、芥末黄、薄荷绿等暖色点缀。
- 中文教学表达，像创作者在对观众讲明白一件事。

触发方式：

```text
使用 xiaoliang-html-ppt-skill，把文章做成小亮实验室风格 HTML PPT。
```

也可以说：

```text
风格=小亮实验室
风格=小亮手绘实验室
风格=小亮风格
风格=xiaoliang-lab
```

如果用户指定其它风格，当前公开版仍然只使用“小亮实验室”。

## 推荐用法

### 从文章和图片目录生成 PPT

```text
使用 xiaoliang-html-ppt-skill，把我提供的文章做成 16:9 可翻页 HTML PPT。
用于录屏讲解，内容要详细，不要做成摘要。
请读取 images 目录里的所有图片，理解后放到合适的位置。
风格使用小亮实验室。
```

### 从文章生成 3:4 图文卡片

```text
使用 xiaoliang-html-ppt-skill，把这篇文章做成 3:4 竖版图文卡片。
适合小红书/公众号发布，每页要能独立读懂。
不要做成横版录屏 PPT，风格使用小亮实验室。
```

## 生成结果应该包含

- `index.html` 或用户指定名称的 HTML 文件。
- 16:9 横版或 3:4 竖版幻灯片舞台。
- 左右键、空格、PageUp/PageDown 翻页。
- 鼠标滚轮翻页。
- `O` 键打开概览。
- `F` 键全屏。
- `Esc` 关闭概览和图片放大。
- 图片悬停放大。
- 本地相对图片路径。

## 适合的内容

- GitHub / AI 编程教程。
- 工具使用教程。
- 产品功能讲解。
- 公众号长文改 PPT。
- 小红书/公众号图文卡片。
- 创作者个人分享。
- 有大量截图的界面教学。

## 不适合的内容

- 纯商务汇报。
- 极简学术论文展示。
- 不需要录屏讲解的静态海报。
- 只追求酷炫动效、没有教学内容的页面。

## Skill 文件结构

```text
xiaoliang-html-ppt-skill/
├── SKILL.md
├── README.md
├── agents/
│   └── openai.yaml
├── assets/
│   └── template.html
├── scripts/
│   └── validate-template.mjs
└── references/
    ├── authoring-workflow.md
    ├── design-system.md
    ├── interactions.md
    └── style-presets.md
```

本仓库还可能包含开发辅助目录：

```text
plans/      # 升级规划，不是运行时必需资源
projects/   # 示例输出，不是运行时必需资源
```

同步到全局 Skill 时，优先同步核心运行文件：`SKILL.md`、`agents/`、`assets/`、`references/`、`scripts/`。`plans/` 和 `projects/` 只在需要保留开发记录或示例时同步。

## 开发与验证

修改 Skill 后建议运行：

```powershell
$env:PYTHONUTF8='1'
py C:\Users\kangt\.codex\skills\.system\skill-creator\scripts\quick_validate.py <skill目录>
node scripts\validate-template.mjs
```

生成具体 HTML 后，可以使用通用静态验证脚本：

```powershell
node scripts\validate-generated-html.mjs <生成的HTML路径> --mode deck --min-slides 20
node scripts\validate-generated-html.mjs <生成的HTML路径> --mode cards --min-slides 8
```

如果本机有 Playwright 包和 Chrome/Edge，可以继续做真实浏览器检查：

```powershell
node scripts\browser-check-generated.mjs <生成的HTML路径> --mode deck --expected-slides 26
node scripts\browser-check-generated.mjs <生成的HTML路径> --mode cards --expected-slides 22
```

真实生成遇到的问题和处理方式记录在 `references/testing-lessons.md`，后续修改 Skill 时应先读它。

生成 HTML PPT 后建议用浏览器检查：

- 图片是否全部加载。
- 所有页面是否无文字/图片溢出。
- 键盘翻页是否正常。
- 鼠标滚轮翻页是否正常。
- 图片悬停放大是否正常。
- `cards` 模式下图片放大是否被限制在 3:4 页面内。

## 迭代流程

本项目中建议先修改局部开发源：

```text
E:\CodeFile\MyAIProject\html-ppt\xiaoliang-html-ppt-skill
```

确认校验和实际生成效果 OK 后，再同步到全局 Skill：

```text
C:\Users\kangt\.codex\skills\xiaoliang-html-ppt-skill
```
