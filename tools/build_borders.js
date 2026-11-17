const fs = require('node:fs');
const path = require('node:path');

const atlas = path.resolve(__dirname, '..');
const d3 = require(path.join(atlas, 'vendor', 'd3.min.js'));
const topojson = require(path.join(atlas, 'vendor', 'topojson-client.min.js'));

const YEARS = [1500, 1600, 1700, 1715, 1783, 1815, 1900].filter((year) =>
  fs.existsSync(path.join(atlas, 'data', 'geo', 'world_' + year + '.geojson')),
);
const BOX = [-180, -90, 180, 90];
const PIXEL_BOX = [2, 2, 998, 818];
const TOL = 0.035;
const VIEW = [1000, 820];

const proj = d3
  .geoConicConformal()
  .parallels([38, 62])
  .rotate([-12, 0])
  .center([0, 52]);
proj.fitExtent(
  [
    [30, 26],
    [970, 794],
  ],
  {
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
  },
);

const NAMES = new Set([
  'Spain', 'France', 'Portugal', 'England', 'England and Ireland', 'Scotland',
  'United Kingdom of Great Britain and Ireland', 'Ireland', 'Holy Roman Empire',
  'Austrian Empire', 'Austria Hungary', 'Prussia', 'Bavaria', 'Saxony', 'Poland-Lithuania',
  'Polish–Lithuanian Commonwealth', 'Tsardom of Muscovy', 'Russian Empire', 'Sweden',
  'Sweden–Norway', 'Denmark-Norway', 'Denmark', 'Ottoman Empire', 'Venice', 'Milan',
  'Naples', 'Papal States', 'Sardinia-Piedmont', 'Savoy', 'Sardinia', 'Sicily',
  'Tuscany', 'Genoa', 'Dutch Republic', 'Netherlands', 'Habsburg Netherlands',
  'Spanish Netherlands', 'Swiss Confederation', 'Republic of the Seven Zenden',
  'United Kingdom of Netherlands', 'Italy', 'Germany', 'Greece', 'Serbia', 'Romania',
  'Bulgaria', 'Montenegro', 'Bosnia', 'Crimean Khanate', 'Morocco', 'Algiers', 'Tunis',
  'Tripoli', 'Egypt', 'Persia', 'Wallachia', 'Moldavia', 'Transylvania', 'Hungary',
  'Croatia', 'Slovenia', 'Lombardy', 'Venetia', 'Parma', 'Modena', 'Lucca', 'Malta',
  'Iceland', 'Norway', 'Finland', 'Lithuania', 'Livonia', 'Courland', 'Hanover',
  'Württemberg', 'Baden', 'Hesse-Kassel', 'Mecklenburg', 'Holstein', 'Oldenburg',
  'Brunswick', 'Anhalt', 'Nassau', 'Luxembourg', 'Belgium', 'Switzerland', 'Albania',
  'Macedonia', 'Thrace', 'Anatolia', 'Syria', 'Palestine', 'Cyprus', 'Crete',
]);

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

function clipRing(ring, bounds) {
  const box = bounds || BOX;
  let output = ring.map((p) => [p[0], p[1]]);
  const edges = [
    [(p) => p[0] >= box[0], (p) => [box[0], p[1]], (a, b) => [box[0], a[1] + ((b[1] - a[1]) * (box[0] - a[0])) / (b[0] - a[0])]],
    [(p) => p[0] <= box[2], (p) => [box[2], p[1]], (a, b) => [box[2], a[1] + ((b[1] - a[1]) * (box[2] - a[0])) / (b[0] - a[0])]],
    [(p) => p[1] >= box[1], (p) => [p[0], box[1]], (a, b) => [a[0] + ((b[0] - a[0]) * (box[1] - a[1])) / (b[1] - a[1]), box[1]]],
    [(p) => p[1] <= box[3], (p) => [p[0], box[3]], (a, b) => [a[0] + ((b[0] - a[0]) * (box[3] - a[1])) / (b[1] - a[1]), box[3]]],
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
    const left = rdp(points.slice(0, index + 1), tolerance);
    const right = rdp(points.slice(index), tolerance);
    return left.slice(0, -1).concat(right);
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
  if (ring.length < 4) return null;
  if (ringArea(ring) < 0.035) return null;
  ring = rdp(ring, TOL);
  if (ring.length < 4) return null;
  return ring;
}

function projectRingStats(ring) {
  const projected = [];
  for (const [lon, lat] of ring) {
    const p = proj([lon, lat]);
    if (!p || !Number.isFinite(p[0]) || !Number.isFinite(p[1])) continue;
    projected.push(p);
  }
  if (projected.length < 4) return null;

  const first = projected[0];
  const last = projected[projected.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) projected.push([first[0], first[1]]);

  const points = clipRing(projected, PIXEL_BOX);
  if (points.length < 4) return null;

  const parts = [];
  let area = 0;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    parts.push(a[0].toFixed(1) + ',' + a[1].toFixed(1));
    area += a[0] * b[1] - b[0] * a[1];
    if (a[0] < minX) minX = a[0];
    if (a[1] < minY) minY = a[1];
    if (a[0] > maxX) maxX = a[0];
    if (a[1] > maxY) maxY = a[1];
  }

  return {
    d: 'M' + parts.join('L') + 'Z',
    area: Math.abs(area / 2),
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2,
  };
}

