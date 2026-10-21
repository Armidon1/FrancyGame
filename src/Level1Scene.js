// Livello 1 — Il Gianicolo.
// Da Trastevere si sale a tornanti fino alla terrazza: 5 cuoricini, la panchina, il Sindaco,
// i ragazzi che giocano a ninja e la sfida con Simone.

// Legenda: . panorama  X balaustra  t travertino  G siepe  S statua  p strada  s scalini
// g scarpata (non si passa)  n prato  w muro  T pino  O albero  U busto  L lampione  b panchina
// c sanpietrini  R tetto  W muro con finestra  I edera  D porta  f fontana  K tavolino
const L1_MAP = [
  '..............................', // 0
  '..............................', // 1
  '..............................', // 2
  '..............................', // 3
  '..............................', // 4
  '..............................', // 5
  '..............................', // 6
  'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // 7
  'GttttttttttLtttttttLtttttttttG', // 8
  'GttttttttttttttttttttSSStGtttG', // 9
  'GttttttttttttttttttttSSStGtttG', // 10
  'GtttttttttttttttttttGGGGGGtttG', // 11
  'GtTtttttttttttttttttttTttGGGGG', // 12
  'GGGGGGGGGGGGGGttGGGGGGGGGGGGGG', // 13
  'ggggggggggggggppgggggggggggggg', // 14
  'ggggggTgggggggppnTnnTggggggggg', // 15
  'ggTgggggggTgggppnnnnggggTggTgg', // 16
  'ggggggggggggggppgggggggggggggg', // 17
  'ggggOgggggggggppwwwwwwwwLwwggg', // 18
  'ggggggggggggggpppppppppppppggg', // 19
  'ggggggggggggggpppppppppppppggg', // 20
  'gggggggggTgggggggUgggUgggppLgg', // 21
  'gTgggTgggggOggggggggTggTgppnng', // 22
  'gggggggggggLttbbttLggggggppnng', // 23
  'gggggggggggttttttttggggggppgTg', // 24
  'gggwwLwwwwwttttttttwwwLwwppggg', // 25
  'gggppppppppppppppppppppppppggg', // 26
  'gggppppppppppppppppppppppppggg', // 27
  'gggppgUgggggUggggggUgggggggggg', // 28
  'ggLppggTggTggggggTgggggggggLgg', // 29
  'gTgppgggggggTggOgggggTgggOgTgg', // 30
  'gggppggggggggggggggggggggggggg', // 31
  'ggLppwwwLwwwwwwwwwwwLwwwwwwggg', // 32
  'gggppppppppppppppppppppppppggg', // 33
  'gggppppppppppppppppppppppppggg', // 34
  'ggggggggnnngggggUgggggUggppggg', // 35
  'ggggggggnnnggggggggTgggggppgTg', // 36
  'gTggggggggOggTggggggggTggppggg', // 37
  'gggggTgggggggggggggggggggppggg', // 38
  'ggggggggggggggwwwwwwwwwwLppggg', // 39
  'ggggggggOgggggpppppppppppppggg', // 40
  'ggggggggggggggpppppppppppppggg', // 41
  'gggTggggggggggppggUgggUgggggTg', // 42
  'ggggggggTgggggppOggTggggTggggg', // 43
  'gOgggggggggggwsswggggggggggOgg', // 44
  'gggggggggggggwsswggggggggggggg', // 45
  'RRRccRRRRRRRRccccRRRRRRRRRRRRR', // 46
  'RRRccRRRRRRRRccccRRRRRRRRRRRRR', // 47
  'WIWccWDWIWWIWccccWDWIWWDWIWWIW', // 48
  'cccccccccccccccccccccccccccccc', // 49
  'ccLcccccccccccccccccccccccLccc', // 50
  'ccccccccccccccffcccccccccccccc', // 51
  'ccccccccccccccffcccccccccccccc', // 52
  'ccLccccKccKcccccccccccccccLccc', // 53
  'cccccccccccccccccccccccccccccc', // 54
  'RRRRccRRRRRRRccccRRRRRRRRRRRRR', // 55
  'RRRRccRRRRRRRccccRRRRRRRRRRRRR', // 56
  'WIWWccWDWIWWIccccIWWDWIWWDWIWW', // 57
  'cccccccccccccccccccccccccccccc', // 58
  'ccLcccccccccccccccccccccccLccc', // 59
  'cccccccccccccccccccccccccccccc', // 60
];

const L1_WALK = 'tpsnc';
const L1_HEARTS = [[3, 46], [9, 36], [28, 22], [19, 15]]; // il quinto è sulla panchina
const L1_BUILDING_COLORS = ['#e8a25a', '#d9774e', '#f0c070', '#e89a8a', '#d8b090'];

// ---------------------------------------------------------------------------
// Grafica

function drawBalustrade(ctx, x0, y0, w) {
  Pix.rect(ctx, x0, y0, w, 16, '#5a3a50');
  for (let x = x0; x < x0 + w; x += 5) {
    Pix.rect(ctx, x + 1, y0 + 4, 3, 10, '#e6d3a8');
    Pix.rect(ctx, x + 1, y0 + 7, 3, 2, '#f4e8cc');
    Pix.rect(ctx, x + 3, y0 + 4, 1, 10, '#bfa77a');
  }
  Pix.rect(ctx, x0, y0, w, 4, '#efe3c4');
  Pix.rect(ctx, x0, y0, w, 1, '#fbf3e0');
  Pix.rect(ctx, x0, y0 + 4, w, 1, '#a8946a');
  Pix.rect(ctx, x0, y0 + 14, w, 2, '#c8b48a');
  for (let x = x0; x < x0 + w; x += 40) {
    Pix.rect(ctx, x, y0, 6, 16, '#e6d3a8');
    Pix.rect(ctx, x, y0, 6, 2, '#fbf3e0');
    Pix.rect(ctx, x + 5, y0, 1, 16, '#bfa77a');
  }
}

function l1Ground(ch, c, r) {
  if ('TOU'.includes(ch)) return r <= 12 ? 't' : 'g';
  if (ch === 'S' || ch === 'b') return 't';
  if (ch === 'f' || ch === 'K') return 'c';
  if (ch === 'L') {
    const around = [L1_MAP[r][c - 1], L1_MAP[r][c + 1], (L1_MAP[r + 1] || '')[c]];
    for (const k of ['t', 'c', 'w', 'p']) if (around.includes(k)) return k === 'p' ? 'g' : k;
    return 'g';
  }
  return ch;
}

