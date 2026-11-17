# 部署说明

站点是纯静态文件，构建产物已经由 GitHub Actions 推送到 **`gh-pages` 分支**。因此有两条启用路径，任选其一。

## 方式 A：分支部署（最快，推荐）

适合不想依赖 Actions 权限的情况。

1. 打开 <https://github.com/csgpjy/europe-history-atlas/settings/pages>
2. **Build and deployment → Source** 选择 **Deploy from a branch**
3. **Branch** 选择 **`gh-pages`**，目录保持 **`/ (root)`**
4. 点 **Save**

约 30 秒后访问：

```
https://csgpjy.github.io/europe-history-atlas/
```

`gh-pages` 分支由 `.github/workflows/pages.yml` 在每次推送到 `main` 时自动更新，无需手动维护。

## 方式 B：GitHub Actions

1. 同一个设置页，**Source** 选择 **GitHub Actions**
2. 打开 <https://github.com/csgpjy/europe-history-atlas/actions>
3. 选择最新的 **Deploy atlas to GitHub Pages**，点 **Re-run all jobs**

工作流会依次执行：拉取历史底图 → 投影构建 → 数据校验 → 打包 → 发布。

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
