# 部署说明

站点是纯静态文件。GitHub Actions 会在每次推送到 `main` 时构建并校验，然后把构建产物强制推送到 **`gh-pages` 分支**（含 `.nojekyll`）。

因此启用线上站点只需要 **一个手动开关**：

## 启用 Pages

1. 打开 <https://github.com/csgpjy/europe-history-atlas/settings/pages>
2. **Build and deployment → Source** 选择 **Deploy from a branch**
3. **Branch** 选择 **`gh-pages`**，目录保持 **`/ (root)`**
4. 点 **Save**

约 30 秒后访问：

```
https://csgpjy.github.io/europe-history-atlas/
```

之后每次 `main` 有更新，工作流 **Build and publish atlas** 会自动重建并刷新 `gh-pages`，不需要再进设置。

## 为什么不能全自动

GitHub 的 Pages 创建接口要求**仓库管理员身份**；Actions 使用的 `GITHUB_TOKEN` 即使声明了 `pages: write`，也没有创建 Pages 站点的权限（实测 `POST /pages` 返回 403，`GET /pages` 为 404）。所以最后这个开关必须由仓库所有者在网页上点一次。

## 如果看不到 Source 下拉框

常见原因：

- **账号邮箱未验证**：打开 <https://github.com/settings/emails> 完成验证后刷新；
- **仓库不是公开的**：免费账户的 Pages 需要公开仓库；
- **账号较新/被风控**：GitHub 可能要求先完成验证，按页面提示操作。

把设置页的提示原文发出来即可继续排查。

## 本地预览

```bash
python -m http.server 8000
```

打开 <http://127.0.0.1:8000>。

## 离线交付包

`dist/europe-history-atlas-site.zip` 是完整静态站点（8 个文件，约 277KB），可拖到任意静态托管（Netlify Drop、Cloudflare Pages、Nginx）直接使用。
