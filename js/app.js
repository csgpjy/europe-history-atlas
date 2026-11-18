/* EUROPA 1500–1900 — 交互逻辑
 * 依赖：vendor/d3.min.js、data/borders.js、data/events.js
 * 所有数据均已本地化，file:// 直接打开也可运行。
 */
(function () {
  'use strict';

  var ATLAS = window.ATLAS;
  var CORE_META = window.CORE_EVENT_META || {};
  var EVENTS = (window.HISTORY_EVENTS || []).concat(window.HISTORY_EVENTS_EXTRA || []);
  if (!ATLAS || !EVENTS.length) return;

  EVENTS.forEach(function (event) {
    var meta = CORE_META[event.id];
    if (meta) {
      event.tier = meta.tier;
      event.category = meta.category;
    }
    event.tier = event.tier || 'core';
    event.category = event.category || '政治';
  });

  var EXTRA_COUNT = (window.HISTORY_EVENTS_EXTRA || []).length;
  var YEARS = ATLAS.years.slice().sort(function (a, b) { return a - b; });
  var DOMAIN = [1490, 1905];
  var INITIAL = 1700;
  var state = { year: INITIAL, era: INITIAL, activeId: null, playing: false, category: 'all', showExtra: false };

  var CN = {
    France: '法兰西', Spain: '西班牙', Portugal: '葡萄牙', England: '英格兰',
    'England and Ireland': '英格兰-爱尔兰', Scotland: '苏格兰', Ireland: '爱尔兰',
    'Holy Roman Empire': '神圣罗马帝国', 'Austrian Empire': '奥地利',
    'Austria Hungary': '奥匈帝国', Prussia: '普鲁士', Bavaria: '巴伐利亚',
    Saxony: '萨克森', 'Polish–Lithuanian Commonwealth': '波兰-立陶宛',
    'Poland-Lithuania': '波兰-立陶宛', 'Tsardom of Muscovy': '莫斯科公国',
    'Russian Empire': '俄罗斯帝国', Sweden: '瑞典', 'Sweden–Norway': '瑞典-挪威',
    'Denmark-Norway': '丹麦-挪威', Denmark: '丹麦', 'Ottoman Empire': '奥斯曼帝国',
    Venice: '威尼斯', Milan: '米兰', Naples: '那不勒斯', 'Papal States': '教宗国',
    'Sardinia-Piedmont': '萨伏依-撒丁', Savoy: '萨伏依', Sardinia: '撒丁',
    'Kingdom of Sardinia': '撒丁王国', Sicily: '西西里', Tuscany: '托斯卡纳',
    Genoa: '热那亚', 'Dutch Republic': '荷兰共和国', Netherlands: '尼德兰',
    'Habsburg Netherlands': '哈布斯堡尼德兰', 'Spanish Netherlands': '西属尼德兰',
    'Swiss Confederation': '瑞士联邦', Italy: '意大利', Germany: '德意志帝国',
    Greece: '希腊', Serbia: '塞尔维亚', Romania: '罗马尼亚', Bulgaria: '保加利亚',
    Hungary: '匈牙利', 'Imperial Hungary': '匈牙利', 'Crimean Khanate': '克里米亚汗国',
    Morocco: '摩洛哥', 'United Kingdom of Great Britain and Ireland': '英国',
    'United Kingdom': '英国', 'Kingdom of Ireland': '爱尔兰',
    'United Kingdom of Netherlands': '尼德兰联合王国', Lombardy: '伦巴第',
    Venetia: '威尼西亚', 'Republic of the Seven Zenden': '七州共和国',
    'Kalmar Union': '卡尔马联盟', 'Grand Duchy of Moscow': '莫斯科大公国',
    'Aragón': '阿拉贡', Castille: '卡斯蒂利亚', 'Teutonic Knights': '条顿骑士团',
    'Golden Horde': '金帐汗国', Britany: '布列塔尼', 'Mamluke Sultanate': '马穆鲁克',
    'Hafsid Caliphate': '哈夫斯王朝', 'Zayyanid Caliphate': '齐亚尼王朝',
    'Wattasid Caliphate': '瓦塔斯王朝', 'Emirate of the White Sheep Turks': '白羊王朝',
    Georgia: '格鲁吉亚', Pskov: '普斯科夫', Cyprus: '塞浦路斯', Malta: '马耳他',
    Iceland: '冰岛', Norway: '挪威', Finland: '芬兰', Livonia: '利沃尼亚',
    Courland: '库尔兰', Hanover: '汉诺威', 'Württemberg': '符腾堡', Baden: '巴登',
    'Hesse-Kassel': '黑森-卡塞尔', Mecklenburg: '梅克伦堡', Holstein: '荷尔斯泰因',
    Oldenburg: '奥尔登堡', Luxembourg: '卢森堡', Belgium: '比利时',
    Switzerland: '瑞士', Albania: '阿尔巴尼亚', Bosnia: '波斯尼亚',
    Montenegro: '黑山', Wallachia: '瓦拉几亚', Moldavia: '摩尔达维亚',
    Transylvania: '特兰西瓦尼亚', Croatia: '克罗地亚', Slovenia: '斯洛文尼亚',
    Anatolia: '安纳托利亚', Syria: '叙利亚', Palestine: '巴勒斯坦', Crete: '克里特',
    Tripoli: '的黎波里', Tunis: '突尼斯', Algiers: '阿尔及尔', Egypt: '埃及',
    Persia: '波斯', Arabs: '阿拉伯部落', 'Sámi': '萨米', Finnmark: '芬马克',
    Poland: '波兰', Austria: '奥地利', 'Kingdom of the Two Sicilies': '两西西里',
    'Austrian Netherlands': '奥属尼德兰', 'Milano (Austria)': '米兰（奥属）',
  };

  var SNAPSHOT_NOTES = {
    1500: '宗教改革前夜',
    1600: '三十年战争前夜',
    1650: '威斯特伐利亚体系',
    1700: '西班牙王位继承战争前夕',
    1715: '乌得勒支体系',
    1783: '法国大革命前夜',
    1800: '拿破仑战争前夜',
    1815: '维也纳体系',
    1880: '民族国家定型',
    1900: '世纪之交',
  };

  function labelFor(name) {
    if (CN[name]) return CN[name];
    return name.replace(/Empire$/, '').replace(/\s+/g, ' ').trim();
  }

  function resolveEra(year) {
    var best = YEARS[0];
    var gap = Infinity;
    for (var i = 0; i < YEARS.length; i += 1) {
      var d = Math.abs(YEARS[i] - year);
      if (d < gap) { gap = d; best = YEARS[i]; }
    }
    return best;
  }

  function eraForEvent(event) {
    if (YEARS.indexOf(event.snapshot) !== -1) return event.snapshot;
    var earlier = YEARS.filter(function (y) { return y <= event.year; });
    return earlier.length ? earlier[earlier.length - 1] : YEARS[0];
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function isVisible(event) {
    if (event.tier === 'extra' && !state.showExtra) return false;
    if (state.category !== 'all' && event.category !== state.category) return false;
    return true;
  }

  function visibleEvents() {
    return EVENTS.filter(isVisible).sort(function (a, b) { return a.year - b.year; });
  }

  var svg = d3.select('#map');
  if (ATLAS.land) svg.select('#land').attr('d', ATLAS.land);
  else svg.select('#land').remove();
  svg.select('#graticule').remove();
  svg.select('#rivers').attr('d', (ATLAS.water && ATLAS.water.rivers) || '');
  svg.select('#lakes').attr('d', (ATLAS.water && ATLAS.water.lakes) || '');

  var cityLayer = svg.select('#cities');
  (ATLAS.cities || []).forEach(function (city) {
    var group = cityLayer.append('g').attr('transform', 'translate(' + city.x + ',' + city.y + ')');
    group.append('circle').attr('class', 'city-dot').attr('r', city.r <= 1 ? 1.6 : 1.1);
    if (city.r <= 1) {
      group.append('text').attr('class', 'city-label').attr('x', 3).attr('y', 2).text(city.n);
    }
  });

  var projection = d3.geoConicConformal()
    .parallels([38, 62])
    .rotate([-12, 0])
    .center([0, 52]);
  projection.fitExtent([[30, 26], [970, 794]], {
    type: 'Polygon',
    coordinates: [
      [
        [-16, 35],
        [-16, 70],
        [36, 70],
        [36, 35],
        [-16, 35],
      ],
    ],
  });

  /* ── 政权边界与标签 ─────────────────────────────── */
  var eraGroups = new Map();
  var erasSelection = svg.select('#eras');

  YEARS.forEach(function (year) {
    var group = erasSelection.append('g')
      .attr('class', 'era' + (year === state.era ? '' : ' is-off'))
      .attr('data-year', year);

    var placed = [];
    var labelled = {};
    ATLAS.borders[year].forEach(function (feature) {
      group.append('path')
        .attr('class', 'polity')
        .attr('d', feature.d)
        .attr('data-name', feature.n)
        .attr('data-subject', feature.s || '');

      if (feature.cx == null || feature.cy == null) return;
      if (labelled[feature.n]) return;
      if (feature.cx < 45 || feature.cx > 955 || feature.cy < 40 || feature.cy > 790) return;
      if (placed.length >= 11) return;
      for (var i = 0; i < placed.length; i += 1) {
        var dx = placed[i][0] - feature.cx;
        var dy = placed[i][1] - feature.cy;
        if (Math.sqrt(dx * dx + dy * dy) < 58) return;
      }
      placed.push([feature.cx, feature.cy]);
      labelled[feature.n] = true;
      group.append('text')
        .attr('class', 'era-label')
        .attr('x', feature.cx)
        .attr('y', feature.cy)
        .attr('text-anchor', 'middle')
        .text(labelFor(feature.n));
    });

    eraGroups.set(year, group);
  });

  /* ── 事件标记 ───────────────────────────────────── */
  var markers = [];
  var markerLayer = svg.select('#markers');

  EVENTS.forEach(function (event) {
    (event.points || []).slice(0, 4).forEach(function (point, index) {
      var xy = projection([point.lon, point.lat]);
      if (!xy || !isFinite(xy[0]) || !isFinite(xy[1])) return;
      var g = markerLayer.append('g')
        .attr('class', 'marker')
        .attr('data-event', event.id)
        .attr('transform', 'translate(' + xy[0].toFixed(1) + ',' + xy[1].toFixed(1) + ')');

      g.append('circle').attr('class', 'halo').attr('r', index === 0 ? 9.5 : 6.5);
      g.append('circle').attr('class', 'core').attr('r', index === 0 ? 3 : 2.2);
      if (index === 0) {
        g.append('text').attr('class', 'tag').attr('x', 8).attr('y', 3)
          .text(event.title);
      }
      g.on('click', function (domEvent) {
        domEvent.stopPropagation();
        selectEvent(event.id);
      });
      markers.push({ el: g, event: event, node: g.node() });
    });
  });

  function updateMarkers() {
    markers.forEach(function (marker) {
      var e = marker.event;
      var near = isVisible(e) && (state.activeId === e.id
        || Math.abs(e.year - state.year) <= 7
        || (state.year >= e.year - 1 && state.year <= (e.end || e.year) + 1));
      marker.node.classList.toggle('is-near', !!near);
      marker.node.classList.toggle('is-active', state.activeId === e.id);
    });
  }

  /* ── 高亮 ───────────────────────────────────────── */
  function clearHighlight() {
    document.querySelectorAll('.polity.is-hi, .polity.is-related').forEach(function (node) {
      node.classList.remove('is-hi');
      node.classList.remove('is-related');
    });
  }

  function applyHighlight(event) {
    clearHighlight();
    var active = eraGroups.get(state.era);
    if (!active) return;
    var names = {};
    var subjects = {};
    (event.highlights.names || []).forEach(function (n) { names[n] = true; });
    (event.highlights.subjects || []).forEach(function (s) { subjects[s] = true; });
    var hasSubjects = Object.keys(subjects).length > 0;

    active.selectAll('.polity').each(function () {
      var name = this.getAttribute('data-name');
      var subject = this.getAttribute('data-subject');
      var isSubject = subject && subjects[subject];
      if (isSubject) {
        this.classList.add('is-hi');
      } else if (names[name]) {
        this.classList.add(hasSubjects ? 'is-related' : 'is-hi');
      }
    });
  }

  /* ── 面板 ───────────────────────────────────────── */
  var panel = document.getElementById('panel');
  var panelScroll = document.getElementById('panelScroll');

  function setPanelScrollTop() { panelScroll.scrollTop = 0; }

  function openPanel() { panel.classList.add('is-open'); }

  function overviewPanel() {
    var chips = YEARS.map(function (year) {
      return '<button class="chip' + (year === state.era ? ' is-on' : '') +
        '" data-snap="' + year + '">' + year + '</button>';
    }).join('');

    var visible = visibleEvents();
    var groups = ['政治', '经济', '文化', '社会'].map(function (category) {
      var items = visible.filter(function (event) { return event.category === category; });
      if (!items.length) return '';
      var list = items.map(function (event) {
        return '<li><button data-id="' + event.id + '"' +
          (state.activeId === event.id ? ' class="is-on"' : '') + '>' +
          '<span class="idx-year">' + escapeHtml(event.kicker) + '</span>' +
          '<span class="idx-title">' + escapeHtml(event.title) + '</span>' +
          '<span class="idx-dot"></span></button></li>';
      }).join('');
      return '<div class="idx-group"><h4>' + category + '<span>' + items.length +
        '</span></h4><ul class="event-index">' + list + '</ul></div>';
    }).join('');

    var filterNote = !state.showExtra && state.category === 'all'
      ? '<p class="panel-note">当前只显示 12 条核心事件。打开时间轴上方的「扩展事件」可查看 ' +
        EXTRA_COUNT + ' 条经济、文化与社会史条目；也可按类别筛选。</p>'
      : '';

    panelScroll.innerHTML =
      '<div class="panel-kicker">阅读指南</div>' +
      '<h2>四百年，<em>' + EVENTS.length + ' 个切面</em></h2>' +
      '<p class="panel-summary">地图以 1500 至 1900 年间的 ' + YEARS.length + ' 个政权边界快照为骨架，串联 ' +
      EVENTS.length + ' 个事件（核心 12 条、扩展 ' + EXTRA_COUNT + ' 条）。' +
      '拖动时间轴浏览时代，按政治 / 经济 / 文化 / 社会筛选，点击紫色菱形或地图脉冲标记查看史料与空间细节。</p>' +
      '<div class="panel-section"><h3>如何使用</h3><ul class="fact-list">' +
      '<li><b>拖动</b><span>时间轴滑块，地图会切换到最接近的边界快照</span></li>' +
      '<li><b>筛选</b><span>时间轴上方切换类别，或展开「扩展事件」</span></li>' +
      '<li><b>点击</b><span>事件菱形或紫色标记，查看详情与高亮政权</span></li>' +
      '<li><b>播放</b><span>按下左侧 ▶，观看 1500–1900 年的连续演进</span></li>' +
      '</ul></div>' +
      '<div class="panel-section"><h3>边界快照</h3><div class="chip-row">' + chips + '</div></div>' +
      '<div class="panel-section"><h3>事件索引</h3>' +
      (groups || '<p class="panel-note">当前筛选没有事件。</p>') + '</div>' +
      filterNote +
      '<p class="panel-note">边界为学术重建的示意数据，细部与同期实际控制存在差异；' +
      '事件年代与史实以知识面板所列教材章节与延伸阅读为准。</p>' +
      '<div class="panel-foot">史料：吴于廑、齐世荣主编《世界史·近代史编》上/下卷 · 数据：historical-basemaps（GPL-3.0）· D3</div>';

    panelScroll.querySelectorAll('[data-snap]').forEach(function (button) {
      button.addEventListener('click', function () {
        var year = Number(button.getAttribute('data-snap'));
        setYear(year);
        clearEvent();
      });
    });
    panelScroll.querySelectorAll('[data-id]').forEach(function (button) {
      button.addEventListener('click', function () {
        selectEvent(button.getAttribute('data-id'));
      });
    });
    setPanelScrollTop();
  }

  function eventPanel(event) {
    var facts = (event.facts || []).map(function (fact) {
      return '<li><b>' + escapeHtml(fact.y) + '</b><span>' + escapeHtml(fact.t) + '</span></li>';
    }).join('');
    var sources = (event.sources || []).map(function (source) {
      if (source.url) {
        return '<li><a href="' + escapeHtml(source.url) + '" target="_blank" rel="noopener noreferrer">' +
          escapeHtml(source.label) + '</a></li>';
      }
      return '<li><span class="source-text">' + escapeHtml(source.label) + '</span></li>';
    }).join('');

    panelScroll.innerHTML =
      '<button class="back-link" id="backBtn">← 返回时期概览</button>' +
      '<div class="panel-kicker"><span class="cat-badge">' + escapeHtml(event.category) + '</span>' +
      escapeHtml(event.kicker) + (event.tier === 'extra' ? ' · 扩展' : '') + '</div>' +
      '<h2>' + escapeHtml(event.title) + '</h2>' +
      '<p class="panel-summary">' + escapeHtml(event.summary) + '</p>' +
      '<div class="panel-section"><h3>关键节点</h3><ul class="fact-list">' + facts + '</ul></div>' +
      (event.note ? '<p class="panel-note">' + escapeHtml(event.note) + '</p>' : '') +
      '<div class="panel-section"><h3>延伸阅读</h3><ul class="source-list">' + sources + '</ul></div>' +
      '<div class="panel-foot">地图快照：' + eraForEvent(event) +
      ' 年 · 紫色区域为事件相关政权 · 边界为示意性重建</div>';

    var back = document.getElementById('backBtn');
    if (back) back.addEventListener('click', function () { clearEvent(); });
    setPanelScrollTop();
    openPanel();
  }

  /* ── 时间轴 ─────────────────────────────────────── */
  var yearNow = document.getElementById('yearNow');
  var track = document.getElementById('track');
  var trackProgress = document.getElementById('trackProgress');
  var trackPlayhead = document.getElementById('trackPlayhead');
  var snapshotChips = document.getElementById('snapshotChips');
  var snapshotLabel = document.getElementById('snapshotLabel');
  var playBtn = document.getElementById('playBtn');

  function percent(year) {
    return ((year - DOMAIN[0]) / (DOMAIN[1] - DOMAIN[0])) * 100;
  }

  var trackEvents = document.getElementById('trackEvents');
  var categoryFilters = document.getElementById('categoryFilters');
  var extraToggle = document.getElementById('extraToggle');
  var extraCount = document.getElementById('extraCount');

  function renderTrackEvents() {
    if (!trackEvents) return;
    trackEvents.innerHTML = '';
    visibleEvents().forEach(function (event, index) {
      var button = document.createElement('button');
      button.className = 'track-event';
      button.type = 'button';
      button.style.left = percent(event.year) + '%';
      button.style.top = index % 2 === 0 ? '14px' : '3px';
      button.setAttribute('data-id', event.id);
      button.setAttribute('data-title', event.kicker + ' · ' + event.title);
      button.setAttribute('aria-label', event.kicker + ' ' + event.title);
      button.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
      button.addEventListener('click', function (e) {
        e.stopPropagation();
        selectEvent(event.id);
      });
      trackEvents.appendChild(button);
    });
    updateTimeline();
  }

  function syncFilterUI() {
    if (categoryFilters) {
      categoryFilters.querySelectorAll('.filter').forEach(function (button) {
        button.classList.toggle('is-on', button.getAttribute('data-cat') === state.category);
      });
    }
    if (extraToggle) {
      extraToggle.classList.toggle('is-on', state.showExtra);
      extraToggle.setAttribute('aria-pressed', state.showExtra ? 'true' : 'false');
    }
  }

  function refreshFilters() {
    syncFilterUI();
    renderTrackEvents();
    updateMarkers();
    if (state.activeId) {
      var active = EVENTS.filter(function (event) { return event.id === state.activeId; })[0];
      if (!active || !isVisible(active)) clearEvent();
    } else {
      overviewPanel();
    }
  }

  function setupFilters() {
    if (extraCount) extraCount.textContent = EXTRA_COUNT;
    if (categoryFilters) {
      categoryFilters.addEventListener('click', function (e) {
        var button = e.target.closest('[data-cat]');
        if (!button) return;
        state.category = button.getAttribute('data-cat');
        if (state.category !== 'all' && state.category !== '政治') state.showExtra = true;
        refreshFilters();
      });
    }
    if (extraToggle) {
      extraToggle.addEventListener('click', function () {
        state.showExtra = !state.showExtra;
        if (!state.showExtra && state.category !== 'all' && state.category !== '政治') {
          state.category = 'all';
        }
        refreshFilters();
      });
    }
  }

  function buildTimeline() {
    for (var year = 1500; year <= 1900; year += 50) {
      var tick = document.createElement('div');
      tick.className = 'axis-tick';
      tick.style.left = percent(year) + '%';
      tick.innerHTML = '<span>' + year + '</span>';
      track.appendChild(tick);
    }

    YEARS.forEach(function (year) {
      var button = document.createElement('button');
      button.className = 'snap';
      button.type = 'button';
      button.setAttribute('data-snap', year);
      button.textContent = year;
      button.addEventListener('click', function () {
        setYear(year);
        clearEvent();
      });
      snapshotChips.appendChild(button);
    });

    renderTrackEvents();
    syncFilterUI();
  }

  function updateTimeline() {
    yearNow.textContent = state.year;
    trackProgress.style.width = percent(state.year) + '%';
    trackPlayhead.style.left = percent(state.year) + '%';
    track.setAttribute('aria-valuenow', state.year);
    track.setAttribute('aria-valuetext', state.year + ' 年，边界快照 ' + state.era);
    snapshotLabel.textContent = '边界快照 ' + state.era + ' · ' + (SNAPSHOT_NOTES[state.era] || '');
    snapshotChips.querySelectorAll('.snap').forEach(function (button) {
      button.classList.toggle('is-on', Number(button.getAttribute('data-snap')) === state.era);
    });
    document.querySelectorAll('.track-event').forEach(function (button) {
      button.classList.toggle('is-on', button.getAttribute('data-id') === state.activeId);
    });
  }

  function setEra(era) {
    state.era = era;
    eraGroups.forEach(function (group, year) {
      group.classed('is-off', year !== era);
    });
  }

  function setYear(year, options) {
    options = options || {};
    var clamped = Math.max(DOMAIN[0], Math.min(DOMAIN[1], Math.round(year)));
    state.year = clamped;
    var era = options.era || resolveEra(clamped);
    if (era !== state.era) setEra(era);
    updateTimeline();
    updateMarkers();
  }

  function selectEvent(id) {
    var event = EVENTS.filter(function (e) { return e.id === id; })[0];
    if (!event) return;
    if (!isVisible(event)) {
      state.category = 'all';
      state.showExtra = true;
    }
    state.activeId = id;
    refreshFilters();
    setYear(event.year, { keepEvent: true, era: eraForEvent(event) });
    applyHighlight(event);
    eventPanel(event);
    updateMarkers();
    try { history.replaceState(null, '', '#' + id); } catch (e) { /* file:// */ }
  }

  function clearEvent() {
    state.activeId = null;
    clearHighlight();
    updateTimeline();
    updateMarkers();
    overviewPanel();
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* file:// */ }
  }

  /* ── 播放 ───────────────────────────────────────── */
  var rafId = null;
  var lastTime = 0;

  function stopPlay() {
    state.playing = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    playBtn.textContent = '▶';
    playBtn.classList.remove('is-playing');
    playBtn.setAttribute('aria-label', '播放 1500 至 1900 年历史演进');
  }

  function tick(time) {
    if (!state.playing) return;
    if (!lastTime) lastTime = time;
    var delta = Math.min(80, time - lastTime);
    lastTime = time;
    var next = state.year + delta * 0.055;
    if (next >= DOMAIN[1]) {
      setYear(DOMAIN[1]);
      stopPlay();
      return;
    }
    setYear(next);
    rafId = requestAnimationFrame(tick);
  }

  playBtn.addEventListener('click', function () {
    if (state.playing) { stopPlay(); return; }
    if (state.activeId) clearEvent();
    if (state.year >= DOMAIN[1]) setYear(DOMAIN[0]);
    state.playing = true;
    lastTime = 0;
    playBtn.textContent = '❚❚';
    playBtn.classList.add('is-playing');
    playBtn.setAttribute('aria-label', '暂停');
    rafId = requestAnimationFrame(tick);
  });

  /* ── 拖动与键盘 ─────────────────────────────────── */
  var dragging = false;

  function yearFromPointer(clientX) {
    var rect = track.getBoundingClientRect();
    var ratio = (clientX - rect.left) / rect.width;
    ratio = Math.max(0, Math.min(1, ratio));
    return DOMAIN[0] + ratio * (DOMAIN[1] - DOMAIN[0]);
  }

  track.addEventListener('pointerdown', function (e) {
    if (e.target.closest('.track-event')) return;
    dragging = true;
    track.setPointerCapture(e.pointerId);
    stopPlay();
    if (state.activeId) clearEvent();
    setYear(yearFromPointer(e.clientX));
  });

  track.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    setYear(yearFromPointer(e.clientX));
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    if (track.hasPointerCapture && track.hasPointerCapture(e.pointerId)) {
      track.releasePointerCapture(e.pointerId);
    }
  }
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);

  track.addEventListener('keydown', function (e) {
    var step = e.shiftKey ? 10 : 2;
    var handled = true;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') setYear(state.year - step);
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') setYear(state.year + step);
    else if (e.key === 'Home') setYear(DOMAIN[0]);
    else if (e.key === 'End') setYear(DOMAIN[1]);
    else if (e.key === 'Escape') clearEvent();
    else handled = false;
    if (handled) e.preventDefault();
  });

  /* ── 地图交互 ───────────────────────────────────── */
  var tooltip = document.getElementById('tooltip');

  document.getElementById('eras').addEventListener('mousemove', function (e) {
    var path = e.target.closest ? e.target.closest('.polity') : null;
    if (!path) { tooltip.classList.remove('is-on'); return; }
    var name = path.getAttribute('data-name');
    var subject = path.getAttribute('data-subject');
    tooltip.innerHTML = '<span>' + escapeHtml(labelFor(name)) + '</span>' +
      (subject && subject !== name ? '<small>' + escapeHtml(subject) + '</small>' : '');
    tooltip.style.left = e.clientX + 'px';
    tooltip.style.top = e.clientY + 'px';
    tooltip.classList.add('is-on');
  });

  document.getElementById('eras').addEventListener('mouseleave', function () {
    tooltip.classList.remove('is-on');
  });

  svg.on('click', function (e) {
    if (e.target.closest && e.target.closest('.marker')) return;
    if (e.target.classList.contains('polity')) return;
    clearEvent();
  });

  /* ── 响应式构图 ─────────────────────────────────── */
  function fitMap() {
    document.getElementById('map').setAttribute('preserveAspectRatio', 'xMidYMid meet');
  }
  fitMap();
  window.addEventListener('resize', fitMap);

  document.getElementById('panelClose').addEventListener('click', function () {
    panel.classList.remove('is-open');
    clearEvent();
  });

  /* ── 主站内战争线视图 ─────────────────────────────── */
  var warOverlay = document.getElementById('warOverlay');
  var warOverlayBody = document.getElementById('warOverlayBody');
  var warOverlayClose = document.getElementById('warOverlayClose');
  var warLineLink = document.getElementById('warLineLink');
  var warFrame = null;
  var warReturnHash = '';

  function warHashTarget() {
    var raw = (location.hash || '').replace('#', '');
    if (raw.indexOf('wars') !== 0) return null;
    var rest = raw.slice(4).replace(/^\/+/, '');
    return {
      hash: rest,
      src: 'wars.html?embed=1' + (rest ? '#' + rest : ''),
    };
  }

  function openWarView(updateUrl) {
    if (!warOverlay) return;
    var target = warHashTarget() || { hash: '', src: 'wars.html?embed=1' };
    if (updateUrl) {
      warReturnHash = location.hash.indexOf('#wars') === 0 ? '' : location.hash;
    }

    if (warFrame && warFrame.getAttribute('data-target') !== target.src) {
      warFrame.setAttribute('data-target', target.src);
      warFrame.src = target.src;
    }
    if (!warFrame) {
      warFrame = document.createElement('iframe');
      warFrame.title = '战争线：1494–1878 年欧洲国家间战争';
      warFrame.loading = 'lazy';
      warFrame.setAttribute('data-target', target.src);
      warFrame.src = target.src;
      warOverlayBody.appendChild(warFrame);
    }

    warOverlay.hidden = false;
    warOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('war-view-open');
    requestAnimationFrame(function () { warOverlay.classList.add('is-open'); });
    if (updateUrl) {
      var nextHash = '#wars' + (target.hash ? '/' + target.hash : '');
      try { history.replaceState(null, '', location.pathname + location.search + nextHash); } catch (e) { /* file:// */ }
    }
    setTimeout(function () { if (warOverlayClose) warOverlayClose.focus(); }, 80);
  }

  function closeWarView(updateUrl) {
    if (!warOverlay || warOverlay.hidden) return;
    warOverlay.classList.remove('is-open');
    warOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('war-view-open');
    setTimeout(function () {
      if (warOverlay.classList.contains('is-open')) return;
      warOverlay.hidden = true;
      if (warFrame) {
        warFrame.remove();
        warFrame = null;
      }
    }, 260);
    if (updateUrl !== false) {
      try {
        history.replaceState(null, '', location.pathname + location.search + (warReturnHash || ''));
      } catch (e) { /* file:// */ }
    }
    if (warLineLink) warLineLink.focus();
  }

  if (warLineLink) {
    warLineLink.addEventListener('click', function (event) {
      event.preventDefault();
      openWarView(true);
    });
  }
  if (warOverlayClose) {
    warOverlayClose.addEventListener('click', function () { closeWarView(true); });
  }
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && warOverlay && !warOverlay.hidden) closeWarView(true);
  });
  window.addEventListener('hashchange', function () {
    if (warHashTarget()) openWarView(false);
    else if (warOverlay && !warOverlay.hidden) closeWarView(false);
  });

  /* ── 启动 ───────────────────────────────────────── */
  var params = new URLSearchParams(location.search);
  var initialCategory = params.get('cat');
  if (['政治', '经济', '文化', '社会'].indexOf(initialCategory) !== -1) {
    state.category = initialCategory;
    if (initialCategory !== '政治') state.showExtra = true;
  }
  if (params.get('extra') === '1') state.showExtra = true;

  setupFilters();
  buildTimeline();
  overviewPanel();
  setYear(INITIAL);

  var hash = (location.hash || '').replace('#', '');
  if (warHashTarget()) {
    openWarView(false);
  } else if (hash && EVENTS.some(function (e) { return e.id === hash; })) {
    selectEvent(hash);
  }
})();
