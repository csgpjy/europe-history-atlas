# 手机部署与安装

项目已经按 **PWA（可安装 Web App）** 配置，不需要应用商店，也不需要 APK。

## 在线地址

- 主站：<https://csgpjy.github.io/europe-history-atlas/>
- 战争线：<https://csgpjy.github.io/europe-history-atlas/wars.html>
- 研究模式：<https://csgpjy.github.io/europe-history-atlas/research.html>

GitHub Pages 使用 HTTPS，满足 Service Worker 与 PWA 安装前提。

## 先看这里：Edge 是主推浏览器

站点按 **Microsoft Edge（Chromium）** 验证，不依赖 Chrome。Edge 桌面、Edge Android 都可以安装为应用；iPhone 上如果 Edge 没有“添加到主屏幕”，改用 Safari 的分享菜单。

### Edge Android（推荐）

1. 用 Edge 打开主站。
2. 右上角菜单 **…**。
3. 选择 **“安装应用”** 或 **“添加到手机”**（不同 Edge 版本文案略有差异）。
4. 桌面出现 **EUROPA** 图标后，可全屏打开。

如果菜单里没有安装项：先正常浏览几秒，让 Service Worker 完成注册，再刷新页面重试。手机端页面左下角也会出现 **“安装到手机”** 按钮。

### Edge 桌面

1. 打开主站。
2. 右上角 **…** → **“应用”** → **“将此站点安装为应用”**。
3. 安装后从开始菜单或桌面启动。

安装后从开始菜单或桌面启动。

桌面端默认收起左下角的安装按钮，请使用 Edge 的“应用”菜单；手机端可点击页面左下角的 **“安装到手机”**。

### iPhone / iPad

1. 优先用 **Safari** 打开主站。
2. 点击底部分享按钮 → **“添加到主屏幕”**。
3. 命名为 “EUROPA” 后添加。

Edge iOS 版本若分享菜单没有“添加到主屏幕”，请改用 Safari；站点本身在 Edge iOS 中仍然可以正常浏览。

## 主站内的战争线

主站点击 **“战争线 · 14 场国家间战争”** 会在主站内打开全屏战争视图，不跳转到独立网站；关闭按钮或 `Esc` 返回时代全景。

- 直达地址仍然可用：<https://csgpjy.github.io/europe-history-atlas/wars.html>
- 深链接示例：`/#wars/seven-years-war/1`、`/wars.html#napoleonic-wars/2`
- 战争视图会被 Service Worker 一起缓存，离线也能打开。

## 离线能力

首次打开并完成 Service Worker 安装后：

- 主站、战争线、研究模式页面可离线打开；
- 边界、事件、战争、CSS、JS 会从缓存读取；
- **研究模式第一次打开 MapLibre 图层时需要联网**，之后 MapLibre 脚本、当年 GeoJSON 会被运行时缓存；
- **OHM 外部对照**需要网络，离线时只会显示失败/超时提示；
- 修改页面后如果仍看到旧版本，关闭所有标签页再重新打开，或在浏览器设置中清除该站点缓存。

## 本地预览

Service Worker 只信任 `https://` 或 `http://localhost`：

```powershell
python -m http.server 8765
```

然后打开 <http://127.0.0.1:8765/>。用局域网 IP（如 `http://192.168.x.x:8765`）访问时，普通页面可看，但 PWA 安装与 Service Worker 可能被浏览器拒绝。

## 部署方式

推送 `main` 后，GitHub Actions 会自动：

1. 下载边界、Natural Earth、MapLibre 与 D3；
2. 生成 SVG 边界和 MapLibre 研究快照；
3. 校验数据；
4. 组装 `manifest.webmanifest`、`sw.js`、`assets/icons/` 与三个页面；
5. 部署到 GitHub Pages。

配置文件：`.github/workflows/pages.yml`。

## 如果要 APK

当前交付是 PWA，优点是无需签名、无需应用商店、更新即时。如果确实需要 Android APK，可在现有静态站点外再套一层 Capacitor：

```text
Capacitor + 本地 WebView 包装 GitHub Pages 或打包 dist 静态文件
```

这需要 Android Studio / Android SDK 和签名流程，属于额外工程；建议先用 PWA 验证手机上的实际使用体验。
