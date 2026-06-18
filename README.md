# xiaoliang-html-ppt-skill

一个用于制作“小亮风格 HTML PPT”的 Codex Skill。

它适合把长文、教程、讲稿、公众号文章、图片素材目录，制作成适合录屏讲解的 16:9 HTML 翻页 PPT。重点不是做普通摘要，而是做一份观众能跟着学的教学型课件。

## 能做什么

- 把长文章拆成 30-50 页左右的讲解型 HTML PPT
- 自动理解图片素材目录，把截图放到合适的讲解位置
- 生成 16:9 单文件 HTML 幻灯片
- 支持键盘翻页、鼠标滚轮翻页、概览模式、全屏
- 支持图片悬停柔和放大，方便录屏时展示截图细节
- 支持多种视觉风格

## 可选风格

### 1. 小亮手绘实验室

默认风格。适合 AI 工具讲解、GitHub 教程、产品拆解、工作流分享。

特点：

- 暖纸背景
- 手绘粗线框
- 贴纸标签
- 略微旋转的卡片
- 番茄红、芥末黄、薄荷绿等暖色点缀

触发方式：

```text
使用 xiaoliang-html-ppt-skill，风格用小亮手绘实验室
```

也可以说：

```text
风格=default
风格=xiaoliang-lab
风格=手绘实验室
```

### 2. 圆润孟菲斯

适合更轻松、卡通、品牌感强一点的内容。

特点：

- 糖果色
- 圆润大卡片，像软糖/玩具积木
- 胖乎乎的标题和按钮，关键词有彩色高亮块
- 明亮的星星、圆形、三角形、菱形装饰
- 整体更友好、更活泼
- 生成时应使用 `style-rounded-memphis`，不能只是在默认风格上换几个颜色

触发方式：

```text
使用 xiaoliang-html-ppt-skill，风格用圆润孟菲斯
```

也可以说：

```text
风格=rounded-memphis
风格=candy-memphis
风格=软糖孟菲斯
```

### 3. 粗黑孟菲斯

适合更有冲击力、更像海报、更适合做爆款感讲解的内容。

特点：

- 超粗黑边
- 强烈黑色投影
- 高饱和粉、黄、青、绿
- 海报式大标题，适合大字、描边、重投影
- 更强的视觉冲击
- 生成时应使用 `style-bold-memphis`，版式要更大块、更像海报，不能像默认笔记风

触发方式：

```text
使用 xiaoliang-html-ppt-skill，风格用粗黑孟菲斯
```

也可以说：

```text
风格=bold-memphis
风格=poster-memphis
风格=爆款孟菲斯
```

## 推荐用法

### 从文章和图片目录生成 PPT

```text
使用 xiaoliang-html-ppt-skill，把我提供的文章做成 16:9 可翻页 HTML PPT。
用于录屏讲解，内容要详细，不要做成摘要。
请读取 images 目录里的所有图片，理解后放到合适的位置。
风格用小亮手绘实验室。
```

### 指定孟菲斯风格

```text
使用 xiaoliang-html-ppt-skill，把这篇教程做成 HTML PPT。
风格用圆润孟菲斯。
图片需要支持悬停放大，鼠标滚轮可以翻页。
```

```text
使用 xiaoliang-html-ppt-skill，制作一份适合录屏介绍产品的 HTML PPT。
风格用粗黑孟菲斯，视觉冲击强一点，但截图必须看得清楚。
```

## 生成结果应该包含

- `index.html` 或用户指定名称的 HTML 文件
- 16:9 幻灯片舞台
- 左右键、空格、PageUp/PageDown 翻页
- 鼠标滚轮翻页
- `O` 键打开概览
- `F` 键全屏
- 图片悬停放大
- 本地相对图片路径

## 适合的内容

- GitHub / AI 编程教程
- 工具使用教程
- 产品功能讲解
- 公众号长文改 PPT
- 创作者个人分享
- 有大量截图的界面教学

## 不适合的内容

- 纯商务汇报
- 极简学术论文展示
- 不需要录屏讲解的静态海报
- 只追求酷炫动效、没有教学内容的页面

## Skill 文件结构

```text
xiaoliang-html-ppt-skill/
├── SKILL.md
├── README.md
├── agents/
│   └── openai.yaml
├── assets/
│   └── template.html
└── references/
    ├── authoring-workflow.md
    ├── design-system.md
    ├── interactions.md
    └── style-presets.md
```

## 开发与验证

修改 skill 后建议运行：

```powershell
$env:PYTHONUTF8='1'
py C:\Users\kangt\.codex\skills\.system\skill-creator\scripts\quick_validate.py <skill目录>
```

生成 HTML PPT 后建议用浏览器检查：

- 图片是否全部加载
- 所有页面是否无文字/图片溢出
- 键盘翻页是否正常
- 鼠标滚轮翻页是否正常
- 图片悬停放大是否正常
