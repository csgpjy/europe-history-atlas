const fs = require('node:fs');
const path = require('node:path');
const dns = require('node:dns');

dns.setDefaultResultOrder('ipv4first');

const root = path.resolve(__dirname, '..');
const vendor = path.join(root, 'vendor');
const geo = path.join(root, 'data', 'geo');
fs.mkdirSync(vendor, { recursive: true });
fs.mkdirSync(geo, { recursive: true });

const YEARS = [1500, 1600, 1650, 1700, 1715, 1783, 1800, 1815, 1880, 1900];
const REPO = 'aourednik/historical-basemaps';
const NE_REPO = 'nvkelso/natural-earth-vector';
const NE_FILES = [
  'ne_50m_rivers_lake_centerlines.geojson',
  'ne_50m_lakes.geojson',
  'ne_50m_populated_places.geojson',
];

async function downloadOne(url, dest, headers = {}) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'europe-history-atlas-build', ...headers },
    signal: AbortSignal.timeout(180000),
    redirect: 'follow',
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length < 4096) throw new Error('suspiciously small file');
  fs.writeFileSync(dest, buffer);
  console.log('OK', path.basename(dest), (buffer.length / 1024).toFixed(1) + 'KB');
}

async function download(urls, dest, headers = {}) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    for (const url of urls) {
      try {
        await downloadOne(url, dest, headers);
        return;
      } catch (error) {
        lastError = error;
        console.log('MISS', (error.cause && error.cause.code) || error.message, url);
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
  }
  throw new Error('failed to download ' + dest + ': ' + (lastError && lastError.message));
}

async function main() {
  await download(
    [
      'https://unpkg.com/d3@7.9.0/dist/d3.min.js',
      'https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js',
    ],
    path.join(vendor, 'd3.min.js'),
  );
  await download(
    [
      'https://unpkg.com/topojson-client@3.1.0/dist/topojson-client.min.js',
      'https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js',
    ],
    path.join(vendor, 'topojson-client.min.js'),
  );

  for (const year of YEARS) {
    const dest = path.join(geo, 'world_' + year + '.geojson');
    if (fs.existsSync(dest) && fs.statSync(dest).size > 100000) {
      console.log('SKIP', path.basename(dest));
      continue;
    }
    await download(
      [
        'https://raw.githubusercontent.com/' + REPO + '/master/geojson/world_' + year + '.geojson',
        'https://api.github.com/repos/' + REPO + '/contents/geojson/world_' + year + '.geojson',
      ],
      dest,
      { Accept: 'application/vnd.github.raw' },
    );
  }

  for (const file of NE_FILES) {
    const dest = path.join(geo, file);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log('SKIP', file);
      continue;
    }
    await download(
      [
        'https://raw.githubusercontent.com/' + NE_REPO + '/master/geojson/' + file,
        'https://api.github.com/repos/' + NE_REPO + '/contents/geojson/' + file,
      ],
      dest,
      { Accept: 'application/vnd.github.raw' },
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