function shapePaths(geometry) {
  if (!geometry) return { d: '', area: 0, centroid: null };
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.type === 'MultiPolygon' ? geometry.coordinates : [];
  let d = '';
  let best = null;
  for (const poly of polygons) {
    if (!poly || !poly.length) continue;
    const outer = cleanRing(poly[0]);
    if (!outer) continue;
    const stats = projectRingStats(outer);
    if (!stats) continue;
    d += stats.d;
    if (!best || stats.area > best.area) best = stats;
  }
  return { d, area: best ? best.area : 0, centroid: best ? [best.cx, best.cy] : null };
}

function buildYear(year) {
  const src = JSON.parse(fs.readFileSync(path.join(atlas, 'data', 'geo', 'world_' + year + '.geojson'), 'utf8'));
  const features = [];
  for (const f of src.features) {
    const props = f.properties || {};
    const name = props.NAME || props.SUBJECTO || props.PARTOF;
    if (!name) continue;
    const b = bboxOf(f.geometry.coordinates);
    if (!(b[2] >= BOX[0] && b[0] <= BOX[2] && b[3] >= BOX[1] && b[1] <= BOX[3])) continue;
    const shape = shapePaths(f.geometry);
    if (!shape.d) continue;
    if (shape.d.split('L').length < 10 || shape.a < 8) continue;
    features.push({
      n: name,
      s: props.SUBJECTO || '',
      p: props.PARTOF || '',
      d: shape.d,
      a: +shape.area.toFixed(5),
      cx: shape.centroid ? +shape.centroid[0].toFixed(1) : null,
      cy: shape.centroid ? +shape.centroid[1].toFixed(1) : null,
    });
  }
  features.sort((x, y) => y.a - x.a);
  console.log(year, 'features=', features.length, 'bytes=', JSON.stringify(features).length);
  return features;
}

function projectRing(ring) {
  const stats = projectRingStats(ring);
  return stats ? stats.d : '';
}

function buildLand() {
  const topo = JSON.parse(fs.readFileSync(path.join(atlas, 'data', 'geo', 'land-50m.json'), 'utf8'));
  const land = topojson.feature(topo, topo.objects.land);
  const geometries = land.type === 'FeatureCollection' ? land.features.map((f) => f.geometry) : [land.geometry];
  let d = '';
  for (const geometry of geometries) {
    for (const poly of geometry.coordinates) {
      const outer = cleanRing(poly[0]);
      if (!outer) continue;
      d += projectRing(outer);
    }
  }
  console.log('land path bytes=', d.length);
  return d;
}

function buildGraticule() {
  let d = '';
  for (let lon = -20; lon <= 40; lon += 10) {
    const pts = [];
    for (let lat = 30; lat <= 72; lat += 2) {
      const p = proj([lon, lat]);
      if (p) pts.push(p[0].toFixed(1) + ',' + p[1].toFixed(1));
    }
    d += 'M' + pts.join('L');
  }
  for (let lat = 30; lat <= 70; lat += 10) {
    const pts = [];
    for (let lon = -20; lon <= 40; lon += 2) {
      const p = proj([lon, lat]);
      if (p) pts.push(p[0].toFixed(1) + ',' + p[1].toFixed(1));
    }
    d += 'M' + pts.join('L');
  }
  console.log('graticule bytes=', d.length);
  return d;
}

const out = {
  viewBox: [0, 0, VIEW[0], VIEW[1]],
  years: YEARS,
  land: '',
  graticule: buildGraticule(),
  borders: {},
};
for (const year of YEARS) out.borders[year] = buildYear(year);

const dest = path.join(atlas, 'data', 'borders.json');
fs.writeFileSync(dest, JSON.stringify(out));
fs.writeFileSync(path.join(atlas, 'data', 'borders.js'), 'window.ATLAS = ' + JSON.stringify(out) + ';\n');
console.log('WROTE', dest, (fs.statSync(dest).size / 1024).toFixed(1) + 'KB');
