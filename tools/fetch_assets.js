const fs = require('node:fs');
const path = require('node:path');
const dns = require('node:dns');

dns.setDefaultResultOrder('ipv4first');

const root = path.resolve(__dirname, '..');
const vendor = path.join(root, 'vendor');
const geo = path.join(root, 'data', 'geo');
fs.mkdirSync(vendor, { recursive: true });
fs.mkdirSync(geo, { recursive: true });

const YEARS = [1500, 1600, 1700, 1715, 1783, 1815, 1900];

async function download(url, dest, headers = {}) {
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'europe-history-atlas-build', ...headers },
        signal: AbortSignal.timeout(180000),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buffer);
      console.log('OK', path.basename(dest), (buffer.length / 1024).toFixed(1) + 'KB');
      return;
    } catch (error) {
      console.log('RETRY', attempt, path.basename(dest), (error.cause && error.cause.code) || error.message);
      await new Promise((resolve) => setTimeout(resolve, 1200 * attempt));
    }
  }
  throw new Error('failed to download ' + url);
}

async function main() {
  await download('https://unpkg.com/d3@7.9.0/dist/d3.min.js', path.join(vendor, 'd3.min.js'));
  await download('https://unpkg.com/topojson-client@3.1.0/dist/topojson-client.min.js', path.join(vendor, 'topojson-client.min.js'));

  for (const year of YEARS) {
    const dest = path.join(geo, 'world_' + year + '.geojson');
    if (fs.existsSync(dest) && fs.statSync(dest).size > 100000) {
      console.log('SKIP', path.basename(dest));
      continue;
    }
    await download(
      'https://api.github.com/repos/aourednik/historical-basemaps/contents/geojson/world_' + year + '.geojson',
      dest,
      { Accept: 'application/vnd.github.raw' },
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
