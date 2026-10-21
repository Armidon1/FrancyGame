// Font pixel art fatto a mano (con lettere accentate italiane), registrato come BitmapFont di Phaser.
// Ogni glifo: righe separate da spazi, '#' = pixel acceso. Altezza cella 10px:
// riga 0 = spazio per accenti sulle maiuscole, righe 1-7 = corpo, righe 8-9 = discendenti.
// Il glifo parte dalla riga 1, tranne quelli con prefisso '^' che partono dalla riga 0.

const FONT_KEY = 'pixel';
const FONT_H = 10;
const FONT_LINE = 12;

const GLYPHS = {
  A: '.###. #...# #...# ##### #...# #...# #...#',
  B: '####. #...# #...# ####. #...# #...# ####.',
  C: '.###. #...# #.... #.... #.... #...# .###.',
  D: '####. #...# #...# #...# #...# #...# ####.',
  E: '##### #.... #.... ####. #.... #.... #####',
  F: '##### #.... #.... ####. #.... #.... #....',
  G: '.###. #...# #.... #.### #...# #...# .####',
  H: '#...# #...# #...# ##### #...# #...# #...#',
  I: '### .#. .#. .#. .#. .#. ###',
  J: '..### ...#. ...#. ...#. #..#. #..#. .##..',
  K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#',
  L: '#.... #.... #.... #.... #.... #.... #####',
  M: '#...# ##.## #.#.# #.#.# #...# #...# #...#',
  N: '#...# ##..# #.#.# #.#.# #..## #...# #...#',
  O: '.###. #...# #...# #...# #...# #...# .###.',
  P: '####. #...# #...# ####. #.... #.... #....',
  Q: '.###. #...# #...# #...# #.#.# #..#. .##.#',
  R: '####. #...# #...# ####. #.#.. #..#. #...#',
  S: '.###. #...# #.... .###. ....# #...# .###.',
  T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..',
  U: '#...# #...# #...# #...# #...# #...# .###.',
  V: '#...# #...# #...# #...# #...# .#.#. ..#..',
  W: '#...# #...# #...# #.#.# #.#.# ##.## #...#',
  X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
  Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..',
  Z: '##### ....# ...#. ..#.. .#... #.... #####',
  'È': '^..#.. ##### #.... #.... ####. #.... #.... #####',

  a: '..... ..... .###. ....# .#### #...# .####',
  b: '#.... #.... ####. #...# #...# #...# ####.',
  c: '.... .... .### #... #... #... .###',
  d: '....# ....# .#### #...# #...# #...# .####',
  e: '..... ..... .###. #...# ##### #.... .###.',
  f: '..## .#.. ###. .#.. .#.. .#.. .#..',
  g: '..... ..... .#### #...# #...# .#### ....# ....# .###.',
  h: '#.... #.... ####. #...# #...# #...# #...#',
  i: '# . # # # # #',
  j: '..# ... ..# ..# ..# ..# ..# ..# ##.',
  k: '#... #... #..# #.#. ##.. #.#. #..#',
  l: '#. #. #. #. #. #. .#',
  m: '..... ..... ####. #.#.# #.#.# #.#.# #.#.#',
  n: '..... ..... ####. #...# #...# #...# #...#',
  o: '..... ..... .###. #...# #...# #...# .###.',
  p: '..... ..... ####. #...# #...# #...# ####. #.... #....',
  q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
  r: '.... .... #.## ##.. #... #... #...',
  s: '.... .... .### #... .##. ...# ###.',
  t: '.#.. .#.. ###. .#.. .#.. .#.. ..##',
  u: '..... ..... #...# #...# #...# #...# .####',
  v: '..... ..... #...# #...# #...# .#.#. ..#..',
  w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
  x: '..... ..... #...# .#.#. ..#.. .#.#. #...#',
  y: '..... ..... #...# #...# #...# #...# .#### ....# .###.',
  z: '..... ..... ##### ...#. ..#.. .#... #####',

  'à': '^.#... ..#.. ..... .###. ....# .#### #...# .####',
  'è': '^.#... ..#.. ..... .###. #...# ##### #.... .###.',
  'é': '^...#. ..#.. ..... .###. #...# ##### #.... .###.',
  'ì': '^#. .# .. .# .# .# .# .#',
  'ò': '^.#... ..#.. ..... .###. #...# #...# #...# .###.',
  'ù': '^.#... ..#.. ..... #...# #...# #...# #...# .####',

  0: '.###. #...# #..## #.#.# ##..# #...# .###.',
  1: '.#. ##. .#. .#. .#. .#. ###',
  2: '.###. #...# ....# ...#. ..#.. .#... #####',
  3: '.###. #...# ....# ..##. ....# #...# .###.',
  4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.',
  5: '##### #.... ####. ....# ....# #...# .###.',
  6: '.###. #.... #.... ####. #...# #...# .###.',
  7: '##### ....# ...#. ..#.. .#... .#... .#...',
  8: '.###. #...# #...# .###. #...# #...# .###.',
  9: '.###. #...# #...# .#### ....# ....# .###.',

  ' ': '... ... ... ... ... ... ...',
  '.': '. . . . . . #',
  ',': '.. .. .. .. .. .. .# #.',
  '!': '# # # # # . #',
  '?': '.###. #...# ....# ...#. ..#.. ..... ..#..',
  "'": '# # . . . . .',
  '"': '#.# #.# ... ... ... ... ...',
  ':': '. . . # . . #',
  ';': '.. .. .. .# .. .. .# #.',
  '-': '... ... ... ### ... ... ...',
  '–': '..... ..... ..... ##### ..... ..... .....',
  '…': '..... ..... ..... ..... ..... ..... #.#.#',
  '(': '.# #. #. #. #. #. .#',
  ')': '#. .# .# .# .# .# #.',
  '/': '....# ...#. ...#. ..#.. .#... .#... #....',
  '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....',
  '=': '.... .... #### .... #### .... ....',
  '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##',
  '£': '..##. .#..# .#... ###.. .#... .#... #####',
  '*': '..... #.#.# .###. ##### .###. #.#.# .....',
  '°': '.#. #.# .#. ... ... ... ...',
  '♥': '....... .##.##. ####### ####### .#####. ..###.. ...#...',
  '♪': '..##. ..#.# ..#.. ..#.. ###.. ###.. .....',
  '▼': '..... ..... ..... ##### .###. ..#.. .....',
  '►': '#... ##.. ###. #### ###. ##.. #...',
  // Icone (caratteri dell'area privata Unicode, vedi FONT_ICONS)
  '\uE000': '#.#.# ..... .###. ##### .#### .###. .##..', // passi
  '\uE001': '.#...#. ####### ##.#.## ####### ##...## .#####. .#...#.', // orsetto
  '\uE002': '..#.#.. .#.#... ....... ######. #####.# ######. .####..', // caffè
  '\uE003': '..#.... .###... ####### #####.# #####.. .###...', // teiera
};