function drawL1Tile(ctx, ch, c, r, rnd) {
  const x = c * TILE;
  const y = r * TILE;
  const at = (dc, dr) => ((L1_MAP[r + dr] || '')[c + dc]) || '';
  const R = (n) => Math.floor(rnd() * n);
  const speck = (n, col, w = 1, h = 1) => { for (let i = 0; i < n; i++) Pix.rect(ctx, x + R(16), y + R(16), w, h, col); };
  const bcol = L1_BUILDING_COLORS[(Math.floor(c / 4) * 7 + Math.floor(r / 9) * 3) % L1_BUILDING_COLORS.length];

  switch (ch) {
    case 'g': {
      Pix.rect(ctx, x, y, 16, 16, '#5f9e48');
      speck(12, '#4f8a3c');
      speck(6, '#7ab85a', 1, 2);
      if (rnd() < 0.45) {
        const bx = x + 3 + R(10), by = y + 4 + R(8);
        Pix.disc(ctx, bx, by, 3, '#3f7a3a');
        Pix.rect(ctx, bx - 2, by - 2, 3, 1, '#56944a');
      }
      if (rnd() < 0.12) Pix.px(ctx, x + R(16), y + R(16), rnd() < 0.5 ? '#f7a6bb' : '#ffd84a');
      break;
    }
    case 'n': {
      Pix.rect(ctx, x, y, 16, 16, '#7cba5a');
      speck(8, '#6aa84c');
      speck(5, '#94cc70', 1, 2);
      for (let i = 0; i < 3; i++) {
        const fx = x + 1 + R(14), fy = y + 1 + R(14);
        const fc = ['#f7a6bb', '#ffd84a', '#ffffff', '#c9a6f0'][R(4)];
        Pix.px(ctx, fx, fy, fc);
        Pix.px(ctx, fx + 1, fy, fc);
        Pix.px(ctx, fx, fy + 1, '#4f8a3c');
      }
      break;
    }
    case 't': {
      Pix.rect(ctx, x, y, 16, 16, '#e6d3a8');
      speck(10, '#d8c59a');
      speck(6, '#f0e2c0');
      Pix.rect(ctx, x, y + 7, 16, 1, '#cdb88c');
      Pix.rect(ctx, x, y + 15, 16, 1, '#cdb88c');
      Pix.rect(ctx, x + (r % 2 ? 3 : 11), y, 1, 7, '#cdb88c');
      Pix.rect(ctx, x + (r % 2 ? 11 : 3), y + 8, 1, 7, '#cdb88c');
      break;
    }
    case 'p': {
      Pix.rect(ctx, x, y, 16, 16, '#d6bf94');
      speck(10, '#c4ab7e');
      speck(8, '#e6d2aa');
      const road = (k) => 'pstn'.includes(k) && k !== '';
      if (!road(at(0, -1))) { Pix.rect(ctx, x, y, 16, 2, '#a88c62'); Pix.rect(ctx, x, y + 2, 16, 1, '#c4ab7e'); }
      if (!road(at(0, 1))) Pix.rect(ctx, x, y + 14, 16, 2, '#a88c62');
      if (!road(at(-1, 0))) Pix.rect(ctx, x, y, 2, 16, '#a88c62');
      if (!road(at(1, 0))) Pix.rect(ctx, x + 14, y, 2, 16, '#a88c62');
      break;
    }
    case 's': {
      Pix.rect(ctx, x, y, 16, 16, '#e6d3a8');
      for (let k = 0; k < 16; k += 4) {
        Pix.rect(ctx, x, y + k, 16, 1, '#f4e8cc');
        Pix.rect(ctx, x, y + k + 3, 16, 1, '#b8a07a');
      }
      break;
    }
    case 'w': {
      Pix.rect(ctx, x, y, 16, 16, '#d8c49a');
      for (let k = 0; k < 3; k++) {
        const by = y + 4 + k * 4;
        Pix.rect(ctx, x, by + 3, 16, 1, '#b8a47a');
        const off = (k + c) % 2 ? 0 : 4;
        for (let bx = off; bx < 16; bx += 8) Pix.rect(ctx, x + bx, by, 1, 3, '#b8a47a');
      }
      Pix.rect(ctx, x, y, 16, 3, '#efe3c4');
      Pix.rect(ctx, x, y + 3, 16, 1, '#a8946a');
      if (rnd() < 0.4) Pix.rect(ctx, x + R(14), y + 12 + R(3), 2, 1, '#7a9a5a');
      break;
    }
    case 'G': {
      Pix.rect(ctx, x, y, 16, 16, '#3e7a3e');
      speck(16, '#4f9a4a', 2, 1);
      speck(10, '#2e5e30');
      if (at(0, -1) !== 'G') { Pix.rect(ctx, x, y, 16, 2, '#5aae52'); Pix.rect(ctx, x, y, 16, 1, '#2a4a2a'); }
      if (at(0, 1) !== 'G') Pix.rect(ctx, x, y + 14, 16, 2, '#24402a');
      break;
    }
    case 'X': break; // disegnata tutta insieme
    case 'c': {
      Pix.rect(ctx, x, y, 16, 16, '#544846');
      for (let sy = 0; sy < 16; sy += 4) {
        const off = ((sy / 4 + r) % 2) ? 2 : 0;
        for (let sx = -off; sx < 16; sx += 4) {
          const col = ['#7c6e68', '#857670', '#706460', '#8a7a72'][R(4)];
          const x1 = Math.max(0, sx), x2 = Math.min(16, sx + 3);
          if (x2 <= x1) continue;
          Pix.rect(ctx, x + x1, y + sy, x2 - x1, 3, col);
          if (sx >= 0) Pix.px(ctx, x + sx, y + sy, '#9a8a82');
        }
      }
      break;
    }
    case 'R': {
      Pix.rect(ctx, x, y, 16, 16, '#c4643e');
      for (let k = 0; k < 16; k += 4) {
        Pix.rect(ctx, x, y + k + 3, 16, 1, '#9a4a2e');
        const off = (k / 4 + r) % 2 ? 2 : 0;
        for (let bx = off; bx < 16; bx += 4) Pix.rect(ctx, x + bx, y + k, 2, 1, '#d8784e');
      }
      if ('WID'.includes(at(0, 1))) { Pix.rect(ctx, x, y + 13, 16, 3, '#6e3424'); Pix.rect(ctx, x, y + 13, 16, 1, '#e08a5a'); }
      if (at(0, -1) !== 'R') Pix.rect(ctx, x, y, 16, 1, '#8a3a24');
      if (at(-1, 0) === 'c') Pix.rect(ctx, x, y, 1, 16, '#6e3424');
      if (at(1, 0) === 'c') Pix.rect(ctx, x + 15, y, 1, 16, '#6e3424');
      break;
    }
    case 'W': case 'I': case 'D': {
      Pix.rect(ctx, x, y, 16, 16, bcol);
      speck(6, 'rgba(0,0,0,0.08)');
      Pix.rect(ctx, x, y + 14, 16, 2, '#8a5a3e');
      if (ch === 'W' || ch === 'I') {
        Pix.rect(ctx, x + 4, y + 2, 8, 10, '#f4e8d0');
        Pix.rect(ctx, x + 5, y + 3, 6, 8, '#3a2a3a');
        Pix.rect(ctx, x + 5, y + 3, 2, 1, '#8a7a9a');
        Pix.rect(ctx, x + 2, y + 2, 2, 10, '#4f7a4a');
        Pix.rect(ctx, x + 12, y + 2, 2, 10, '#4f7a4a');
        for (let k = 3; k < 12; k += 2) { Pix.px(ctx, x + 2, y + k, '#3a5e38'); Pix.px(ctx, x + 13, y + k, '#3a5e38'); }
        Pix.rect(ctx, x + 3, y + 12, 10, 2, '#8a5a3e');
        if (rnd() < 0.6) for (let k = 0; k < 4; k++) Pix.px(ctx, x + 4 + k * 2, y + 11, rnd() < 0.5 ? '#e8506a' : '#f7a6bb');
      }
      if (ch === 'I') {
        for (let i = 0; i < 40; i++) {
          const ix = R(16), iy = R(16);
          if (rnd() < 0.5 && ix > 3 && ix < 12 && iy > 2 && iy < 12) continue;
          Pix.rect(ctx, x + ix, y + iy, 2, 1, ['#3f7a3a', '#5a9a4a', '#2e5e30'][R(3)]);
        }
      }
      if (ch === 'D') {
        Pix.rect(ctx, x + 4, y + 4, 8, 11, '#7a4a2a');
        Pix.rect(ctx, x + 5, y + 3, 6, 1, '#7a4a2a');
        Pix.rect(ctx, x + 4, y + 4, 8, 1, '#5a3420');
        Pix.rect(ctx, x + 7, y + 5, 1, 10, '#5a3420');
        Pix.px(ctx, x + 9, y + 10, '#e0c070');
        Pix.rect(ctx, x + 3, y + 15, 10, 1, '#c8b490');
      }
      break;
    }
    default: break;
  }
}

