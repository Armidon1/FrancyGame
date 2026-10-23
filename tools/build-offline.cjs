// node tools/build-offline.cjs — rigenerare dopo ogni modifica prima di pubblicare.
// Nessun bundler o dipendenza: ricava tutti gli script dall'HTML e le musiche dalla configurazione.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file));
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const html = read('index.html').toString();
const manifest = JSON.parse(read('manifest.webmanifest'));
const urls = new Set([
  'index.html', 'manifest.webmanifest', 'assets/app-icon-180.png',
  ...manifest.icons.map(icon => icon.src),
  'assets/francesca_sheet.png', 'assets/simone_sheet.png',
  ...Array.from(html.matchAll(/<script\s+src="([^"]+)"/g), match => match[1]),
]);
if (urls.has('local/songs.js')) {
  for (const match of read('local/songs.js').toString().matchAll(/\.file\s*=\s*['"]([^'"]+)['"]/g)) urls.add(match[1]);
}
const assets = [...urls].map(url => /^https:\/\//.test(url) ? { url } : { url, sha256: hash(read(url)) });
const version = hash(JSON.stringify(assets) + hash(read('sw.js'))).slice(0, 16);
const output = JSON.stringify({ version, assets }, null, 2) + '\n';
const target = path.join(root, 'offline-manifest.json');
if (process.argv.includes('--check')) {
  if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== output) {
    console.error('Elenco offline da aggiornare: esegui node tools/build-offline.cjs');
    process.exitCode = 1;
  } else console.log('OK: elenco offline aggiornato.');
} else {
  fs.writeFileSync(target, output);
  console.log(`Elenco offline: ${assets.length} file, versione ${version}.`);
}
