// La lotta della notte londinese, in stile Pokémon: SIMONE contro la CACCA DI SIMONE.
// Vince sempre Simone (con un po' di magia). Non è una scena Phaser: vive dentro LondonNightScene.

const POOP_ROWS = [
  '.........KKK..........',
  '........KBBbK.........',
  '.......KBBBBK.........',
  '......KBBBBBBK........',
  '.....KKKKKKKKKK.......',
  '....KBBBBBBBBBbK......',
  '...KBBBBBBBBBBBbK.....',
  '...KBBBBBBBBBBBBK.....',
  '..KKKKKKKKKKKKKKKK....',
  '.KBBBBBBBBBBBBBBBbK...',
  'KBBKKKBBBBBBBKKKBBbK..',
  'KBBWWKKBBBBBKKWWBBbK..',
  'KBBWKWBBBBBBBWKWBBBK..',
  'KBBBWWBBBBBBBBWWBBBbK.',
  'KBBBBBBKKKKKKBBBBBBbK.',
  'KBBBBBBKRRRRKBBBBBBbK.',
  'KBBBBBBBKKKKBBBBBBbbK.',
  '.KBBBBBBBBBBBBBBBbbK..',
  '..KKbbbbbbbbbbbbbbK...',
  '....KKKKKKKKKKKKKK....',
];

const BATTLE_MOVES = ['SCIACQUONE', 'SCOPINO', 'PREGHIERA', 'MAGIA'];

function buildBattleArt(scene) {
  if (scene.textures.exists('poop')) return;
  Pix.addTexture(scene, 'poop', Pix.gridCanvas(POOP_ROWS,
    { '.': null, K: '#2a1d1a', B: '#8a5a2a', b: '#6a4020', W: '#ffffff', R: '#d9434f' }));

  // bagno: piastrelle e pavimento a scacchi
  const [c, ctx] = Pix.canvas(480, 270);
  Pix.rect(ctx, 0, 0, 480, 150, '#e4eef2');
  for (let x = 0; x < 480; x += 14) Pix.rect(ctx, x, 0, 1, 150, '#c4d4dc');
  for (let y = 0; y < 150; y += 14) Pix.rect(ctx, 0, y, 480, 1, '#c4d4dc');
  Pix.rect(ctx, 0, 146, 480, 4, '#a8bcc8');
  for (let y = 150; y < 270; y += 16) {
    for (let x = 0; x < 480; x += 16) Pix.rect(ctx, x, y, 16, 16, ((x + y) / 16) % 2 ? '#d8d8dc' : '#f4f4f6');
  }
  // tappetino sotto Simone e piattaforma per la tazza
  Pix.disc(ctx, 130, 214, 6, '#b8e0c8');
  for (let k = -40; k <= 40; k++) Pix.rect(ctx, 130 + k, 206 + Math.round(Math.abs(k) / 8), 1, 16 - Math.round(Math.abs(k) / 5), '#8ac8a8');
  for (let k = -46; k <= 46; k++) Pix.rect(ctx, 350 + k, 124 + Math.round(Math.abs(k) / 9), 1, 12 - Math.round(Math.abs(k) / 6), '#b8c8d0');
  Pix.addTexture(scene, 'bathroomBg', c);

  // la tazza del gabinetto (vista di tre quarti)
  const [t, tc] = Pix.canvas(56, 54);
  Pix.box(tc, 10, 0, 36, 18, '#ffffff', '#2a1d1a');
  Pix.rect(tc, 12, 2, 32, 3, '#e8eef2');
  Pix.rect(tc, 24, 4, 8, 3, '#c8d0d8');
  Pix.disc(tc, 28, 30, 24, '#2a1d1a');
  Pix.disc(tc, 28, 30, 23, '#ffffff');
  Pix.disc(tc, 28, 30, 17, '#c8d4dc');
  Pix.disc(tc, 28, 31, 14, '#5a8ab8');
  Pix.rect(tc, 18, 28, 8, 1, '#8ab4d8');
  Pix.rect(tc, 14, 46, 28, 8, '#ffffff');
  Pix.rect(tc, 14, 52, 28, 2, '#2a1d1a');
  Pix.rect(tc, 12, 46, 2, 8, '#2a1d1a');
  Pix.rect(tc, 42, 46, 2, 8, '#2a1d1a');
  Pix.addTexture(scene, 'toilet', t);

  // riquadri delle informazioni
  const box = (key, w, h) => {
    const [b, bc] = Pix.canvas(w, h);
    Pix.box(bc, 0, 0, w, h, PAL.cream, PAL.outline);
    Pix.rect(bc, 2, h - 3, w - 4, 1, '#c8b48a');
    Pix.addTexture(scene, key, b);
  };
  box('battleBoxE', 190, 36);
  box('battleBoxS', 196, 46);
}

