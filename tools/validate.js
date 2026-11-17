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
const events = loadWindow('data/events.js').HISTORY_EVENTS;

assert(atlas && Array.isArray(atlas.years), 'borders.js 缺少 ATLAS.years');
assert(Array.isArray(events) && events.length > 0, 'events.js 缺少事件数组');

const years = atlas.years.slice();
assert(years.length >= 6, '边界快照少于 6 个');
assert(years.every((y, i) => i === 0 || years[i - 1] < y), '快照年份未升序');

const requiredFiles = [
  'index.html',
  'css/style.css',
  'js/app.js',
  'data/events.js',
  'vendor/d3.min.js',
  'vendor/topojson-client.min.js',
];
for (const file of requiredFiles) {
  assert(fs.existsSync(path.join(root, file)), '缺少文件：' + file);
}

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const id of ['map', 'eras', 'markers', 'panel', 'panelScroll', 'track', 'playBtn', 'yearNow']) {
  assert(html.includes('id="' + id + '"'), 'index.html 缺少 #' + id);
}
for (const src of ['vendor/d3.min.js', 'data/borders.js', 'data/events.js', 'js/app.js']) {
  assert(html.includes('src="' + src + '"'), 'index.html 未引用 ' + src);
}

const ids = new Set();
for (const event of events) {
  const prefix = '事件 ' + (event.id || '(无 id)');
  assert(event.id && !ids.has(event.id), prefix + '：id 缺失或重复');
  ids.add(event.id);

  assert(Number.isFinite(event.year), prefix + '：year 无效');
  assert(Number.isFinite(event.end) && event.end >= event.year, prefix + '：end 无效');
  assert(event.title && event.title.length >= 2, prefix + '：title 过短');
  assert(event.summary && event.summary.length >= 60, prefix + '：summary 少于 60 字');
  assert(Array.isArray(event.facts) && event.facts.length >= 2, prefix + '：facts 少于 2 条');
  assert(Array.isArray(event.sources) && event.sources.length >= 1, prefix + '：缺少 sources');
  assert(Array.isArray(event.points) && event.points.length >= 1, prefix + '：缺少地图标记点');

  for (const source of event.sources || []) {
    assert(source.label && source.url && source.url.startsWith('https://'), prefix + '：出处链接无效');
  }

  const highlight = event.highlights || {};
  const totalHighlights = (highlight.names || []).length + (highlight.subjects || []).length;
  assert(totalHighlights > 0, prefix + '：没有高亮政权');

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

console.log('VALIDATION OK');
console.log(' - years: ' + years.join(', '));
console.log(' - events: ' + events.length);
console.log(' - features: ' + years.map((y) => y + ':' + atlas.borders[y].length).join(' '));
for (const warning of warnings) console.warn(' ! ' + warning);
