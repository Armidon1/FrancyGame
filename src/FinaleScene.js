// Finale: Big Ben di notte, fuochi d'artificio, i tre oggetti di Londra e il premio.

class FinaleScene extends BaseScene {
  constructor() { super('Finale'); }

  create() {
    this.initBase();
    Save.setLevel('Finale');
    this.buildArt();
    this.add.image(0, 0, 'finaleNight').setOrigin(0, 0);

    // stelle che brillano
    for (let i = 0; i < 26; i++) {
      const s = this.add.image(Math.random() * 480, Math.random() * 120, 'sparkle').setScale(0.4).setAlpha(0.3);
      this.tweens.add({ targets: s, alpha: 1, duration: 600 + Math.random() * 900, yoyo: true, repeat: -1, delay: Math.random() * 1500 });
    }

    // Big Ben illuminato
    this.add.image(404, 236, 'bigBenNight').setOrigin(0.5, 1).setScale(1.7);
    const glow = this.add.image(404, 236 - 80 * 1.7, 'clockGlow').setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({ targets: glow, alpha: 0.6, duration: 1200, yoyo: true, repeat: -1 });

    // i due, mano nella mano
    this.f = this.add.sprite(-30, 252, 'francesca', DIR_ROW.right * 3).setOrigin(0.5, 1).setScale(2);
    this.s = this.add.sprite(-60, 252, 'simone', DIR_ROW.right * 3).setOrigin(0.5, 1).setScale(2);

    this.confetti = [];
    Audio8.playSong(SONGS.title);
    this.run();
  }

  buildArt() {
    if (this.textures.exists('finaleNight')) return;
    const [c, ctx] = Pix.canvas(480, 270);
    ditherGradient(ctx, 0, 0, 480, 200, ['#0e0a24', '#1e1640', '#3a2458', '#6a3a6a']);
    // profilo del Parlamento in controluce
    for (let x = 0; x < 360; x += 12) {
      const h = 40 + ((x * 7) % 20);
      Pix.rect(ctx, x, 200 - h, 10, h, '#1a1230');
      Pix.rect(ctx, x + 4, 196 - h, 2, 4, '#1a1230');
      if ((x / 12) % 2) Pix.rect(ctx, x + 3, 200 - h + 10, 3, 5, '#f2c14e');
    }
    Pix.rect(ctx, 0, 170, 480, 30, '#1a1230');
    // Tamigi con i riflessi
    ditherGradient(ctx, 0, 200, 480, 70, ['#1e2a50', '#14183a']);
    const rnd = Pix.rng(4);
    for (let i = 0; i < 60; i++) {
      Pix.rect(ctx, Math.floor(rnd() * 480), 204 + Math.floor(rnd() * 60), 3 + Math.floor(rnd() * 6), 1,
        rnd() < 0.5 ? '#f2c14e' : '#6a7ab8');
    }
    // banchina dove stanno i due
    Pix.rect(ctx, 0, 236, 480, 34, '#3a3048');
    Pix.rect(ctx, 0, 236, 480, 2, '#5a4a68');
    for (let x = 0; x < 480; x += 20) Pix.rect(ctx, x, 238, 1, 32, '#2e2640');
    Pix.addTexture(this, 'finaleNight', c);

    // Big Ben in versione notturna: ridisegno con colori caldi e quadrante acceso
    if (!this.textures.exists('bigBen')) buildLondonArt(this);
    const src = this.textures.get('bigBen').getSourceImage();
    const [b, bc] = Pix.canvas(src.width, src.height);
    bc.drawImage(src, 0, 0);
    const img = bc.getImageData(0, 0, b.width, b.height);
    for (let i = 0; i < img.data.length; i += 4) {
      img.data[i] = img.data[i] * 0.75;
      img.data[i + 1] = img.data[i + 1] * 0.62;
      img.data[i + 2] = img.data[i + 2] * 0.55 + 20;
    }
    bc.putImageData(img, 0, 0);
    Pix.disc(bc, 24, 36, 7, '#fff2b0');
    Pix.rect(bc, 24, 30, 1, 6, '#2a1d1a');
    Pix.rect(bc, 24, 36, 4, 1, '#2a1d1a');
    Pix.addTexture(this, 'bigBenNight', b);

    const [g, gc] = Pix.canvas(40, 40);
    Pix.disc(gc, 20, 20, 19, 'rgba(255,230,140,0.15)');
    Pix.disc(gc, 20, 20, 12, 'rgba(255,230,140,0.25)');
    Pix.addTexture(this, 'clockGlow', g);

    const [p, pc] = Pix.canvas(2, 2);
    Pix.rect(pc, 0, 0, 2, 2, '#ffffff');
    Pix.addTexture(this, 'spark', p);

    const [pn, pnc] = Pix.canvas(340, 126);
    Pix.box(pnc, 0, 0, 340, 126, 'rgba(251,243,228,0.94)', PAL.outline);
    Pix.rect(pnc, 2, 2, 336, 1, PAL.pink);
    Pix.rect(pnc, 2, 123, 336, 1, PAL.pink);
    Pix.addTexture(this, 'prizePanel', pn);
  }