// Sostituzioni per testi con emoji: le trasformiamo in icone del font
const FONT_ICONS = {
  '👣': '', '🧸': '', '☕': '', '🫖': '',
  '’': "'", '‘': "'", '“': '"', '”': '"', '—': '–', 'É': 'È',
};

function fontText(str) {
  let out = '';
  for (const ch of str) out += FONT_ICONS[ch] !== undefined ? FONT_ICONS[ch] : ch;
  return out;
}

function parseGlyph(spec) {
  let top = 1;
  if (spec[0] === '^') { top = 0; spec = spec.slice(1); }
  const rows = spec.split(' ');
  return { rows, top, w: rows[0].length };
}

const FontMetrics = {
  widths: {},
  advance(ch) {
    const w = this.widths[ch];
    return w === undefined ? 4 : w + 1;
  },
  measure(str) {
    let w = 0;
    for (const ch of str) w += this.advance(ch);
    return Math.max(0, w - 1);
  },
  // A capo sulle parole, restituisce un array di righe
  wrap(str, maxW) {
    const lines = [];
    for (const para of str.split('\n')) {
      let line = '';
      for (const word of para.split(' ')) {
        const test = line ? line + ' ' + word : word;
        if (this.measure(test) <= maxW || !line) line = test;
        else { lines.push(line); line = word; }
      }
      lines.push(line);
    }
    return lines;
  },
};