class ToiletBattle {
  constructor(scene) {
    this.scene = scene;
    buildBattleArt(scene);
  }

  // HP bar con colore che cambia
  makeBar(x, y, w) {
    const S = this.scene;
    const bg = S.add.rectangle(x, y, w + 2, 6, 0x2a1d1a).setOrigin(0, 0.5);
    const fg = S.add.rectangle(x + 1, y, w, 4, 0x4fc86a).setOrigin(0, 0.5);
    this.root.add([bg, fg]);
    return { fg, w };
  }

  setBar(bar, hp, max) {
    const ratio = Math.max(0, hp) / max;
    const col = ratio > 0.5 ? 0x4fc86a : ratio > 0.2 ? 0xf2c14e : 0xd9434f;
    return this.scene.tweenP({
      targets: bar.fg, width: Math.max(0, Math.round(bar.w * ratio)), duration: 500,
      onUpdate: () => bar.fg.setFillStyle(col),
    });
  }

  async run() {
    const releaseTouch = Controls.pushTouchMode('battle', this.scene);
    try {
      return await this.play();
    } finally {
      releaseTouch();
    }
  }

  async play() {
    const S = this.scene;
    this.enemyHP = 100;
    this.simoneHP = 100;

    // transizione: lampi bianchi come quando parte un incontro selvatico
    const flash = S.add.rectangle(0, 0, 480, 270, 0xffffff, 0).setOrigin(0, 0).setScrollFactor(0).setDepth(1300);
    Audio8.playSong(SONGS.battle);
    for (let i = 0; i < 3; i++) {
      flash.fillAlpha = 1;
      await S.tweenP({ targets: flash, fillAlpha: 0, duration: 140 });
    }
    const bars = [];
    for (let i = 0; i < 8; i++) {
      const b = S.add.rectangle(i % 2 ? 480 : -480, i * 34, 480, 34, 0x0e0a12).setOrigin(0, 0).setScrollFactor(0).setDepth(1300);
      bars.push(b);
      S.tweens.add({ targets: b, x: 0, duration: 380, ease: 'Quad.In' });
    }
    await S.wait(450);

    this.root = S.add.container(0, 0).setScrollFactor(0).setDepth(960);
    this.root.add(S.add.image(0, 0, 'bathroomBg').setOrigin(0, 0));
    this.toilet = S.add.image(350, 132, 'toilet').setOrigin(0.5, 1);
    this.poop = S.add.image(350, 104, 'poop').setOrigin(0.5, 1).setScale(3);
    this.simone = S.add.sprite(130, 210, 'simone', DIR_ROW.up * 3).setOrigin(0.5, 1).setScale(4);
    this.root.add([this.toilet, this.poop, this.simone]);

    this.root.add(S.add.image(22, 18, 'battleBoxE').setOrigin(0, 0));
    this.root.add(addText(S, 30, 22, 'CACCA DI SIMONE', { color: 0x2a1d1a }));
    this.root.add(addText(S, 172, 22, 'Lv40', { color: 0x2a1d1a }));
    this.root.add(addText(S, 30, 36, 'HP', { color: 0xd0607e }));
    this.barE = this.makeBar(44, 41, 130);

    this.root.add(S.add.image(268, 142, 'battleBoxS').setOrigin(0, 0));
    this.root.add(addText(S, 276, 146, 'SIMONE', { color: 0x2f4f86 }));
    this.root.add(addText(S, 434, 146, 'Lv99', { color: 0x2a1d1a }));
    this.root.add(addText(S, 276, 160, 'HP', { color: 0xd0607e }));
    this.barS = this.makeBar(290, 165, 160);
    this.hpText = addText(S, 380, 172, '100/100', { color: 0x2a1d1a });
    this.root.add(this.hpText);

    // ingresso: la cacca sale dalla tazza, Simone entra da sinistra
    this.poop.setScale(3, 0);
    this.simone.x = -40;
    bars.forEach((b, i) => S.tweens.add({ targets: b, x: i % 2 ? -480 : 480, duration: 380, ease: 'Quad.Out', onComplete: () => b.destroy() }));
    await S.wait(300);
    Audio8.tone(200, 0.4, { type: 'triangle', vol: 0.2, slide: 500 });
    S.tweens.add({ targets: this.poop, scaleY: 3, duration: 500, ease: 'Back.Out' });
    await S.tweenP({ targets: this.simone, x: 130, duration: 600, ease: 'Quad.Out' });
    S.tweens.add({ targets: this.poop, y: 101, duration: 420, yoyo: true, repeat: -1, ease: 'Sine.InOut' });

    await S.talk([
      [null, 'Una CACCA DI SIMONE selvatica blocca il gabinetto!'],
      [null, 'Forza, SIMONE!'],
    ]);

    // turni
    let turns = 0;
    for (;;) {
      const m = await this.chooseMove();
      const won = await this.simoneTurn(m);
      if (won) break;
      await this.enemyTurn();
      turns++;
      // piccoli aiuti, per non restare bloccati
      if (this.enemyHP <= 45 && !this.hintMagic) {
        this.hintMagic = true;
        await S.talk([[null, 'Psst… forse è il momento giusto per la MAGIA.']]);
      } else if (turns >= 3 && this.enemyHP > 45 && !this.hintBrush) {
        this.hintBrush = true;
        await S.talk([[null, 'Psst… hai provato con lo SCOPINO?']]);
      }
    }
    flash.destroy();
  }