  firework(x, y) {
    const cols = [0xff6a8a, 0xffd84a, 0x7ac0ff, 0x9aff9a, 0xffffff, 0xd08aff];
    const col = cols[Math.floor(Math.random() * cols.length)];
    Audio8.noise(0.35, { freq: 900, vol: 0.12 });
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      const d = 22 + Math.random() * 12;
      const p = this.add.image(x, y, 'spark').setTint(col).setDepth(2);
      this.tweens.add({
        targets: p, x: x + Math.cos(a) * d, y: y + Math.sin(a) * d + 10, alpha: 0,
        duration: 900 + Math.random() * 300, ease: 'Quad.Out', onComplete: () => p.destroy(),
      });
    }
  }

  spawnConfetti() {
    const cols = [0xff6a8a, 0xffd84a, 0x7ac0ff, 0x9aff9a, 0xf7a6bb];
    const p = this.add.image(Math.random() * 480, -4, 'spark').setTint(cols[Math.floor(Math.random() * cols.length)])
      .setDepth(30).setScale(1, 1.5);
    this.tweens.add({
      targets: p, y: 280, x: p.x + (Math.random() - 0.5) * 60, angle: 360,
      duration: 4000 + Math.random() * 2500, onComplete: () => p.destroy(),
    });
  }

  async typeText(t, full, cps = 30) {
    let localized = FontMetrics.wrap(fontText(full), 156).join('\n');
    let i = 0;
    let finished = false;
    const refresh = () => {
      localized = FontMetrics.wrap(fontText(full), 156).join('\n');
      i = finished ? localized.length : Math.min(i, localized.length);
      t.setText(localized.slice(0, i));
    };
    I18n.bind(t, refresh);
    for (i = 1; i <= localized.length; i++) {
      t.setText(localized.slice(0, i));
      if (i % 2) Audio8.sfx('blip');
      await this.wait(1000 / cps);
    }
    finished = true;
  }

  async run() {
    // entrano camminando
    this.f.play('francesca-walk-right');
    this.s.play('simone-walk-right');
    this.tweens.add({ targets: this.s, x: 222, duration: 2600 });
    await this.tweenP({ targets: this.f, x: 254, duration: 2600 });
    this.f.anims.stop(); this.s.anims.stop();
    this.f.setFrame(DIR_ROW.down * 3);
    this.s.setFrame(DIR_ROW.down * 3);
    const h = this.add.image(238, 196, 'heart').setScale(0).setDepth(5);
    this.tweens.add({ targets: h, scale: 1.5, duration: 400, ease: 'Back.Out' });
    this.tweens.add({ targets: h, y: 192, duration: 700, yoyo: true, repeat: -1, delay: 400, ease: 'Sine.InOut' });

    // fuochi d'artificio e coriandoli
    this.time.addEvent({ delay: 650, loop: true, callback: () => this.firework(60 + Math.random() * 300, 30 + Math.random() * 80) });
    this.time.addEvent({ delay: 120, loop: true, callback: () => this.spawnConfetti() });

    await this.wait(600);
    const title = addText(this, 240, 22, 'Buon compleanno, Picci Picci.', {
      scale: 3, color: 0xffd6de, shadow: 0x5a1a3a, origin: [0.5, 0.5], depth: 40,
    });
    title.setScale(0);
    Audio8.sfx('jingle');
    await this.tweenP({ targets: title, scale: 1, duration: 600, ease: 'Back.Out' });
    await this.wait(900);

    const panel = this.add.image(14, 46, 'prizePanel').setOrigin(0, 0).setDepth(35).setAlpha(0);
    await this.tweenP({ targets: panel, alpha: 1, duration: 400 });
    addText(this, 24, 54, 'Premio sbloccato:', { scale: 2, color: 0xd0607e, depth: 40 });
    const body = 'un viaggio a Londra con me, a novembre… e un tè caldo che ti aspetta adesso.';
    const bodyText = addText(this, 24, 78, '', { scale: 2, color: 0x2a1d1a, depth: 40 });
    bodyText.setLineSpacing(2);
    await this.typeText(bodyText, body);
    await this.wait(700);
    const sign = addText(this, 342, 154, '— il tuo orsacchiotto', { scale: 1, color: 0x7a3a5a, origin: [1, 0], depth: 40 });
    sign.setAlpha(0);
    await this.tweenP({ targets: sign, alpha: 1, duration: 900 });

    // i tre oggetti di Londra
    await this.wait(500);
    const icons = ['itemTeddy', 'itemCoffee', 'itemTea'];
    for (let i = 0; i < 3; i++) {
      const x = 46 + i * 40;
      const base = this.add.rectangle(x, 218, 30, 6, 0x5a4a68).setDepth(6);
      const it = this.add.image(x, 202, icons[i]).setScale(0).setDepth(7);
      Audio8.sfx('pop');
      await this.tweenP({ targets: it, scale: 2, duration: 350, ease: 'Back.Out' });
      this.tweens.add({ targets: it, y: 198, duration: 800 + i * 120, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
      base.setAlpha(0.8);
      await this.wait(250);
    }

    // tasto discreto "Gioca di nuovo" (solo tocco/clic, così non si preme per sbaglio)
    await this.wait(2500);
    const again = addText(this, 470, 260, 'Gioca di nuovo', { color: 0xc8b8d8, origin: [1, 1], depth: 40 });
    again.setAlpha(0);
    this.tweens.add({ targets: again, alpha: 0.75, duration: 800 });
    const zone = this.add.zone(470, 260, 90, 22).setOrigin(1, 1).setInteractive({ useHandCursor: true }).setDepth(41);
    zone.on('pointerup', () => {
      Save.clear();
      Audio8.stopSong(0.5);
      this.goTo('Title');
    });
  }
}