function buildGianicoloArt(scene) {
  if (scene.textures.exists('gianicolo')) return;
  const W = 30 * TILE;
  const H = L1_MAP.length * TILE;
  const [c, ctx] = Pix.canvas(W, H);
  const rnd = Pix.rng(1022);

  // panorama al tramonto con Roma
  drawSunsetSky(ctx, W, 112, { sunX: 330, sunY: 92, stars: 18, seed: 5 });
  drawRomeSkyline(ctx, W, 112, { domeX: 300, towerX: 120, pines: [40, 200, 430], seed: 8 });
  drawBalustrade(ctx, 0, 7 * TILE, W);

  for (let r = 0; r < L1_MAP.length; r++) {
    for (let col = 0; col < 30; col++) {
      const ch = L1_MAP[r][col];
      if (ch === '.' || ch === 'X') continue;
      drawL1Tile(ctx, l1Ground(ch, col, r), col, r, rnd);
    }
  }

  // panchina
  {
    const bx = 14 * TILE + 2, by = 23 * TILE + 2;
    Pix.rect(ctx, bx + 1, by + 12, 26, 2, 'rgba(42,29,26,0.25)');
    Pix.rect(ctx, bx, by, 28, 3, '#2a1d1a');
    Pix.rect(ctx, bx + 1, by + 1, 26, 1, '#a8703e');
    Pix.rect(ctx, bx, by + 4, 28, 3, '#2a1d1a');
    Pix.rect(ctx, bx + 1, by + 5, 26, 1, '#a8703e');
    Pix.rect(ctx, bx, by + 7, 28, 4, '#8a5a3a');
    Pix.rect(ctx, bx, by + 7, 28, 1, '#c88a52');
    for (const lx of [1, 25]) Pix.rect(ctx, bx + lx, by, 2, 13, '#2a2a36');
  }
  // fontana in piazza
  {
    const fx = 15 * TILE, fy = 52 * TILE;
    Pix.disc(ctx, fx, fy, 15, '#8a7a5a');
    Pix.disc(ctx, fx, fy, 14, '#e6d3a8');
    Pix.disc(ctx, fx, fy, 11, '#5aa8d0');
    Pix.disc(ctx, fx, fy, 10, '#7ac0e0');
    Pix.rect(ctx, fx - 6, fy - 4, 4, 1, '#b8e4f4');
    Pix.rect(ctx, fx + 3, fy + 3, 5, 1, '#b8e4f4');
    Pix.disc(ctx, fx, fy, 4, '#bfa77a');
    Pix.disc(ctx, fx, fy, 3, '#f0e2c0');
  }
  // tavolini della trattoria
  for (const [tc, tr] of [[7, 53], [10, 53]]) {
    const tx = tc * TILE + 3, ty = tr * TILE + 4;
    Pix.rect(ctx, tx - 3, ty + 3, 3, 5, '#7a4a2a');
    Pix.rect(ctx, tx + 10, ty + 3, 3, 5, '#7a4a2a');
    Pix.rect(ctx, tx, ty, 10, 9, '#2a1d1a');
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
      Pix.rect(ctx, tx + 1 + i * 2, ty + 1 + j * 2, 2, 2, (i + j) % 2 ? '#ffffff' : '#d9434f');
    }
  }
  // panni stesi tra le case
  const laundry = (x1, x2, ly) => {
    Pix.rect(ctx, x1, ly, x2 - x1, 1, '#4a3a3a');
    const cols = ['#ffffff', '#f7a6bb', '#7ac0ff', '#ffd84a', '#c9a6f0'];
    for (let lx = x1 + 3; lx < x2 - 6; lx += 8) {
      const col = cols[Math.floor(rnd() * cols.length)];
      Pix.rect(ctx, lx, ly + 1, 5, 4 + Math.floor(rnd() * 3), col);
      Pix.rect(ctx, lx, ly + 1, 5, 1, 'rgba(0,0,0,0.15)');
    }
  };
  laundry(2 * TILE + 8, 5 * TILE + 8, 47 * TILE + 2);
  laundry(12 * TILE + 8, 17 * TILE + 8, 46 * TILE + 8);
  laundry(3 * TILE + 8, 6 * TILE + 8, 56 * TILE + 3);
  laundry(12 * TILE + 8, 17 * TILE + 8, 55 * TILE + 9);

  Pix.addTexture(scene, 'gianicolo', c);

  // --- oggetti alti (con profondità) ---
  {
    const [p, pc] = Pix.canvas(40, 46);
    Pix.rect(pc, 18, 14, 4, 32, '#5a3a28');
    Pix.rect(pc, 18, 14, 1, 32, '#7a5038');
    Pix.rect(pc, 16, 22, 3, 2, '#5a3a28');
    Pix.rect(pc, 21, 18, 4, 2, '#5a3a28');
    const canopy = (cx, cy, rx, ry, col) => {
      for (let yy = -ry; yy <= ry; yy++) {
        const half = Math.round(rx * Math.sqrt(1 - (yy / (ry + 0.5)) ** 2));
        Pix.rect(pc, cx - half, cy + yy, half * 2 + 1, 1, col);
      }
    };
    canopy(20, 9, 20, 8, '#1e3a24');
    canopy(20, 8, 19, 7, '#2f5a34');
    canopy(18, 6, 15, 5, '#3f7a3e');
    const r2 = Pix.rng(77);
    for (let i = 0; i < 30; i++) Pix.px(pc, 6 + Math.floor(r2() * 28), 2 + Math.floor(r2() * 9), '#5a9a4a');
    Pix.addTexture(scene, 'pine', p);
  }
  {
    const [o, oc] = Pix.canvas(28, 34);
    Pix.rect(oc, 12, 20, 4, 14, '#5a3a28');
    Pix.rect(oc, 12, 20, 1, 14, '#7a5038');
    Pix.disc(oc, 14, 13, 13, '#1e3a24');
    Pix.disc(oc, 14, 12, 12, '#3a6e36');
    Pix.disc(oc, 12, 10, 8, '#4f8e44');
    Pix.disc(oc, 10, 8, 4, '#68a858');
    Pix.addTexture(scene, 'oak', o);
  }
  {
    const [b, bc] = Pix.canvas(12, 26);
    Pix.rect(bc, 2, 12, 8, 14, '#bfa77a');
    Pix.rect(bc, 3, 12, 6, 14, '#e6d3a8');
    Pix.rect(bc, 1, 12, 10, 2, '#f0e2c0');
    Pix.rect(bc, 1, 24, 10, 2, '#bfa77a');
    Pix.rect(bc, 2, 6, 8, 6, '#f4f4f0');
    Pix.rect(bc, 3, 1, 6, 6, '#f4f4f0');
    Pix.rect(bc, 3, 1, 6, 1, '#d8d8d0');
    Pix.rect(bc, 8, 2, 1, 9, '#d0d0c8');
    Pix.px(bc, 4, 4, '#b0b0a8');
    Pix.px(bc, 7, 4, '#b0b0a8');
    Pix.addTexture(scene, 'bust', b);
  }
  {
    const [l, lc] = Pix.canvas(10, 36);
    Pix.rect(lc, 4, 9, 2, 25, '#2a2a36');
    Pix.rect(lc, 3, 32, 4, 4, '#2a2a36');
    Pix.rect(lc, 2, 1, 6, 1, '#2a2a36');
    Pix.rect(lc, 1, 2, 8, 7, '#2a2a36');
    Pix.rect(lc, 2, 3, 6, 5, '#ffd87a');
    Pix.rect(lc, 3, 3, 2, 2, '#fff4c4');
    Pix.addTexture(scene, 'lamp', l);
    const [g, gc] = Pix.canvas(24, 24);
    Pix.disc(gc, 12, 12, 11, 'rgba(255,216,122,0.18)');
    Pix.disc(gc, 12, 12, 7, 'rgba(255,216,122,0.22)');
    Pix.addTexture(scene, 'lampGlow', g);
  }
  {
    // Garibaldi a cavallo (sagoma in bronzo) sul piedistallo
    const [s, sc] = Pix.canvas(48, 68);
    Pix.rect(sc, 2, 40, 44, 28, '#bfa77a');
    Pix.rect(sc, 3, 40, 42, 26, '#e6d3a8');
    Pix.rect(sc, 0, 62, 48, 6, '#d8c49a');
    Pix.rect(sc, 0, 62, 48, 1, '#f0e2c0');
    Pix.rect(sc, 4, 38, 40, 3, '#f0e2c0');
    Pix.rect(sc, 10, 48, 28, 8, '#d8c49a');
    Pix.rect(sc, 11, 49, 26, 6, '#bfa77a');
    const B = '#3e5a4e', b2 = '#5a7a6a';
    Pix.rect(sc, 12, 22, 22, 9, B);        // corpo del cavallo
    Pix.rect(sc, 13, 22, 20, 2, b2);
    Pix.rect(sc, 31, 14, 5, 10, B);        // collo
    Pix.rect(sc, 33, 11, 8, 5, B);         // testa
    Pix.rect(sc, 33, 11, 6, 1, b2);
    Pix.rect(sc, 13, 31, 3, 7, B); Pix.rect(sc, 18, 31, 3, 7, B);
    Pix.rect(sc, 27, 31, 3, 7, B); Pix.rect(sc, 31, 30, 3, 8, B);
    Pix.rect(sc, 9, 23, 3, 9, B);          // coda
    Pix.rect(sc, 20, 10, 6, 12, B);        // cavaliere
    Pix.rect(sc, 21, 4, 4, 6, B);
    Pix.rect(sc, 20, 3, 6, 2, B);
    Pix.rect(sc, 21, 10, 1, 10, b2);
    Pix.addTexture(scene, 'statue', s);
  }
  // Barra e cursore del minigioco
  {
    const [b, bc] = Pix.canvas(204, 14);
    Pix.box(bc, 0, 0, 204, 14, '#fbf3e4', PAL.outline);
    Pix.rect(bc, 2, 2, 200, 10, '#e9d9bd');
    Pix.rect(bc, 2, 2, 200, 1, '#d8c4a0');
    Pix.addTexture(scene, 'ninjaBar', b);
    Pix.addTexture(scene, 'ninjaCursor', Pix.gridCanvas([
      'KKKKKKK',
      'KRRRRRK',
      '.KRRRK.',
      '..KRK..',
      '...K...',
      '...K...',
      '...K...',
      '...K...',
      '...K...',
      '...K...',
      '...K...',
      '...K...',
      '...K...',
      '...K...',
      '...K...',
      '...K...',
      '...K...',
    ], { '.': null, K: PAL.outline, R: PAL.red }));
  }
  // Sfondo del minigioco e del finale: terrazza davanti a Roma
  const vista = (key, sunY, stars) => {
    const [v, vc] = Pix.canvas(480, 270);
    drawSunsetSky(vc, 480, 176, { sunX: 240, sunY, stars, seed: 13 });
    drawRomeSkyline(vc, 480, 176, { domeX: 240, towerX: 90, pines: [30, 150, 400, 452], seed: 21 });
    drawBalustrade(vc, 0, 172, 480);
    Pix.rect(vc, 0, 188, 480, 82, '#e6d3a8');
    for (let y = 188; y < 270; y += 12) Pix.rect(vc, 0, y + 11, 480, 1, '#cdb88c');
    const rr = Pix.rng(3);
    for (let i = 0; i < 300; i++) Pix.px(vc, Math.floor(rr() * 480), 188 + Math.floor(rr() * 82), rr() < 0.5 ? '#d8c59a' : '#f0e2c0');
    Pix.addTexture(scene, key, v);
  };
  vista('ninjaBg', 150, 25);
  vista('finaleBg', 168, 70);
}

