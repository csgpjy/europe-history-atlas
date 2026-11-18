/* 研究模式原型：默认零外部请求，点击后才创建 OHM iframe。 */
(function () {
  'use strict';

  var yearInput = document.getElementById('researchYear');
  var yearOut = document.getElementById('researchYearOut');
  var loadButton = document.getElementById('ohmLoad');
  var unloadButton = document.getElementById('ohmUnload');
  var openLink = document.getElementById('ohmOpen');
  var wrap = document.getElementById('ohmFrameWrap');
  var placeholder = document.getElementById('ohmPlaceholder');
  var status = document.getElementById('ohmStatus');

  if (!yearInput || !loadButton || !wrap) return;

  var frame = null;
  var loadStart = 0;
  var loadTimer = null;

  function embedUrl(year) {
    return 'https://embed.openhistoricalmap.org/#map=4/50/15&date=' + encodeURIComponent(year) +
      '&layer=O&language=zh&bbox=-15,35,40,65';
  }

  function setStatus(message, kind) {
    status.textContent = '状态：' + message;
    status.classList.remove('is-ok', 'is-warn', 'is-error');
    if (kind) status.classList.add('is-' + kind);
  }

  function syncControls() {
    var year = yearInput.value;
    yearOut.textContent = year;
    openLink.href = embedUrl(year);
  }

  function clearFrame() {
    if (loadTimer) clearTimeout(loadTimer);
    loadTimer = null;
    if (frame && frame.parentNode) frame.parentNode.removeChild(frame);
    frame = null;
    placeholder.style.display = '';
    unloadButton.disabled = true;
    loadButton.textContent = '加载实时图层';
  }

  function unload() {
    clearFrame();
    setStatus('未加载');
  }

  function load() {
    if (frame) {
      if (frame.parentNode) frame.parentNode.removeChild(frame);
      frame = null;
    }
    placeholder.style.display = 'none';
    setStatus('正在请求 OHM 外部服务…', 'warn');
    loadButton.textContent = '重新加载';
    unloadButton.disabled = false;

    var year = yearInput.value;
    loadStart = performance.now();
    frame = document.createElement('iframe');
    frame.title = 'OpenHistoricalMap ' + year + ' 年欧洲历史地图';
    frame.loading = 'lazy';
    frame.referrerPolicy = 'no-referrer-when-downgrade';
    frame.setAttribute('allow', 'fullscreen');
    frame.addEventListener('load', function () {
      var elapsed = Math.round(performance.now() - loadStart);
      if (loadTimer) clearTimeout(loadTimer);
      loadTimer = null;
      setStatus('iframe 已触发 load，用时约 ' + elapsed + ' ms；若画面空白，说明网络或 OHM 服务不可达。', 'ok');
    });
    frame.src = embedUrl(year);
    wrap.appendChild(frame);

    if (loadTimer) clearTimeout(loadTimer);
    loadTimer = setTimeout(function () {
      if (frame) {
        setStatus('12 秒内未收到 load 事件；可能是网络/服务不可达，或 iframe 被拦截。', 'warn');
      }
    }, 12000);
  }

  yearInput.addEventListener('input', syncControls);
  yearInput.addEventListener('change', function () {
    syncControls();
    if (frame) load();
  });
  loadButton.addEventListener('click', load);
  unloadButton.addEventListener('click', unload);

  syncControls();
  unloadButton.disabled = true;
})();
