# 手机部署与安装

项目已经按 **PWA（可安装 Web App）** 配置，不需要应用商店，也不需要 APK。

## 在线地址

- 主站：<https://csgpjy.github.io/europe-history-atlas/>
- 战争线：<https://csgpjy.github.io/europe-history-atlas/wars.html>
- 研究模式：<https://csgpjy.github.io/europe-history-atlas/research.html>

GitHub Pages 使用 HTTPS，满足 Service Worker 与 PWA 安装前提。

## Android

1. 用 Chrome 打开主站。
2. 右上角菜单选择 **“安装应用”** 或 **“添加到主屏幕”**。
3. 桌面出现 **EUROPA** 图标后，可像普通 App 一样全屏打开。

部分浏览器会在页面加载后显示左下角 **“安装到手机”** 按钮，点击即可安装。

## iPhone / iPad

1. 用 **Safari** 打开主站。
2. 点击底部分享按钮。
3. 选择 **“添加到主屏幕”**。
4. 命名为 “EUROPA” 后添加。

iOS 不提供自动安装提示，必须从 Safari 的分享菜单添加。

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