// ---------------------------------------------------------------------------

class Level1Scene extends BaseScene {
  constructor() { super('Level1'); }

  create() {
    this.initBase();
    this.challengeSession = {};
    this.ninja = null;
    this.mini = null;
    Save.setLevel('Level1');
    buildGianicoloArt(this);
    this.add.image(0, 0, 'gianicolo').setOrigin(0, 0).setDepth(0);

    this.world = new GridWorld(L1_MAP, L1_WALK);
    this.addObjects();

    // Francesca
    const fr = new Character(this, 'francesca', 0, 0, 'up');
    this.mover = new GridMover(this, this.world, fr, 14, 59);
    this.mover.onStep = (c, r) => this.onStep(c, r);
    this.player = fr;
    this.humSongs = [[[fr, '♪ Cosa sarà… ♪']], [[fr, '♪ mm mm mmm… ♪']], [[fr, '♪ cosa sarààà… ♪']]];

    this.addNPCs();
    this.enableChallenges();
    this.addHearts();
    this.addHUD();
    this.exclaim = new ExclaimMarker(this);

    const cam = this.cameras.main;
    cam.setBounds(0, 0, 30 * TILE, L1_MAP.length * TILE);
    cam.setRoundPixels(true);
    cam.startFollow(fr.sprite, true, 0.15, 0.15, 0, 10);

    Audio8.playSong(SONGS.gianicolo);
    this.busy = true;
    this.battle = null;
    this.npcMenuTick = null;
    this.events.once('shutdown', () => {
      this.challengeSession = null;
      if (this.battle) this.battle.destroy();
      this.battle = null;
      this.npcMenuTick = null;
    });
    this.intro();
  }

