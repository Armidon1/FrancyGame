// Strumenti per la pixel art generata in codice: griglie di caratteri -> canvas -> texture Phaser.

const PAL = {
  outline: '#2a1d1a',
  outlineSoft: '#4a3028',
  cream: '#fbf3e4',
  creamDark: '#e9d9bd',
  pink: '#f29bb0',
  pinkDark: '#d0607e',
  red: '#d9434f',
  redDark: '#9c2a3a',
  gold: '#f2c14e',
  goldDark: '#c08a2e',
  sky1: '#2e2350',
  sky2: '#5b3a74',
  sky3: '#a8507a',
  sky4: '#e8796b',
  sky5: '#f7b267',
  sky6: '#fde3a0',
  ice: '#cdeaf5',
  iceLight: '#e9f7fc',
  iceDark: '#a9d3e6',
  iceLine: '#b8dfee',
  wood: '#a0673c',
  woodDark: '#6e4426',
  woodLight: '#c88a52',
  white: '#ffffff',
};

const Pix = {
  canvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    return [c, ctx];
  },

  rect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  },

  px(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  },

  // Disegna una griglia di caratteri usando una palette { char: '#rrggbb' | null }
  grid(ctx, rows, pal, ox = 0, oy = 0, flip = false) {
    const w = rows[0].length;
    for (let y = 0; y < rows.length; y++) {
      const r = rows[y];
      for (let x = 0; x < r.length; x++) {
        const c = pal[r[x]];
        if (!c) continue;
        ctx.fillStyle = c;
        ctx.fillRect(ox + (flip ? w - 1 - x : x), oy + y, 1, 1);
      }
    }
  },

  gridCanvas(rows, pal) {
    const [c, ctx] = Pix.canvas(rows[0].length, rows.length);
    Pix.grid(ctx, rows, pal);
    return c;
  },

  // Cerchio pieno pixelato
  disc(ctx, cx, cy, r, color) {
    ctx.fillStyle = color;
    for (let y = -r; y <= r; y++) {
      const half = Math.floor(Math.sqrt(r * r - y * y + r * 0.8));
      ctx.fillRect(cx - half, cy + y, half * 2 + 1, 1);
    }
  },

  // Rettangolo con angoli smussati di 1px e contorno
  box(ctx, x, y, w, h, fill, line) {
    Pix.rect(ctx, x + 1, y, w - 2, h, line);
    Pix.rect(ctx, x, y + 1, w, h - 2, line);
    Pix.rect(ctx, x + 1, y + 1, w - 2, h - 2, fill);
  },

  // Generatore pseudo-casuale deterministico (così la grafica è sempre uguale)
  rng(seed) {
    let s = seed >>> 0 || 1;
    return () => {
      s ^= s << 13; s >>>= 0;
      s ^= s >> 17;
      s ^= s << 5; s >>>= 0;
      return (s % 100000) / 100000;
    };
  },

  addTexture(scene, key, canvas) {
    if (scene.textures.exists(key)) scene.textures.remove(key);
    scene.textures.addCanvas(key, canvas);
  },

  addSheet(scene, key, canvas, fw, fh) {
    if (scene.textures.exists(key)) scene.textures.remove(key);
    scene.textures.addSpriteSheet(key, canvas, { frameWidth: fw, frameHeight: fh });
  },
};

// ---------------------------------------------------------------------------
// Personaggi 16x22: stessi modelli di assets/sprite_source.py (Simone e Francesca),
// riusati con palette diverse e qualche ritocco per gli altri personaggi.

