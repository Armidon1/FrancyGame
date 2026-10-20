// Livello 2 — La pista di pattinaggio.
// Simone è caduto in fondo alla pista: Francesca scivola sul ghiaccio evitando i pattinatori.

const RINK = {
  W: 480, H: 640,
  x0: 56, y0: 56, x1: 424, y1: 600, r: 40, // interno del ghiaccio (rettangolo arrotondato)
  board: 8,
  start: { x: 240, y: 582 },
  checkpointY: 328,
  simone: { x: 240, y: 86 },
};

const ICE = {
  acc: 230,        // accelerazione con la croce premuta
  maxV: 92,
  dragInput: 1.0,  // attrito quando si spinge
  dragIdle: 0.7,   // attrito quando si scivola (basso: non ci si ferma subito)
  feetR: 5,
};

function hexRgb(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Distanza con segno dal bordo del rettangolo arrotondato (negativa dentro)
function rinkSD(px, py) {
  const cx = (RINK.x0 + RINK.x1) / 2;
  const cy = (RINK.y0 + RINK.y1) / 2;
  const hx = (RINK.x1 - RINK.x0) / 2 - RINK.r;
  const hy = (RINK.y1 - RINK.y0) / 2 - RINK.r;
  const qx = Math.abs(px - cx) - hx;
  const qy = Math.abs(py - cy) - hy;
  const ox = Math.max(qx, 0);
  const oy = Math.max(qy, 0);
  return Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - RINK.r;
}

function buildRinkTexture(scene) {
  if (scene.textures.exists('rink')) return;
  const { W, H } = RINK;
  const [c, ctx] = Pix.canvas(W, H);
  const img = ctx.createImageData(W, H);
  const C = {
    ice: hexRgb(PAL.ice), iceLight: hexRgb(PAL.iceLight), iceDark: hexRgb(PAL.iceDark),
    red: hexRgb('#e7a3ad'), blue: hexRgb('#9fc6ea'),
    out: hexRgb(PAL.outline), cream: hexRgb('#f6f0e6'), creamS: hexRgb('#ddd2c0'),
    bRed: hexRgb('#d9434f'), bRedD: hexRgb('#9c2a3a'), floor: hexRgb('#3e2f45'),
  };
  const spots = [];
  for (let sy = 120; sy < 600; sy += 120) for (const sx of [140, 240, 340]) spots.push([sx, sy]);
  const midY = RINK.checkpointY;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const d = rinkSD(x + 0.5, y + 0.5);
      const th = (BAYER4[y & 3][x & 3] + 0.5) / 16;
      let col;
      if (d < 0) {
        col = C.ice;
        // riflessi delle luci del soffitto
        let f = 0;
        for (const [sx, sy] of spots) {
          const e = 1 - (((x - sx) / 46) ** 2 + ((y - sy) / 20) ** 2);
          if (e > f) f = e;
        }
        if (f > 0.55 || f > th * 0.9 + 0.05) col = C.iceLight;
        // linee da hockey sbiadite
        const dc = Math.hypot(x - 240, y - midY);
        if (Math.abs(y - midY) < 1.5 && th < 0.75) col = C.red;
        if ((Math.abs(y - 228) < 1.5 || Math.abs(y - 428) < 1.5) && th < 0.6) col = C.blue;
        if (Math.abs(dc - 40) < 1 && th < 0.75) col = C.red;
        if (dc < 3) col = C.red;
        // ombra lungo le balaustre
        if (d > -3) col = C.iceDark;
        else if (d > -6 && th < 0.5) col = C.iceDark;
      } else if (d < RINK.board) {
        if (d < 1) col = C.out;
        else if (d < 4) col = C.cream;
        else if (d < 5) col = C.creamS;
        else if (d < 7) col = (Math.floor((x + y) / 3) % 6 === 0) ? C.bRedD : C.bRed;
        else col = C.out;
      } else {
        col = C.floor;
      }
      const i = (y * W + x) * 4;
      img.data[i] = col[0]; img.data[i + 1] = col[1]; img.data[i + 2] = col[2]; img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  // graffi dei pattini
  const rnd = Pix.rng(42);
  for (let k = 0; k < 90; k++) {
    let x = RINK.x0 + 10 + rnd() * (RINK.x1 - RINK.x0 - 20);
    let y = RINK.y0 + 10 + rnd() * (RINK.y1 - RINK.y0 - 20);
    const ang = rnd() * Math.PI * 2;
    const curve = (rnd() - 0.5) * 0.08;
    let a = ang;
    const len = 8 + rnd() * 26;
    const col = rnd() < 0.6 ? PAL.iceLine : '#f4fbfe';
    for (let s = 0; s < len; s++) {
      if (rinkSD(x, y) < -4) Pix.px(ctx, Math.floor(x), Math.floor(y), col);
      x += Math.cos(a); y += Math.sin(a); a += curve;
    }
  }

  // Spalti ai lati: due file di gradini con sedili
  const drawStands = (sx, flip) => {
    Pix.rect(ctx, sx, 48, 46, 560, '#4a3550');
    for (let tier = 0; tier < 2; tier++) {
      const tx = flip ? sx + 24 - tier * 22 : sx + tier * 22;
      Pix.rect(ctx, tx, 48, 22, 560, tier === 0 ? '#57405e' : '#664c6c');
      Pix.rect(ctx, flip ? tx : tx + 21, 48, 1, 560, '#2a1d2a');
      for (let y = 56; y < 600; y += 26) {
        const seat = (Math.floor(y / 26) + tier) % 2 ? '#c94f5a' : '#4f7fbf';
        Pix.box(ctx, tx + 3, y + 10, 16, 8, seat, '#2a1d2a');
        Pix.rect(ctx, tx + 5, y + 11, 12, 1, 'rgba(255,255,255,0.35)');
      }
    }
    // corrimano
    Pix.rect(ctx, flip ? sx : sx + 44, 48, 2, 560, PAL.woodDark);
  };
  drawStands(0, false);
  drawStands(434, true);

  // Parete in fondo con travi di legno
  ditherGradient(ctx, 0, 0, W, 48, ['#2e2040', '#4a3058', '#5e3c66']);
  for (let x = 0; x < W; x += 60) Pix.rect(ctx, x, 0, 4, 48, '#3a2848');
  Pix.rect(ctx, 0, 46, W, 2, '#2a1d2a');
  // striscione
  Pix.box(ctx, 120, 20, 240, 20, '#d9434f', PAL.outline);
  Pix.rect(ctx, 122, 22, 236, 1, '#ef7a82');
  Pix.rect(ctx, 122, 37, 236, 1, '#9c2a3a');

  // Ingresso in basso: tappeto di gomma e cancelletto
  Pix.rect(ctx, 0, 609, W, 31, '#3a2c40');
  for (let x = 0; x < W; x += 8) Pix.rect(ctx, x, 612, 4, 1, '#463650');
  for (let x = 4; x < W; x += 8) Pix.rect(ctx, x, 620, 4, 1, '#463650');
  Pix.rect(ctx, 214, 600, 52, 9, PAL.outline);
  Pix.rect(ctx, 215, 601, 50, 7, PAL.wood);
  Pix.rect(ctx, 215, 601, 50, 2, PAL.woodLight);
  Pix.rect(ctx, 239, 601, 2, 7, PAL.woodDark);
  Pix.rect(ctx, 216, 603, 3, 3, '#e0c070');
  Pix.rect(ctx, 261, 603, 3, 3, '#e0c070');

  Pix.addTexture(scene, 'rink', c);

  // Lampadina dei festoni
  for (const [name, col] of Object.entries({ red: '#ff6a6a', gold: '#ffd84a', green: '#7ae08a', blue: '#7ac0ff', pink: '#ff9ad0' })) {
    const [b, bctx] = Pix.canvas(4, 5);
    Pix.rect(bctx, 1, 0, 2, 1, '#2a1d2a');
    Pix.rect(bctx, 0, 1, 4, 3, col);
    Pix.rect(bctx, 1, 4, 2, 1, col);
    Pix.px(bctx, 1, 1, '#ffffff');
    Pix.addTexture(scene, `bulb_${name}`, b);
  }

  // Bandierina del checkpoint
  Pix.addTexture(scene, 'flag', Pix.gridCanvas([
    'KK......',
    'KRRK....',
    'KRWRRK..',
    'KRRRRRRK',
    'KRRRRK..',
    'KRRK....',
    'KK......',
    'K.......',
    'K.......',
    'K.......',
    'KK......',
  ], { '.': null, K: PAL.outline, R: '#4fb870', W: '#b8f0c8' }));

  // Segno del pattino sul ghiaccio
  const [s, sctx] = Pix.canvas(3, 1);
  Pix.rect(sctx, 0, 0, 3, 1, '#ffffff');
  Pix.addTexture(scene, 'scratch', s);

  // Simone seduto sul ghiaccio (dal suo foglio: busto + gambe in avanti)
  const src = scene.textures.get('simone').getSourceImage();
  const [sit, sitx] = Pix.canvas(16, 22);
  sitx.drawImage(src, 0, 0, 16, 19, 0, 2, 16, 19);
  Pix.grid(sitx, [
    '..KPPPPKKPPPPK..',
    '.KOOOK....KOOOK.',
  ], { '.': null, K: '#2a1d1a', P: '#282832', O: '#463024' }, 0, 20);
  Pix.addTexture(scene, 'simoneSit', sit);
}

// Pattinatori con percorsi semplici
class Skater {
  constructor(scene, key, path) {
    this.ch = new Character(scene, key, path.x || 0, path.y || 0, 'down');
    this.path = path;
    this.t = path.phase || 0;
    this.vx = 0;
    this.vy = 0;
    this.dirSign = 1;
    this.place(0);
  }

  place(dt) {
    const p = this.path;
    const ox = this.ch.x;
    const oy = this.ch.y;
    let x, y;
    if (p.type === 'line') {
      // avanti e indietro tra xa e xb
      const span = p.xb - p.xa;
      this.t += dt * p.speed;
      const m = this.t % (span * 2);
      x = m < span ? p.xa + m : p.xb - (m - span);
      y = p.y + (p.wave ? Math.sin(this.t / p.waveLen) * p.wave : 0);
    } else {
      // ellisse
      this.t += dt * p.speed;
      x = p.cx + Math.cos(this.t) * p.rx;
      y = p.cy + Math.sin(this.t) * p.ry;
    }
    this.ch.setPos(x, y);
    if (dt > 0) {
      this.vx = (x - ox) / dt;
      this.vy = (y - oy) / dt;
      const d = dirFromVector(this.vx, this.vy * 0.8, this.ch.dir);
      this.ch.walk(d, 0.6);
    }
  }
}

class Level2Scene extends BaseScene {
  constructor() { super('Level2'); }

  create() {
    this.initBase();
    Save.setLevel('Level2');
    buildRinkTexture(this);
    this.add.image(0, 0, 'rink').setOrigin(0, 0).setDepth(0);

    addText(this, 240, 25, 'PISTA DI PATTINAGGIO', { color: 0xfbf3e4, shadow: 0x7a1a2a, origin: [0.5, 0], depth: 3 });
    this.addFestoons();
    this.addAudience();

    // bandierine del checkpoint ai lati
    this.flags = [
      this.add.image(RINK.x0 - 3, RINK.checkpointY + 2, 'flag').setOrigin(0, 1).setDepth(5),
      this.add.image(RINK.x1 + 3, RINK.checkpointY + 2, 'flag').setOrigin(0, 1).setDepth(5).setFlipX(true),
    ];
    this.flags[1].setOrigin(1, 1);

    // Simone seduto
    this.simone = new Character(this, 'simone', RINK.simone.x, RINK.simone.y, 'down');
    this.simone.sprite.setTexture('simoneSit');
    this.simoneBubble = Art.bubble(this, 'aiuto…');
    this.simoneBubble.setPosition(RINK.simone.x, RINK.simone.y - 24);
    let bubbleState = 0;
    this.bubbleTimer = this.time.addEvent({
      delay: 2400, loop: true, callback: () => {
        bubbleState = 1 - bubbleState;
        this.simoneBubble.destroy();
        this.simoneBubble = Art.bubble(this, bubbleState ? 'tutto ok, tutto ok!' : 'aiuto…');
        this.simoneBubble.setPosition(RINK.simone.x, RINK.simone.y - 24);
      },
    });

    // Francesca
    this.player = new Character(this, 'francesca', RINK.start.x, RINK.start.y, 'up');
    this.vx = 0;
    this.vy = 0;
    this.checkpoint = { ...RINK.start };
    this.reachedCheckpoint = false;
    this.invulnUntil = 0;
    this.trailAcc = 0;

    this.addSkaters();
    this.addHearts();
    this.addHUD();

    // Telecamera: si parte da Simone in alto
    const cam = this.cameras.main;
    cam.setBounds(0, 0, RINK.W, RINK.H);
    cam.setRoundPixels(true);
    cam.scrollY = 0;

    this.busy = true;
    Audio8.playSong(SONGS.ice);
    this.intro();
  }

  addFestoons() {
    const colors = ['red', 'gold', 'green', 'blue', 'pink'];
    const g = this.add.graphics().setDepth(4);
    g.lineStyle(1, 0x1a1020, 1);
    const pts = [];
    for (let x = 0; x <= 480; x += 2) pts.push([x, 8 + Math.round(Math.sin(Math.PI * ((x % 96) / 96)) * 9)]);
    g.beginPath();
    g.moveTo(pts[0][0], pts[0][1]);
    pts.forEach(([x, y]) => g.lineTo(x, y));
    g.strokePath();
    let i = 0;
    for (let x = 6; x < 480; x += 12) {
      const y = 8 + Math.round(Math.sin(Math.PI * ((x % 96) / 96)) * 9);
      const b = this.add.image(x, y + 1, `bulb_${colors[i++ % colors.length]}`).setOrigin(0.5, 0).setDepth(4);
      this.tweens.add({ targets: b, alpha: 0.45, duration: 500 + Math.random() * 700, yoyo: true, repeat: -1, delay: Math.random() * 1000 });
    }
    // lucine lungo gli spalti
    for (let y = 60; y < 600; y += 14) {
      for (const x of [46, 434]) {
        const b = this.add.image(x, y, `bulb_${colors[i++ % colors.length]}`).setDepth(4);
        this.tweens.add({ targets: b, alpha: 0.4, duration: 600 + Math.random() * 600, yoyo: true, repeat: -1, delay: Math.random() * 1000 });
      }
    }
  }

  addAudience() {
    const keys = ['fanA', 'fanB', 'fanC', 'fanD', 'skaterB', 'skaterD', 'skaterE'];
    const rnd = Pix.rng(9);
    this.fans = [];
    for (let y = 56; y < 600; y += 26) {
      for (const [x, side] of [[12, 'right'], [33, 'right'], [446, 'left'], [467, 'left']]) {
        if (rnd() < 0.35) continue;
        const key = keys[Math.floor(rnd() * keys.length)];
        const f = this.add.sprite(x, y + 14, key, DIR_ROW[side] * 3).setOrigin(0.5, 1).setDepth(3);
        f.setCrop(0, 0, 16, 15);
        this.fans.push(f);
      }
    }
    // ogni tanto qualcuno saltella
    this.time.addEvent({
      delay: 700, loop: true, callback: () => {
        const f = this.fans[Math.floor(Math.random() * this.fans.length)];
        if (f) this.tweens.add({ targets: f, y: f.y - 3, duration: 120, yoyo: true, repeat: 1 });
      },
    });
  }

  cheer() {
    this.fans.forEach((f, i) => {
      this.tweens.add({ targets: f, y: f.y - 4, duration: 140, yoyo: true, repeat: 2, delay: (i % 7) * 40 });
    });
  }

  // Come in una vera pista, quasi tutti girano in tondo; alcuni in "trenino".
  // Ogni anello è un'ellisse schiacciata: per passare bisogna attraversarne due lati.
  addSkaters() {
    const xa = RINK.x0 + 18;
    const xb = RINK.x1 - 18;
    this.skaters = [];
    const ring = (keys, cx, cy, rx, ry, speed, phase, gap) => {
      keys.forEach((k, i) => {
        this.skaters.push(new Skater(this, k, { type: 'circle', cx, cy, rx, ry, speed, phase: phase - i * gap * Math.sign(speed) }));
      });
    };
    // zona bassa: lenta, per prendere confidenza
    ring(['skaterA', 'skaterB', 'skaterC'], 240, 516, 150, 22, 0.32, 0.4, 0.14);
    ring(['skaterD', 'skaterE'], 240, 516, 150, 22, 0.32, 0.4 + Math.PI, 0.14);
    ring(['skaterE', 'skaterD', 'skaterB', 'skaterA'], 240, 428, 140, 24, -0.42, 2.0, Math.PI / 2);
    // attorno al cerchio centrale (il checkpoint è dentro il cerchio)
    ring(['skaterC', 'skaterA', 'skaterD'], 240, RINK.checkpointY, 66, 58, 0.8, 1.2, Math.PI * 2 / 3);
    // metà alta: più vivace
    ring(['skaterD', 'skaterE', 'skaterB'], 240, 236, 150, 24, 0.55, 3.0, 0.13);
    ring(['skaterC', 'skaterA', 'skaterE'], 240, 236, 150, 24, 0.55, 3.0 + Math.PI, 0.13);
    this.skaters.push(new Skater(this, 'skaterA', { type: 'line', xa, xb, y: 170, speed: 82, phase: 120, wave: 9, waveLen: 16 }));
    // il giro attorno a Simone
    ring(['skaterB', 'skaterD', 'skaterE'], 240, 96, 86, 24, 0.6, 0, Math.PI * 2 / 3);
  }

  addHearts() {
    this.hearts = [];
    [[100, 505], [380, 455], [292, 300], [96, 214], [392, 118]].forEach(([x, y]) => {
      const h = this.add.image(x, y - 8, 'heart').setDepth(9);
      this.tweens.add({ targets: h, y: y - 11, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
      this.hearts.push({ img: h, x, y, got: false });
    });
    this.heartCount = 0;
  }

  addHUD() {
    const bg = this.add.rectangle(4, 4, 50, 15, 0x1a1020, 0.55).setOrigin(0, 0).setScrollFactor(0).setDepth(950);
    this.hudHeart = this.add.image(13, 11, 'heart').setScrollFactor(0).setDepth(951);
    this.hudText = addText(this, 21, 7, '0/5', { color: 0xfbf3e4, fixed: true, depth: 951 });
    this.hud = [bg, this.hudHeart, this.hudText];
  }

  async intro() {
    await this.wait(500);
    await this.levelCard(2, 'La pista di pattinaggio');
    await this.talk([[null, 'Oh no! Simone è cascato dall\'altra parte della pista! Vallo a recuperare!']]);
    await this.tweenP({ targets: this.cameras.main, scrollY: RINK.H - 270, duration: 1800, ease: 'Sine.InOut' });
    this.cameras.main.startFollow(this.player.sprite, true, 0.12, 0.12, 0, 10);
    this.busy = false;
    this.toast(Controls.isTouch ? 'Sul ghiaccio si scivola! Usa la croce per pattinare.' : 'Sul ghiaccio si scivola! Usa le frecce per pattinare.', 3800);
  }

  toast(text, ms = 2200) {
    if (this.toastObj) this.toastObj.destroy();
    const w = FontMetrics.measure(fontText(text)) + 16;
    const c = this.add.container(240, 30).setScrollFactor(0).setDepth(1200);
    c.add(this.add.rectangle(0, 0, w, 16, 0x1a1020, 0.75));
    c.add(addText(this, 0, 0, text, { color: 0xfbf3e4, origin: [0.5, 0.5] }));
    c.setAlpha(0);
    this.toastObj = c;
    this.tweens.add({ targets: c, alpha: 1, duration: 200 });
    this.time.delayedCall(ms, () => {
      if (c.active) this.tweens.add({ targets: c, alpha: 0, duration: 300, onComplete: () => c.destroy() });
    });
  }

  tick(time, delta) {
    const dt = delta / 1000;
    for (const s of this.skaters) s.place(dt);
    if (this.stars) this.updateStars(time);

    if (this.busy || this.leaving || this.dialog.active || this.falling) {
      this.slide(dt, { x: 0, y: 0 }, this.falling ? 2.5 : 4);
      return;
    }

    const inp = Controls.axis();
    this.slide(dt, inp);

    // checkpoint a metà pista
    if (!this.reachedCheckpoint && this.player.y < RINK.checkpointY) {
      this.reachedCheckpoint = true;
      this.checkpoint = { x: 240, y: RINK.checkpointY };
      Audio8.sfx('checkpoint');
      this.toast('Checkpoint! Se cadi, ripartirai da qui.');
      this.flags.forEach(f => this.tweens.add({ targets: f, scaleY: 1.3, duration: 150, yoyo: true, repeat: 2 }));
      this.cheer();
    }

    // cuoricini (facoltativi)
    for (const h of this.hearts) {
      if (h.got) continue;
      if (Math.abs(h.x - this.player.x) < 10 && Math.abs(h.y - this.player.y) < 10) {
        h.got = true;
        this.heartCount++;
        Audio8.sfx('heart');
        this.hudText.setText(`${this.heartCount}/5`);
        this.tweens.add({ targets: this.hudHeart, scale: 1.6, duration: 120, yoyo: true });
        this.tweens.add({ targets: h.img, y: h.img.y - 16, alpha: 0, scale: 2, duration: 400, onComplete: () => h.img.destroy() });
      }
    }

    // scontri con i pattinatori
    if (time > this.invulnUntil) {
      for (const s of this.skaters) {
        const dx = (s.ch.x - this.player.x) / 9;
        const dy = (s.ch.y - this.player.y) / 5;
        if (dx * dx + dy * dy < 1) { this.fall(s); break; }
      }
    }
    this.player.sprite.setAlpha(time < this.invulnUntil ? (Math.floor(time / 90) % 2 ? 0.35 : 1) : 1);

    // arrivo da Simone
    const sdx = Math.abs(this.player.x - RINK.simone.x);
    const sdy = this.player.y - RINK.simone.y;
    if (sdx < 18 && sdy > -14 && sdy < 30) this.rescue();
  }

  // Fisica del ghiaccio: accelerazione dolce, attrito basso, rimbalzo morbido sulle balaustre
  slide(dt, inp, extraDrag = 0) {
    const p = this.player;
    let ix = inp.x;
    let iy = inp.y;
    const il = Math.hypot(ix, iy);
    if (il > 0) { ix /= il; iy /= il; }
    this.vx += ix * ICE.acc * dt;
    this.vy += iy * ICE.acc * dt;
    const k = (il > 0 ? ICE.dragInput : ICE.dragIdle) + extraDrag;
    const damp = Math.exp(-k * dt);
    this.vx *= damp;
    this.vy *= damp;
    const sp = Math.hypot(this.vx, this.vy);
    if (sp > ICE.maxV) { this.vx *= ICE.maxV / sp; this.vy *= ICE.maxV / sp; }
    if (sp < 1.5 && il === 0) { this.vx = 0; this.vy = 0; }

    let nx = p.x + this.vx * dt;
    let ny = p.y + this.vy * dt;
    // tieni i piedi dentro il ghiaccio (lascia un po' di margine sopra per la testa)
    const limit = -ICE.feetR;
    const d = rinkSD(nx, ny - 2);
    if (d > limit) {
      const e = 0.5;
      const gx = (rinkSD(nx + e, ny - 2) - rinkSD(nx - e, ny - 2)) / (2 * e);
      const gy = (rinkSD(nx, ny - 2 + e) - rinkSD(nx, ny - 2 - e)) / (2 * e);
      const gl = Math.hypot(gx, gy) || 1;
      const ux = gx / gl;
      const uy = gy / gl;
      nx -= ux * (d - limit);
      ny -= uy * (d - limit);
      const vn = this.vx * ux + this.vy * uy;
      if (vn > 0) {
        this.vx -= 1.4 * vn * ux;
        this.vy -= 1.4 * vn * uy;
        if (vn > 30 && !this.falling) Audio8.sfx('bump');
      }
    }
    p.x = nx;
    p.y = ny;
    p.sync();

    if (!this.falling) {
      const moving = Math.hypot(this.vx, this.vy) > 6;
      if (il > 0) {
        p.walk(dirFromVector(ix, iy, p.dir), 0.75);
      } else if (moving) {
        p.face(dirFromVector(this.vx, this.vy, p.dir)); // scivola in posa
      } else if (p.sprite.anims.isPlaying) {
        p.face(p.dir);
      }
      // scie sul ghiaccio
      if (moving) {
        this.trailAcc += dt;
        if (this.trailAcc > 0.07) {
          this.trailAcc = 0;
          const s = this.add.image(Math.round(p.x) + (Math.random() < 0.5 ? -2 : 2), Math.round(p.y), 'scratch')
            .setDepth(1).setAlpha(0.8);
          if (Math.abs(this.vy) > Math.abs(this.vx)) s.setAngle(90);
          this.tweens.add({ targets: s, alpha: 0, duration: 900, onComplete: () => s.destroy() });
        }
      }
    }
  }

  async fall(skater) {
    this.falling = true;
    Audio8.sfx('fall');
    const p = this.player;
    // spinta via dal pattinatore
    const ax = p.x - skater.ch.x;
    const ay = p.y - skater.ch.y;
    const al = Math.hypot(ax, ay) || 1;
    this.vx = (ax / al) * 70;
    this.vy = (ay / al) * 70;
    const sorry = Art.bubble(this, ['Scusa!', 'Ops!', 'Attenta!'][Math.floor(Math.random() * 3)]);
    sorry.setPosition(skater.ch.x, skater.ch.y - 24);
    this.time.addEvent({ delay: 16, repeat: 60, callback: () => sorry.active && sorry.setPosition(skater.ch.x, skater.ch.y - 24) });
    this.time.delayedCall(1000, () => sorry.destroy());

    p.sprite.anims.stop();
    p.sprite.setOrigin(0.5, 0.75);
    await this.tweenP({ targets: p.sprite, angle: 720, duration: 550, ease: 'Quad.Out' });
    p.sprite.setAngle(90);
    this.stars = [0, 1, 2].map(() => this.add.image(0, 0, 'star').setDepth(2000));
    await this.wait(1100);
    this.stars.forEach(s => s.destroy());
    this.stars = null;

    await this.tweenP({ targets: p.sprite, alpha: 0, duration: 250 });
    p.sprite.setAngle(0).setOrigin(0.5, 1);
    this.vx = 0;
    this.vy = 0;
    p.setPos(this.checkpoint.x, this.checkpoint.y);
    p.face('up');
    p.sprite.setAlpha(1);
    this.invulnUntil = this.time.now + 1600;
    this.falling = false;
    Controls.reset();
  }

  updateStars(time) {
    const p = this.player;
    this.stars.forEach((s, i) => {
      const a = time / 220 + (i * Math.PI * 2) / 3;
      s.setPosition(Math.round(p.x + Math.cos(a) * 9), Math.round(p.y - 14 + Math.sin(a) * 3));
    });
  }

  async rescue() {
    if (this.busy) return;
    this.busy = true;
    this.bubbleTimer.remove();
    this.simoneBubble.destroy();
    Audio8.stopSong(1.2);
    const p = this.player;
    this.vx = 0;
    this.vy = 0;
    this.invulnUntil = Infinity;
    p.sprite.setAlpha(1);
    // si sistema accanto a Simone
    const tx = RINK.simone.x - 14;
    const ty = RINK.simone.y + 10;
    await p.walkTo(tx, ty, 50);
    p.face('right');
    this.cheer();
    await this.wait(300);
    await this.talk([
      ['Simone', 'Piccina! Sapevo che saresti venuta a prendermi.'],
      [null, 'Il tuo orsacchiotto è salvo.'],
    ]);
    if (this.heartCount === 5) {
      await this.say('Simone', 'E hai pure raccolto tutti i cuoricini! Sei fortissima.');
    }
    // Simone si rialza e si tengono per mano
    Audio8.sfx('pop');
    this.simone.sprite.setTexture('simone', 0);
    await this.tweenP({ targets: this.simone, lift: 6, duration: 160, yoyo: true, onUpdate: () => this.simone.sync() });
    this.simone.lift = 0;
    this.simone.setPos(RINK.simone.x + 2, RINK.simone.y + 10);
    p.face('down');
    this.simone.face('down');
    const h = this.add.image((p.x + this.simone.x) / 2, p.y - 28, 'heartBig').setDepth(2000).setScale(0);
    Audio8.sfx('heart');
    await this.tweenP({ targets: h, scale: 1, duration: 400, ease: 'Back.Out' });
    // pattinano insieme verso il basso
    this.cameras.main.stopFollow();
    this.tweens.add({ targets: h, y: h.y - 10, alpha: 0, delay: 600, duration: 800 });
    p.walk('down', 0.6);
    this.simone.walk('down', 0.6);
    this.tweens.add({ targets: [p, this.simone], y: '+=60', duration: 2200, ease: 'Sine.InOut',
      onUpdate: () => { p.sync(); this.simone.sync(); } });
    await this.wait(1600);
    this.completeLevel(2);
  }
}
