/* PWA：注册 Service Worker，并在浏览器允许时显示安装入口。 */
(function () {
  'use strict';

  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').catch(function () {
      /* 本地 file:// 或某些浏览器不支持时静默失败，不影响页面。 */
    });
  });

  var deferredPrompt = null;
  var installButton = null;

  function removeButton() {
    if (installButton && installButton.parentNode) installButton.parentNode.removeChild(installButton);
    installButton = null;
  }

  function showButton() {
    if (installButton || window.matchMedia('(display-mode: standalone)').matches) return;
    installButton = document.createElement('button');
    installButton.type = 'button';
    installButton.id = 'pwaInstall';
    installButton.className = 'pwa-install';
    installButton.textContent = '安装到手机';
    installButton.addEventListener('click', function () {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function () {
        deferredPrompt = null;
        removeButton();
      }).catch(function () {
        deferredPrompt = null;
        removeButton();
      });
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
  });
})();