function buildPixelFont(scene) {
  const entries = Object.entries(GLYPHS).map(([ch, spec]) => [String(ch), parseGlyph(spec)]);
  const pad = 1;
  const cols = 16;
  const cellW = 8 + pad;
  const cellH = FONT_H + pad;
  const rowsN = Math.ceil(entries.length / cols);
  const [canvas, ctx] = Pix.canvas(cols * cellW, rowsN * cellH);
  let xml = `<?xml version="1.0"?><font><info face="${FONT_KEY}" size="${FONT_H}"/>` +
    `<common lineHeight="${FONT_LINE}" base="8" scaleW="${canvas.width}" scaleH="${canvas.height}"/><chars>`;
  entries.forEach(([ch, g], i) => {
    const cx = (i % cols) * cellW;
    const cy = Math.floor(i / cols) * cellH;
    g.rows.forEach((r, y) => {
      for (let x = 0; x < r.length; x++) if (r[x] === '#') Pix.px(ctx, cx + x, cy + g.top + y, '#ffffff');
    });
    FontMetrics.widths[ch] = g.w;
    xml += `<char id="${ch.charCodeAt(0)}" x="${cx}" y="${cy}" width="${g.w}" height="${FONT_H}" ` +
      `xoffset="0" yoffset="0" xadvance="${g.w + 1}"/>`;
  });
  xml += '</chars></font>';

  Pix.addTexture(scene, FONT_KEY, canvas);
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  const frame = scene.textures.getFrame(FONT_KEY);
  const data = Phaser.GameObjects.BitmapText.ParseXMLBitmapFont(doc, frame, 0, 0, scene.textures.get(FONT_KEY));
  scene.cache.bitmapFont.add(FONT_KEY, { data, texture: FONT_KEY, frame: null });
}

// Testo pixel con ombra opzionale. scale: 1, 2, 3 ...
// Con l'ombra restituisce un Container (testo + copia scura sotto) con setText/setLineSpacing/setTint.
// (setDropShadow di Phaser 4 disegna l'ombra sopra il testo, per questo la facciamo a mano)
// Con un'origine diversa da (0,0) il testo viene messo in un Container e spostato di un numero
// intero di pixel: a mezzo pixel il campionamento NEAREST perde una colonna dei glifi.
function addText(scene, x, y, str, opts = {}) {
  const scale = opts.scale || 1;
  const make = (px, py) => scene.add.bitmapText(px, py, FONT_KEY, fontText(str), FONT_H * scale, opts.align || 0);
  let obj;
  if (opts.shadow !== undefined || opts.origin) {
    const [ox, oy] = opts.origin || [0, 0];
    const parts = [];
    const sh = opts.shadow !== undefined ? make(0, 0).setTint(opts.shadow) : null;
    const tx = make(0, 0);
    if (sh) parts.push(sh);
    parts.push(tx);
    if (opts.color !== undefined) tx.setTint(opts.color);
    obj = scene.add.container(Math.round(x), Math.round(y), parts);
    const layout = () => {
      const lx = -Math.round(tx.width * ox);
      const ly = -Math.round(tx.height * oy);
      tx.setPosition(lx, ly);
      if (sh) sh.setPosition(lx + scale, ly + scale);
    };
    layout();
    obj.setText = (s) => { tx.setText(fontText(s)); if (sh) sh.setText(fontText(s)); layout(); return obj; };
    obj.setLineSpacing = (v) => { tx.setLineSpacing(v); if (sh) sh.setLineSpacing(v); layout(); return obj; };
    obj.setTint = (c) => { tx.setTint(c); return obj; };
  } else {
    obj = make(Math.round(x), Math.round(y));
    if (opts.color !== undefined) obj.setTint(opts.color);
    const raw = obj.setText;
    obj.setText = (s) => raw.call(obj, fontText(s));
  }
  if (opts.fixed) obj.setScrollFactor(0);
  if (opts.depth !== undefined) obj.setDepth(opts.depth);
  return obj;
}

// Scrive testo direttamente su un canvas (per insegne disegnate nella mappa)
function drawGlyphText(ctx, str, x, y, color, scale = 1) {
  let cx = x;
  for (const ch of fontText(str)) {
    const spec = GLYPHS[ch];
    if (!spec) { cx += 4 * scale; continue; }
    const g = parseGlyph(spec);
    ctx.fillStyle = color;
    g.rows.forEach((r, ry) => {
      for (let rx = 0; rx < r.length; rx++) {
        if (r[rx] === '#') ctx.fillRect(cx + rx * scale, y + (g.top + ry) * scale, scale, scale);
      }
    });
    cx += (g.w + 1) * scale;
  }
  return cx - x;
}

function glyphTextWidth(str, scale = 1) {
  let w = 0;
  for (const ch of fontText(str)) {
    const spec = GLYPHS[ch];
    w += ((spec ? parseGlyph(spec).w : 3) + 1) * scale;
  }
  return w - scale;
}
