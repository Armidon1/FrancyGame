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

// Cuoricini da raccogliere prima che Simone riesca a rialzarsi, ognuno con la sua dose d'amore
const HEART_SPOTS = [[100, 505], [330, 548], [380, 455], [150, 410], [292, 300], [128, 300], [96, 214], [310, 196], [190, 128], [392, 118]];
const HEART_GIFTS = ['un abbraccio', 'una risata', 'un bacino', 'una carezza', 'un "piccina"',
  'una coccola', 'un tè caldo', 'un sorriso', 'un "ti amo"', 'tutto il mio amore'];
const HEARTS_NEEDED = HEART_SPOTS.length;

// Velocità relativa oltre la quale Francesca e Simone si scontrano e cascano insieme
const TUMBLE_SPEED = 28;

// Il varco per uscire, sulla balaustra di destra (si apre solo alla fine)
const EXIT = { y0: 300, y1: 356 };

// Simone sul ghiaccio: più lento e meno sciolto di Francesca
const SIMONE_ICE = { acc: 170, maxV: 74, catchUp: 86, drag: 1.3, gap: 22 };

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
        bubbleState = (bubbleState + 1) % 4;
        this.simoneBubble.destroy();
        const lines = this.heartCount >= HEARTS_NEEDED / 2
          ? ['sento già le gambe!', 'forza Picci!', 'quasi, quasi…', '♪ amore disperatooo ♪']
          : ['aiuto…', 'tutto ok, tutto ok!', 'aiuto…', '♪ amore disperatooo ♪'];
        this.simoneBubble = Art.bubble(this, lines[bubbleState]);
        this.simoneBubble.setPosition(RINK.simone.x, RINK.simone.y - 24);
      },
    });

    // Francesca
    this.player = new Character(this, 'francesca', RINK.start.x, RINK.start.y, 'up');
    this.humSongs = [[[this.player, '♪ amore disperato… ♪']], [[this.player, '♪ na na na naa! ♪']]];
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
    this.bulbs = [];
    for (let x = 6; x < 480; x += 12) {
      const y = 8 + Math.round(Math.sin(Math.PI * ((x % 96) / 96)) * 9);
      const b = this.add.image(x, y + 1, `bulb_${colors[i++ % colors.length]}`).setOrigin(0.5, 0).setDepth(4);
      this.bulbs.push(b);
      this.tweens.add({ targets: b, alpha: 0.45, duration: 500 + Math.random() * 700, yoyo: true, repeat: -1, delay: Math.random() * 1000 });
    }
    // lucine lungo gli spalti
    for (let y = 60; y < 600; y += 14) {
      for (const x of [46, 434]) {
        const b = this.add.image(x, y, `bulb_${colors[i++ % colors.length]}`).setDepth(4);
        this.bulbs.push(b);
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
    HEART_SPOTS.forEach(([x, y]) => {
      const h = this.add.image(x, y - 8, 'heart').setDepth(9);
      this.tweens.add({ targets: h, y: y - 11, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
      this.hearts.push({ img: h, x, y, got: false });
    });
    this.heartCount = 0;
  }

  // Scritta che sale dal cuoricino appena preso
  heartGift(h, gift) {
    const t = addText(this, h.x, h.y - 18, `+ ${gift}`, { color: 0xc0186a, shadow: 0xfbf3e4, origin: [0.5, 1], depth: 1100 });
    this.tweens.add({ targets: t, y: t.y - 18, alpha: 0, delay: 700, duration: 900, ease: 'Sine.In', onComplete: () => t.destroy() });
  }

  addHUD() {
    const bg = this.add.rectangle(4, 4, 50, 15, 0x1a1020, 0.55).setOrigin(0, 0).setScrollFactor(0).setDepth(950);
    this.hudHeart = this.add.image(13, 11, 'heart').setScrollFactor(0).setDepth(951);
    this.hudText = addText(this, 21, 7, `0/${HEARTS_NEEDED}`, { color: 0xfbf3e4, fixed: true, depth: 951 });
    this.hud = [bg, this.hudHeart, this.hudText];
  }

  async intro() {
    await this.wait(500);
    await this.levelCard(2, 'La pista di pattinaggio');
    await this.talk([
      [null, 'Oh no! Simone è cascato dall\'altra parte della pista! Vallo a recuperare!'],
      [null, `Per rialzarsi gli serve tutto il tuo amore: raccogli tutti i ${HEARTS_NEEDED} cuoricini sul ghiaccio prima di arrivare da lui.`],
    ]);
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
    if (!this.crowdGone) for (const s of this.skaters) s.place(dt);
    if (this.romance) { this.tickRomance(time, dt); return; }
    if (this.stars) this.updateStars(time);
    this.humTick(time, this.humSongs, !this.falling);

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
        this.hudText.setText(`${this.heartCount}/${HEARTS_NEEDED}`);
        this.heartGift(h, HEART_GIFTS[this.heartCount - 1]);
        this.tweens.add({ targets: this.hudHeart, scale: 1.6, duration: 120, yoyo: true });
        this.tweens.add({ targets: h.img, y: h.img.y - 16, alpha: 0, scale: 2, duration: 400, onComplete: () => h.img.destroy() });
        if (this.heartCount === HEARTS_NEEDED) this.toast('Tutti i cuoricini! Adesso Simone ce la fa a rialzarsi.', 3000);
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

    // arrivo da Simone (se mancano cuoricini lo dice una volta, poi di nuovo solo dopo essersi allontanata)
    const sdx = Math.abs(this.player.x - RINK.simone.x);
    const sdy = this.player.y - RINK.simone.y;
    if (sdx < 18 && sdy > -14 && sdy < 30) this.rescue();
    else if (Math.hypot(sdx, sdy) > 60) this.nagged = false;
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
    // dal varco aperto si esce di lato
    const inGap = this.exitOpen && ny > EXIT.y0 + 6 && ny < EXIT.y1 - 2 && nx > RINK.x1 - 40;
    if (inGap) {
      if (nx > RINK.x1 + 26) this.leaveRink();
    } else if (d > limit) {
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
    const p = this.player;
    if (this.heartCount < HEARTS_NEEDED) {
      if (this.nagged) return;
      this.nagged = true;
      this.busy = true;
      this.vx = 0;
      this.vy = 0;
      const missing = HEARTS_NEEDED - this.heartCount;
      await this.talk([
        ['Simone', 'Piccina! Sei venuta! Però… da solo non ce la faccio a rialzarmi.'],
        ['Simone', missing === 1
          ? 'Mi manca solo un cuoricino di forza. Uno! Io ti aspetto qui, tanto non vado da nessuna parte.'
          : `Mi mancano ancora ${missing} cuoricini di forza. Io ti aspetto qui, tanto non vado da nessuna parte.`],
      ]);
      // un piccolo passo indietro, così non riparte subito il dialogo
      this.vy = 40;
      this.busy = false;
      Controls.reset();
      return;
    }
    this.busy = true;
    this.bubbleTimer.remove();
    this.simoneBubble.destroy();
    Audio8.stopSong(1.2);
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
      ['Simone', 'E con tutti quei cuoricini… mi sento già più forte.'],
      [null, 'Il tuo orsacchiotto è salvo.'],
    ]);
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
    this.tweens.add({ targets: h, y: h.y - 10, alpha: 0, delay: 600, duration: 800, onComplete: () => h.destroy() });
    await this.startRomance();
  }

  // Luci soffuse rosa e fucsia, la pista si svuota e restano solo loro due
  async startRomance() {
    Audio8.playSong(SONGS.lullaby);
    this.floatHearts(16, { x: RINK.x0, y: RINK.y0, w: RINK.x1 - RINK.x0, h: RINK.y1 - RINK.y0 }, { depth: 945 });
    const full = { x: 0, y: 0, w: RINK.W, h: RINK.H };
    this.moodDark = this.add.rectangle(full.x, full.y, full.w, full.h, 0x2a0634, 0).setOrigin(0, 0).setDepth(940);
    this.moodPink = this.add.rectangle(full.x, full.y, full.w, full.h, 0xff3f9a, 0).setOrigin(0, 0).setDepth(941)
      .setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({ targets: this.moodDark, fillAlpha: 0.55, duration: 2600 });
    this.tweens.add({ targets: this.moodPink, fillAlpha: 0.1, duration: 2600 });
    // lucine e faretti che diventano rosa
    this.bulbs.forEach((b, i) => this.time.delayedCall(i * 12, () => b.setTint(i % 2 ? 0xff6ac8 : 0xffa0d8).setBlendMode(Phaser.BlendModes.ADD).setDepth(942)));
    // faretti morbidi: anelli concentrici che sfumano verso il bordo
    this.spots = [0, 1, 2].map(i => {
      const c = this.add.container(120 + i * 120, 200 + i * 140).setDepth(943).setAlpha(0);
      for (const r of [50, 40, 30, 20]) {
        c.add(this.add.circle(0, 0, r, i === 1 ? 0xff40c0 : 0xff8ad0, 0.05).setBlendMode(Phaser.BlendModes.ADD));
      }
      this.tweens.add({ targets: c, alpha: 1, duration: 2600 });
      this.tweens.add({ targets: c, x: 360 - i * 100, y: 460 - i * 130, duration: 5200 + i * 900, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
      return c;
    });
    this.flags.forEach(f => this.tweens.add({ targets: f, alpha: 0, duration: 800 }));
    await this.wait(900);
    // tutti se ne vanno: i pattinatori scivolano fuori dalla pista, il pubblico esce dagli spalti
    this.crowdGone = true;
    for (const sk of this.skaters) {
      const out = sk.ch.x < 240 ? -24 : RINK.W + 24;
      sk.ch.walk(out < 0 ? 'left' : 'right', 0.6);
      this.tweens.add({ targets: sk.ch, x: out, duration: 1800 + Math.random() * 1400, delay: Math.random() * 600, ease: 'Sine.In',
        onUpdate: () => sk.ch.sync(), onComplete: () => sk.ch.destroy() });
      this.tweens.add({ targets: [sk.ch.sprite, sk.ch.shadow], alpha: 0, delay: 1600, duration: 1200 });
    }
    const goingHome = this.fans;
    this.fans = [];
    goingHome.forEach((f, i) => {
      this.tweens.add({ targets: f, x: f.x < 240 ? f.x - 30 : f.x + 30, alpha: 0, duration: 900, delay: 300 + (i % 9) * 160,
        onComplete: () => f.destroy() });
    });
    await this.wait(3200);
    this.skaters = [];
    await this.talk([
      ['Simone', 'Guarda… se ne sono andati tutti.'],
      ['Simone', 'La pista è tutta nostra. Facciamo un giro? Vai pure avanti tu, io… ti seguo. Più o meno.'],
      [null, 'Raccogliete tutti i cuoricini che volete. Quando vuoi andare, esci dal varco sulla destra.'],
    ]);
    this.openExit();
    this.heartTotal = this.heartCount;
    this.hudText.setText(String(this.heartTotal));
    this.hearts = [];
    for (let i = 0; i < 6; i++) this.spawnHeart();
    this.svx = 0;
    this.svy = 0;
    this.nextGrumble = this.time.now + 5000;
    this.tumbleAfter = this.time.now + 2000;
    this.romance = true;
    this.cameras.main.startFollow(this.player.sprite, true, 0.12, 0.12, 0, 10);
    this.busy = false;
    Controls.reset();
  }

  // Varco nella balaustra di destra, con un cartello che pulsa
  openExit() {
    this.exitOpen = true;
    const x = RINK.x1 - 2;
    this.add.rectangle(x, EXIT.y0, RINK.W - x, EXIT.y1 - EXIT.y0, 0x9a6a48).setOrigin(0, 0).setDepth(1);
    this.add.rectangle(x, EXIT.y0, RINK.W - x, 2, 0x2a1d1a).setOrigin(0, 0).setDepth(1);
    this.add.rectangle(x, EXIT.y1 - 2, RINK.W - x, 2, 0x2a1d1a).setOrigin(0, 0).setDepth(1);
    // niente lucine dentro il varco
    this.bulbs = this.bulbs.filter(b => {
      const inGap = b.x > RINK.x1 - 8 && b.y > EXIT.y0 - 4 && b.y < EXIT.y1 + 4;
      if (inGap) b.destroy();
      return !inGap;
    });
    const sign = addText(this, RINK.x1 - 6, EXIT.y0 - 12, 'USCITA', { color: 0xffd0ea, shadow: 0x5a1040, origin: [1, 0.5], depth: 946 });
    this.tweens.add({ targets: sign, alpha: 0.4, duration: 700, yoyo: true, repeat: -1 });
  }

  // Un cuoricino in un punto libero del ghiaccio, non troppo vicino a Francesca
  spawnHeart() {
    let x = 240, y = 300;
    for (let k = 0; k < 30; k++) {
      x = RINK.x0 + 20 + Math.random() * (RINK.x1 - RINK.x0 - 40);
      y = RINK.y0 + 24 + Math.random() * (RINK.y1 - RINK.y0 - 40);
      if (rinkSD(x, y) < -14 && Math.hypot(x - this.player.x, y - this.player.y) > 50) break;
    }
    const img = this.add.image(x, y - 8, Math.random() < 0.5 ? 'heart' : 'heartPink').setDepth(945).setScale(0);
    this.tweens.add({ targets: img, scale: 1, duration: 300, ease: 'Back.Out' });
    this.tweens.add({ targets: img, y: y - 11, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.hearts.push({ img, x, y, got: false });
  }

  tickRomance(time, dt) {
    if (this.leavingRink) { this.followSimone(time, dt); return; }
    if (this.tumbleStars) this.updateTumbleStars(time);
    if (this.busy || this.leaving || this.dialog.active || this.tumbling) {
      this.slide(dt, { x: 0, y: 0 }, this.tumbling ? 2.5 : 4);
      this.followSimone(time, dt);
      return;
    }
    this.slide(dt, Controls.axis());
    this.followSimone(time, dt);
    // se si scontrano un po' forte, cascano tutti e due
    const s = this.simone, p = this.player;
    const cx = (s.x - p.x) / 9, cy = (s.y - p.y) / 5;
    const rel = Math.hypot(this.vx - this.svx, this.vy - this.svy);
    if (cx * cx + cy * cy < 1 && rel > TUMBLE_SPEED && time > this.tumbleAfter) { this.tumble(); return; }
    for (const h of this.hearts) {
      if (h.got || Math.abs(h.x - this.player.x) > 10 || Math.abs(h.y - this.player.y) > 10) continue;
      h.got = true;
      this.heartTotal++;
      Audio8.sfx('heart');
      this.hudText.setText(String(this.heartTotal));
      this.tweens.add({ targets: this.hudHeart, scale: 1.6, duration: 120, yoyo: true });
      this.tweens.add({ targets: h.img, y: h.img.y - 16, alpha: 0, scale: 2, duration: 400, onComplete: () => h.img.destroy() });
      this.time.delayedCall(700, () => { if (this.romance && !this.leaving) this.spawnHeart(); });
    }
    this.hearts = this.hearts.filter(h => !h.got);
  }

  // Simone insegue un punto dietro Francesca: accelera meno, frena di più e barcolla
  followSimone(time, dt) {
    const s = this.simone, p = this.player;
    if (this.simoneOut) return;
    const sp = Math.hypot(this.vx, this.vy);
    const away = Math.hypot(s.x - p.x, s.y - p.y) || 1;
    const bx = sp > 10 ? -this.vx / sp : (s.x - p.x) / away;
    const by = sp > 10 ? -this.vy / sp : (s.y - p.y) / away;
    const dx = p.x + bx * SIMONE_ICE.gap - s.x;
    const dy = p.y + by * SIMONE_ICE.gap - s.y;
    const d = Math.hypot(dx, dy);
    if (d > 6 && !this.tumbling) {
      this.svx += dx / d * SIMONE_ICE.acc * dt;
      this.svy += dy / d * SIMONE_ICE.acc * dt;
    }
    const damp = Math.exp(-(SIMONE_ICE.drag + (this.tumbling ? 2.5 : 0)) * dt);
    this.svx *= damp;
    this.svy *= damp;
    const v = Math.hypot(this.svx, this.svy);
    // quando resta troppo indietro si dà una spinta (ma non la raggiunge mai davvero)
    const cap = d > 90 ? SIMONE_ICE.catchUp : SIMONE_ICE.maxV;
    if (v > cap) { this.svx *= cap / v; this.svy *= cap / v; }
    let nx = s.x + this.svx * dt, ny = s.y + this.svy * dt;
    // anche lui resta sul ghiaccio (o esce dal varco dietro di lei)
    const gap = this.exitOpen && ny > EXIT.y0 + 6 && ny < EXIT.y1 - 2 && nx > RINK.x1 - 40;
    const sd = rinkSD(nx, ny - 2);
    if (!gap && sd > -ICE.feetR) {
      const e = 0.5;
      const gx = rinkSD(nx + e, ny - 2) - rinkSD(nx - e, ny - 2);
      const gy = rinkSD(nx, ny - 2 + e) - rinkSD(nx, ny - 2 - e);
      const gl = Math.hypot(gx, gy) || 1;
      nx -= gx / gl * (sd + ICE.feetR);
      ny -= gy / gl * (sd + ICE.feetR);
      const vn = (this.svx * gx + this.svy * gy) / gl;
      if (vn > 0) { this.svx -= vn * gx / gl; this.svy -= vn * gy / gl; }
    }
    s.setPos(nx, ny);
    if (this.tumbling) return;
    // barcolla quando va veloce: si vede che fa fatica
    const wob = Math.min(1, v / 40);
    s.sprite.setAngle(Math.sin(time / 120) * 7 * wob);
    if (v > 6) s.walk(dirFromVector(this.svx, this.svy, s.dir), 0.45);
    else if (s.sprite.anims.isPlaying) s.face(s.dir);
    if (this.grumble) this.grumble.setPosition(s.x, s.y - 24);
    if (!this.leaving && time > this.nextGrumble && d > 30) {
      this.nextGrumble = time + 7000 + Math.random() * 5000;
      if (this.grumble) this.grumble.destroy();
      const b = this.grumble = Art.bubble(this, ['è davvero brava...', 'Ce la posso fare!', 'sono stabile, sono stabile…', 'che carina che è...!', 'che spettacolo...'][Math.floor(Math.random() * 5)]);
      b.setPosition(s.x, s.y - 24).setDepth(2000);
      this.time.delayedCall(2200, () => { b.destroy(); if (this.grumble === b) this.grumble = null; });
    }
  }

  // Scontro tra i due: giravolta, stelline, e si rialzano lì dove sono
  async tumble() {
    this.tumbling = true;
    Audio8.sfx('fall');
    const p = this.player, s = this.simone;
    const ax = p.x - s.x, ay = p.y - s.y;
    const al = Math.hypot(ax, ay) || 1;
    this.vx = ax / al * 55;
    this.vy = ay / al * 55;
    this.svx = -ax / al * 45;
    this.svy = -ay / al * 45;
    if (this.grumble) { this.grumble.destroy(); this.grumble = null; }
    const oops = Art.bubble(this, ['scusa Picci!', 'frenooo!', 'era un abbraccio!', 'non ho visto la curva!'][Math.floor(Math.random() * 4)]);
    oops.setDepth(2000);
    const follow = this.time.addEvent({ delay: 16, loop: true, callback: () => oops.setPosition(s.x, s.y - 24) });
    this.time.delayedCall(1300, () => { follow.remove(); oops.destroy(); });

    for (const c of [p, s]) {
      c.sprite.anims.stop();
      c.sprite.setOrigin(0.5, 0.75);
    }
    await Promise.all([
      this.tweenP({ targets: p.sprite, angle: 720, duration: 550, ease: 'Quad.Out' }),
      this.tweenP({ targets: s.sprite, angle: -720, duration: 600, ease: 'Quad.Out' }),
    ]);
    p.sprite.setAngle(ax < 0 ? -90 : 90);
    s.sprite.setAngle(ax < 0 ? 90 : -90);
    this.tumbleStars = [p, s].map(() => [0, 1, 2].map(() => this.add.image(0, 0, 'star').setDepth(2000)));
    await this.wait(1100);
    this.tumbleStars.flat().forEach(st => st.destroy());
    this.tumbleStars = null;

    // si rialzano con un saltello, e un cuoricino tra loro
    for (const c of [p, s]) {
      c.sprite.setAngle(0).setOrigin(0.5, 1);
      c.face(c === p ? (ax < 0 ? 'right' : 'left') : (ax < 0 ? 'left' : 'right'));
      this.tweens.add({ targets: c, lift: 4, duration: 120, yoyo: true, onUpdate: () => c.sync(), onComplete: () => { c.lift = 0; c.sync(); } });
    }
    Audio8.sfx('pop');
    const h = this.add.image((p.x + s.x) / 2, Math.min(p.y, s.y) - 26, 'heartPink').setDepth(2000).setScale(0);
    this.tweens.add({ targets: h, scale: 1, duration: 250, ease: 'Back.Out' });
    this.tweens.add({ targets: h, y: h.y - 12, alpha: 0, delay: 500, duration: 600, onComplete: () => h.destroy() });
    await this.wait(300);
    this.tumbleAfter = this.time.now + 2500;
    this.tumbling = false;
    Controls.reset();
  }

  updateTumbleStars(time) {
    [this.player, this.simone].forEach((c, k) => this.tumbleStars[k].forEach((st, i) => {
      const a = time / 220 + (i * Math.PI * 2) / 3 + k;
      st.setPosition(Math.round(c.x + Math.cos(a) * 9), Math.round(c.y - 8 + Math.sin(a) * 3));
    }));
  }

  // Francesca esce dal varco; Simone arranca dietro, poi fine livello
  async leaveRink() {
    if (this.leavingRink || this.tumbling) return;
    this.leavingRink = true;
    this.busy = true;
    this.cameras.main.stopFollow();
    const p = this.player;
    p.walk('right', 0.7);
    this.tweens.add({ targets: p, x: RINK.W + 20, duration: 900, onUpdate: () => p.sync() });
    this.vx = 0;
    this.vy = 0;
    await this.wait(700);
    this.simoneOut = true;
    const s = this.simone;
    s.sprite.setAngle(0);
    await s.walkTo(RINK.x1 - 20, (EXIT.y0 + EXIT.y1) / 2 + 6, 55);
    await s.walkTo(RINK.W + 20, (EXIT.y0 + EXIT.y1) / 2 + 6, 55);
    this.completeLevel(2);
  }
}