  addObjects() {
    const depthAt = (r) => 10 + r * TILE + 13;
    for (let r = 0; r < L1_MAP.length; r++) {
      for (let c = 0; c < 30; c++) {
        const ch = L1_MAP[r][c];
        const x = c * TILE + 8;
        const y = (r + 1) * TILE;
        if (ch === 'T') this.add.image(x, y, 'pine').setOrigin(0.5, 1).setDepth(depthAt(r));
        else if (ch === 'O') this.add.image(x, y, 'oak').setOrigin(0.5, 1).setDepth(depthAt(r));
        else if (ch === 'U') this.add.image(x, y - 1, 'bust').setOrigin(0.5, 1).setDepth(depthAt(r));
        else if (ch === 'L') {
          this.add.image(x, y - 1, 'lamp').setOrigin(0.5, 1).setDepth(depthAt(r));
          const g = this.add.image(x, y - 31, 'lampGlow').setDepth(depthAt(r) + 1).setBlendMode(Phaser.BlendModes.ADD);
          this.tweens.add({ targets: g, alpha: 0.6, duration: 900 + Math.random() * 500, yoyo: true, repeat: -1 });
        }
      }
    }
    this.add.image(22 * TILE + 8, 11 * TILE, 'statue').setOrigin(0.5, 1).setDepth(depthAt(10));
    // zampilli della fontana
    for (let i = 0; i < 4; i++) {
      const s = this.add.image(15 * TILE + (i % 2 ? 4 : -4), 52 * TILE - 2 + (i < 2 ? -3 : 3), 'sparkle').setDepth(5).setScale(0.6);
      this.tweens.add({ targets: s, alpha: 0, duration: 400, yoyo: true, repeat: -1, delay: i * 200 });
    }
  }

  addNPCs() {
    const W = this.world;
    // Trastevere
    this.nonna = W.placeNPC(this, 'nonna', 21, 50, 'down', () => this.talkTo(this.nonna, [
      ['Signora', 'Ah, er Gianicolo! Sali sali, bella mia, che da lassù se vede tutta Roma.'],
      ['Signora', 'E nun te scordà de raccoje li cuoricini pe\' strada!'],
    ]));
    this.cameriere = W.placeNPC(this, 'cameriere', 12, 53, 'left', () => this.talkTo(this.cameriere, [
      ['Cameriere', 'Ah, ve ricordo voi due! Prima uscita, eh? Se vedeva lontano un chilometro.'],
      ['Cameriere', 'Er ragazzo tuo è già salito: t\'aspetta in cima ar Gianicolo!'],
    ]));

    // I turisti che bloccano la terrazza
    this.turistaA = W.placeNPC(this, 'turistaA', 14, 13, 'up', () => this.talkTourists());
    this.turistaB = W.placeNPC(this, 'turistaB', 15, 13, 'up', () => this.talkTourists());
    this.touristsMoved = false;

    // I ragazzi che giocano a ninja, in cerchio
    const kidTalk = () => this.talkKids();
    this.kids = [
      W.placeNPC(this, 'kidA', 7, 10, 'down', kidTalk),
      W.placeNPC(this, 'kidB', 6, 11, 'right', kidTalk),
      W.placeNPC(this, 'kidC', 8, 11, 'left', kidTalk),
      W.placeNPC(this, 'kidD', 7, 12, 'up', kidTalk),
    ];
    this.time.addEvent({ delay: 380, loop: true, callback: () => this.jitterKids() });

    // Easter egg: il Sindaco, nascosto dietro la statua
    this.sindaco = W.placeNPC(this, 'sindaco', 27, 10, 'down', () => this.talkSindaco());
    this.sindacoTalks = 0;

    // Simone alla balaustra, guarda Roma
    this.simone = W.placeNPC(this, 'simone', 15, 8, 'up', () => this.talkSimone());

    // La panchina
    const bench = () => this.useBench();
    W.setInteract(14, 23, bench);
    W.setInteract(15, 23, bench);
  }

