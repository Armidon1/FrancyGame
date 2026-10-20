// Sfondi condivisi: cielo al tramonto con retinatura, profilo di Roma, nuvole.

const BAYER4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

// Gradiente verticale a bande con retinatura ordinata (stile 16 bit)
function ditherGradient(ctx, x0, y0, w, h, colors) {
  const n = colors.length - 1;
  for (let y = 0; y < h; y++) {
    const t = (y / (h - 1)) * n;
    const i = Math.min(n - 1, Math.floor(t));
    const f = t - i;
    for (let x = 0; x < w; x++) {
      const th = (BAYER4[y & 3][x & 3] + 0.5) / 16;
      ctx.fillStyle = f > th ? colors[i + 1] : colors[i];
      ctx.fillRect(x0 + x, y0 + y, 1, 1);
    }
  }
}

function drawSunsetSky(ctx, w, h, opts = {}) {
  const colors = opts.colors || [PAL.sky1, PAL.sky2, PAL.sky3, PAL.sky4, PAL.sky5, PAL.sky6];
  ditherGradient(ctx, 0, 0, w, h, colors);
  const rnd = Pix.rng(opts.seed || 7);
  // stelline in alto
  for (let i = 0; i < (opts.stars === undefined ? 40 : opts.stars); i++) {
    const x = Math.floor(rnd() * w);
    const y = Math.floor(rnd() * h * 0.3);
    Pix.px(ctx, x, y, rnd() < 0.3 ? '#fff6d8' : '#c9a6d8');
  }
  if (opts.sun !== false) {
    const sx = opts.sunX || Math.floor(w * 0.62);
    const sy = opts.sunY || Math.floor(h * 0.78);
    Pix.disc(ctx, sx, sy, 24, '#fbd38a');
    Pix.disc(ctx, sx, sy, 20, '#fde7b0');
    Pix.disc(ctx, sx, sy, 15, '#fff4d4');
    // righe di riflesso sul sole
    for (let k = 0; k < 4; k++) Pix.rect(ctx, sx - 24, sy + 6 + k * 4, 49, 1, PAL.sky5);
  }
}

// Profilo di Roma: cupola di San Pietro, campanili, pini marittimi, tetti
function drawRomeSkyline(ctx, w, baseY, opts = {}) {
  const far = opts.far || '#7a3e62';
  const near = opts.near || '#3a2340';
  const rnd = Pix.rng(opts.seed || 3);

  // strato lontano: tetti e piccole cupole
  let x = 0;
  while (x < w) {
    const bw = 8 + Math.floor(rnd() * 18);
    const bh = 8 + Math.floor(rnd() * 16);
    Pix.rect(ctx, x, baseY - bh, bw, bh, far);
    if (rnd() < 0.18) Pix.disc(ctx, x + Math.floor(bw / 2), baseY - bh, 4, far);
    if (rnd() < 0.12) Pix.rect(ctx, x + 2, baseY - bh - 10, 3, 10, far);
    x += bw;
  }

  // strato vicino
  x = 0;
  while (x < w) {
    const bw = 10 + Math.floor(rnd() * 22);
    const bh = 4 + Math.floor(rnd() * 9);
    Pix.rect(ctx, x, baseY - bh, bw, bh, near);
    x += bw;
  }

  const domeX = opts.domeX || Math.floor(w * 0.7);
  // San Pietro: facciata, tamburo, cupola, lanterna, croce
  Pix.rect(ctx, domeX - 34, baseY - 18, 68, 18, near);
  Pix.rect(ctx, domeX - 18, baseY - 34, 36, 16, near);
  for (let k = -14; k <= 14; k += 5) Pix.rect(ctx, domeX + k, baseY - 32, 1, 10, far);
  for (let y = 0; y <= 20; y++) {
    const half = Math.round(Math.sqrt(1 - Math.pow(y / 21, 2)) * 20);
    Pix.rect(ctx, domeX - half, baseY - 34 - y, half * 2 + 1, 1, near);
  }
  Pix.rect(ctx, domeX - 3, baseY - 61, 7, 7, near);
  Pix.rect(ctx, domeX - 1, baseY - 66, 3, 5, near);
  Pix.rect(ctx, domeX, baseY - 70, 1, 5, near);
  Pix.rect(ctx, domeX - 1, baseY - 69, 3, 1, near);
  // cupolette laterali
  Pix.disc(ctx, domeX - 30, baseY - 22, 6, near);
  Pix.disc(ctx, domeX + 30, baseY - 22, 6, near);

  // campanile
  const tX = opts.towerX || Math.floor(w * 0.32);
  Pix.rect(ctx, tX, baseY - 40, 9, 40, near);
  for (let k = 0; k < 4; k++) Pix.rect(ctx, tX + 4 - k, baseY - 44 + k, 1 + k * 2, 1, near);
  Pix.rect(ctx, tX + 2, baseY - 34, 2, 3, far);
  Pix.rect(ctx, tX + 5, baseY - 34, 2, 3, far);

  // pini marittimi
  const pines = opts.pines || [Math.floor(w * 0.08), Math.floor(w * 0.18), Math.floor(w * 0.9)];
  for (const px of pines) {
    const ph = 22 + Math.floor(rnd() * 10);
    Pix.rect(ctx, px, baseY - ph, 2, ph, near);
    Pix.rect(ctx, px - 11, baseY - ph - 3, 24, 4, near);
    Pix.rect(ctx, px - 8, baseY - ph - 6, 18, 3, near);
    Pix.rect(ctx, px - 13, baseY - ph, 28, 2, near);
  }
}

function cloudCanvas(seed, w = 40) {
  const [c, ctx] = Pix.canvas(w, 12);
  const rnd = Pix.rng(seed);
  const top = '#f7c6b8';
  const body = '#e89a9a';
  const shade = '#b8708a';
  for (let i = 0; i < 5; i++) {
    const cx = 6 + Math.floor(rnd() * (w - 12));
    const r = 3 + Math.floor(rnd() * 3);
    Pix.disc(ctx, cx, 7, r, body);
  }
  Pix.rect(ctx, 2, 8, w - 4, 3, body);
  Pix.rect(ctx, 3, 10, w - 6, 1, shade);
  // luce dall'alto
  const img = ctx.getImageData(0, 0, w, 12);
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < 12; y++) {
      if (img.data[(y * w + x) * 4 + 3]) { Pix.px(ctx, x, y, top); break; }
    }
  }
  return c;
}
