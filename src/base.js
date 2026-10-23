// Scena di base con gli strumenti comuni: dialoghi, attese, dissolvenze, completamento livelli.

const LEVELS = [
  {
    key: 'Level1', num: 1, name: 'Il Gianicolo',
    message: 'Qui hai trovato Roma ai tuoi piedi… e un orsacchiotto al tuo fianco.',
  },
  {
    key: 'Level2', num: 2, name: 'La pista di pattinaggio',
    message: 'Anche quando scivoliamo, ci teniamo per mano. Livello superato, piccina!',
  },
  {
    key: 'Level3', num: 3, name: 'Londra, 40.000 passi',
    message: 'Ci siamo già stati, ma la prossima volta sarà ancora più bella.',
  },
];

const FADE_RGB = [26, 16, 32];

class BaseScene extends Phaser.Scene {
  initBase() {
    Controls.reset();
    this.dialog = new DialogBox(this);
    this.busy = false;
    this.leaving = false;
    this.aWaiter = null;
    this.humBubbles = [];
    this.nextHum = null;
    this.humIndex = -1;
    this.cameras.main.fadeIn(450, ...FADE_RGB);
    this.events.once('shutdown', () => { this.tweens.killAll(); this.time.removeAllEvents(); });
  }

  get locked() {
    return this.busy || this.dialog.active || this.leaving;
  }

  update(time, delta) {
    delta = Math.min(delta, 50); // niente salti enormi se il telefono rallenta
    this.dialog.update(delta);
    if (this.aWaiter && !this.dialog.active && Controls.consumeA()) {
      const r = this.aWaiter;
      this.aWaiter = null;
      Audio8.sfx('select');
      r();
    }
    if (this.tick) this.tick(time, delta);
    this.humBubbles = this.humBubbles.filter((e) => {
      if (time > e.until) { e.b.destroy(); return false; }
      // dentro lo schermo anche quando il personaggio è vicino al bordo
      const cam = this.cameras.main, half = e.w / 2 + 2;
      const x = Math.max(cam.scrollX + half, Math.min(cam.scrollX + 480 - half, e.ch.x));
      e.b.setPosition(Math.round(x), Math.round(e.ch.y - 24));
      return true;
    });
  }

  // Canticchiare: fumetto con le note sopra il personaggio e qualche nota sottovoce
  hum(ch, text, ms = 2600) {
    const w = FontMetrics.measureLocalized(text) + 10;
    this.humBubbles.push({ b: Art.bubble(this, text), ch, w, until: this.time.now + ms });
    const scale = ['C5', 'D5', 'E5', 'G5', 'A5', 'C6'];
    for (let i = 0; i < 4; i++) {
      const f = NOTE_FREQ[scale[Math.floor(Math.random() * scale.length)]];
      Audio8.tone(f, 0.22, { type: 'sine', vol: 0.05, delay: 0.15 + i * 0.26 });
    }
  }

  // Ogni tanto, mentre si gioca liberamente, qualcuno canticchia: righe [[personaggio, testo], ...]
  humTick(time, songs, allowed = true) {
    if (this.nextHum === null) this.nextHum = time + 18000;
    if (time < this.nextHum || this.locked || !allowed) return;
    this.nextHum = time + 30000 + Math.random() * 15000;
    this.humIndex = (this.humIndex + 1) % songs.length;
    songs[this.humIndex].forEach(([ch, text], i) =>
      this.time.delayedCall(i * 2000, () => { if (!this.locked) this.hum(ch, text); }));
  }

  wait(ms) {
    return new Promise(r => this.time.delayedCall(ms, r));
  }

  tweenP(cfg) {
    return new Promise((r) => {
      const done = cfg.onComplete;
      this.tweens.add({ ...cfg, onComplete: (...a) => { if (done) done(...a); r(); } });
    });
  }

  waitA() {
    Controls.reset();
    return new Promise((r) => { this.aWaiter = r; });
  }

  say(who, text) {
    return this.dialog.show([[who, text]]);
  }

  talk(lines) {
    return this.dialog.show(lines);
  }

  goTo(key, data) {
    if (this.leaving) return;
    this.leaving = true;
    const cam = this.cameras.main;
    cam.fadeOut(500, ...FADE_RGB);
    cam.once('camerafadeoutcomplete', () => this.scene.start(key, data));
  }