const CHAR_TEMPLATES = {
  boy: {
    down: [
      '......KKKK......',
      '....KKHHHHKK....',
      '...KHHhhHHHHK...',
      '..KHHHHHHhhHHK..',
      '..KHHhHHHHHHHK..',
      '..KHHHSSSSHHHK..',
      '..KHSSSSSSSSHK..',
      '..KSSSSSSSSSSK..',
      '..KSSESSSSESSK..',
      '..KsSSSSSSSSsK..',
      '...KSRSSSSRSK...',
      '...KSSSMMSSSK...',
      '....KSSSSSSK....',
      '...KAAaAAaAAK...',
      '..KCAAaAAaAACK..',
      '..KCCCAaCCCCCK..',
      '.KCCCCAaCCCCCCK.',
      '.KSCCCCcCCCCCSK.',
      '..KCCCCcCCCCCK..',
      '...KPPPKKPPPK...',
      '...KPPPK.KPPPK..',
      '...KOOOK.KOOOK..',
    ],
    up: [
      '......KKKK......',
      '....KKHHHHKK....',
      '...KHHhhHHHHK...',
      '..KHHHHHHhhHHK..',
      '..KHHhHHHHHHHK..',
      '..KHHHHHHHHHHK..',
      '..KHHHhHHHHHHK..',
      '..KHHHHHHHHHHK..',
      '..KHHHHhHHHHHK..',
      '..KsHHHHHHHHsK..',
      '...KHHHHHHHHK...',
      '...KsSSSSSSsK...',
      '....KSSSSSSK....',
      '...KAAaAAaAAK...',
      '..KCAAaAAaAACK..',
      '..KCCCCCCCCCCK..',
      '.KCCCCCcCCCCCCK.',
      '.KSCCCCcCCCCCSK.',
      '..KCCCCcCCCCCK..',
      '...KPPPKKPPPK...',
      '...KPPPK.KPPPK..',
      '...KOOOK.KOOOK..',
    ],
    left: [
      '......KKKK......',
      '....KKHHHHKK....',
      '...KHhhHHHHHK...',
      '..KHHHHHHhHHHK..',
      '..KHHHHHHHHhHK..',
      '..KSSHHHHHHHHK..',
      '.KSSSSSHHHHHHK..',
      '.KSSSSSSHHHHHK..',
      '.KSESSSSSHHHK...',
      '.KSSSSSSssHHK...',
      '..KSSSSSSsHK....',
      '..KMSSSSSSK.....',
      '...KSSSSSK......',
      '...KAAaAAAK.....',
      '..KCAAaAAACK....',
      '..KCCAaCCCCK....',
      '..KCCAaCCCCK....',
      '..KCSSCCCCCK....',
      '..KCCCcCCCCK....',
      '...KPPPPPPK.....',
      '...KPPKKPPK.....',
      '...KOOK.KOOK....',
    ],
  },
  girl: {
    down: [
      '......KKKK......',
      '....KKhHHhKK....',
      '...KHhHHHHhHK...',
      '..KHhHHddHHhHK..',
      '..KHHHdSSdHHHK..',
      '.KHHHSSSSSSHHHK.',
      '.KHhSSSSSSSShHK.',
      '.KHhSLLSSLLShHK.',
      '.KHhSESSSSESHhK.',
      '.KHHRSSSSSSRHHK.',
      '.KHhHSSrrSSHhHK.',
      '.KHhhKSSSSKhhHK.',
      '.KHhHKMMMMKHhHK.',
      'KHhHMMSYSSMMHhHK',
      'KHhMMMSSSSMMMhHK',
      'KHdMLMmMMmMMMdHK',
      '.KKMLMMMMMMMMKK.',
      '..KSLMMmmMMMSK..',
      '..KMMLMMMMMMMK..',
      '...KJJJKKJJJK...',
      '...KJJJK.KJJJK..',
      '...KOOOK.KOOOK..',
    ],
    up: [
      '......KKKK......',
      '....KKhHHhKK....',
      '...KHhHHHHhHK...',
      '..KHhHHHHHHhHK..',
      '..KHHHhHHhHHHK..',
      '.KHHhHHHHHHhHHK.',
      '.KHhHHHhHHHHhHK.',
      '.KHhHHHHHHhHhHK.',
      '.KHHhHHhHHHHHHK.',
      '.KHhHHHHhHHhHHK.',
      '.KHhHhHHHHhHhHK.',
      '.KHHhHHHhHHHhHK.',
      '.KHhHHhHHHhHHHK.',
      '.KMHhHHHHHHhHMK.',
      '.KMMHdHHhHHdHMMK',
      '.KMMMdHdHHdHdMMK',
      '.KKMMMMMMMMLMKK.',
      '..KSMMmmMMMLSK..',
      '..KMMMMMMMLMMK..',
      '...KJJJKKJJJK...',
      '...KJJJK.KJJJK..',
      '...KOOOK.KOOOK..',
    ],
    left: [
      '......KKKK......',
      '....KKhHHhKK....',
      '...KHhhHHHHhK...',
      '..KHhHHHHhHHHK..',
      '..KhHHHHHHhHHK..',
      '..KSSHHHHHHhHHK.',
      '.KSSSSSHHHHhHHK.',
      '.KSLLSSShHHHhHK.',
      '.KSESSSShHHhHHK.',
      '.KRSSSSShHHHhHK.',
      '..KrSSSHhHHhHHK.',
      '..KSSSKhHHhHHHK.',
      '...KKMKHhHHhHHK.',
      '...KMMMKhHHHhHK.',
      '..KMMMMMKhHhHdK.',
      '..KMSSMMMKdHdK..',
      '..KMSSMMMMKKK...',
      '..KMMMmMMMMK....',
      '..KMMMMMMMMK....',
      '...KJJJJJJK.....',
      '...KJJKKJJK.....',
      '...KOOK.KOOK....',
    ],
  },
};

