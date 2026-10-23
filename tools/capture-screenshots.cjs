// Schermate reali per il README. Richiede Chromium e playwright-core già disponibile.
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright-core');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'docs/screenshots');
const types = { '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.mp3': 'audio/mpeg' };
const server = http.createServer((request, response) => {
  const relative = new URL(request.url, 'http://localhost').pathname.slice(1) || 'index.html';
  const filename = path.resolve(root, relative);
  if (!filename.startsWith(root + path.sep) || !fs.existsSync(filename) || !fs.statSync(filename).isFile()) {
    response.writeHead(404); response.end(); return;
  }
  response.writeHead(200, { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream' });
  fs.createReadStream(filename).pipe(response);
});

(async () => {
  fs.mkdirSync(output, { recursive: true });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader'] });
  try {
    const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(() => {
      localStorage.setItem('picci_crt', '0');
      localStorage.setItem('picci_muted', '1');
    });
    const settle = async (key, condition = 'free') => {
      for (let i = 0; i < 300; i++) {
        const done = await page.evaluate(({ key, condition }) => {
          const s = game.scene.getScene(key);
          if (condition === 'battle' ? !!s.npcMenuTick : !s.locked) return true;
          if (s.dialog.active || s.aWaiter) Controls.pressA();
          return false;
        }, { key, condition });
        if (done) return;
        await page.waitForTimeout(70);
      }
      throw new Error('La scena non è pronta: ' + key);
    };
    const load = async (level, scene, touch = false) => {
      await page.goto(url + `?level=${level}&touch=${touch ? 1 : 0}`);
      await page.waitForFunction(key => typeof game !== 'undefined' && game.scene.isActive(key), scene);
      await settle(scene);
      await page.waitForTimeout(650);
    };
    const shot = async name => {
      await page.locator('#wrap').screenshot({ path: path.join(output, name + '.png') });
      console.log('Schermata: ' + name);
    };
    await load('title', 'Title');
    // Ferma soltanto il lampeggio del prompt per renderlo leggibile nella foto.
    await page.evaluate(() => {
      const s = game.scene.getScene('Title');
      s.tweens.killTweensOf(s.prompt); s.prompt.setAlpha(1);
    });
    await shot('titolo');

    await load('1', 'Level1');
    await page.evaluate(() => {
      const s = game.scene.getScene('Level1');
      s.mover.teleport(14, 10, 'up');
      s.cameras.main.centerOn(s.player.x, s.player.y);
    });
    await page.waitForTimeout(700);
    await shot('gianicolo');

    await load('2', 'Level2');
    await page.evaluate(() => {
      const s = game.scene.getScene('Level2');
      s.reachedCheckpoint = true;
      s.player.setPos(240, 205); s.vx = 0; s.vy = 0;
      s.cameras.main.stopFollow(); s.cameras.main.scrollY = 0;
      if (s.toastObj) s.toastObj.setVisible(false);
      s.invulnUntil = s.time.now + 5000;
    });
    await page.waitForTimeout(400);
    await shot('pattinaggio');

    await load('3', 'Level3');
    await page.evaluate(() => {
      const s = game.scene.getScene('Level3');
      s.mover.teleport(110, 8, 'right');
      const p = tileFeet(109, 8);
      s.simone.setPos(p.x, p.y); s.simone.face('right');
      s.mover.follower.c = 109; s.mover.follower.r = 8;
      s.cameras.main.centerOn(s.player.x, s.player.y);
    });
    await page.waitForTimeout(700);
    await shot('londra');

    const battle = async touch => {
      await load('1', 'Level1', touch);
      await page.evaluate(() => {
        const s = game.scene.getScene('Level1');
        s.busy = true;
        s.battle = new GianicoloBattle(s, 'sindaco');
        s.battle.run();
      });
      await settle('Level1', 'battle');
      await page.waitForTimeout(250);
    };
    await battle(false);
    await shot('combattimento');
    await page.setViewportSize({ width: 844, height: 390 });
    await battle(true);
    await shot('mobile');
    if (errors.length) throw new Error(errors.join('\n'));
    console.log('OK: sei schermate del gioco, nessun errore JavaScript.');
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
