# 部署说明

站点已上线：

```
https://csgpjy.github.io/europe-history-atlas/
```

GitHub Pages 的 **Source 为 GitHub Actions**。每次推送到 `main`，工作流 **Build, validate and deploy atlas** 会：

1. 下载 D3 与 7 个年份的历史边界；
2. 裁剪 / 简化 / 圆锥投影，生成 `data/borders.js`；
3. 运行 `tools/validate.js` 校验事件与地图数据；
4. 组装 `_site/`；
5. 同时更新 **`gh-pages` 分支**（镜像）并通过 GitHub Actions 部署线上站点。

## 为什么之前卡住

GitHub 的 Pages 创建接口要求**仓库管理员身份**；Actions 的 `GITHUB_TOKEN` 即使声明了 `pages: write`，也无法创建 Pages 站点（`GET /pages` 404、`POST /pages` 403）。仓库所有者在 Settings → Pages 中启用后，部署链路即可全自动运行。

## 日常更新

直接改 `main` 上的源码并推送即可，不需要再进 Pages 设置。构建产物（`data/borders.js`、`vendor/`）由 CI 生成，不提交到仓库。

## 故障排查

- **Actions 在 “Fetch map sources” 失败**：CI 优先使用 `raw.githubusercontent.com`，GitHub API 作为兜底；若仍失败，检查仓库 Actions 的网络或限流。
- **部署成功但页面 404**：确认 Settings → Pages 的 Source 仍为 **GitHub Actions**，并检查 `github-pages` environment 的部署记录。
- **本地打开空白**：直接双击 `index.html` 需要同目录存在 `vendor/d3.min.js` 与 `data/borders.js`，这两个是构建产物。

## 本地预览

```bash
python -m http.server 8000
```

打开 <http://127.0.0.1:8000>。

## 离线交付包

`dist/europe-history-atlas-site.zip` 是完整静态站点（8 个文件，约 277KB），可拖到任意静态托管（Netlify Drop、Cloudflare Pages、Nginx）直接使用。
