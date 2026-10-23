// Test offline reale con server locale temporaneo, Chromium e playwright-core già disponibile.
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright-core');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const prefix = '/FrancyGame/';
const types = { '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.mp3': 'audio/mpeg' };
let unavailable = false, brokenFile = '', nextVersion = false;
const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const relative = pathname.slice(prefix.length) || 'index.html';
  if (unavailable || !pathname.startsWith(prefix) || relative === brokenFile || relative.includes('..')) {
    response.writeHead(404); response.end('Sito non disponibile'); return;
  }
  const filename = path.join(root, relative);
  if (!fs.existsSync(filename) || !fs.statSync(filename).isFile()) {
    response.writeHead(404); response.end(); return;
  }
  if (nextVersion && relative === 'offline-manifest.json') {
    const manifest = JSON.parse(fs.readFileSync(filename));
    manifest.version = 'ffffffffffffffff';
    response.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    response.end(JSON.stringify(manifest)); return;
  }
  response.writeHead(200, { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(filename).pipe(response);
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}${prefix}`;
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader'] });
  try {
    const options = { viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1' };
    // Dal browser iPhone invitiamo ad aprire prima l'icona, senza una falsa conferma.
    const safari = await browser.newContext(options);
    const tab = await safari.newPage();
    await tab.goto(url);
    await tab.locator('#ios-install button').click();
    await tab.locator('#offline-open').click();
    assert.equal(await tab.locator('#offline-download').isDisabled(), true);
    assert.match(await tab.locator('#offline-status').textContent(), /nuova icona/);
    await safari.close();

    // Simula il contesto Home iPhone; il motore rimane Chromium, non Safari.
    const context = await browser.newContext(options);
    await context.addInitScript(() => Object.defineProperty(navigator, 'standalone', { value: true }));
    let page = await context.newPage();
    const errors = [];
    const watch = p => p.on('pageerror', error => errors.push(error.message));
    watch(page);
    await page.goto(url);
    await page.locator('#offline-open').click();
    await page.waitForFunction(() => !document.getElementById('offline-download').disabled);
    assert.match(await page.locator('#offline-status').textContent(), /non è ancora scaricato/);
    brokenFile = 'assets/simone_sheet.png';
    await page.locator('#offline-download').click();
    await page.waitForFunction(() => !OfflineGame.downloading);
    assert.match(await page.locator('#offline-status').textContent(), /Download non completato/);
    assert.equal(await page.evaluate(() => OfflineGame.check()), false);
    console.log('OK: un file mancante impedisce la conferma offline.');

    brokenFile = '';
    await page.locator('#offline-download').click();
    await page.waitForFunction(() => !OfflineGame.downloading, { timeout: 120000 });
    assert.match(await page.locator('#offline-status').textContent(), /Pronto per giocare offline/);
    const copy = await page.evaluate(async () => {
      const names = await caches.keys();
      const cache = await caches.open(names.find(name => name.includes('copy-')));
      return (await cache.keys()).map(request => request.url);
    });
    assert.ok(copy.includes(new URL('local/gianicolo.mp3', url).href));
    assert.ok(copy.includes(new URL('local/ice.mp3', url).href));
    assert.ok(copy.includes(new URL('local/london.mp3', url).href));
    assert.ok(copy.includes('https://cdnjs.cloudflare.com/ajax/libs/phaser/4.0.0/phaser.min.js'));
    await page.screenshot({ path: '/tmp/francygame-offline-ready.png' });
    nextVersion = true;
    brokenFile = 'assets/simone_sheet.png';
    await page.locator('#offline-download').click();
    await page.waitForFunction(() => !OfflineGame.downloading);
    assert.match(await page.locator('#offline-status').textContent(), /La copia già scaricata resta disponibile/);
    assert.equal(await page.evaluate(() => OfflineGame.check()), true);
    nextVersion = false;
    brokenFile = '';
    await page.locator('#offline-close').click();
    console.log('OK: tutti i file, musiche e Phaser inclusi; un aggiornamento fallito conserva la copia precedente.');

    // Pages disattivato: il server risponde 404, ma la Home continua a partire dalla copia.
    unavailable = true;
    await page.close();
    page = await context.newPage(); watch(page);
    await page.goto(url);
    await page.waitForFunction(() => typeof game !== 'undefined' && game.scene.isActive('Title'));
    await page.locator('#offline-open').click();
    await page.waitForFunction(() => document.getElementById('offline-status').textContent.includes('Pronto per giocare offline'));
    assert.match(await page.locator('#offline-status').textContent(), /Pronto per giocare offline/);
    await page.locator('#offline-close').click();
    console.log('OK: nuova apertura con sito disattivato e risposta 404.');

    await context.setOffline(true);
    for (const [level, scene] of [['1', 'Level1'], ['2', 'Level2'], ['3', 'Level3'], ['notte', 'LondonNight'], ['finale', 'Finale']]) {
      await page.goto(url + '?level=' + level + '&touch=1');
      await page.waitForFunction(key => typeof game !== 'undefined' && game.scene.isActive(key), scene);
    }
    const music = await page.evaluate(async () => {
      Audio8.unlock();
      for (const key of ['gianicolo', 'ice', 'london']) {
        const response = await fetch(SONGS[key].file);
        const buffer = await Audio8.ctx.decodeAudioData(await response.arrayBuffer());
        if (!(buffer.duration > 1)) return false;
      }
      return true;
    });
    assert.equal(music, true);
    // Lo stato salvato sopravvive alla chiusura e viene riletto senza rete.
    await page.evaluate(() => Save.setLevel('Level3'));
    await page.close();
    page = await context.newPage(); watch(page);
    await page.goto(url);
    await page.waitForFunction(() => typeof game !== 'undefined' && game.scene.isActive('Title'));
    assert.equal(await page.evaluate(() => Save.level()), 'Level3');
    assert.deepEqual(errors, []);
    console.log('OK: tutti i livelli e il finale avviati senza rete, MP3 decodificati offline, salvataggio mantenuto.');
    await context.close();
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
