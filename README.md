# EUROPA 1500–1900 · 近代早期欧洲交互史

一个面向历史教学与自主学习的交互式历史地图：以 1500–1900 年间十个政权边界快照为骨架，串联 **30 个关键事件**（12 条核心 + 18 条扩展），覆盖政治、经济、文化与社会，把「地图上的空间变化」与「时间轴上的因果链」放在同一屏里。

**在线地址：<https://csgpjy.github.io/europe-history-atlas/>**  
**战争线：<https://csgpjy.github.io/europe-history-atlas/wars.html>**  
**研究模式：<https://csgpjy.github.io/europe-history-atlas/research.html>**

**手机安装：** 用手机打开主站，Android Chrome 选择“安装应用”，iPhone Safari 选择“分享 → 添加到主屏幕”。详见 [docs/MOBILE.md](docs/MOBILE.md)。

## 特点

- **历史地图 × 时间轴**：拖动 1490–1905 年时间轴，地图在 1500 / 1600 / 1650 / 1700 / 1715 / 1783 / 1800 / 1815 / 1880 / 1900 十个边界快照间淡入切换。
- **水系与城市**：叠加 Natural Earth 50m 河流、湖泊与主要城市点，便于理解战争与交通的地理条件。
- **四类事件与两级深度**：政治、经济、文化、社会四类筛选；默认展示 12 条核心事件，可展开 18 条扩展事件，避免时间轴拥挤。
- **独立战争线**：`wars.html` 单列 1494–1878 年 14 场国家间战争，紫、金两色区分交战双方，附关键战役、结果与教材章节；三十年战争、七年战争、拿破仑战争支持阶段切换。
- **研究模式**：`research.html` 独立入口，默认不加载外部服务；点击后加载本地 MapLibre 与单年 GeoJSON，附 OHM 外部对照和 Cliopatria 数据/授权说明。
- **事件驱动的高亮**：点击事件菱形或地图脉冲标记，相关政权以紫色高亮；核心政权（如西班牙哈布斯堡）与参战方分两级呈现。
- **深色沉浸式视觉**：藏蓝底 `#0a0e17`、羊皮纸噪点、暗角、青色发光国界 `#22d3ee`、紫色事件区 `#a855f7`、细金线玻璃拟态知识面板。
- **零依赖运行**：D3 与历史边界均已本地化，`file://` 直接打开也能用；无框架、无构建步骤（CI 仅负责生成数据）。
- **可访问与响应式**：时间轴支持方向键 / Home / End，遵循 `prefers-reduced-motion`；桌面为侧栏版面，移动端为底部抽屉。
- **可安装到手机（PWA）**：`manifest.webmanifest` + `sw.js` + 本地图标；Android / iOS 可添加到主屏幕，主站与战争线支持离线缓存。

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
node tools/fetch_assets.js          # 下载 10 个年份、D3、MapLibre、Natural Earth
node tools/build_borders.js         # 裁剪、简化、预投影 → data/borders.js
node tools/build_research_geojson.js # MapLibre 单年 GeoJSON → data/research/
```

`data/geo/`、`data/research/`、`data/borders.json`、`vendor/` 均为生成物，不提交到仓库；GitHub Actions 会在部署时自动生成。

## 部署

站点已上线：<https://csgpjy.github.io/europe-history-atlas/>。GitHub Pages 的 **Source 为 GitHub Actions**。

每次推送到 `main`，`.github/workflows/pages.yml`（运行名 **Build, validate and deploy atlas**）会：

1. 下载 D3、十个年份的历史边界与 Natural Earth 50m 水系/城市；
2. 在 Node 中完成裁剪 / 简化 / 圆锥投影，输出 `data/borders.js`；
3. 运行 `tools/validate.js` 做数据与 PWA 资源校验；
4. 组装 `_site/`（含 manifest、Service Worker、图标），更新 **`gh-pages`** 镜像分支，并通过 Actions 部署线上站点。

手机安装与离线行为详见 [docs/MOBILE.md](docs/MOBILE.md)。

详见 [DEPLOY.md](DEPLOY.md)。

## 目录

```
index.html              时代全景：地图、时间轴、分类筛选、知识面板
wars.html               战争线：14 场国家间战争、双方阵营、阶段与战役
research.html           研究模式：MapLibre 自托管原型 + OHM 对照 + Cliopatria 说明
manifest.webmanifest    PWA 清单：名称、图标、独立窗口、主题色
sw.js                   Service Worker：应用壳离线缓存
assets/icons/           PWA / Apple touch / favicon 图标
css/style.css           视觉系统（设计令牌、玻璃拟态、时间轴）
css/wars.css            战争线专属样式
css/research.css        研究模式样式
js/app.js               主页面交互
js/wars.js              战争线交互（双方高亮、战争带、阶段）
js/research.js          研究模式按需加载、MapLibre 与耗时记录
js/pwa.js               Service Worker 注册与安装按钮
data/events.js          12 条核心事件：年代、摘要、关键节点、出处、高亮选择器
data/events-extra.js    18 条扩展事件：政治 / 经济 / 文化 / 社会，附教材章节
data/events-meta.js     核心事件的分类元数据
data/wars.js            14 场战争：双方阵营、阶段、战役、结果、教材出处
data/research/          生成物：MapLibre 研究模式单年 GeoJSON 快照
data/borders.js         生成物：十个年份的预投影 SVG 路径、水系与城市点
tools/fetch_assets.js   下载原始边界、D3、MapLibre 与 Natural Earth 图层
tools/build_borders.js  裁剪 / 简化 / 投影 / 生成标签质心
tools/build_research_geojson.js  生成 MapLibre 研究模式单年 GeoJSON
tools/validate.js       事件、战争、研究数据与构建产物校验
docs/MOBILE.md          手机安装、离线行为与 APK 说明
.github/workflows/pages.yml
```

## 数据与史实说明

- **史料来源**：核心事件参考 Britannica 与中文维基百科；18 条扩展事件从吴于廑、齐世荣主编《世界史·近代史编》上卷、下卷（高等教育出版社，第 2 版）提取，并在知识面板标注具体章节。
- 边界为**示意性重建**，用于呈现政权空间关系的宏观变化，不等同于精确的历史勘界；细部与同期实际控制可能存在差异。
- 事件年代取通行学界分期；个别事件（如七年战争）使用最接近的**战前快照**，并在面板中注明。

## 许可

- **代码**（HTML / CSS / JS / 构建脚本）：MIT，见 [LICENSE](LICENSE)。
- **历史边界数据及其衍生 SVG 路径**：GPL-3.0，见 [DATA-LICENSE.md](DATA-LICENSE.md)。
