/* 研究模式：MapLibre 自托管图层（默认）+ OHM 外部对照（按需）。 */
(function () {
  'use strict';

  var MAP_YEARS = [1500, 1600, 1650, 1700, 1715, 1783, 1800, 1815, 1880, 1900];

  var mapYearInput = document.getElementById('mapYear');
  var mapYearOut = document.getElementById('mapYearOut');
  var mapLoad = document.getElementById('mapLoad');
  var mapUnload = document.getElementById('mapUnload');
  var mapStatus = document.getElementById('mapStatus');
  var mapPlaceholder = document.getElementById('mapPlaceholder');
  var mapEl = document.getElementById('researchMap');

  var map = null;
  var mapStart = 0;

  function snapshotYear() {
    return MAP_YEARS[Number(mapYearInput.value)] || 1700;
  }

  function setMapStatus(message, kind) {
    mapStatus.textContent = '状态：' + message;
    mapStatus.classList.remove('is-ok', 'is-warn', 'is-error');
    if (kind) mapStatus.classList.add('is-' + kind);
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[data-research-lib="maplibre"]')) { resolve(); return; }
      var script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.dataset.researchLib = 'maplibre';
      script.onload = resolve;
      script.onerror = function () { reject(new Error('无法加载 ' + src)); };
      document.head.appendChild(script);
    });
  }

  function loadCss(href) {
    if (document.querySelector('link[data-research-lib="maplibre-css"]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.researchLib = 'maplibre-css';
    document.head.appendChild(link);
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  async function fetchSnapshot(year) {
    var response = await fetch('data/research/' + year + '.geojson');
    if (!response.ok) throw new Error('快照请求失败 HTTP ' + response.status);
    return response.json();
  }

  async function loadMap() {
    var year = snapshotYear();
    mapStart = performance.now();
    setMapStatus('正在加载 MapLibre 与 ' + year + ' 年快照…', 'warn');
    mapLoad.textContent = '重新加载';
    mapUnload.disabled = false;

    try {
      await loadScript('vendor/maplibre-gl.js');
      loadCss('vendor/maplibre-gl.css');
      var data = await fetchSnapshot(year);
      if (map) { map.remove(); map = null; }
      mapPlaceholder.style.display = 'none';

      map = new maplibregl.Map({
        container: 'researchMap',
        style: {
          version: 8,
          sources: {},
          layers: [{ id: 'bg', type: 'background', paint: { 'background-color': '#0a0e17' } }],
        },
        center: [10, 50],
        zoom: 3.6,
        attributionControl: false,
        dragRotate: false,
        pitchWithRotate: false,
      });

      map.on('load', function () {
        map.addSource('borders', { type: 'geojson', data: data });
        map.addLayer({
          id: 'borders-fill',
          type: 'fill',
          source: 'borders',
          paint: { 'fill-color': '#1a2a44', 'fill-opacity': 0.82 },
        });
        map.addLayer({
          id: 'borders-line',
          type: 'line',
          source: 'borders',
          paint: { 'line-color': '#22d3ee', 'line-width': 1, 'line-opacity': 0.72 },
        });
        map.fitBounds([[-15, 35], [40, 65]], { padding: 22, duration: 0 });
        var elapsed = Math.round(performance.now() - mapStart);
        var canvas = map.getCanvas();
        setMapStatus('MapLibre 已加载 ' + year + ' 年：' + data.features.length +
          ' 个多边形，约 ' + elapsed + ' ms；画布 ' + canvas.width + '×' + canvas.height + '。', 'ok');
      });

      map.on('click', 'borders-fill', function (event) {
        var feature = event.features && event.features[0];
        if (!feature) return;
        var props = feature.properties || {};
        new maplibregl.Popup({ closeButton: false, offset: 8 })
          .setLngLat(event.lngLat)
          .setHTML('<strong>' + escapeHtml(props.name || props.label || '') + '</strong>' +
            (props.subject ? '<br><small>' + escapeHtml(props.subject) + '</small>' : ''))
          .addTo(map);
      });

      map.on('error', function (event) {
        if (event && event.error) setMapStatus('MapLibre 渲染错误：' + event.error.message, 'error');
      });
    } catch (error) {
      setMapStatus(error.message || 'MapLibre 加载失败', 'error');
      mapPlaceholder.style.display = '';
      mapLoad.textContent = '重新加载';
    }
  }

  function unloadMap() {
    if (map) { map.remove(); map = null; }
    mapPlaceholder.style.display = '';
    mapUnload.disabled = true;
    mapLoad.textContent = '加载自托管图层';
    setMapStatus('未加载');
  }

  async function updateMapYear() {
    mapYearOut.textContent = snapshotYear();
    if (!map) return;
    try {
      setMapStatus('正在切换 ' + snapshotYear() + ' 年快照…', 'warn');
      var data = await fetchSnapshot(snapshotYear());
      map.getSource('borders').setData(data);
      setMapStatus('已切换 ' + snapshotYear() + ' 年：' + data.features.length + ' 个多边形。', 'ok');
    } catch (error) {
      setMapStatus(error.message || '快照切换失败', 'error');
    }
  }

  if (mapYearInput) {
    mapYearInput.addEventListener('input', function () {
      mapYearOut.textContent = snapshotYear();
    });
    mapYearInput.addEventListener('change', updateMapYear);
  }
  if (mapLoad) mapLoad.addEventListener('click', loadMap);
  if (mapUnload) mapUnload.addEventListener('click', unloadMap);
  if (mapYearOut) mapYearOut.textContent = snapshotYear();
  if (mapUnload) mapUnload.disabled = true;

  /* ── OHM 外部对照（保持按需加载） ───────────────── */
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
    loadButton.textContent = '加载 OHM 嵌入';
  }

  function unload() {
    clearFrame();
    setStatus('未加载');
  }

  function load() {
    if (frame && frame.parentNode) frame.parentNode.removeChild(frame);
    frame = null;
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
      if (frame) setStatus('12 秒内未收到 load 事件；可能是网络/服务不可达，或 iframe 被拦截。', 'warn');
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

  if (new URLSearchParams(location.search).get('map') === '1') {
    loadMap();
  }
})();
