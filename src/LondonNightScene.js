// Quella sera a Londra: febbre a 38,5, il tè alla cannella di zia Dorota, il film sul soffitto
// col proiettore di zio Paul, Simone infermiere, la lotta col gabinetto e la mattina dopo.
// La camera è disegnata a mezza risoluzione (240x135) e mostrata ingrandita 2x.

class LondonNightScene extends BaseScene {
  constructor() { super('LondonNight'); }

  create() {
    this.initBase();
    this.buildArt();
    this.room = this.add.container(0, 0).setScale(2);
    this.room.add(this.add.image(0, 0, 'bedroom').setOrigin(0, 0));
    this.fra = this.add.image(120, 33, 'fraBed').setOrigin(0.5, 0);
    this.duvet = this.add.image(91, 50, 'duvet').setOrigin(0, 0);
    this.simone = this.add.sprite(80, 86, 'simone', DIR_ROW.right * 3).setOrigin(0.5, 1);
    this.room.add([this.fra, this.duvet, this.simone]);

    // luce calda della lampada e buio della sera
    this.lampGlow = this.add.image(324, 64, 'lampGlowBig').setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.8);
    this.night = this.add.rectangle(0, 0, 480, 270, 0x0a0a28, 0.35).setOrigin(0, 0).setDepth(50);
    this.lampGlow.setDepth(51);
    this.battle = null;
    Audio8.playSong(SONGS.lullaby);
    this.run();
  }

  buildArt() {
    if (!this.textures.exists('itemTea')) buildLondonArt(this);
    if (this.textures.exists('bedroom')) return;
    const [c, ctx] = Pix.canvas(240, 135);
    // pareti color salvia e finestra con la luna
    Pix.rect(ctx, 0, 0, 240, 33, '#a8b4a4');
    for (let x = 0; x < 240; x += 6) Pix.rect(ctx, x, 0, 1, 31, '#9ca898');
    Pix.rect(ctx, 0, 31, 240, 3, '#e8e4d8');
    Pix.rect(ctx, 14, 4, 32, 22, '#f4f0e8');
    Pix.rect(ctx, 16, 6, 28, 18, '#1e2a50');
    Pix.disc(ctx, 37, 11, 3, '#fff4c4');
    Pix.px(ctx, 22, 9, '#ffffff'); Pix.px(ctx, 27, 17, '#ffffff'); Pix.px(ctx, 19, 20, '#c8d0f0');
    Pix.rect(ctx, 29, 6, 1, 18, '#f4f0e8');
    Pix.rect(ctx, 10, 3, 5, 26, '#c8a0a8');
    Pix.rect(ctx, 45, 3, 5, 26, '#c8a0a8');
    Pix.rect(ctx, 196, 6, 22, 15, '#8a6a4a');
    Pix.rect(ctx, 198, 8, 18, 11, '#e8c8a0');
    Pix.rect(ctx, 200, 13, 14, 5, '#7aa860');
    // parquet
    Pix.rect(ctx, 0, 34, 240, 101, '#b08454');
    for (let y = 34; y < 135; y += 6) {
      Pix.rect(ctx, 0, y, 240, 1, '#946a40');
      for (let x = (y % 12 ? 0 : 20); x < 240; x += 40) Pix.rect(ctx, x, y, 1, 6, '#946a40');
    }
    // tappeto
    Pix.box(ctx, 64, 70, 112, 56, '#c8a8b8', '#8a6a7a');
    Pix.rect(ctx, 68, 74, 104, 1, '#e8d0dc');
    Pix.rect(ctx, 68, 121, 104, 1, '#e8d0dc');
    // letto: testiera imbottita, materasso e cuscino
    Pix.box(ctx, 88, 17, 64, 19, '#9aa898', '#4a5a4a');
    for (let x = 96; x < 148; x += 10) { Pix.px(ctx, x, 23, '#6a7a6a'); Pix.px(ctx, x + 5, 29, '#6a7a6a'); }
    Pix.rect(ctx, 90, 34, 60, 76, '#2a1d1a');
    Pix.rect(ctx, 91, 35, 58, 74, '#f4f4f0');
    Pix.box(ctx, 95, 36, 50, 13, '#ffffff', '#c8c8c4');
    Pix.rect(ctx, 97, 46, 46, 2, '#e4e4e0');
    // cuscino a stella grigio e orsetto sulla testiera (come nella foto)
    Pix.grid(ctx, [
      '...KK...',
      '..KGGK..',
      'KKGGGGKK',
      'KGGGGGGK',
      '.KGGGGK.',
      'KGGKKGGK',
      'KKK..KKK',
    ], { '.': null, K: '#2a2a32', G: '#6a6a74' }, 114, 9);
    Pix.grid(ctx, [
      '.KK.KK.',
      'KbbKbbK',
      'KbbbbbK',
      '.KbEbK.',
      'KbbbbbK',
      'KbKKKbK',
      '.K...K.',
    ], { '.': null, K: '#2a1d1a', b: '#c8c0c8', E: '#2a1d1a' }, 124, 10);
    // comodino con la tazza a righe e il sacchetto regalo
    Pix.box(ctx, 154, 28, 18, 16, '#c89a5a', '#6a4a2a');
    Pix.rect(ctx, 155, 40, 16, 1, '#8a6a3a');
    Pix.rect(ctx, 165, 21, 5, 7, '#ffffff');
    Pix.rect(ctx, 165, 22, 5, 1, '#d9434f'); Pix.rect(ctx, 165, 24, 5, 1, '#d9434f'); Pix.rect(ctx, 165, 26, 5, 1, '#d9434f');
    Pix.rect(ctx, 170, 23, 1, 2, '#ffffff');
    Pix.rect(ctx, 156, 19, 7, 9, '#f8f0f4');
    Pix.px(ctx, 158, 21, '#f29bb0'); Pix.px(ctx, 161, 24, '#f29bb0'); Pix.px(ctx, 158, 26, '#f29bb0');
    Pix.rect(ctx, 157, 17, 1, 2, '#c8a0a8'); Pix.rect(ctx, 161, 17, 1, 2, '#c8a0a8');
    // lampada
    Pix.rect(ctx, 160, 12, 1, 7, '#4a3a2a');
    Pix.rect(ctx, 157, 8, 7, 5, '#f8e8b8');
    Pix.addTexture(this, 'bedroom', c);

    // Francesca a letto: testa dal suo foglio + pigiama azzurro di pile con i pon pon
    const src = this.textures.get('francesca').getSourceImage();
    const [f, fc] = Pix.canvas(26, 20);
    fc.drawImage(src, 0, 0, 16, 13, 5, 0, 16, 13);
    Pix.rect(fc, 2, 12, 22, 8, '#2a1d1a');
    Pix.rect(fc, 3, 13, 20, 7, '#a8d4e4');
    Pix.rect(fc, 3, 13, 20, 1, '#c8e8f4');
    Pix.rect(fc, 12, 13, 2, 3, '#2a1d1a');
    Pix.px(fc, 11, 16, '#ffffff'); Pix.px(fc, 14, 16, '#ffffff');
    Pix.rect(fc, 6, 17, 4, 3, '#f8d4ba');
    Pix.rect(fc, 16, 17, 4, 3, '#f8d4ba');
    Pix.addTexture(this, 'fraBed', f);

    const [d, dc] = Pix.canvas(58, 59);
    Pix.rect(dc, 0, 0, 58, 59, '#f8f8f4');
    Pix.rect(dc, 0, 0, 58, 3, '#ffffff');
    Pix.rect(dc, 0, 3, 58, 1, '#dcdcd8');
    for (let k = 0; k < 6; k++) Pix.rect(dc, 6 + k * 9, 10 + (k % 3) * 12, 6, 1, '#e0e0dc');
    Pix.rect(dc, 0, 57, 58, 2, '#dcdcd8');
    Pix.addTexture(this, 'duvet', d);

    // vassoio: mela a spicchi, burro d'arachidi e tè alla cannella
    Pix.addTexture(this, 'tray', Pix.gridCanvas([
      'KKKKKKKKKKKKKKKKKKKK',
      'KwwwwwwwwwwwwwwwwwwK',
      'KwWWWWWWWwwwwwwwwwwK',
      'KWaaWaaWWWwwKKKKwwwK',
      'KWarWarWWWwKRWRWKwwK',
      'KWWWWWWWWWwKWRWRKKwK',
      'KWaaWaaWppWKRWRWKwKK',
      'KWarWarWppWKWRWRKKwK',
      'KwWWWWWWWWwwKKKKwwwK',
      'KwwwwwwwwwwwwwwwwwwK',
      'KKKKKKKKKKKKKKKKKKKK',
    ], { '.': null, K: '#5a3a24', w: '#c89a5a', W: '#ffffff', a: '#f4ecc8', r: '#d9434f', p: '#c8945a', R: '#d9434f' }));

    Pix.addTexture(this, 'projector', Pix.gridCanvas([
      '.KKKKKKKK.',
      'KGGGGGGGGK',
      'KGgGGGGKYK',
      'KGGGGGGKYK',
      'KGGGGGGGGK',
      '.KK....KK.',
    ], { '.': null, K: '#1e1e26', G: '#5a5a66', g: '#8a8a96', Y: '#fff4c4' }));

    Pix.addTexture(this, 'shirtWet', Pix.gridCanvas([
      'KK.KK.KK',
      'KbKbbKbK',
      'KbbbbbbK',
      '.KbdbbK.',
      '.KbbbdK.',
      '.KdbbbK.',
      '.KKKKKK.',
    ], { '.': null, K: '#2a1d1a', b: '#a8d4e4', d: '#4f8fcf' }));

    const [g, gc] = Pix.canvas(60, 60);
    Pix.disc(gc, 30, 30, 29, 'rgba(255,214,140,0.10)');
    Pix.disc(gc, 30, 30, 18, 'rgba(255,214,140,0.18)');
    Pix.addTexture(this, 'lampGlowBig', g);

    // il soffitto visto dal letto, per il film
    const [p, pc] = Pix.canvas(480, 270);
    Pix.rect(pc, 0, 0, 480, 270, '#2a2636');
    const r = Pix.rng(9);
    for (let i = 0; i < 400; i++) Pix.px(pc, Math.floor(r() * 480), Math.floor(r() * 270), '#322e40');
    Pix.disc(pc, 70, 40, 12, '#3a3648');
    Pix.disc(pc, 70, 40, 6, '#4a4658');
    Pix.rect(pc, 0, 236, 480, 34, '#e8e8e4');
    Pix.rect(pc, 0, 236, 480, 2, '#c8c8c4');
    Pix.addTexture(this, 'ceilingPov', p);

    // il "film" proiettato: Londra al tramonto
    const [m, mc] = Pix.canvas(240, 128);
    ditherGradient(mc, 0, 0, 240, 128, ['#4a3a74', '#a8507a', '#f7b267', '#fde3a0']);
    Pix.disc(mc, 170, 96, 16, '#fff2c4');
    Pix.rect(mc, 0, 100, 240, 28, '#3a2340');
    for (let x = 0; x < 240; x += 14) Pix.rect(mc, x, 100 - 6 - ((x * 3) % 14), 12, 20, '#3a2340');
    Pix.rect(mc, 40, 52, 10, 50, '#3a2340');
    Pix.rect(mc, 38, 46, 14, 8, '#3a2340');
    for (let k = 0; k < 8; k++) Pix.rect(mc, 45 - k / 2, 38 + k, 1 + k, 1, '#3a2340');
    Pix.disc(mc, 45, 50, 3, '#fff2c4');
    Pix.addTexture(this, 'filmScene', m);
  }

  // Coordinate della camera (mezza risoluzione) -> schermo
  sx(x) { return x * 2; }
  sy(y) { return y * 2; }

  bubbleAt(x, y, text, ms = 2000) {
    const b = Art.bubble(this, text).setDepth(1500);
    b.setPosition(this.sx(x), this.sy(y));
    this.time.delayedCall(ms, () => b.destroy());
    return new Promise(r => this.time.delayedCall(ms, r));
  }

  // un personaggio cammina dentro la camera
  walkSprite(spr, key, x, y, speed = 30) {
    const dx = x - spr.x;
    const dy = y - spr.y;
    const dir = dirFromVector(dx, dy, 'up');
    spr.play(`${key}-walk-${dir}`);
    return this.tweenP({ targets: spr, x, y, duration: Math.hypot(dx, dy) / speed * 1000 }).then(() => {
      spr.anims.stop();
      spr.setFrame(DIR_ROW[dir] * 3);
    });
  }

  async card(text) {
    const t = addText(this, 240, 135, text, { scale: 3, color: 0xfbf3e4, shadow: 0x3a2340, origin: [0.5, 0.5], depth: 1400 });
    const bg = this.add.rectangle(0, 0, 480, 270, 0x0e0a12, 1).setOrigin(0, 0).setDepth(1399);
    t.setAlpha(0);
    await this.tweenP({ targets: t, alpha: 1, duration: 600 });
    await this.wait(1400);
    this.tweens.add({ targets: t, alpha: 0, duration: 500 });
    await this.tweenP({ targets: bg, alpha: 0, duration: 900 });
    t.destroy();
    bg.destroy();
  }

  tick() {
    if (this.battle) this.battle.update();
    if (this.carry) this.carry.what.setPosition(this.carry.who.x, this.carry.who.y - 8);
  }

  async run() {
    await this.card('Quella sera…');

    // la febbre
    Audio8.tone(NOTE_FREQ.E5, 0.15, { vol: 0.08 });
    this.bubbleAt(120, 30, '38,5°', 2600);
    const blush = this.add.rectangle(this.sx(120), this.sy(40), 22, 4, 0xf07070, 0.45).setDepth(5);
    this.room.add(blush);
    blush.setPosition(120, 41);
    blush.setSize(11, 2);
    await this.wait(600);
    await this.talk([
      [null, 'Dopo quarantamila passi, quella sera stessa: febbre a 38,5.'],
      ['Simone', '…lo sapevo che dovevamo prendere la metro.'],
    ]);

    // zia Dorota con il tè alla cannella e la mela col burro d'arachidi
    const dorota = this.add.sprite(200, 150, 'ziaDorota', DIR_ROW.up * 3).setOrigin(0.5, 1);
    const tray = this.add.image(200, 128, 'tray').setOrigin(0.5, 1);
    this.room.add([dorota, tray]);
    this.carry = { who: dorota, what: tray };
    await this.walkSprite(dorota, 'ziaDorota', 200, 104, 28);
    await this.walkSprite(dorota, 'ziaDorota', 162, 82, 28);
    dorota.setFrame(DIR_ROW.left * 3);
    this.carry = null;
    tray.setPosition(152, 72);
    await this.talk([
      ['Zia Dorota', 'Oh, you poor thing! Here you go, sweetheart: a hot cinnamon tea…'],
      ['Zia Dorota', '…and some apple with peanut butter. You\'ll feel better in no time.'],
    ]);
    await this.tweenP({ targets: tray, x: 104, y: 74, duration: 500 });
    tray.setDepth(1);
    this.room.bringToTop(tray);
    await this.itemPopup('itemTea', 'il tè alla cannella di zia Dorota 🫖');
    await this.say('Zia Dorota', 'Get some rest, love.');
    await this.walkSprite(dorota, 'ziaDorota', 200, 104, 34);
    await this.walkSprite(dorota, 'ziaDorota', 200, 150, 34);
    dorota.destroy();

    // zio Paul e il proiettore
    const paul = this.add.sprite(200, 150, 'zioPaul', DIR_ROW.up * 3).setOrigin(0.5, 1);
    this.room.add(paul);
    await this.walkSprite(paul, 'zioPaul', 200, 104, 30);
    await this.walkSprite(paul, 'zioPaul', 166, 60, 30);
    paul.setFrame(DIR_ROW.up * 3);
    await this.talk([
      ['Zio Paul', 'Right then, you two. Fancy a film?'],
      ['Zio Paul', 'I\'ll put it on the ceiling with my projector. Proper cinema, innit.'],
    ]);
    const proj = this.add.image(162, 27, 'projector').setOrigin(0.5, 1);
    this.room.add(proj);
    Audio8.sfx('pop');
    await this.wait(400);
    await this.say('Zio Paul', 'Enjoy! Night night.');
    await this.walkSprite(paul, 'zioPaul', 200, 104, 34);
    await this.walkSprite(paul, 'zioPaul', 200, 150, 34);
    paul.destroy();
    await this.ceilingFilm();

    // la notte: Simone infermiere
    this.tweens.add({ targets: this.night, fillAlpha: 0.62, duration: 1200 });
    this.tweens.add({ targets: this.lampGlow, alpha: 0.25, duration: 1200 });
    await this.wait(900);
    this.bubbleAt(122, 30, 'zzz…', 2500);
    await this.talk([[null, 'Simone ti ha fatto da infermiere per tutta la notte.']]);
    const shirt = this.add.image(this.sx(120), this.sy(48), 'shirtWet').setScale(3).setDepth(60);
    await this.tweenP({ targets: shirt, y: shirt.y - 30, duration: 500, ease: 'Quad.Out' });
    this.tweens.add({ targets: shirt, x: this.sx(80), y: this.sy(110), angle: -200, alpha: 0, duration: 700, onComplete: () => shirt.destroy() });
    for (let i = 0; i < 6; i++) {
      const s = this.add.image(this.sx(120) + (Math.random() - 0.5) * 40, this.sy(45) + (Math.random() - 0.5) * 20, 'sparkle').setDepth(60);
      this.tweens.add({ targets: s, alpha: 0, scale: 1.8, duration: 600, delay: i * 90, onComplete: () => s.destroy() });
    }
    await this.talk([[null, 'Ti ha cambiato la maglietta sudata, perché il giorno dopo stessi meglio.']]);

    // il gabinetto
    await this.talk([[null, 'Poi, nel cuore della notte…']]);
    await this.walkSprite(this.simone, 'simone', 80, 140, 34);
    await this.talk([[null, '…Simone ha intasato il gabinetto di zia Dorota e zio Paul.']]);
    Audio8.stopSong();
    this.battle = new ToiletBattle(this);
    await this.battle.run();
    this.battle = null;

    // la doccia
    Audio8.playSong(SONGS.lullaby);
    Audio8.noise(2.4, { filter: 'highpass', freq: 3000, vol: 0.18 });
    for (let i = 0; i < 12; i++) {
      const st = this.add.image(this.sx(30) + Math.random() * 60, this.sy(130), 'sparkle').setDepth(60).setAlpha(0.6).setTint(0xdde8f0);
      this.tweens.add({ targets: st, y: st.y - 80 - Math.random() * 40, alpha: 0, scale: 2.5, duration: 1600, delay: i * 150, onComplete: () => st.destroy() });
    }
    await this.wait(600);
    await this.talk([
      [null, 'Ha vinto lui. Ma il combattimento è stato così tosto che si è dovuto fare una doccia.'],
    ]);
    await this.walkSprite(this.simone, 'simone', 80, 86, 30);
    this.simone.setFrame(DIR_ROW.right * 3);

    // la mattina dopo
    await this.card('La mattina dopo…');
    blush.destroy();
    this.tweens.add({ targets: this.night, fillAlpha: 0, duration: 1500 });
    this.tweens.add({ targets: this.lampGlow, alpha: 0, duration: 1500 });
    const sun = this.add.graphics().setDepth(52).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0);
    sun.fillStyle(0xffd88a, 0.18).fillTriangle(60, 30, 100, 30, 240, 230).fillTriangle(60, 30, 180, 250, 240, 230);
    this.tweens.add({ targets: sun, alpha: 1, duration: 1500 });
    const day = this.add.rectangle(16, 6, 28, 18, 0xa8d4f0).setOrigin(0, 0).setAlpha(0);
    const pane = this.add.rectangle(29, 6, 1, 18, 0xf4f0e8).setOrigin(0, 0).setAlpha(0);
    this.room.addAt([day, pane], 1);
    this.tweens.add({ targets: [day, pane], alpha: 1, duration: 1500 });
    Audio8.playSong(SONGS.title);
    await this.wait(1200);
    await this.tweenP({ targets: this.fra, y: 30, duration: 500, ease: 'Quad.Out' });
    const h = this.add.image(this.sx(120), this.sy(26), 'heartBig').setDepth(60).setScale(0);
    Audio8.sfx('heart');
    await this.tweenP({ targets: h, scale: 1.2, duration: 400, ease: 'Back.Out' });
    this.tweens.add({ targets: h, y: h.y - 4, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    await this.talk([
      [null, 'E il giorno dopo, infatti, stavi meglio.'],
      ['Simone', 'Visto? Tè alla cannella e maglietta asciutta: cura infallibile.'],
    ]);
    await this.wait(400);
    this.completeLevel(3);
  }

  // Il film sul soffitto, visto dal letto
  async ceilingFilm() {
    const black = this.add.rectangle(0, 0, 480, 270, 0x0e0a12, 0).setOrigin(0, 0).setDepth(1200);
    await this.tweenP({ targets: black, fillAlpha: 1, duration: 600 });
    const ov = this.add.container(0, 0).setDepth(1190);
    ov.add(this.add.image(0, 0, 'ceilingPov').setOrigin(0, 0));
    const beam = this.add.graphics();
    beam.fillStyle(0xfff4d8, 0.07).fillTriangle(240, 270, 120, 168, 360, 168).fillTriangle(240, 270, 120, 168, 120, 40);
    beam.fillTriangle(240, 270, 360, 168, 360, 40);
    ov.add(beam);
    const screen = this.add.image(240, 104, 'filmScene');
    ov.add(screen);
    this.tweens.add({ targets: screen, alpha: 0.88, duration: 90, yoyo: true, repeat: -1, repeatDelay: 700 });
    // due figurine nel film che camminano mano nella mano
    const a = this.add.sprite(140, 160, 'francesca', DIR_ROW.right * 3).setOrigin(0.5, 1);
    const b = this.add.sprite(124, 160, 'simone', DIR_ROW.right * 3).setOrigin(0.5, 1);
    a.play('francesca-walk-right'); b.play('simone-walk-right');
    ov.add([a, b]);
    this.tweens.add({ targets: [a, b], x: '+=180', duration: 7000 });
    // le vostre teste, dal cuscino
    const hf = this.add.sprite(214, 214, 'francesca', DIR_ROW.up * 3).setOrigin(0.5, 0).setScale(4).setCrop(0, 0, 16, 14);
    const hs = this.add.sprite(272, 214, 'simone', DIR_ROW.up * 3).setOrigin(0.5, 0).setScale(4).setCrop(0, 0, 16, 14);
    ov.add([hf, hs]);
    await this.tweenP({ targets: black, fillAlpha: 0, duration: 800 });
    await this.wait(1200);
    await this.talk([[null, 'E così vi siete visti un film. Sul soffitto.']]);
    for (let i = 0; i < 3; i++) {
      const heart = this.add.image(250 + i * 6, 200, 'heart').setDepth(1195);
      this.tweens.add({ targets: heart, y: 150, alpha: 0, delay: i * 400, duration: 1500, onComplete: () => heart.destroy() });
    }
    await this.wait(2200);
    await this.tweenP({ targets: black, fillAlpha: 1, duration: 600 });
    ov.destroy();
    await this.tweenP({ targets: black, fillAlpha: 0, duration: 600 });
    black.destroy();
  }
}
