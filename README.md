# EUROPA 1500–1900 · 近代早期欧洲交互史

一个面向历史教学与自主学习的交互式历史地图：以 1500–1900 年间七个政权边界快照为骨架，串联十二个关键事件，把「地图上的空间变化」与「时间轴上的因果链」放在同一屏里。

## 特点

- **历史地图 × 时间轴**：拖动 1490–1905 年时间轴，地图在 1500 / 1600 / 1700 / 1715 / 1783 / 1815 / 1900 七个边界快照间淡入切换。
- **事件驱动的高亮**：点击事件菱形或地图脉冲标记，相关政权以紫色高亮；核心政权（如西班牙哈布斯堡）与参战方分两级呈现。
- **深色沉浸式视觉**：藏蓝底 `#0a0e17`、羊皮纸噪点、暗角、青色发光国界 `#22d3ee`、紫色事件区 `#a855f7`、细金线玻璃拟态知识面板。
- **零依赖运行**：D3 与历史边界均已本地化，`file://` 直接打开也能用；无框架、无构建步骤（CI 仅负责生成数据）。
- **可访问与响应式**：时间轴支持方向键 / Home / End，遵循 `prefers-reduced-motion`；桌面为侧栏版面，移动端为底部抽屉。

## 本地运行

```bash
# 任选其一
python -m http.server 8000
npx serve .
```

打开 <http://127.0.0.1:8000>。也可以直接双击 `index.html`（数据均已内联为 JS）。

## 重新生成地图数据

原始边界来自 [historical-basemaps](https://github.com/aourednik/historical-basemaps)（GPL-3.0）与 [Natural Earth](https://www.naturalearthdata.com/)（公有领域）。

```bash
node tools/fetch_assets.js   # 下载 7 个年份的 GeoJSON 与 D3
node tools/build_borders.js  # 裁剪、简化、预投影 → data/borders.js
```

`data/geo/`、`data/borders.json`、`vendor/` 均为生成物，不提交到仓库；GitHub Actions 会在部署时自动生成。

## 部署

推送到 `main` 后，`.github/workflows/pages.yml` 会：

1. 下载 D3 与七个年份的历史边界；
2. 在 Node 中完成裁剪 / 简化 / 圆锥投影，输出 `data/borders.js`；
3. 组装 `_site/` 并发布到 GitHub Pages。

首次部署需要在仓库 **Settings → Pages → Build and deployment** 中把 Source 设为 **GitHub Actions**（工作流中的 `configure-pages` 也会尝试自动启用）。

> 如果希望跳过 Actions 权限，也可以选择 **Deploy from a branch → `gh-pages` / root**：CI 已经把构建产物推到该分支。详见 [DEPLOY.md](DEPLOY.md)。

## 目录

```
index.html              页面骨架与 SVG 地图
css/style.css           视觉系统（设计令牌、玻璃拟态、时间轴）
js/app.js               投影、时间轴、事件联动、面板渲染
data/events.js          十二个事件：年代、摘要、关键节点、出处、高亮选择器
data/borders.js         生成物：七个年份的预投影 SVG 路径
tools/fetch_assets.js   下载原始边界与 D3
tools/build_borders.js  裁剪 / 简化 / 投影 / 生成标签质心
.github/workflows/pages.yml
```

## 数据与史实说明

- 边界为**示意性重建**，用于呈现政权空间关系的宏观变化，不等同于精确的历史勘界；细部与同期实际控制可能存在差异。
- 每条事件附有 Britannica 与中文维基百科出处，见知识面板「延伸阅读」。
- 事件年代取通行学界分期；个别事件（如七年战争）使用最接近的**战前快照**，并在面板中注明。

## 许可

- **代码**（HTML / CSS / JS / 构建脚本）：MIT，见 [LICENSE](LICENSE)。
- **历史边界数据及其衍生 SVG 路径**：GPL-3.0，见 [DATA-LICENSE.md](DATA-LICENSE.md)。