  completeLevel(num) {
    const i = LEVELS.findIndex(l => l.num === num);
    const next = LEVELS[i + 1] ? LEVELS[i + 1].key : 'Finale';
    Save.setLevel(next);
    this.goTo('LevelComplete', { num, next });
  }

  // Cartello iniziale "Livello N — nome"
  levelCard(num, name) {
    const g = this.add.container(240, 120).setScrollFactor(0).setDepth(1500);
    const w = Math.max(FontMetrics.measureLocalized(name) * 2, 120) + 32;
    const key = `card_${w}`;
    if (!this.textures.exists(key)) {
      const [c, ctx] = Pix.canvas(w, 46);
      Pix.box(ctx, 0, 0, w, 46, PAL.cream, PAL.outline);
      Pix.rect(ctx, 2, 2, w - 4, 1, PAL.pink);
      Pix.rect(ctx, 2, 43, w - 4, 1, PAL.pink);
      Pix.addTexture(this, key, c);
    }
    g.add(this.add.image(0, 0, key));
    g.add(addText(this, 0, -14, `Livello ${num}`, { color: 0xd0607e, origin: [0.5, 0.5] }));
    g.add(addText(this, 0, 6, name, { scale: 2, color: 0x2a1d1a, origin: [0.5, 0.5] }));
    g.setAlpha(0).setScale(0.8);
    return this.tweenP({ targets: g, alpha: 1, scale: 1, duration: 350, ease: 'Back.Out' })
      .then(() => this.wait(1500))
      .then(() => this.tweenP({ targets: g, alpha: 0, y: 100, duration: 350 }))
      .then(() => g.destroy());
  }

  // Riquadro "Oggetto sbloccato!" con l'icona grande; onShown viene chiamato quando appare
  async itemPopup(icon, name, onShown) {
    Audio8.sfx('item');
    const c = this.add.container(240, 118).setScrollFactor(0).setDepth(1250);
    const key = 'itemPanel';
    if (!this.textures.exists(key)) {
      const [p, pc] = Pix.canvas(260, 96);
      Pix.box(pc, 0, 0, 260, 96, PAL.cream, PAL.outline);
      Pix.rect(pc, 2, 2, 256, 1, PAL.pink);
      Pix.rect(pc, 2, 93, 256, 1, PAL.pink);
      Pix.addTexture(this, key, p);
    }
    c.add(this.add.image(0, 0, key));
    c.add(addText(this, 0, -36, 'Oggetto sbloccato!', { scale: 2, color: 0xd0607e, origin: [0.5, 0.5] }));
    const img = this.add.image(0, -2, icon).setScale(3);
    c.add(img);
    c.add(addText(this, 0, 30, name, { color: 0x2a1d1a, origin: [0.5, 0.5] }));
    c.setScale(0);
    this.tweens.add({ targets: img, angle: { from: -8, to: 8 }, duration: 500, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    await this.tweenP({ targets: c, scale: 1, duration: 350, ease: 'Back.Out' });
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2;
      const s = this.add.image(240, 116, 'sparkle').setScrollFactor(0).setDepth(1251);
      this.tweens.add({ targets: s, x: 240 + Math.cos(a) * 70, y: 116 + Math.sin(a) * 50, alpha: 0, duration: 700, onComplete: () => s.destroy() });
    }
    if (onShown) onShown();
    await this.wait(500);
    await this.waitA();
    await this.tweenP({ targets: c, scale: 0, duration: 200 });
    c.destroy();
  }

  // Cuoricini che salgono (decorazione)
  floatHearts(count, area, opts = {}) {
    for (let i = 0; i < count; i++) {
      const tex = Math.random() < 0.5 ? 'heart' : 'heartPink';
      const h = this.add.image(area.x + Math.random() * area.w, area.y + area.h + Math.random() * 40, tex)
        .setDepth(opts.depth || 5).setScrollFactor(opts.fixed ? 0 : 1).setAlpha(0.9);
      const dur = 4000 + Math.random() * 4000;
      this.tweens.add({
        targets: h, y: area.y - 20, duration: dur, delay: Math.random() * dur, repeat: -1,
        onRepeat: () => { h.x = area.x + Math.random() * area.w; },
      });
      this.tweens.add({ targets: h, x: '+=6', duration: 900 + Math.random() * 600, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    }
  }
}
