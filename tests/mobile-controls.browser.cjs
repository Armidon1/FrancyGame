// Dipendenza opzionale: playwright-core già installato, indicabile con PLAYWRIGHT_PATH.
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright-core');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader'],
  });
  try {
    const page = await browser.newPage({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto((process.env.GAME_URL || 'http://localhost:8000/') + '?level=1&touch=1');
    await page.waitForFunction(() => typeof game !== 'undefined' && game.scene.isActive('Level1'));
    const settle = async predicate => {
      for (let i = 0; i < 200; i++) {
        if (await page.evaluate(predicate)) return;
        await page.evaluate(() => {
          const s = game.scene.getScene('Level1');
          if (s.dialog.active || s.aWaiter) Controls.pressA();
        });
        await page.waitForTimeout(70);
      }
      throw new Error('Timeout: ' + predicate);
    };
    const mode = async (expected, hidden) => {
      assert.equal(await page.locator('#touch').getAttribute('data-mode'), expected);
      assert.equal(await page.locator('#touch .pad').evaluate(e => e.hidden), hidden);
      assert.equal(await page.locator('#touch .abtn').isVisible(), true);
    };
    await settle(() => !game.scene.getScene('Level1').locked);
    await mode('explore', false);
    await page.evaluate(() => { game.scene.getScene('Level1').say('Simone', 'Ciao Picci Picci!'); });
    await mode('dialog', true);
    await page.locator('#touch .abtn').tap();
    await page.waitForTimeout(100);
    await page.locator('#touch .abtn').tap();
    await page.waitForFunction(() => !game.scene.getScene('Level1').dialog.active);
    await mode('explore', false);

    // Le risposte riattivano la croce; la seconda voce si raggiunge e conferma con A.
    await page.evaluate(() => {
      window.picked = null;
      GianicoloBattle.choose(game.scene.getScene('Level1'), 'Una sfida?', ['Sì', 'Non ancora'])
        .then(i => { window.picked = i; });
    });
    await mode('choice', false);
    const pad = await page.locator('#touch .pad').boundingBox();
    await page.mouse.move(pad.x + pad.width / 2, pad.y + pad.height * 0.85);
    await page.mouse.down();
    await page.waitForTimeout(100);
    await page.mouse.up();
    await page.locator('#touch .abtn').tap();
    await page.waitForFunction(() => window.picked !== null);
    assert.equal(await page.evaluate(() => window.picked), 1);
    await mode('explore', false);

    await page.evaluate(() => {
      const s = game.scene.getScene('Level1');
      s.busy = true;
      s.battle = new GianicoloBattle(s, 'sindaco');
      s.battle.run().then(result => { window.battleResult = result.outcome; s.battle = null; s.busy = false; });
    });
    await settle(() => !!game.scene.getScene('Level1').npcMenuTick);
    await mode('battle', true);
    for (const viewport of [{ width: 667, height: 375 }, { width: 568, height: 320 }, { width: 844, height: 390 }]) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(600);
      const button = await page.locator('#touch .abtn').boundingBox();
      const gameCanvas = await page.locator('#game canvas').boundingBox();
      assert.ok(button.y + button.height < gameCanvas.y + gameCanvas.height * 190 / 270,
        'A copre le mosse a ' + viewport.width + 'x' + viewport.height);
    }
    const a = await page.locator('#touch .abtn').boundingBox();
    const canvas = await page.locator('#game canvas').boundingBox();
    // A rimane sopra l'intero pannello delle mosse (da y=190 sul canvas interno).
    assert.ok(a.y + a.height < canvas.y + canvas.height * 190 / 270);
    const hit = await page.evaluate(() => game.scene.getScene('Level1').npcMenuTick.hits[3]);
    await page.touchscreen.tap(canvas.x + hit.x / 480 * canvas.width, canvas.y + hit.y / 270 * canvas.height);
    await page.waitForTimeout(260);
    assert.equal(await page.evaluate(() => !!game.scene.getScene('Level1').npcMenuTick), true);
    await page.screenshot({ path: '/tmp/francygame-mobile-controls.png' });
    await page.locator('#touch .abtn').tap();
    await settle(() => window.battleResult === 'flee');
    await mode('explore', false);

    // Una pausa sopra un dialogo ripristina la croce, poi torna al solo A.
    await page.evaluate(() => { game.scene.getScene('Level1').say('Simone', 'Una pausa?'); Pause.open(); });
    await page.waitForFunction(() => game.scene.isActive('Pause'));
    await mode('choice', false);
    await page.evaluate(() => game.scene.getScene('Pause').close());
    await page.waitForFunction(() => !game.scene.isActive('Pause'));
    await mode('dialog', true);
    await page.evaluate(() => game.scene.getScene('Level1').scene.restart());
    await page.waitForTimeout(600);
    await settle(() => !game.scene.getScene('Level1').locked);
    await mode('explore', false);
    assert.equal(await page.evaluate(() => Controls.touchModes.length), 0);
    assert.deepEqual(errors, []);
    console.log('OK: dialogo con A, scelta con croce e A, lotta con tap e A, posizione sopra le mosse, pausa e riavvio.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
