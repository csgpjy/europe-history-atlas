/* 将仓库中以 base64 文本保存的 PWA 图标还原为 PNG（CI/本地构建前运行）。 */
const fs = require('node:fs');
const path = require('node:path');

const dir = path.resolve(__dirname, '..', 'assets', 'icons');
const icons = ['icon-32', 'icon-180', 'icon-192', 'icon-512'];

for (const name of icons) {
  const encoded = path.join(dir, name + '.png.b64');
  const output = path.join(dir, name + '.png');
  if (!fs.existsSync(encoded)) throw new Error('缺少 ' + encoded);
  const buffer = Buffer.from(fs.readFileSync(encoded, 'utf8').trim(), 'base64');
  if (buffer.length < 100) throw new Error('图标 base64 过短：' + name);
  fs.writeFileSync(output, buffer);
  console.log('ICON', name + '.png', buffer.length + ' bytes');
}