  // Conserva le interazioni originali: le sfide sono sempre una scelta facoltativa.
  enableChallenges() {
    this.challengeNPCs = Array.from(this.world.occupied.values());
    for (const npc of this.challengeNPCs) {
      const key = this.world.key(npc.c, npc.r);
      const original = this.world.interact.get(key);
      this.world.setInteract(npc.c, npc.r, () => this.offerChallenge(npc, original));
    }
  }

  offerChallenge(npc, original) {
    // Il dialogo di Simone può aver avviato la sfida ninja: in quel caso non sbloccare.
    return GianicoloBattle.offer(this, npc, original, { canUnlock: () => !this.ninja && !this.leaving });
  }

  addHearts() {
    this.hearts = new Map();
    for (const [c, r] of L1_HEARTS) {
      const p = tileFeet(c, r);
      const img = this.add.image(p.x, p.y - 7, 'heart').setDepth(10 + p.y - 1);
      this.tweens.add({ targets: img, y: p.y - 10, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
      this.hearts.set(`${c},${r}`, img);
    }
    // cuore sulla panchina
    this.benchHeart = this.add.image(15 * TILE, 23 * TILE + 4, 'heart').setDepth(10 + 23 * TILE + 14);
    this.tweens.add({ targets: this.benchHeart, y: '-=3', duration: 600, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.heartCount = 0;
  }

  addHUD() {
    this.add.rectangle(4, 4, 62, 15, 0x1a1020, 0.55).setOrigin(0, 0).setScrollFactor(0).setDepth(950);
    this.hudHearts = [];
    for (let i = 0; i < 5; i++) {
      this.hudHearts.push(this.add.image(12 + i * 11, 11, 'heartEmpty').setScrollFactor(0).setDepth(951));
    }
  }

  gainHeart() {
    const img = this.hudHearts[this.heartCount];
    this.heartCount++;
    img.setTexture('heart');
    this.tweens.add({ targets: img, scale: 1.8, duration: 140, yoyo: true });
    Audio8.sfx('heart');
    if (this.heartCount < 5) {
      this.toast(`Cuoricino trovato! ${this.heartCount}/5`);
    } else {
      this.toast('Tutti e 5 i cuoricini! Ora la terrazza è libera.', 3000);
      this.moveTourists();
    }
  }

  toast(text, ms = 2200) {
    if (this.toastObj) this.toastObj.destroy();
    const w = FontMetrics.measure(fontText(text)) + 16;
    const c = this.add.container(240, 30).setScrollFactor(0).setDepth(1200);
    c.add(this.add.rectangle(0, 0, w, 16, 0x1a1020, 0.75));
    c.add(addText(this, 0, 0, text, { color: 0xfbf3e4, origin: [0.5, 0.5] }));
    this.toastObj = c;
    this.time.delayedCall(ms, () => {
      if (c.active) this.tweens.add({ targets: c, alpha: 0, duration: 300, onComplete: () => c.destroy() });
    });
  }

  async intro() {
    await this.wait(400);
    await this.levelCard(1, 'Il Gianicolo');
    await this.talk([
      [null, 'Trastevere. Qui è iniziata la vostra prima uscita…'],
      [null, '…e da qui si sale al Gianicolo. Raccogli i 5 cuoricini lungo la strada: Simone ti aspetta in cima!'],
      [null, 'Con A puoi parlare con chi incontri… oppure sfidarlo a una battaglia! Le sfide sono facoltative e puoi sempre fuggire.'],
    ]);
    this.busy = false;
  }

  tick(time) {
    if (this.npcMenuTick) this.npcMenuTick();
    if (this.battle) this.battle.update();
    const free = !this.locked;
    this.mover.update(time, free);
    if (this.mini) this.updateMini(time);
    this.humTick(time, this.humSongs, !this.mini);

    // il "!" quando guarda qualcosa di interagibile
    const f = this.mover.facing();
    const fn = free && !this.mover.moving ? this.world.interact.get(`${f.c},${f.r}`) : null;
    if (fn) {
      const isNPC = this.world.occupied.has(`${f.c},${f.r}`);
      this.exclaim.show(f.c, f.r, isNPC ? 24 : 12);
      if (Controls.consumeA()) {
        this.exclaim.hide();
        fn();
      }
    } else {
      this.exclaim.hide();
      if (free) Controls.consumeA();
    }
  }

  onStep(c, r) {
    const k = `${c},${r}`;
    const h = this.hearts.get(k);
    if (h) {
      this.hearts.delete(k);
      this.tweens.killTweensOf(h);
      this.tweens.add({ targets: h, y: h.y - 16, alpha: 0, scale: 2, duration: 400, onComplete: () => h.destroy() });
      this.gainHeart();
    }
  }

  // Un NPC si gira verso Francesca e parla
  async talkTo(npc, lines) {
    npc.ch.face(OPPOSITE[this.player.dir]);
    await this.talk(lines);
  }

  async useBench() {
    await this.say('Simone', 'Questa panchina la conosciamo bene. Qui ci siamo abbracciati in un giorno difficile. Ricordati sempre che io ci sarò, in quelli belli e in quelli brutti.');
    if (this.benchHeart) {
      const h = this.benchHeart;
      this.benchHeart = null;
      this.tweens.killTweensOf(h);
      this.tweens.add({ targets: h, y: h.y - 16, alpha: 0, scale: 2, duration: 400, onComplete: () => h.destroy() });
      this.gainHeart();
    }
  }

  async talkTourists() {
    if (this.touristsMoved) {
      await this.talkTo(this.turistaA, [['Turisti', 'What a view! Bellissimo!']]);
      return;
    }
    this.turistaA.ch.face('down');
    this.turistaB.ch.face('down');
    await this.talk([
      ['Turisti', 'Sorry! Perfect sunset selfie in progress… one more… one more…'],
      [null, `Sembra che ne avranno per un bel po'. Intanto cerca i cuoricini: te ne mancano ${5 - this.heartCount}.`],
    ]);
    this.turistaA.ch.face('up');
    this.turistaB.ch.face('up');
  }

  async moveTourists() {
    this.touristsMoved = true;
    const go = async (npc, path) => {
      for (const [c, r] of path) {
        const p = tileFeet(c, r);
        this.world.moveNPC(npc, c, r);
        await npc.ch.walkTo(p.x, p.y, 45);
      }
      npc.ch.face('up');
    };
    go(this.turistaA, [[14, 12], [13, 12], [12, 12]]);
    go(this.turistaB, [[15, 12], [16, 12], [17, 12]]);
  }

  jitterKids() {
    if (this.locked) return;
    const k = this.kids[Math.floor(Math.random() * this.kids.length)];
    const roll = Math.random();
    if (roll < 0.4) {
      k.ch.face(['down', 'left', 'right', 'up'][Math.floor(Math.random() * 4)]);
    } else if (roll < 0.75) {
      this.tweens.add({ targets: k.ch, lift: 4, duration: 70, yoyo: true, onUpdate: () => k.ch.sync() });
    } else {
      // "mossa ninja": fotogramma del passo, poi immobile
      k.ch.sprite.setFrame(DIR_ROW[k.ch.dir] * 3 + 1);
      this.time.delayedCall(260, () => k.ch.face(k.ch.dir));
    }
  }

  async talkKids() {
    const k = this.kids.find(n => n.c === this.mover.facing().c && n.r === this.mover.facing().r) || this.kids[0];
    k.ch.face(OPPOSITE[this.player.dir]);
    await this.say('Ragazzi', 'Stiamo giocando a ninja! Ma c\'è qualcuno che ti aspetta laggiù…');
  }

  async talkSindaco() {
    this.sindaco.ch.face(OPPOSITE[this.player.dir]);
    this.sindacoTalks++;
    if (this.sindacoTalks > 1) {
      await this.say('Il Sindaco', 'Cittadini! As-fal-ta-mo-lo!');
      return;
    }
    const S = 'Il Sindaco';
    await this.talk([
      [S, 'Cittadini! Guardate Roma, guardate \'sto fiume…'],
      [S, 'Ma \'sto fiume… ce piace o nun ce piace? Se ce piace, e allora tenemoselo! Ma se nun ce piace… e allora prosciughiamolo!'],
      [S, 'Facciamone una grande arteria di scorrimento veloce, una superstrada a quattro corsie per ogni senso de marcia!'],
      [S, 'Asfaltamolo \'sto Tevere! As-fal-ta-mo-lo!'],
      [S, 'Perché noi della DC non promettiamo chiacchiere, noi promettiamo fatti!'],
      [S, 'Voi me direte: "Ma l\'acqua? E li pesci \'ndo vanno?". E \'ndo vanno? Troveranno \'n\'altra sistemazione! Li mettiamo nelle vasche, li portiamo ar mare!'],
      [S, 'Ma Roma ha bisogno de traffico fluido, de modernità, de progresso!'],
      [null, '…Simone l\'ha detto davvero, al suo compleanno. Proprio qui.'],
    ]);
  }

  async talkSimone() {
    this.simone.ch.face(OPPOSITE[this.player.dir]);
    await this.say('Simone', 'Ehi… ti va una sfida a ninja?');
    const yes = await GianicoloBattle.choose(this, 'Una sfida a ninja?', ['Sì, bel maschione profumato', 'Non ancora, favoloso e virile macho']);
    if (yes !== 0) {
      await this.say('Simone', 'Va bene… ti aspetto qui. Bello, profumato e virile.');
      return;
    }
    this.ninjaGame();
  }

  // -------------------------------------------------------------------------
  // Minigioco: premi A quando il cursore è nella zona verde

  async ninjaGame() {
    this.busy = true;
    this.exclaim.hide();
    Audio8.playSong(SONGS.ninja);
    const ov = this.add.container(0, 0).setScrollFactor(0).setDepth(960).setAlpha(0);
    this.ninja = ov;
    ov.add(this.add.image(0, 0, 'ninjaBg').setOrigin(0, 0));
    const f = this.add.sprite(176, 238, 'francesca', DIR_ROW.right * 3).setOrigin(0.5, 1).setScale(3);
    const s = this.add.sprite(304, 238, 'simone', DIR_ROW.left * 3).setOrigin(0.5, 1).setScale(3);
    ov.add([f, s]);
    this.nf = f;
    this.ns = s;

    const bar = this.add.image(240, 40, 'ninjaBar');
    this.zone = this.add.rectangle(240, 40, 40, 10, 0x5ac46a).setStrokeStyle(1, 0x2e7a3a);
    this.cursor = this.add.image(140, 40, 'ninjaCursor').setOrigin(0.5, 0.5);
    const hint = addText(this, 240, 58, Controls.isTouch ? 'Tocca quando il cursore è nel verde!' : 'Premi A (Spazio) quando il cursore è nel verde!',
      { color: 0xfbf3e4, shadow: 0x3a2340, origin: [0.5, 0] });
    this.scoreText = addText(this, 240, 8, 'Francesca 0 - 0 Simone', { scale: 2, color: 0xffd6de, shadow: 0x5a1a3a, origin: [0.5, 0] });
    this.barGroup = [bar, this.zone, this.cursor, hint];
    ov.add([bar, this.zone, this.cursor, hint, this.scoreText]);
    this.barGroup.forEach(o => o.setVisible(false));

    await this.tweenP({ targets: ov, alpha: 1, duration: 500 });
    await this.roundLabel('Round 1');

    // Round 1: vince Francesca (se sbaglia, il cursore rallenta e si riprova)
    let speed = 250;
    for (;;) {
      const ok = await this.attempt(speed, 40);
      if (ok) { await this.animHit(f, s, 1); break; }
      await this.animMiss(f, s);
      speed = Math.max(70, speed * 0.7);
    }
    this.scoreText.setText('Francesca 1 - 0 Simone');
    await this.say('Simone', 'Ok ok, hai vinto tu. Ma esigo la rivincita!');

    // Round 2: vince comunque Simone (se lei colpisce, lui schiva all'ultimo)
    await this.roundLabel('Round 2');
    const ok2 = await this.attempt(220, 40);
    if (ok2) await this.animDodge(f, s);
    await this.animHit(s, f, -1);
    this.scoreText.setText('Francesca 1 - 1 Simone');
    await this.say('Simone', ok2 ? 'Schivata! Pareggio! E adesso…' : 'Pareggio! E adesso…');
    this.finale();
  }

  async roundLabel(text) {
    const t = addText(this, 240, 110, text, { scale: 3, color: 0xfbf3e4, shadow: 0x3a2340, origin: [0.5, 0.5] })
      .setScrollFactor(0).setDepth(1100).setScale(0);
    Audio8.sfx('select');
    await this.tweenP({ targets: t, scale: 1, duration: 300, ease: 'Back.Out' });
    await this.wait(700);
    await this.tweenP({ targets: t, alpha: 0, duration: 250 });
    t.destroy();
  }

  attempt(speed, zoneW) {
    this.zone.width = zoneW;
    this.zone.setSize(zoneW, 10);
    this.barGroup.forEach(o => o.setVisible(true));
    Controls.reset();
    return new Promise((res) => {
      this.mini = { pos: 0, dir: 1, speed, zoneW, res, started: this.time.now };
    });
  }

  updateMini(time) {
    const m = this.mini;
    const dt = Math.min(this.game.loop.delta, 50) / 1000;
    m.pos += m.dir * m.speed * dt;
    if (m.pos > 200) { m.pos = 200; m.dir = -1; }
    if (m.pos < 0) { m.pos = 0; m.dir = 1; }
    this.cursor.x = Math.round(140 + m.pos);
    if (time - m.started < 250) { Controls.consumeA(); return; } // ignora i tocchi "di troppo"
    if (Controls.consumeA()) {
      const hit = Math.abs(m.pos - 100) <= m.zoneW / 2 + 2;
      this.mini = null;
      this.barGroup.forEach(o => o.setVisible(false));
      this.time.delayedCall(10, () => m.res(hit));
    }
  }

  burst(x, y) {
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const st = this.add.image(x, y, 'star').setScrollFactor(0).setDepth(1001).setScale(1.5);
      this.tweens.add({ targets: st, x: x + Math.cos(a) * 22, y: y + Math.sin(a) * 22, alpha: 0, duration: 450, onComplete: () => st.destroy() });
    }
  }

  floatWord(text, x, y, color) {
    const t = addText(this, x, y, text, { scale: 2, color, shadow: 0x2a1d1a, origin: [0.5, 0.5] }).setScrollFactor(0).setDepth(1001);
    this.tweens.add({ targets: t, y: y - 20, alpha: 0, duration: 900, delay: 300, onComplete: () => t.destroy() });
  }

  // a colpisce la mano di b (dir = verso dell'attacco)
  async animHit(a, b, dir) {
    const ax = a.x;
    await this.tweenP({ targets: a, x: ax + dir * 70, duration: 110, ease: 'Quad.In' });
    Audio8.sfx('hit');
    this.burst(b.x - dir * 22, 200);
    this.floatWord('Preso!', b.x, 150, 0xffd84a);
    this.tweens.add({ targets: b, x: b.x + dir * 6, duration: 50, yoyo: true, repeat: 2 });
    await this.tweenP({ targets: a, x: ax, duration: 200, ease: 'Quad.Out' });
    await this.wait(400);
  }

  async animMiss(f, s) {
    const fx = f.x;
    this.tweens.add({ targets: s, x: s.x + 14, duration: 90, yoyo: true });
    await this.tweenP({ targets: f, x: fx + 50, duration: 110, ease: 'Quad.In' });
    Audio8.sfx('miss');
    this.floatWord('Mancato! Riprova', 240, 150, 0xfbf3e4);
    await this.tweenP({ targets: f, x: fx, duration: 200 });
    await this.wait(500);
  }

  async animDodge(f, s) {
    const fx = f.x;
    const sx = s.x;
    Audio8.sfx('whoosh');
    this.tweens.add({ targets: s, x: sx + 40, y: s.y - 14, duration: 120, yoyo: true, hold: 160 });
    await this.tweenP({ targets: f, x: fx + 70, duration: 110, ease: 'Quad.In' });
    this.floatWord('Schivato!', sx + 20, 140, 0xa8e0ff);
    await this.tweenP({ targets: f, x: fx, duration: 220 });
    await this.wait(250);
  }

  // Finale: la musica si ferma, tramonto su Roma, il cuore, "Qui è iniziato tutto."
  async finale() {
    Audio8.stopSong(1.2);
    const black = this.add.rectangle(0, 0, 480, 270, 0x1a1020, 0).setOrigin(0, 0).setScrollFactor(0).setDepth(1300);
    await this.tweenP({ targets: black, fillAlpha: 1, duration: 900 });
    this.ninja.destroy();
    const ov = this.add.container(0, 0).setScrollFactor(0).setDepth(1290);
    ov.add(this.add.image(0, 0, 'finaleBg').setOrigin(0, 0));
    const f = this.add.sprite(150, 240, 'francesca', DIR_ROW.right * 3).setOrigin(0.5, 1).setScale(3);
    const s = this.add.sprite(330, 240, 'simone', DIR_ROW.left * 3).setOrigin(0.5, 1).setScale(3);
    ov.add([f, s]);
    await this.tweenP({ targets: black, fillAlpha: 0, duration: 1200 });
    await this.wait(400);
    f.play('francesca-walk-right');
    s.play('simone-walk-left');
    f.anims.timeScale = 0.6;
    s.anims.timeScale = 0.6;
    this.tweens.add({ targets: f, x: 216, duration: 1900, ease: 'Sine.Out' });
    await this.tweenP({ targets: s, x: 264, duration: 1900, ease: 'Sine.Out' });
    f.anims.stop(); f.setFrame(DIR_ROW.right * 3);
    s.anims.stop(); s.setFrame(DIR_ROW.left * 3);
    await this.wait(500);
    const heart = this.add.image(240, 132, 'heartBig').setScale(0).setScrollFactor(0).setDepth(1295);
    [0, 1, 2, 3].forEach(i => this.time.delayedCall(i * 160, () => Audio8.tone(NOTE_FREQ[['C5', 'E5', 'G5', 'C6'][i]], 0.6, { type: 'triangle', vol: 0.18 })));
    await this.tweenP({ targets: heart, scale: 3, duration: 900, ease: 'Back.Out' });
    this.tweens.add({ targets: heart, scale: 3.3, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    for (let i = 0; i < 10; i++) {
      const sp = this.add.image(240 + (Math.random() - 0.5) * 120, 132 + (Math.random() - 0.5) * 70, 'sparkle')
        .setScrollFactor(0).setDepth(1296).setAlpha(0);
      this.tweens.add({ targets: sp, alpha: 1, duration: 400, yoyo: true, repeat: -1, delay: Math.random() * 1200 });
    }
    await this.wait(600);
    const t = addText(this, 240, 44, 'Qui è iniziato tutto.', { scale: 3, color: 0xfbf3e4, shadow: 0x3a2340, origin: [0.5, 0.5] })
      .setScrollFactor(0).setDepth(1297).setAlpha(0);
    await this.tweenP({ targets: t, alpha: 1, duration: 1500 });
    await this.wait(1500);
    await this.waitA();
    this.completeLevel(1);
  }
}
