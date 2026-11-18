/* 欧洲战争线：独立分支页面逻辑
 * 依赖：vendor/d3.min.js、data/borders.js、data/wars.js
 */
(function () {
  'use strict';

  if (new URLSearchParams(location.search).get('embed') === '1') {
    document.body.classList.add('is-embedded');
  }

  var ATLAS = window.ATLAS;
  var WARS = window.HISTORY_WARS;
  if (!ATLAS || !WARS || !WARS.length) return;

  var YEARS = ATLAS.years.slice().sort(function (a, b) { return a - b; });
  var DOMAIN = [1490, 1905];
  var DEFAULT_WAR = 'spanish-succession-war';
  var state = { activeId: null, era: 1700, phaseIndex: 0 };

  var WAR_CN = {
    France: '法国', Spain: '西班牙', Portugal: '葡萄牙', 'England and Ireland': '英国',
    'United Kingdom': '英国', 'United Kingdom of Great Britain and Ireland': '英国',
    'Holy Roman Empire': '神圣罗马帝国', 'Austrian Empire': '奥地利', Prussia: '普鲁士',
    Bavaria: '巴伐利亚', Saxony: '萨克森', Hanover: '汉诺威', Denmark: '丹麦',
    'Denmark-Norway': '丹麦-挪威', Sweden: '瑞典', 'Sweden–Norway': '瑞典-挪威',
    'Tsardom of Muscovy': '俄国', 'Russian Empire': '俄国', Netherlands: '尼德兰',
    'Dutch Republic': '荷兰共和国', 'Habsburg Netherlands': '哈布斯堡尼德兰',
    'Spanish Netherlands': '西属尼德兰', 'Austrian Netherlands': '奥属尼德兰',
    'Ottoman Empire': '奥斯曼帝国', Venice: '威尼斯', Milan: '米兰', Naples: '那不勒斯',
    'Papal States': '教宗国', 'Savoy-Piedmont': '萨伏依-撒丁', 'Kingdom of Sardinia': '撒丁王国',
    'Polish–Lithuanian Commonwealth': '波兰-立陶宛', Poland: '波兰', Castille: '卡斯蒂利亚',
    Aragón: '阿拉贡', 'Kingdom of the Two Sicilies': '两西西里', Romania: '罗马尼亚',
    Serbia: '塞尔维亚', Montenegro: '黑山', Germany: '德意志帝国', Italy: '意大利',
  };

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function percent(year) {
    return ((year - DOMAIN[0]) / (DOMAIN[1] - DOMAIN[0])) * 100;
  }

  function nearestEra(year) {
    var best = YEARS[0];
    var gap = Infinity;
    for (var i = 0; i < YEARS.length; i += 1) {
      var d = Math.abs(YEARS[i] - year);
      if (d < gap) { gap = d; best = YEARS[i]; }
    }
    return best;
  }

  var svg = d3.select('#map');
  svg.select('#rivers').attr('d', (ATLAS.water && ATLAS.water.rivers) || '');
  svg.select('#lakes').attr('d', (ATLAS.water && ATLAS.water.lakes) || '');
  var cityLayer = svg.select('#cities');
  (ATLAS.cities || []).forEach(function (city) {
    var group = cityLayer.append('g').attr('transform', 'translate(' + city.x + ',' + city.y + ')');
    group.append('circle').attr('class', 'city-dot').attr('r', city.r <= 1 ? 1.5 : 1);
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

  /* ── 地图 ───────────────────────────────────────── */
  var eraGroups = new Map();
  var eras = svg.select('#eras');

  YEARS.forEach(function (year) {
    var group = eras.append('g')
      .attr('class', 'era' + (year === state.era ? '' : ' is-off'))
      .attr('data-year', year);
    ATLAS.borders[year].forEach(function (feature) {
      group.append('path')
        .attr('class', 'polity')
        .attr('d', feature.d)
        .attr('data-name', feature.n);
    });
    eraGroups.set(year, group);
  });

  function setEra(year) {
    state.era = year;
    eraGroups.forEach(function (group, key) {
      group.classed('is-off', key !== year);
    });
  }

  /* ── 时间轴 ─────────────────────────────────────── */
  var warTrack = document.getElementById('warTrack');
  var warLanes = document.getElementById('warLanes');
  var warAxis = document.getElementById('warAxis');
  var warPlayhead = document.getElementById('warPlayhead');
  var warYear = document.getElementById('warYear');
  var warName = document.getElementById('warName');
  var warRange = document.getElementById('warRange');
  var warCount = document.getElementById('warCount');

  var sortedWars = WARS.slice().sort(function (a, b) { return a.start - b.start; });
  var laneEnds = [];
  sortedWars.forEach(function (war) {
    var lane = laneEnds.findIndex(function (end) { return end < war.start; });
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(0);
    }
    laneEnds[lane] = war.end;
    war._lane = lane;
  });
  var laneCount = Math.max(1, laneEnds.length);
  warTrack.style.height = Math.max(108, 30 + laneCount * 22) + 'px';

  for (var year = 1500; year <= 1900; year += 50) {
    var tick = document.createElement('div');
    tick.className = 'war-tick';
    tick.style.left = percent(year) + '%';
    tick.innerHTML = '<span>' + year + '</span>';
    warAxis.appendChild(tick);
  }

  var barById = {};
  sortedWars.forEach(function (war) {
    var bar = document.createElement('button');
    bar.type = 'button';
    bar.className = 'war-bar';
    bar.style.left = percent(war.start) + '%';
    bar.style.width = Math.max(0.55, percent(war.end) - percent(war.start)) + '%';
    bar.style.top = (war._lane * 22) + 'px';
    bar.setAttribute('data-id', war.id);
    bar.setAttribute('aria-label', war.name + ' ' + war.start + '—' + war.end);
    bar.title = war.name + ' · ' + war.start + '—' + war.end;
    if (percent(war.end) - percent(war.start) > 6.5) {
      var label = document.createElement('span');
      label.textContent = war.name;
      bar.appendChild(label);
    }
    bar.addEventListener('click', function () { selectWar(war.id); });
    warLanes.appendChild(bar);
    barById[war.id] = bar;
  });

  if (warCount) warCount.textContent = WARS.length;

  function currentPhase(war) {
    return war.phases && war.phases[state.phaseIndex] ? war.phases[state.phaseIndex] : null;
  }

  function currentSides(war) {
    var phase = currentPhase(war);
    return phase ? { a: phase.a, b: phase.b } : war.sides;
  }

  function updateTimeline(war) {
    var phase = currentPhase(war);
    var focusYear = phase ? phase.from : war.start;
    warYear.textContent = focusYear;
    warName.textContent = war.name;
    warRange.textContent = phase
      ? phase.from + '—' + phase.to + ' / ' + war.start + '—' + war.end
      : war.start + '—' + war.end;
    warPlayhead.style.left = percent(focusYear) + '%';
    Object.keys(barById).forEach(function (id) {
      barById[id].classList.toggle('is-on', id === war.id);
    });
  }

  /* ── 高亮与标记 ─────────────────────────────────── */
  var sideLabelLayer = svg.select('#sideLabels');
  var battleLayer = svg.select('#battles');

  function clearMapSelection() {
    document.querySelectorAll('.polity.side-a, .polity.side-b').forEach(function (node) {
      node.classList.remove('side-a');
      node.classList.remove('side-b');
    });
    sideLabelLayer.selectAll('*').remove();
    battleLayer.selectAll('*').remove();
  }

  function renderSides(war) {
    var group = eraGroups.get(state.era);
    if (!group) return;
    var sides = currentSides(war);
    var labelled = {};
    ['a', 'b'].forEach(function (sideKey) {
      var side = sides[sideKey];
      if (!side) return;
      (side.polities || []).forEach(function (polity) {
        group.selectAll('.polity').each(function () {
          if (this.getAttribute('data-name') === polity.name) {
            this.classList.add('side-' + sideKey);
          }
        });
        if (labelled[polity.name]) return;
        var feature = ATLAS.borders[state.era].filter(function (f) { return f.n === polity.name; })[0];
        if (!feature || feature.cx == null || feature.cy == null) return;
        if (feature.cx < 40 || feature.cx > 960 || feature.cy < 40 || feature.cy > 790) return;
        labelled[polity.name] = true;
        sideLabelLayer.append('text')
          .attr('class', 'war-side-label side-' + sideKey)
          .attr('x', feature.cx)
          .attr('y', feature.cy)
          .text(polity.label || WAR_CN[polity.name] || polity.name);
      });
    });
  }

  function renderBattles(war) {
    battleLayer.selectAll('*').remove();
    var phase = currentPhase(war);
    var battles = (war.battles || []).filter(function (battle) {
      return !phase || (battle.year >= phase.from && battle.year <= phase.to);
    });
    if (!battles.length) battles = war.battles || [];
    var shown = 0;
    battles.forEach(function (battle) {
      if (shown >= 5) return;
      var xy = projection([battle.lon, battle.lat]);
      if (!xy || !isFinite(xy[0]) || !isFinite(xy[1])) return;
      if (xy[0] < 8 || xy[0] > 992 || xy[1] < 8 || xy[1] > 812) return;
      var g = battleLayer.append('g')
        .attr('class', 'battle-marker')
        .attr('transform', 'translate(' + xy[0].toFixed(1) + ',' + xy[1].toFixed(1) + ')');
      g.append('circle').attr('class', 'battle-halo').attr('r', 6.5);
      g.append('circle').attr('class', 'battle-core').attr('r', 2.3);
      g.append('text').attr('class', 'battle-label').attr('x', 7).attr('y', 3)
        .text(battle.name);
      g.on('mousemove', function (event) {
        showTooltip(event, battle.name, battle.year + ' 年');
      });
      g.on('mouseleave', hideTooltip);
      shown += 1;
    });
  }

  /* ── 面板 ───────────────────────────────────────── */
  var panel = document.getElementById('warPanel');
  var panelScroll = document.getElementById('warPanelScroll');
  var tooltip = document.getElementById('warTooltip');

  function openPanel() { panel.classList.add('is-open'); }

  function renderIndex() {
    var groups = [
      { label: '15—16世纪', test: function (w) { return w.start < 1600; } },
      { label: '17世纪', test: function (w) { return w.start >= 1600 && w.start < 1700; } },
      { label: '18世纪', test: function (w) { return w.start >= 1700 && w.start < 1800; } },
      { label: '19世纪', test: function (w) { return w.start >= 1800; } },
    ];
    var html = groups.map(function (group) {
      var items = sortedWars.filter(group.test);
      if (!items.length) return '';
      var list = items.map(function (war) {
        return '<li><button data-id="' + war.id + '"' +
          (state.activeId === war.id ? ' class="is-on"' : '') + '>' +
          '<span class="war-years">' + war.start + '—' + war.end + '</span>' +
          '<span>' + escapeHtml(war.name) + '</span><span>›</span></button></li>';
      }).join('');
      return '<div class="war-index-group"><h4>' + group.label +
        ' · ' + items.length + ' 场</h4><ul class="war-index">' + list + '</ul></div>';
    }).join('');

    panelScroll.innerHTML =
      '<div class="panel-kicker">战争线 · 国家间战争</div>' +
      '<h2>十四场战争，<em>一部欧洲均势史</em></h2>' +
      '<p class="panel-summary">从意大利战争到俄土战争，这里只收录<strong>国家之间的战争</strong>。' +
      '点击色条或列表，查看交战双方、关键战役、结果与教材章节；地图以紫、金两色区分两大阵营。</p>' +
      '<div class="panel-note">范围：1494–1878 年，欧洲列强之间的主要战争；内战、殖民地战争与帝国扩张不在此列。</div>' +
      '<div class="panel-section"><h3>战争索引</h3>' + html + '</div>' +
      '<div class="panel-foot">史料：吴于廑、齐世荣主编《世界史·近代史编》上/下卷（高等教育出版社，第2版）</div>';

    panelScroll.querySelectorAll('[data-id]').forEach(function (button) {
      button.addEventListener('click', function () {
        selectWar(button.getAttribute('data-id'));
      });
    });
    panelScroll.scrollTop = 0;
  }

  function renderWar(war) {
    var sides = currentSides(war);
    var sideA = sides.a;
    var sideB = sides.b;
    var phase = currentPhase(war);
    var phaseStrip = '';
    if (war.phases && war.phases.length) {
      phaseStrip = '<div class="war-phase-strip">' + war.phases.map(function (item, index) {
        return '<button type="button" class="war-phase' +
          (index === state.phaseIndex ? ' is-on' : '') + '" data-phase="' + index + '">' +
          item.from + '—' + item.to + '<span>' + escapeHtml(item.label) + '</span></button>';
      }).join('') + '</div>';
    }
    var battles = (war.battles || []).map(function (battle) {
      return '<li><b>' + battle.year + '</b><span>' + escapeHtml(battle.name) + '</span></li>';
    }).join('');
    var sources = (war.sources || []).map(function (source) {
      if (source.url) {
        return '<li><a href="' + escapeHtml(source.url) + '" target="_blank" rel="noopener noreferrer">' +
          escapeHtml(source.label) + '</a></li>';
      }
      return '<li><span class="source-text">' + escapeHtml(source.label) + '</span></li>';
    }).join('');

    panelScroll.innerHTML =
      '<button class="back-link" id="warBack">← 战争列表</button>' +
      '<div class="panel-kicker">战争线 · ' + war.start + '—' + war.end + '</div>' +
      '<h2>' + escapeHtml(war.name) + '</h2>' +
      phaseStrip +
      '<div class="war-side-row">' +
      '<div class="war-side-chip a"><b>交战方 A</b><span>' + escapeHtml(sideA.label) + '</span></div>' +
      '<div class="war-side-chip b"><b>交战方 B</b><span>' + escapeHtml(sideB.label) + '</span></div>' +
      '</div>' +
      '<p class="panel-summary">' + escapeHtml(war.summary) + '</p>' +
      (phase && phase.note ? '<p class="panel-note"><strong>本阶段：</strong>' + escapeHtml(phase.note) + '</p>' : '') +
      '<div class="panel-section"><h3>关键战役</h3><ul class="war-battle-list">' + battles + '</ul></div>' +
      '<p class="panel-note"><strong>结果：</strong>' + escapeHtml(war.outcome) + '</p>' +
      '<p class="panel-note">' + escapeHtml(war.note) + '</p>' +
      '<div class="panel-section"><h3>教材与延伸</h3><ul class="source-list">' + sources + '</ul></div>' +
      '<div class="panel-foot">地图快照：' + state.era + ' 年 · 紫色 = 交战方 A，金色 = 交战方 B · 边界为示意性重建</div>';

    var back = document.getElementById('warBack');
    if (back) back.addEventListener('click', showIndex);
    panelScroll.querySelectorAll('[data-phase]').forEach(function (button) {
      button.addEventListener('click', function () {
        selectPhase(Number(button.getAttribute('data-phase')));
      });
    });
    panelScroll.scrollTop = 0;
    openPanel();
  }

  function selectWar(id, phaseIndex) {
    var war = WARS.filter(function (item) { return item.id === id; })[0];
    if (!war) return;
    state.activeId = id;
    state.phaseIndex = war.phases && Number.isInteger(phaseIndex) && phaseIndex >= 0 && phaseIndex < war.phases.length
      ? phaseIndex : 0;
    var phase = currentPhase(war);
    var era = YEARS.indexOf(phase && phase.snapshot ? phase.snapshot : war.snapshot) !== -1
      ? (phase && phase.snapshot ? phase.snapshot : war.snapshot)
      : nearestEra(war.start);
    if (era !== state.era) setEra(era);
    clearMapSelection();
    renderSides(war);
    renderBattles(war);
    renderWar(war);
    updateTimeline(war);
    var hash = war.phases && war.phases.length > 1 ? id + '/' + state.phaseIndex : id;
    try { history.replaceState(null, '', '#' + hash); } catch (e) { /* file:// */ }
  }

  function selectPhase(index) {
    var war = WARS.filter(function (item) { return item.id === state.activeId; })[0];
    if (!war || !war.phases || !war.phases[index]) return;
    state.phaseIndex = index;
    var phase = war.phases[index];
    var targetEra = phase.snapshot || war.snapshot;
    var era = YEARS.indexOf(targetEra) !== -1 ? targetEra : nearestEra(war.start);
    if (era !== state.era) setEra(era);
    clearMapSelection();
    renderSides(war);
    renderBattles(war);
    renderWar(war);
    updateTimeline(war);
    try { history.replaceState(null, '', '#' + war.id + '/' + index); } catch (e) { /* file:// */ }
  }

  function showIndex() {
    state.activeId = null;
    state.phaseIndex = 0;
    clearMapSelection();
    if (state.era !== nearestEra(1700)) setEra(nearestEra(1700));
    renderIndex();
    Object.keys(barById).forEach(function (id) { barById[id].classList.remove('is-on'); });
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* file:// */ }
  }

  /* ── Tooltip / 交互 ─────────────────────────────── */
  function showTooltip(event, title, sub) {
    tooltip.innerHTML = '<span>' + escapeHtml(title) + '</span>' +
      (sub ? '<small>' + escapeHtml(sub) + '</small>' : '');
    tooltip.style.left = event.clientX + 'px';
    tooltip.style.top = event.clientY + 'px';
    tooltip.classList.add('is-on');
  }

  function hideTooltip() { tooltip.classList.remove('is-on'); }

  eras.on('mousemove', function (event) {
    var path = event.target.closest ? event.target.closest('.polity') : null;
    if (!path) { hideTooltip(); return; }
    var name = path.getAttribute('data-name');
    showTooltip(event, WAR_CN[name] || name, '');
  });
  eras.on('mouseleave', hideTooltip);

  document.getElementById('warClose').addEventListener('click', function () {
    panel.classList.remove('is-open');
  });

  function fitMap() {
    document.getElementById('map').setAttribute('preserveAspectRatio', 'xMidYMid meet');
  }
  fitMap();
  window.addEventListener('resize', fitMap);

  /* ── 启动 ───────────────────────────────────────── */
  var hash = (location.hash || '').replace('#', '');
  var hashParts = hash.split('/');
  var hashWar = WARS.filter(function (war) { return war.id === hashParts[0]; })[0];
  if (hashWar) {
    selectWar(hashWar.id, hashParts[1] ? Number(hashParts[1]) : 0);
  } else {
    selectWar(DEFAULT_WAR);
  }
})();
