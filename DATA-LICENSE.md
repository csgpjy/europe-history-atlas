# 数据许可

本项目的历史政权边界来自 **[historical-basemaps](https://github.com/aourednik/historical-basemaps)**，该项目以 **GNU General Public License v3.0** 发布。

- 原始数据：`geojson/world_{1500,1600,1700,1715,1783,1815,1900}.geojson`
- 经裁剪、简化、预投影后生成的 `data/borders.js` 属于上述数据的衍生作品，同样按 **GPL-3.0** 分发。
- GPL-3.0 全文：<https://www.gnu.org/licenses/gpl-3.0.txt>

地理轮廓与水系/城市参考 **Natural Earth**（公有领域）。

研究模式引用的外部数据与库：

- **OpenHistoricalMap**：CC0 / 公有领域，见 <https://www.openhistoricalmap.org/>；研究页仅按需加载其官方 embed，不把 OHM 数据打包进仓库。
- **Cliopatria（Seshat）**：数据 CC BY 4.0，见 <https://github.com/Seshat-Global-History-Databank/cliopatria>；研究页仅展示数据说明与链接，当前未打包其数据。
- **MapLibre GL JS**：BSD-3-Clause，见 <https://github.com/maplibre/maplibre-gl-js>；以本地 vendor 文件形式按需加载。

事件文字为项目作者撰写，引用来源列于 `data/events.js`、`data/war-details.js` 与页面知识面板。文字内容以吴于廑、齐世荣主编《世界史·近代史编》上/下卷（第2版）章节为主要依据，逐条章节对照见 `docs/SOURCES.md`；外部补充同样记录于该文件。代码部分采用 MIT 许可，见 `LICENSE`。
