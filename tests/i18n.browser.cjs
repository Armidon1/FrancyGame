// Test UI reale in entrambe le lingue. Chromium + playwright-core già disponibile.
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright-core');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname, '..');
const types = { '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.mp3': 'audio/mpeg' };
const server = http.createServer((request, response) => {
  const relative = new URL(request.url, 'http://localhost').pathname.slice(1) || 'index.html';
  const file = path.resolve(root, relative);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    response.writeHead(404); response.end(); return;
  }
  response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(response);
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader'] });
  try {
    const page = await browser.newPage({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, locale: 'en-GB' });
    const errors = [];
    page.on('pageerror', e => { errors.push(e.message); console.log('PAGEERROR', e.stack); });
    const texts = key => page.evaluate(key => {
      const out = [];
      const walk = list => { for (const object of list || []) {
        if (object.type === 'BitmapText') out.push(object.text);
        if (object.type === 'Container') walk(object.list);
      } };
      walk(game.scene.getScene(key).children.list);
      return out;
    }, key);
    const load = async (level, key) => {
      await page.goto(base + '?level=' + level + '&touch=1');
      await page.waitForFunction(key => typeof game !== 'undefined' && game.scene.isActive(key), key);
    };
    const settle = async (key, battle = false) => {
      for (let i = 0; i < 300; i++) {
        if (await page.evaluate(({ key, battle }) => {
          const s = game.scene.getScene(key);
          if (battle ? !!s.npcMenuTick : !s.locked) return true;
          if (s.dialog.active || s.aWaiter) Controls.pressA();
          return false;
        }, { key, battle })) return;
        await page.waitForTimeout(70);
      }
      throw new Error('Timeout scena: ' + key);
    };
    const pick = async (key, index) => {
      await page.waitForFunction(key => !!game.scene.getScene(key).npcMenuTick, key);
      const hit = await page.evaluate(({ key, index }) => game.scene.getScene(key).npcMenuTick.hits[index], { key, index });
      const canvas = await page.locator('#game canvas').boundingBox();
      await page.touchscreen.tap(canvas.x + hit.x / 480 * canvas.width, canvas.y + hit.y / 270 * canvas.height);
      await page.waitForTimeout(160);
    };
    const pausePick = async index => {
      const canvas = await page.locator('#game canvas').boundingBox();
      await page.touchscreen.tap(canvas.x + 110 / 480 * canvas.width, canvas.y + (80 + index * 20) / 270 * canvas.height);
      await page.waitForTimeout(180);
    };

    await load('title', 'Title');
    assert.equal(await page.evaluate(() => I18n.lang), 'it');
    assert.ok((await texts('Title')).includes('Tocca per iniziare'));
    await page.locator('#touch .abtn').tap();
    await pick('Title', 2); // Impostazioni
    await pick('Title', 0); // Lingua
    await pick('Title', 1); // English
    assert.equal(await page.evaluate(() => I18n.lang), 'en');
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.ok((await texts('Title')).includes('Settings'));
    assert.ok((await texts('Title')).includes('Language: English'));
    assert.equal(await page.locator('#offline-open').textContent(), 'Download game offline');
    await page.screenshot({ path: '/tmp/francygame-english-settings.png' });
    await page.reload();
    await page.waitForFunction(() => typeof game !== 'undefined' && game.scene.isActive('Title'));
    assert.equal(await page.evaluate(() => I18n.lang), 'en');
    assert.ok((await texts('Title')).includes('Tap to start'));
    console.log('OK: italiano predefinito anche su browser inglese; scelta English dal titolo e preferenza al riavvio.');

    await load('1', 'Level1');
    await settle('Level1');
    await page.evaluate(() => { game.scene.getScene('Level1').say('Simone', 'Questa panchina la conosciamo bene. Qui ci siamo abbracciati in un giorno difficile. Ricordati sempre che io ci sarò, in quelli belli e in quelli brutti.'); });
    assert.match(await page.evaluate(() => game.scene.getScene('Level1').dialog.full), /We know this bench/);
    const state = await page.evaluate(() => {
      const s = game.scene.getScene('Level1');
      return JSON.stringify({ x: s.player.x, y: s.player.y, save: Save.load(), mode: Mode.load(), hearts: s.heartCount });
    });
    await page.locator('#pausebtn').tap();
    await page.waitForFunction(() => game.scene.isActive('Pause'));
    await pausePick(2); // Settings
    assert.ok((await texts('Pause')).includes('Settings'));
    await pausePick(0); // Language
    await pausePick(0); // Italiano
    assert.equal(await page.evaluate(() => I18n.lang), 'it');
    assert.match(await page.evaluate(() => game.scene.getScene('Level1').dialog.full), /Questa panchina/);
    assert.equal(await page.evaluate(() => {
      const s = game.scene.getScene('Level1');
      return JSON.stringify({ x: s.player.x, y: s.player.y, save: Save.load(), mode: Mode.load(), hearts: s.heartCount });
    }), state);
    await pausePick(2); // Indietro
    await pausePick(3); // Indietro dalle impostazioni
    await pausePick(0); // Riprendi
    await page.waitForFunction(() => !game.scene.isActive('Pause'));
    assert.equal(await page.locator('#touch .pad').evaluate(e => e.hidden), true);
    await settle('Level1');
    console.log('OK: cambio lingua dalla pausa con tocco reale, dialogo aperto e progressi invariati.');

    await page.evaluate(() => {
      I18n.set('en');
      const s = game.scene.getScene('Level1'); s.busy = true;
      s.battle = new GianicoloBattle(s, 'sindaco');
      s.battle.run().then(() => { s.battle = null; s.busy = false; });
    });
    await settle('Level1', true);
    let battleTexts = await texts('Level1');
    assert.ok(battleTexts.includes('The Mayor'));
    assert.ok(battleTexts.includes('Seed Shooter'));
    assert.ok(battleTexts.includes('Run away'));
    await page.evaluate(() => I18n.set('it'));
    assert.ok((await texts('Level1')).includes('Spara Pipas'));
    await page.evaluate(() => I18n.set('en'));
    await page.screenshot({ path: '/tmp/francygame-english-battle.png' });
    assert.equal(await page.locator('#touch .abtn').isVisible(), true);
    await page.evaluate(() => game.scene.getScene('Level1').battle.destroy());
    await settle('Level1');

    await load('2', 'Level2'); await settle('Level2');
    assert.ok((await texts('Level2')).includes('ICE RINK'));
    await load('3', 'Level3'); await settle('Level3');
    const mapChanges = await page.evaluate(() => {
      const image = game.textures.get('londonMap').getSourceImage();
      const en = image.toDataURL(); I18n.set('it'); const it = image.toDataURL(); I18n.set('en');
      return en !== it && image.toDataURL() === en;
    });
    assert.equal(mapChanges, true);
    await page.evaluate(() => {
      const s = game.scene.getScene('Level3'); s.steps = 12480; s.updateSteps();
    });
    assert.ok((await texts('Level3')).some(s => s.includes('12,480 / 40,000')));
    await load('notte', 'LondonNight');
    assert.equal(await page.evaluate(() => I18n.t('Il diario di Bridget Jones')), "Bridget Jones's Diary");
    await load('finale', 'Finale');
    await page.waitForFunction(() => game.scene.getScene('Finale').children.list.some(o => o.i18nSource === 'Buon compleanno, Picci Picci.'));
    assert.ok((await texts('Finale')).includes('Happy birthday, Picci Picci.'));
    assert.deepEqual(errors, []);
    console.log('OK: battaglie, pista, Londra, mappa disegnata, numeri inglesi, notte e finale; nessun errore JavaScript.');
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