// Gambe dei passi (porting della funzione legs() dello script Python)
function charLegs(rows, d, f) {
  rows = rows.slice();
  if (f === 0) return rows;
  const P = rows[rows.length - 3].includes('J') ? 'J' : 'P';
  let nw;
  if (d === 'down' || d === 'up') {
    nw = f === 1
      ? ['...KPPPKKPPPK...', '...KPPPK.KOOOK..', '...KOOOK........']
      : ['...KPPPKKPPPK...', '...KOOOK.KPPPK..', '........KOOOK...'];
  } else {
    nw = f === 1
      ? ['...KPPPPPPK.....', '..KPPK.KPPK.....', '..KOOK..KOOK....']
      : ['...KPPPPPPK.....', '....KPPPPK......', '....KOOOOK......'];
  }
  return rows.slice(0, -3).concat(nw.map(r => r.replaceAll('P', P)));
}

// Applica modifiche riga per riga: patch = { direzione: { indiceRiga: 'stringa' } }
function patchRows(rows, patch) {
  if (!patch) return rows;
  const out = rows.slice();
  for (const k of Object.keys(patch)) out[+k] = patch[k];
  return out;
}

// Crea un foglio 48x88 (3 colonne x 4 righe: giù, sinistra, destra, su)
function buildCharSheet(template, pal, patches = {}) {
  const [c, ctx] = Pix.canvas(48, 88);
  const order = ['down', 'left', 'right', 'up'];
  order.forEach((d, ri) => {
    const srcDir = d === 'right' ? 'left' : d;
    const base = patchRows(template[srcDir], patches[srcDir]);
    base.forEach((row, i) => { if (row.length !== 16) console.warn('riga sprite lunga', row.length, srcDir, i, row); });
    for (let f = 0; f < 3; f++) {
      const g = charLegs(base, srcDir, f);
      Pix.grid(ctx, g, pal, f * 16, ri * 22, d === 'right');
    }
  });
  return c;
}

// Palette di base: K contorno, H/h capelli, S/s pelle, E occhi, R guance, M bocca/maglia ...
function boyPal(o) {
  return Object.assign({
    '.': null, K: '#2a1d1a', H: '#4a2e22', h: '#6e4832', S: '#f1c6a0', s: '#d6a07c',
    E: '#2a1d1a', R: '#eaa08c', M: '#96504a', A: '#c94f4f', a: '#9c3a3a',
    C: '#c94f4f', c: '#9c3a3a', P: '#3b3b52', O: '#46302a', W: '#ffffff', L: '#2a1d1a',
  }, o);
}

function girlPal(o) {
  return Object.assign({
    '.': null, K: '#3a241e', H: '#7a4a2e', h: '#a86a40', d: '#5a341e', S: '#f8d4ba',
    s: '#e2b296', E: '#3a5a8a', R: '#f09696', M: '#e88aa0', m: '#c96a84', Y: '#f2c14e',
    L: '#1e1e24', J: '#5a6a9a', j: '#4e628e', O: '#3c302c', W: '#ffffff', r: '#c46268',
  }, o);
}
