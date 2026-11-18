/* PWA：注册 Service Worker，并在 Edge / 手机浏览器显示安装入口与说明。 */
(function () {
  'use strict';

  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').catch(function () {
      /* 本地 file:// 或某些浏览器不支持时静默失败，不影响页面。 */
    });
  });

  var ua = navigator.userAgent || '';
  var isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
  var isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
  var deferredPrompt = null;
  var installButton = null;

  function removeButton() {
    if (installButton && installButton.parentNode) installButton.parentNode.removeChild(installButton);
    installButton = null;
  }

  function closeHelp() {
    var help = document.getElementById('pwaHelp');
    if (help) help.remove();
  }

  function showHelp() {
    if (document.getElementById('pwaHelp')) return;
    var help = document.createElement('div');
    help.id = 'pwaHelp';
    help.className = 'pwa-help';
    help.innerHTML =
      '<div class="pwa-help-card" role="dialog" aria-modal="true" aria-labelledby="pwaHelpTitle">' +
      '<button type="button" class="pwa-help-close" aria-label="关闭安装说明">×</button>' +
      '<span class="pwa-help-kicker">EUROPA · 安装到手机</span>' +
      '<h2 id="pwaHelpTitle">用 Edge 安装</h2>' +
      '<ol>' +
      '<li><b>Edge Android</b>：右上角菜单 <b>…</b> → “添加到手机”或“安装应用”。</li>' +
      '<li><b>Edge 桌面</b>：菜单 <b>…</b> → “应用” → “将此站点安装为应用”。</li>' +
      '<li><b>iPhone</b>：分享按钮 → “添加到主屏幕”；若 Edge 没有该选项，请用 Safari 打开。</li>' +
      '</ol>' +
      '<p>安装后从主屏打开，可离线查看主站与战争线。研究模式的 MapLibre 图层首次需要联网。</p>' +
      '<a class="pwa-help-link" href="install.html">完整手机安装指南 →</a>' +
      '<button type="button" class="pwa-help-ok">知道了</button>' +
      '</div>';
    document.body.appendChild(help);
    help.addEventListener('click', function (event) {
      if (event.target === help || event.target.classList.contains('pwa-help-close') ||
        event.target.classList.contains('pwa-help-ok')) closeHelp();
    });
  }

  function showButton() {
    if (installButton || isStandalone) return;
    installButton = document.createElement('button');
    installButton.type = 'button';
    installButton.id = 'pwaInstall';
    installButton.className = 'pwa-install';
    installButton.textContent = isMobile ? '安装到手机' : '安装为应用';
    installButton.addEventListener('click', function () {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function () {
          deferredPrompt = null;
          removeButton();
        }).catch(function () {
          deferredPrompt = null;
          showHelp();
        });
      } else {
        showHelp();
      }
    });
    document.body.appendChild(installButton);
  }

  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    deferredPrompt = event;
    showButton();
  });

  window.addEventListener('appinstalled', function () {
    deferredPrompt = null;
    removeButton();
    closeHelp();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeHelp();
  });
})();
