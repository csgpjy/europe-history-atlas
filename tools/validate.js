/* 静态校验：事件完整性、快照覆盖、SVG 路径与资源引用。
 * 用法：node tools/validate.js
 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const errors = [];
const warnings = [];

function fail(message) { errors.push(message); }
function warn(message) { warnings.push(message); }

function loadWindow(file) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), sandbox);
  return sandbox.window;
}

function assert(condition, message) {
  if (!condition) fail(message);
}

const atlas = loadWindow('data/borders.js').ATLAS;
const core = loadWindow('data/events.js').HISTORY_EVENTS;
const meta = loadWindow('data/events-meta.js').CORE_EVENT_META;
const extra = loadWindow('data/events-extra.js').HISTORY_EVENTS_EXTRA;
const wars = loadWindow('data/wars.js').HISTORY_WARS;
const events = core.concat(extra);

events.forEach((event) => {
  if (meta[event.id]) Object.assign(event, meta[event.id]);
  event.tier = event.tier || 'core';
  event.category = event.category || '政治';
});

assert(atlas && Array.isArray(atlas.years), 'borders.js 缺少 ATLAS.years');
assert(Array.isArray(events) && events.length >= 24, '事件总数少于 24');
assert(Array.isArray(extra) && extra.length >= 12, '扩展事件少于 12 条');

const years = atlas.years.slice();
assert(years.length >= 6, '边界快照少于 6 个');
assert(years.every((y, i) => i === 0 || years[i - 1] < y), '快照年份未升序');

const requiredFiles = [
  'index.html',
  'wars.html',
  'research.html',
  'install.html',
  'css/style.css',
  'css/wars.css',
  'css/research.css',
  'css/install.css',
  'js/app.js',
  'js/wars.js',
  'js/research.js',
  'js/pwa.js',
  'manifest.webmanifest',
  'sw.js',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/icon-180.png',
  'data/events.js',
  'data/events-meta.js',
  'data/events-extra.js',
  'data/wars.js',
  'data/research/index.json',
  'vendor/d3.min.js',
  'vendor/topojson-client.min.js',
  'vendor/maplibre-gl.js',
  'vendor/maplibre-gl.css',
];
for (const file of requiredFiles) {
  assert(fs.existsSync(path.join(root, file)), '缺少文件：' + file);
}

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const id of ['map', 'eras', 'markers', 'panel', 'panelScroll', 'track', 'trackEvents', 'categoryFilters', 'extraToggle', 'playBtn', 'yearNow']) {
  assert(html.includes('id="' + id + '"'), 'index.html 缺少 #' + id);
}
for (const src of ['vendor/d3.min.js', 'data/borders.js', 'data/events.js', 'data/events-meta.js', 'data/events-extra.js', 'js/app.js']) {
  assert(html.includes('src="' + src + '"'), 'index.html 未引用 ' + src);
}
assert(html.includes('href="wars.html"'), 'index.html 未链接战争线页面');
assert(html.includes('href="research.html"'), 'index.html 未链接研究模式');
assert(html.includes('href="manifest.webmanifest"'), 'index.html 未引用 manifest');
assert(html.includes('src="js/pwa.js"'), 'index.html 未引用 pwa.js');
assert(html.includes('id="warLineLink"') && html.includes('id="warOverlay"'), 'index.html 缺少主站战争视图');

const warHtml = fs.readFileSync(path.join(root, 'wars.html'), 'utf8');
for (const id of ['map', 'eras', 'sideLabels', 'battles', 'warPanel', 'warTimeline', 'warTrack', 'warAxis', 'warLanes']) {
  assert(warHtml.includes('id="' + id + '"'), 'wars.html 缺少 #' + id);
}
for (const src of ['vendor/d3.min.js', 'data/borders.js', 'data/wars.js', 'js/wars.js']) {
  assert(warHtml.includes('src="' + src + '"'), 'wars.html 未引用 ' + src);
}
assert(warHtml.includes('href="research.html"'), 'wars.html 未链接研究模式');
assert(warHtml.includes('href="manifest.webmanifest"'), 'wars.html 未引用 manifest');
assert(warHtml.includes('src="js/pwa.js"'), 'wars.html 未引用 pwa.js');

const researchHtml = fs.readFileSync(path.join(root, 'research.html'), 'utf8');
for (const id of ['researchYear', 'researchYearOut', 'ohmLoad', 'ohmUnload', 'ohmFrameWrap', 'ohmStatus', 'mapYear', 'mapLoad', 'mapUnload', 'researchMap', 'mapStatus']) {
  assert(researchHtml.includes('id="' + id + '"'), 'research.html 缺少 #' + id);
}
for (const src of ['js/research.js']) {
  assert(researchHtml.includes('src="' + src + '"'), 'research.html 未引用 ' + src);
}
assert(researchHtml.includes('href="manifest.webmanifest"'), 'research.html 未引用 manifest');
assert(researchHtml.includes('src="js/pwa.js"'), 'research.html 未引用 pwa.js');

const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
assert(manifest.name && manifest.short_name, 'manifest 缺少 name/short_name');
assert(manifest.start_url === './' && manifest.scope === './', 'manifest start_url/scope 必须是相对路径');
assert(manifest.display === 'standalone', 'manifest display 必须是 standalone');
assert(Array.isArray(manifest.shortcuts) && manifest.shortcuts.some((shortcut) => shortcut.url === './#wars'), 'manifest 缺少战争线快捷方式');
for (const icon of manifest.icons || []) {
  assert(fs.existsSync(path.join(root, icon.src)), 'manifest 图标不存在：' + icon.src);
}
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
assert(sw.includes('serviceWorker') === false && sw.includes('caches.open'), 'sw.js 缺少缓存逻辑');
assert(sw.includes('./index.html') && sw.includes('./data/borders.js'), 'sw.js 核心缓存不完整');
assert(sw.includes('./install.html'), 'sw.js 未缓存手机安装页');
assert(sw.includes('ignoreSearch'), 'sw.js 导航回退应按 ignoreSearch 匹配嵌入页');

const installHtml = fs.readFileSync(path.join(root, 'install.html'), 'utf8');
for (const marker of ['id="copyUrl"', 'id="deviceHint"', 'Edge Android', '添加到主屏幕', 'install.css']) {
  assert(installHtml.includes(marker), 'install.html 缺少 ' + marker);
}

const researchIndex = JSON.parse(fs.readFileSync(path.join(root, 'data', 'research', 'index.json'), 'utf8'));
assert(Array.isArray(researchIndex.years) && researchIndex.years.length === 10, 'research/index.json 快照数量不为 10');
for (const year of researchIndex.years) {
  const file = path.join(root, 'data', 'research', year + '.geojson');
  assert(fs.existsSync(file), '缺少研究模式快照：' + year);
  const collection = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert(collection.type === 'FeatureCollection' && collection.features.length >= 10, '研究模式快照过小：' + year);
}

const ids = new Set();
for (const event of events) {
  const prefix = '事件 ' + (event.id || '(无 id)');
  assert(event.id && !ids.has(event.id), prefix + '：id 缺失或重复');
  ids.add(event.id);

  assert(Number.isFinite(event.year), prefix + '：year 无效');
  assert(event.year >= 1490 && event.year <= 1905, prefix + '：year 超出时间轴范围');
  assert(Number.isFinite(event.end) && event.end >= event.year, prefix + '：end 无效');
  assert(event.title && event.title.length >= 2, prefix + '：title 过短');
  assert(event.summary && event.summary.length >= 40, prefix + '：summary 少于 40 字');
  assert(['政治', '经济', '文化', '社会'].includes(event.category), prefix + '：category 无效');
  assert(['core', 'extra'].includes(event.tier), prefix + '：tier 无效');
  assert(Array.isArray(event.facts) && event.facts.length >= 2, prefix + '：facts 少于 2 条');
  assert(Array.isArray(event.sources) && event.sources.length >= 1, prefix + '：缺少 sources');
  assert(Array.isArray(event.points) && event.points.length >= 1, prefix + '：缺少地图标记点');

  for (const source of event.sources || []) {
    assert(source.label, prefix + '：出处缺少 label');
    if (source.url) assert(source.url.startsWith('https://'), prefix + '：出处链接必须以 https:// 开头');
  }

  const highlight = event.highlights || {};
  const totalHighlights = (highlight.names || []).length + (highlight.subjects || []).length;
  assert(totalHighlights > 0 || (event.points || []).length > 0, prefix + '：既无高亮政权也无标记点');

  const snapshot = event.snapshot;
  if (years.includes(snapshot)) {
    assert(snapshot <= event.end + 30, prefix + '：快照与事件年代相差过大');
    if (snapshot > event.end) {
      warn(prefix + '：快照 ' + snapshot + ' 为事件结束后的边界，需在面板中注明');
    }
  } else {
    warn(prefix + '：快照 ' + snapshot + ' 不存在，将回退到更早快照');
    const earlier = years.filter((y) => y <= event.year);
    assert(earlier.length > 0, prefix + '：没有可用快照');
  }

  for (const point of event.points || []) {
    assert(Number.isFinite(point.lon) && point.lon >= -30 && point.lon <= 55, prefix + '：标记点经度越界');
    assert(Number.isFinite(point.lat) && point.lat >= 30 && point.lat <= 75, prefix + '：标记点纬度越界');
    assert(point.label, prefix + '：标记点缺少 label');
  }
}

for (const category of ['政治', '经济', '文化', '社会']) {
  assert(events.some((event) => event.category === category), '缺少“' + category + '”类事件');
}

assert(Array.isArray(wars) && wars.length >= 12, '战争线少于 12 场战争');
const warIds = new Set();
for (const war of wars) {
  const prefix = '战争 ' + (war.name || '(无名称)');
  assert(war.id && !warIds.has(war.id), prefix + '：id 缺失或重复');
  warIds.add(war.id);
  assert(war.name && war.name.length >= 2, prefix + '：名称无效');
  assert(Number.isFinite(war.start) && Number.isFinite(war.end), prefix + '：起止年份无效');
  assert(war.end >= war.start, prefix + '：结束年份早于开始年份');
  assert(war.start >= 1490 && war.end <= 1905, prefix + '：超出战争线时间范围');
  assert(years.includes(war.snapshot), prefix + '：snapshot 不在边界快照中');
  assert(war.sides && war.sides.a && war.sides.b, prefix + '：缺少交战双方');
  for (const key of ['a', 'b']) {
    const side = war.sides && war.sides[key];
    assert(side && side.label, prefix + '：缺少交战方 ' + key + ' 标签');
    assert(Array.isArray(side.polities) && side.polities.length >= 1, prefix + '：交战方 ' + key + ' 没有政权');
    for (const polity of side.polities || []) {
      assert(polity.name && polity.label, prefix + '：交战方 ' + key + ' 的政权条目无效');
    }
  }
  assert(war.summary && war.summary.length >= 40, prefix + '：summary 少于 40 字');
  if (war.phases) {
    assert(Array.isArray(war.phases) && war.phases.length >= 2, prefix + '：phases 少于 2 段');
    let previousEnd = war.start - 1;
    for (const phase of war.phases) {
      assert(phase.from >= war.start && phase.to <= war.end && phase.from <= phase.to, prefix + '：阶段年份越界');
      assert(phase.from >= previousEnd, prefix + '：阶段年份重叠或乱序');
      previousEnd = phase.to;
      assert(phase.label, prefix + '：阶段缺少 label');
      if (phase.snapshot) assert(years.includes(phase.snapshot), prefix + '：阶段 snapshot 不在边界快照中');
      for (const key of ['a', 'b']) {
        assert(phase[key] && phase[key].label, prefix + '：阶段缺少交战方 ' + key);
        assert(Array.isArray(phase[key].polities) && phase[key].polities.length >= 1, prefix + '：阶段 ' + key + ' 没有政权');
      }
    }
    assert(war.phases[0].from === war.start, prefix + '：第一阶段未从战争开始');
    assert(war.phases[war.phases.length - 1].to === war.end, prefix + '：最后阶段未到战争结束');
  }
  assert(Array.isArray(war.battles) && war.battles.length >= 1, prefix + '：缺少战役');
  for (const battle of war.battles || []) {
    assert(battle.name && Number.isFinite(battle.year), prefix + '：战役条目无效');
    assert(Number.isFinite(battle.lon) && battle.lon >= -30 && battle.lon <= 55, prefix + '：战役经度越界');
    assert(Number.isFinite(battle.lat) && battle.lat >= 30 && battle.lat <= 75, prefix + '：战役纬度越界');
  }
  assert(war.outcome && war.outcome.length >= 8, prefix + '：缺少战争结果');
  assert(Array.isArray(war.sources) && war.sources.length >= 1, prefix + '：缺少史料出处');
  for (const source of war.sources || []) {
    assert(source.label, prefix + '：出处缺少 label');
    if (source.url) assert(source.url.startsWith('https://'), prefix + '：出处链接必须以 https:// 开头');
  }
}

for (const year of years) {
  const features = atlas.borders[year] || [];
  assert(features.length >= 15, year + ' 年政权多边形少于 15 个');
  for (const feature of features) {
    assert(feature.n, year + ' 年存在无名称多边形');
    assert(typeof feature.d === 'string' && feature.d.startsWith('M'), year + ' 年 ' + feature.n + ' 路径无效');
    assert(feature.d.split('L').length >= 8, year + ' 年 ' + feature.n + ' 路径点数过少');
  }
}

if (errors.length) {
  console.error('VALIDATION FAILED (' + errors.length + ')');
  for (const error of errors) console.error(' - ' + error);
  for (const warning of warnings) console.warn(' ! ' + warning);
  process.exit(1);
}

const counts = {};
for (const event of events) counts[event.category] = (counts[event.category] || 0) + 1;
console.log('VALIDATION OK');
console.log(' - years: ' + years.join(', '));
console.log(' - events: ' + events.length + ' (core ' + events.filter((e) => e.tier === 'core').length +
  ', extra ' + events.filter((e) => e.tier === 'extra').length + ')');
console.log(' - categories: ' + Object.keys(counts).map((k) => k + ':' + counts[k]).join(' '));
console.log(' - wars: ' + wars.length + ' (' + wars.map((w) => w.id).join(', ') + ')');
console.log(' - features: ' + years.map((y) => y + ':' + atlas.borders[y].length).join(' '));
for (const warning of warnings) console.warn(' ! ' + warning);