  chooseMove() {
    const S = this.scene;
    const menu = S.add.container(0, 0).setScrollFactor(0).setDepth(1001);
    menu.add(S.add.image(DIALOG.x, DIALOG.y, `dlg_${DIALOG.w}x${DIALOG.h}`).setOrigin(0, 0));
    menu.add(addText(S, 18, 222, 'Cosa farà\nSimone?', { scale: 2, color: 0x2a1d1a }));
    const pos = [[250, 220], [366, 220], [250, 244], [366, 244]];
    const labels = BATTLE_MOVES.map((name, i) => {
      const t = addText(S, pos[i][0] + 10, pos[i][1], name, { color: 0x2a1d1a });
      menu.add(t);
      const z = S.add.zone(pos[i][0] - 4, pos[i][1] - 4, 112, 20).setOrigin(0, 0).setInteractive().setScrollFactor(0);
      z.on('pointerdown', () => { this.menuIndex = i; place(); });
      menu.add(z);
      return t;
    });
    const cursor = addText(S, 0, 0, '►', { color: 0xd0607e });
    menu.add(cursor);
    this.menuIndex = this.menuIndex || 0;
    const place = () => cursor.setPosition(pos[this.menuIndex][0], pos[this.menuIndex][1]);
    place();
    Controls.reset();
    return new Promise((res) => {
      let prevDir = Controls.dir();
      this.menuTick = () => {
        const d = Controls.dir();
        if (d && d !== prevDir) {
          const i = this.menuIndex;
          if (d === 'left' || d === 'right') this.menuIndex = i % 2 ? i - 1 : i + 1;
          if (d === 'up' || d === 'down') this.menuIndex = i < 2 ? i + 2 : i - 2;
          Audio8.sfx('blip');
          place();
        }
        prevDir = d;
        if (Controls.consumeA()) {
          this.menuTick = null;
          Audio8.sfx('select');
          labels.length = 0;
          menu.destroy();
          res(this.menuIndex);
        }
      };
    });
  }

  update() {
    if (this.menuTick) this.menuTick();
  }

  async hitEnemy() {
    const S = this.scene;
    await S.tweenP({ targets: this.simone, x: 160, y: 196, duration: 120, yoyo: true });
    Audio8.sfx('hit');
    for (let i = 0; i < 3; i++) {
      this.poop.setAlpha(0.2);
      await S.wait(70);
      this.poop.setAlpha(1);
      await S.wait(70);
    }
  }

