/* 生成 MapLibre 研究模式用的欧洲 GeoJSON 快照（构建产物，不提交仓库）。
 * 数据：historical-basemaps（GPL-3.0）。
 */
const fs = require('node:fs');
const path = require('node:path');

const atlas = path.resolve(__dirname, '..');
const srcDir = path.join(atlas, 'data', 'geo');
const outDir = path.join(atlas, 'data', 'research');
const YEARS = [1500, 1600, 1650, 1700, 1715, 1783, 1800, 1815, 1880, 1900];
const BOX = [-30, 30, 50, 78];
const TOL = 0.08;

fs.mkdirSync(outDir, { recursive: true });

function bboxOf(coords, box = [Infinity, Infinity, -Infinity, -Infinity]) {
  if (typeof coords[0] === 'number') {
    if (coords[0] < box[0]) box[0] = coords[0];
    if (coords[1] < box[1]) box[1] = coords[1];
    if (coords[0] > box[2]) box[2] = coords[0];
    if (coords[1] > box[3]) box[3] = coords[1];
    return box;
  }
  for (const item of coords) bboxOf(item, box);
  return box;
}

function clipRing(ring) {
  let output = ring.map((p) => [p[0], p[1]]);
  const edges = [
    [(p) => p[0] >= BOX[0], (p) => [BOX[0], p[1]], (a, b) => [BOX[0], a[1] + ((b[1] - a[1]) * (BOX[0] - a[0])) / (b[0] - a[0])]],
    [(p) => p[0] <= BOX[2], (p) => [BOX[2], p[1]], (a, b) => [BOX[2], a[1] + ((b[1] - a[1]) * (BOX[2] - a[0])) / (b[0] - a[0])]],
    [(p) => p[1] >= BOX[1], (p) => [p[0], BOX[1]], (a, b) => [a[0] + ((b[0] - a[0]) * (BOX[1] - a[1])) / (b[1] - a[1]), BOX[1]]],
    [(p) => p[1] <= BOX[3], (p) => [p[0], BOX[3]], (a, b) => [a[0] + ((b[0] - a[0]) * (BOX[3] - a[1])) / (b[1] - a[1]), BOX[3]]],
  ];
  for (const [inside, intersect, cross] of edges) {
    if (!output.length) return [];
    const input = output;
    output = [];
    for (let i = 0; i < input.length; i += 1) {
      const current = input[i];
      const previous = input[(i + input.length - 1) % input.length];
      const currIn = inside(current);
      const prevIn = inside(previous);
      if (currIn) {
        if (!prevIn) output.push(cross(previous, current));
        output.push(current);
      } else if (prevIn) {
        output.push(cross(previous, current));
      }
    }
  }
  return output;
}

function distToSegment(p, a, b) {
  let x = a[0], y = a[1];
  let dx = b[0] - x, dy = b[1] - y;
  if (dx !== 0 || dy !== 0) {
    const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) { x = b[0]; y = b[1]; } else if (t > 0) { x += dx * t; y += dy * t; }
  }
  dx = p[0] - x; dy = p[1] - y;
  return Math.sqrt(dx * dx + dy * dy);
}

function rdp(points, tolerance) {
  if (points.length <= 4) return points;
  let maxDist = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i += 1) {
    const d = distToSegment(points[i], points[0], points[points.length - 1]);
    if (d > maxDist) { maxDist = d; index = i; }
  }
  if (maxDist > tolerance) {
    return rdp(points.slice(0, index + 1), tolerance)
      .slice(0, -1)
      .concat(rdp(points.slice(index), tolerance));
  }
  return [points[0], points[points.length - 1]];
}

function ringArea(ring) {
  let sum = 0;
  for (let i = 0; i < ring.length - 1; i += 1) {
    sum += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
  }
  return Math.abs(sum / 2);
}

function cleanRing(raw) {
  let ring = raw.filter((p, i) => i === 0 || p[0] !== raw[i - 1][0] || p[1] !== raw[i - 1][1]);
  if (ring.length < 3) return null;
  if (ring[0][0] !== ring[ring.length - 1][0] || ring[0][1] !== ring[ring.length - 1][1]) ring.push(ring[0]);
  ring = clipRing(ring);
  if (ring.length < 4 || ringArea(ring) < 0.025) return null;
  ring = rdp(ring, TOL);
  if (ring.length < 4) return null;
  return ring.map((p) => [+p[0].toFixed(3), +p[1].toFixed(3)]);
}

function cleanGeometry(geometry) {
  if (!geometry) return null;
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] :
    geometry.type === 'MultiPolygon' ? geometry.coordinates : [];
  const output = [];
  for (const polygon of polygons) {
    if (!polygon || !polygon.length) continue;
    const outer = cleanRing(polygon[0]);
    if (!outer) continue;
    output.push([outer]);
  }
  if (!output.length) return null;
  return output.length === 1
    ? { type: 'Polygon', coordinates: output[0] }
    : { type: 'MultiPolygon', coordinates: output };
}

const index = { years: [], counts: {} };
for (const year of YEARS) {
  const src = JSON.parse(fs.readFileSync(path.join(srcDir, 'world_' + year + '.geojson'), 'utf8'));
  const features = [];
  for (const feature of src.features) {
    const props = feature.properties || {};
    if (!props.NAME || !feature.geometry) continue;
    const box = bboxOf(feature.geometry.coordinates);
    if (!(box[2] >= BOX[0] && box[0] <= BOX[2] && box[3] >= BOX[1] && box[1] <= BOX[3])) continue;
    const geometry = cleanGeometry(feature.geometry);
    if (!geometry) continue;
    features.push({
      type: 'Feature',
      properties: {
        name: props.NAME,
        subject: props.SUBJECTO || '',
        label: props.NAME,
      },
      geometry,
    });
  }
  const collection = { type: 'FeatureCollection', features };
  const dest = path.join(outDir, year + '.geojson');
  fs.writeFileSync(dest, JSON.stringify(collection));
  const size = fs.statSync(dest).size;
  index.years.push(year);
  index.counts[year] = { features: features.length, bytes: size };
  console.log(year, 'features=', features.length, 'bytes=', size);
}
fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(index));
console.log('WROTE', path.join(outDir, 'index.json'));