  async simoneTurn(i) {
    const S = this.scene;
    const name = BATTLE_MOVES[i];
    let lines;
    let dmg = 0;
    if (name === 'SCIACQUONE') {
      lines = ["L'acqua sale… e sale… e SALE!", 'Non è molto efficace…'];
      dmg = 5;
    } else if (name === 'SCOPINO') {
      lines = ['È superefficace!'];
      dmg = 40;
    } else if (name === 'PREGHIERA') {
      lines = ['Simone invoca tutti i santi del calendario.', 'La CACCA DI SIMONE è confusa!'];
      dmg = 20;
    } else if (this.enemyHP > 45) {
      await S.talk([[null, 'Simone prova a usare MAGIA…'], [null, '…ma non ci crede ancora abbastanza. Prima bisogna indebolirla!']]);
      return false;
    } else {
      await S.talk([[null, 'Simone usa MAGIA!']]);
      await this.hitEnemy();
      const sp = [];
      for (let k = 0; k < 10; k++) {
        const s = S.add.image(350 + (Math.random() - 0.5) * 70, 70 + Math.random() * 50, 'sparkle').setScrollFactor(0).setDepth(970);
        sp.push(s);
        S.tweens.add({ targets: s, alpha: 0, scale: 2, duration: 600, delay: k * 50 });
      }
      this.enemyHP = 0;
      await this.setBar(this.barE, 0, 100);
      await S.talk([[null, 'Nessuno sa cosa abbia fatto esattamente.'], [null, 'Ma ha funzionato!']]);
      sp.forEach(s => s.destroy());
      await this.enemyFaint();
      return true;
    }
    await S.talk([[null, `Simone usa ${name}!`]]);
    await this.hitEnemy();
    const before = this.enemyHP;
    this.enemyHP = Math.max(8, this.enemyHP - dmg);
    await this.setBar(this.barE, this.enemyHP, 100);
    if (before - dmg < 8) lines = lines.concat(['La CACCA DI SIMONE resiste! Serve qualcosa di… magico.']);
    await S.talk(lines.map(l => [null, l]));
    return false;
  }

  async enemyTurn() {
    const S = this.scene;
    const attacks = [
      ['RISALITA', "L'acqua arriva pericolosamente al bordo!", 15],
      ['PUZZA TREMENDA', 'Simone lacrima. È superefficace!', 22],
      ['SGUARDO FISSO', 'Simone si sente giudicato.', 8],
    ];
    let k = Math.floor(Math.random() * attacks.length);
    if (k === this.lastAttack) k = (k + 1) % attacks.length;
    this.lastAttack = k;
    const [name, msg, dmg] = attacks[k];
    await S.talk([[null, `La CACCA DI SIMONE usa ${name}!`]]);
    await S.tweenP({ targets: this.poop, x: 320, duration: 120, yoyo: true });
    Audio8.tone(140, 0.2, { type: 'square', vol: 0.12, slide: 90 });
    S.cameras.main.shake(200, 0.006);
    for (let i = 0; i < 3; i++) {
      this.simone.setAlpha(0.2);
      await S.wait(70);
      this.simone.setAlpha(1);
      await S.wait(70);
    }
    const lines = [msg];
    this.simoneHP -= dmg;
    if (this.simoneHP < 14) { this.simoneHP = 14; lines.push('Simone resiste con le ultime forze!'); }
    this.hpText.setText(`${this.simoneHP}/100`);
    await this.setBar(this.barS, this.simoneHP, 100);
    await S.talk(lines.map(l => [null, l]));
  }

  async enemyFaint() {
    const S = this.scene;
    S.tweens.killTweensOf(this.poop);
    Audio8.noise(1.2, { filter: 'lowpass', freq: 1200, sweep: 200, vol: 0.35 });
    Audio8.tone(600, 0.9, { type: 'triangle', vol: 0.15, slide: 80 });
    await S.tweenP({ targets: this.poop, scaleY: 0, y: 112, angle: 20, duration: 900, ease: 'Quad.In' });
    Audio8.stopSong();
    Audio8.sfx('jingle');
    await S.talk([
      [null, 'La CACCA DI SIMONE è tornata nelle tubature, da dove era venuta!'],
      [null, 'SIMONE ha vinto!'],
      [null, 'SIMONE ottiene: un gabinetto funzionante.'],
    ]);
    await S.tweenP({ targets: this.root, alpha: 0, duration: 500 });
    this.root.destroy();
  }
}
