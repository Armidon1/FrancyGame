// Livello 3 — Londra, 40.000 passi.
// Una lunga passeggiata da Kensington a Harrods, St James's Park, Buckingham Palace, Big Ben,
// il caffè da 6 sterline, il Tamigi e finalmente la casa degli zii. Simone segue Francesca.

// Legenda: ~ cielo  H edifici  D porta  s marciapiede  r strada (attraversabile)  u giardini in basso  g prato  p vialetto
// w acqua  T albero  L lampione  B cabina telefonica  M cassetta postale  b panchina  c tavolino
// P cancellata  q ponte (marciapiede)  x ponte (strada)  f ringhiera
// Interni: # buio  Z muro  F pavimento  C tappeto  S scaffale  A bancone  o divano  h camino  y tavolino  e uscita
const L3_MAP = [
  '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~wwwwwwwwww~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', // 0
  '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~wwwwwwwwww~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', // 1
  'HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHgTgggggggggTggggTgggggHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHwwwwwwwwwwHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH', // 2
  'HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHggggTgwwwwwwwwwgggggggHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHwwwwwwwwwwHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH', // 3
  'HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHggggggwwwwwwwwwggggTggHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHwwwwwwwwwwHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH', // 4
  'HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHTgggggwwwwwwwwwgggggggPPPPPPPPPPPPPPPPPPPPPPHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHwwwwwwwwwwHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH', // 5
  'HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHDDHHHHHHHHppppppppppppppppppppppssssssssssssssssssssssHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHwwwwwwwwwwHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHDHHHHHHH', // 6
  'fssssssBsssssssMssssssssssssssssssssssssssssgggpggbgggggbgggggpgggssssssssssssssssssssssssssssssssssssssBsssssssssssssqqqqqqqqqqsssssssssssssssMsssssssssssssssssssBsssssssssssH', // 7
  'fsssssssssssssssssssssssssssssssssssssssssssggTpggggTggggTggggpgTgsssssssssssssssssssssssscssscsssssssssssssssssssssssqqqqqqqqqqsssssssssssssssssssssssssssssssssssssssssssssssH', // 8
  'fsssssssssssssssssssssssssssssssssssssssssssgggpggggggggggggggpgggssssssssssssssssssssssssssssssssssssssssssssssssssssqqqqqqqqqqsssssssssssssssssssssssssssssssssssssssssssssssH', // 9
  'fsssLssssssTssssssLsssssTsssssLssssssssLssssLssssssssLsssssssssssLsssLssssssTsssssssLssssssssssssLsssLsssssTsssLssssssqqqqqqqqqqsssLsssssTssssssssLsssssTssssssLssssssssssssTssH', // 10
  'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrxxxxxxxxxxrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr', // 11
  'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrxxxxxxxxxxrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr', // 12
  'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrxxxxxxxxxxrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr', // 13
  'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrxxxxxxxxxxrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr', // 14
  'fssLssssssLssssssssssssssssssssLssssssLssssssLssssssLssssssLssssssLssssssLssssssLssssssLssssssLssssssLssssssLssssssLsswwwwwwwwwwssssssssssssssssssssssLssssssLssssssLssssssLsssf', // 15
  'fssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssswwwwwwwwwwsssssssssssssssssssssssssssssssssssssssssssssssf', // 16
  'fssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssswwwwwwwwwwsssssssssssssssssssssssssssssssssssssssssssssssf', // 17
  'uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuwwwwwwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu', // 18
  '################################################################################################################################################################################', // 19
  '##ZZZZZZZZZZZZZZZ#####ZZZZZZZZZZZZZZZ###########################################################################################################################################', // 20
  '##ZZZZZZZZZZZZZZZ#####ZZZZZZZZZZZZZZZ###########################################################################################################################################', // 21
  '##ZSSSSSAAASSSSSZ#####ZFFFFFhhhFFFFFZ###########################################################################################################################################', // 22
  '##ZFFFFFFFFFFFFFZ#####ZFooFFFFFFFooFZ###########################################################################################################################################', // 23
  '##ZFFFFFFFFFFFFFZ#####ZFooCCCCCCCooFZ###########################################################################################################################################', // 24
  '##ZFSSSFFFFFSSSFZ#####ZFFFCCyyyCCFFFZ###########################################################################################################################################', // 25
  '##ZFSSSFFFFFSSSFZ#####ZFFFCCCCCCCFFFZ###########################################################################################################################################', // 26
  '##ZFFFFFFFFFFFFFZ#####ZFFFCCCCCCCFFFZ###########################################################################################################################################', // 27
  '##ZFFFFFFFFFFFFFZ#####ZFFFFFFFFFFFFFZ###########################################################################################################################################', // 28
  '##ZZZZZZZeZZZZZZZ#####ZZZZZZZeZZZZZZZ###########################################################################################################################################', // 29
  '################################################################################################################################################################################', // 30
];

const L3_WALK = 'sgpqFCerx';
const L3_W = 176;
const L3_OUT_ROWS = 19;
const L3_GOAL = 40000;

const L3_ITEMS = {
  teddy: { name: "l'orsetto di Londra 🧸", icon: 'itemTeddy' },
  coffee: { name: 'il caffè da 6 sterline ☕ (un botto)', icon: 'itemCoffee' },
  tea: { name: 'il tè alla cannella di zia Dorota 🫖', icon: 'itemTea' },
};

// Mappa stilizzata di Londra: punti e tratti (coordinate dello schermo 480x270)
const LONDON_PTS = {
  start: [44, 108], harrods: [112, 146], buck: [205, 150], bigben: [282, 170], bar: [258, 160], zii: [372, 224],
};
const LONDON_LEGS = [
  [[44, 108], [58, 124], [76, 118], [88, 136], [100, 132], [112, 146]],
  [[112, 146], [126, 122], [146, 104], [168, 108], [186, 126], [205, 150], [228, 146], [246, 154], [258, 160]],
  [[258, 160], [282, 170], [292, 186], [304, 198], [326, 206], [348, 214], [372, 224]],
];

// ---------------------------------------------------------------------------
// Grafica

function drawL3Tile(ctx, ch, c, r, rnd) {
  const x = c * TILE;
  const y = r * TILE;
  const R = (n) => Math.floor(rnd() * n);
  const speck = (n, col, w = 1, h = 1) => { for (let i = 0; i < n; i++) Pix.rect(ctx, x + R(16), y + R(16), w, h, col); };
  const at = (dc, dr) => ((L3_MAP[r + dr] || '')[c + dc]) || '';
  const harrodsRoom = c < 20;
  switch (ch) {
    case 's': case 'v': case 'q': {
      Pix.rect(ctx, x, y, 16, 16, ch === 'q' ? '#d0c8b0' : '#cfc8bc');
      Pix.rect(ctx, x, y + 7, 16, 1, '#b8b0a4');
      Pix.rect(ctx, x, y + 15, 16, 1, '#b8b0a4');
      Pix.rect(ctx, x + ((r % 2) ? 4 : 12), y, 1, 7, '#b8b0a4');
      Pix.rect(ctx, x + ((r % 2) ? 12 : 4), y + 8, 1, 7, '#b8b0a4');
      speck(5, '#c0b8ac');
      speck(3, '#ddd6ca');
      break;
    }
    case 'r': case 'x': {
      Pix.rect(ctx, x, y, 16, 16, '#4a4a52');
      speck(14, '#545460');
      speck(6, '#404048');
      break;
    }
    case 'g': {
      Pix.rect(ctx, x, y, 16, 16, '#6aa84f');
      speck(10, '#5a9442');
      speck(6, '#84c068', 1, 2);
      if (rnd() < 0.15) Pix.px(ctx, x + R(16), y + R(16), ['#ffffff', '#ffd84a', '#f7a6bb'][R(3)]);
      break;
    }
    case 'p': {
      Pix.rect(ctx, x, y, 16, 16, '#d8c8a0');
      speck(10, '#c8b48a');
      speck(5, '#e8dcb8');
      break;
    }
    case 'w': {
      Pix.rect(ctx, x, y, 16, 16, '#5a7a98');
      speck(6, '#4a6a88', 3, 1);
      for (let i = 0; i < 2; i++) Pix.rect(ctx, x + R(12), y + R(16), 4, 1, '#8aa8c4');
      break;
    }
    case 'u': {
      Pix.rect(ctx, x, y, 16, 16, '#6aa84f');
      speck(10, '#5a9442');
      break;
    }
    case 'f': {
      Pix.rect(ctx, x, y, 16, 16, '#cfc8bc');
      for (let k = 1; k < 16; k += 3) Pix.rect(ctx, x + 6, y + k, 4, 2, '#1e1e26');
      Pix.rect(ctx, x + 7, y, 2, 16, '#1e1e26');
      break;
    }
    case '#': Pix.rect(ctx, x, y, 16, 16, '#0e0a12'); break;
    case 'F': case 'e': {
      if (harrodsRoom) {
        Pix.rect(ctx, x, y, 16, 16, '#e8dcc8');
        Pix.rect(ctx, x, y, 8, 8, '#d8c8b0');
        Pix.rect(ctx, x + 8, y + 8, 8, 8, '#d8c8b0');
        Pix.px(ctx, x + 7, y + 7, '#c8a050');
      } else {
        Pix.rect(ctx, x, y, 16, 16, '#a8784a');
        for (let k = 3; k < 16; k += 4) Pix.rect(ctx, x, y + k, 16, 1, '#8a5a34');
        Pix.rect(ctx, x + ((r * 5) % 16), y, 1, 16, '#8a5a34');
      }
      if (ch === 'e') {
        Pix.rect(ctx, x, y, 16, 16, '#0e0a12');
        Pix.rect(ctx, x + 1, y, 14, 10, '#8a5a3a');
        Pix.rect(ctx, x + 2, y + 1, 12, 8, '#a8703e');
        for (let k = 3; k < 13; k += 2) Pix.rect(ctx, x + k, y + 2, 1, 6, '#8a5a3a');
      }
      break;
    }
    case 'C': {
      Pix.rect(ctx, x, y, 16, 16, '#a8404a');
      if ((c + r) % 2) Pix.rect(ctx, x + 6, y + 6, 4, 4, '#c8a050');
      else Pix.rect(ctx, x + 7, y + 3, 2, 10, '#8a2a34');
      if (at(0, -1) !== 'C' && at(0, -1) !== 'y') Pix.rect(ctx, x, y, 16, 2, '#c8a050');
      if (at(0, 1) !== 'C' && at(0, 1) !== 'y') Pix.rect(ctx, x, y + 14, 16, 2, '#c8a050');
      if (at(-1, 0) !== 'C' && at(-1, 0) !== 'y') Pix.rect(ctx, x, y, 2, 16, '#c8a050');
      if (at(1, 0) !== 'C' && at(1, 0) !== 'y') Pix.rect(ctx, x + 14, y, 2, 16, '#c8a050');
      break;
    }
    case 'Z': {
      const top = r === 20 || r === 21;
      if (top && c !== 2 && c !== 16 && c !== 22 && c !== 36) {
        if (harrodsRoom) {
          Pix.rect(ctx, x, y, 16, 16, r === 20 ? '#2f5a4a' : '#5a3a28');
          if (r === 20) { Pix.rect(ctx, x + 7, y + 2, 2, 12, '#3f6a5a'); Pix.rect(ctx, x, y + 15, 16, 1, '#c8a050'); }
          else { Pix.rect(ctx, x, y, 16, 1, '#c8a050'); Pix.rect(ctx, x + 2, y + 3, 12, 10, '#6a4a34'); }
        } else {
          Pix.rect(ctx, x, y, 16, 16, '#e8d8c0');
          for (let k = 0; k < 4; k++) Pix.px(ctx, x + 3 + (k % 2) * 8, y + 3 + Math.floor(k / 2) * 8 + (r % 2), '#e89aa8');
          if (r === 21) Pix.rect(ctx, x, y + 12, 16, 4, '#8a5a34');
        }
      } else {
        Pix.rect(ctx, x, y, 16, 16, '#3a2418');
        Pix.rect(ctx, x + 1, y + 1, 14, 14, '#4a3020');
      }
      break;
    }
    case 'S': { // scaffale con orsetti
      Pix.rect(ctx, x, y, 16, 16, '#5a3a28');
      Pix.rect(ctx, x, y + 7, 16, 2, '#3a2418');
      Pix.rect(ctx, x, y + 15, 16, 1, '#3a2418');
      for (const sy of [1, 9]) {
        for (const sx of [2, 9]) {
          const fur = ['#a8703e', '#c8945a', '#f0e0c8', '#8a5a34'][R(4)];
          Pix.rect(ctx, x + sx, y + sy + 1, 5, 5, fur);
          Pix.px(ctx, x + sx, y + sy, fur); Pix.px(ctx, x + sx + 4, y + sy, fur);
          Pix.px(ctx, x + sx + 1, y + sy + 2, '#2a1d1a'); Pix.px(ctx, x + sx + 3, y + sy + 2, '#2a1d1a');
          if (rnd() < 0.4) Pix.rect(ctx, x + sx + 1, y + sy + 4, 3, 1, '#d9434f');
        }
      }
      break;
    }
    case 'A': {
      Pix.rect(ctx, x, y, 16, 16, '#6a4a34');
      Pix.rect(ctx, x, y, 16, 3, '#c8a050');
      Pix.rect(ctx, x, y + 3, 16, 1, '#3a2418');
      if (c === 10) { Pix.rect(ctx, x + 4, y + 4, 8, 6, '#c8a050'); Pix.rect(ctx, x + 5, y + 5, 6, 2, '#2a1d1a'); }
      break;
    }
    case 'o': { // divano a fiori
      Pix.rect(ctx, x, y, 16, 16, '#a8784a');
      Pix.box(ctx, x, y + 1, 16, 15, '#d88a9a', '#8a3a4a');
      Pix.rect(ctx, x + 2, y + 2, 12, 5, '#c87080');
      Pix.px(ctx, x + 4, y + 10, '#ffffff'); Pix.px(ctx, x + 11, y + 12, '#ffffff'); Pix.px(ctx, x + 8, y + 8, '#f2c14e');
      break;
    }
    case 'h': { // camino
      Pix.rect(ctx, x, y, 16, 16, '#b8604a');
      Pix.rect(ctx, x, y, 16, 3, '#e8d8c0');
      for (let k = 6; k < 16; k += 4) Pix.rect(ctx, x, y + k, 16, 1, '#8a4434');
      if (c === 29) { Pix.rect(ctx, x + 2, y + 5, 12, 11, '#2a1d1a'); }
      break;
    }
    case 'y': { // tavolino da tè
      Pix.rect(ctx, x, y, 16, 16, '#a8404a');
      Pix.rect(ctx, x, y + 3, 16, 10, '#6a4028');
      Pix.rect(ctx, x, y + 3, 16, 2, '#8a5a34');
      if (c === 29) {
        Pix.rect(ctx, x + 4, y + 4, 8, 6, '#f4f0e8'); Pix.rect(ctx, x + 12, y + 6, 2, 2, '#f4f0e8');
        Pix.rect(ctx, x + 2, y + 6, 2, 1, '#f4f0e8'); Pix.px(ctx, x + 7, y + 6, '#4f8fcf'); Pix.px(ctx, x + 9, y + 7, '#e8506a');
      } else {
        Pix.rect(ctx, x + 5, y + 6, 5, 4, '#f4f0e8'); Pix.rect(ctx, x + 6, y + 7, 3, 2, '#a8703e');
      }
      break;
    }
    default: break;
  }
}

// Casa vittoriana a schiera (3 tile di larghezza, righe 2-6)
function drawTerraceHouse(ctx, x, rnd, brick) {
  const y0 = 32;
  const wall = brick ? '#b8604a' : '#f2ece0';
  const wallS = brick ? '#9a4a38' : '#d8d0c0';
  Pix.rect(ctx, x, y0, 48, 12, '#5a6070');
  for (let k = 2; k < 12; k += 3) Pix.rect(ctx, x, y0 + k, 48, 1, '#4a5060');
  const chx = x + 6 + Math.floor(rnd() * 30);
  Pix.rect(ctx, chx, y0 - 9, 9, 12, '#a85a44');
  Pix.rect(ctx, chx, y0 - 9, 9, 1, '#c8785a');
  Pix.rect(ctx, chx + 1, y0 - 12, 2, 3, '#c87a54');
  Pix.rect(ctx, chx + 5, y0 - 12, 2, 3, '#c87a54');
  Pix.rect(ctx, x, y0 + 12, 48, 68, wall);
  if (brick) for (let yy = y0 + 14; yy < y0 + 80; yy += 3) Pix.rect(ctx, x, yy, 48, 1, wallS);
  Pix.rect(ctx, x, y0 + 12, 48, 3, '#e8e0d0');
  Pix.rect(ctx, x, y0 + 15, 48, 1, '#a8a090');
  Pix.rect(ctx, x + 47, y0 + 12, 1, 68, wallS);
  const win = (wx, wy, h) => {
    Pix.rect(ctx, wx, wy, 11, h, '#ffffff');
    Pix.rect(ctx, wx + 1, wy + 1, 9, h - 2, '#4a5a78');
    Pix.rect(ctx, wx + 1, wy + Math.floor(h / 2), 9, 1, '#ffffff');
    Pix.rect(ctx, wx + 2, wy + 2, 2, 2, '#8aa0c0');
    Pix.rect(ctx, wx - 1, wy + h, 13, 2, '#e8e0d0');
  };
  win(x + 7, y0 + 20, 15);
  win(x + 29, y0 + 20, 15);
  win(x + 29, y0 + 46, 17);
  const doorCol = ['#1e1e2a', '#c8323a', '#2f4f86', '#2f6a4a', '#f2c14e'][Math.floor(rnd() * 5)];
  Pix.rect(ctx, x + 4, y0 + 44, 18, 36, '#e8e0d0');
  Pix.rect(ctx, x + 7, y0 + 54, 12, 24, doorCol);
  Pix.rect(ctx, x + 8, y0 + 48, 10, 5, '#8aa0c0');
  Pix.rect(ctx, x + 8, y0 + 48, 10, 1, '#ffffff');
  Pix.px(ctx, x + 16, y0 + 66, '#f2c14e');
  Pix.rect(ctx, x + 5, y0 + 44, 2, 34, '#ffffff');
  Pix.rect(ctx, x + 19, y0 + 44, 2, 34, '#ffffff');
  Pix.rect(ctx, x + 3, y0 + 77, 20, 3, '#bdb6aa');
  // ringhiera davanti alla finestra del piano terra
  Pix.rect(ctx, x + 25, y0 + 70, 20, 1, '#1e1e26');
  for (let k = 0; k < 20; k += 3) Pix.rect(ctx, x + 25 + k, y0 + 70, 1, 10, '#1e1e26');
  if (rnd() < 0.5) for (let k = 0; k < 5; k++) Pix.px(ctx, x + 9 + k * 2, y0 + 35, rnd() < 0.5 ? '#e8506a' : '#f2c14e');
}

function drawGenericBuilding(ctx, x0, w, col) {
  const y0 = 32;
  Pix.rect(ctx, x0, y0, w, 80, col);
  Pix.rect(ctx, x0, y0, w, 4, '#8a8a90');
  for (let wx = x0 + 6; wx + 10 < x0 + w; wx += 16) {
    for (let wy = y0 + 12; wy < y0 + 70; wy += 22) {
      Pix.rect(ctx, wx, wy, 9, 13, '#ffffff');
      Pix.rect(ctx, wx + 1, wy + 1, 7, 11, '#4a5a78');
    }
  }
}

// Sfondo delle sfide a Londra: cielo grigio-azzurro, tetti, Big Ben e il prato del parco.
function buildLondonBattleBg(scene) {
  const [c, ctx] = Pix.canvas(480, 270);
  ditherGradient(ctx, 0, 0, 480, 176, ['#9fb4d4', '#c4d2e6', '#e6e2da']);
  for (const [x, y, r] of [[70, 40, 14], [92, 36, 18], [116, 42, 12], [330, 58, 12], [350, 52, 16], [372, 60, 11]]) Pix.disc(ctx, x, y, r, '#f4f2ee');
  const rnd = Pix.rng(5);
  let x = 0;
  while (x < 480) {
    const w = 22 + Math.floor(rnd() * 30), top = 128 + Math.floor(rnd() * 30);
    Pix.rect(ctx, x, top, w, 172 - top, rnd() < 0.5 ? '#a8a4b4' : '#9a96a8');
    for (let wy = top + 5; wy < 166; wy += 9) for (let wx = x + 4; wx < x + w - 4; wx += 7) Pix.rect(ctx, wx, wy, 3, 4, '#c8c4d0');
    x += w;
  }
  const ben = scene.textures.get('bigBen').getSourceImage();
  ctx.drawImage(ben, 412 - ben.width, 172 - ben.height * 2, ben.width * 2, ben.height * 2);
  // ringhiera nera e prato
  Pix.rect(ctx, 0, 164, 480, 2, '#1e1a1e');
  for (let fx = 2; fx < 480; fx += 6) Pix.rect(ctx, fx, 160, 2, 12, '#1e1a1e');
  Pix.rect(ctx, 0, 172, 480, 98, '#7ab85a');
  for (let y = 172; y < 270; y += 14) Pix.rect(ctx, 0, y + 7, 480, 7, '#6eac50');
  for (let i = 0; i < 260; i++) Pix.px(ctx, Math.floor(rnd() * 480), 172 + Math.floor(rnd() * 98), rnd() < 0.5 ? '#5e9a42' : '#8ccc6a');
  Pix.addTexture(scene, 'londonBattleBg', c);
}

function buildLondonArt(scene) {
  if (scene.textures.exists('london')) return;
  const W = L3_W * TILE;
  const H = L3_MAP.length * TILE;
  const [c, ctx] = Pix.canvas(W, H);
  const rnd = Pix.rng(2210);

  // cielo pomeridiano
  ditherGradient(ctx, 0, 0, W, 40, ['#8fa8c8', '#b0bed4', '#d8c8c8', '#ecd2b8']);
  for (let i = 0; i < 26; i++) {
    const cx = Math.floor(rnd() * W);
    const cy = 4 + Math.floor(rnd() * 16);
    for (let k = 0; k < 4; k++) Pix.disc(ctx, cx + k * 6, cy + (k % 2), 4, '#f4ecec');
    Pix.rect(ctx, cx - 3, cy + 3, 26, 2, '#dcd0d8');
  }

  for (let r = 0; r < L3_MAP.length; r++) {
    for (let col = 0; col < L3_W; col++) {
      let ch = L3_MAP[r][col];
      if ('TLBMbc'.includes(ch)) ch = r <= 9 && col >= 44 && col <= 65 ? 'g' : 's';
      if (ch === 'D' || ch === 'H' || ch === '~' || ch === 'P') continue;
      drawL3Tile(ctx, ch, col, r, rnd);
    }
  }

  // Strada: marciapiedi, doppie linee gialle, mezzeria, strisce pedonali
  const roadY = 11 * TILE;
  Pix.rect(ctx, 0, roadY, W, 2, '#e8e2d8');
  Pix.rect(ctx, 0, roadY + 4, W, 1, '#f2c14e');
  Pix.rect(ctx, 0, roadY + 6, W, 1, '#f2c14e');
  Pix.rect(ctx, 0, roadY + 62, W, 2, '#e8e2d8');
  Pix.rect(ctx, 0, roadY + 57, W, 1, '#f2c14e');
  Pix.rect(ctx, 0, roadY + 59, W, 1, '#f2c14e');
  for (let x = 0; x < W; x += 18) Pix.rect(ctx, x, roadY + 31, 10, 2, '#e8e8e8');
  for (const zx of [20 * TILE, 140 * TILE]) {
    for (let k = 0; k < 64; k += 8) Pix.rect(ctx, zx, roadY + k + 2, 28, 5, '#f0f0f0');
  }
  // marciapiede: bordo verso la strada
  Pix.rect(ctx, 0, roadY - 2, W, 2, '#a8a094');

  // "LOOK RIGHT" dipinto vicino alle strisce, come a Londra (per chi scende dal marciapiede)
  for (const zx of [20 * TILE, 140 * TILE]) {
    const tw = glyphTextWidth('LOOK RIGHT');
    for (const [x, y] of [[zx - tw - 6, roadY + 9], [zx + 34, roadY + 9], [zx - tw - 6, roadY + 48], [zx + 34, roadY + 48]]) {
      drawGlyphText(ctx, 'LOOK RIGHT', x, y, '#e8e2d0');
    }
  }
  // marciapiede in basso: bordo verso la strada
  Pix.rect(ctx, 0, 15 * TILE, W, 2, '#a8a094');

  // fascia bassa: ringhiere, siepi e aiuole oltre il marciapiede largo
  const lowY = 18 * TILE;
  for (let x = 0; x < W; x += 16) {
    const colI = Math.floor(x / 16);
    if (colI >= 118 && colI <= 129) continue;
    const park = colI >= 44 && colI <= 87;
    if (!park) {
      Pix.rect(ctx, x, lowY + 2, 16, 1, '#1e1e26');
      for (let k = 0; k < 16; k += 3) Pix.rect(ctx, x + k, lowY, 1, 8, '#1e1e26');
    }
    if (rnd() < (park ? 0.7 : 0.5)) { Pix.disc(ctx, x + 8, lowY + 13, 6, park ? '#2f5a34' : '#3f7a3a'); Pix.rect(ctx, x + 4, lowY + 9, 6, 1, '#56944a'); }
    if (rnd() < 0.3) for (let k = 0; k < 4; k++) Pix.px(ctx, x + 3 + k * 3, lowY + 12, ['#e8506a', '#f2c14e', '#ffffff'][k % 3]);
  }

  // --- Edifici ---
  // Kensington
  Pix.rect(ctx, 0, 32, 16, 80, '#d8d0c0');
  for (let col = 1; col + 2 <= 27; col += 3) drawTerraceHouse(ctx, col * TILE, rnd, false);

  // Harrods
  {
    const x0 = 28 * TILE, w = 14 * TILE, y0 = 32;
    Pix.rect(ctx, x0, y0, w, 80, '#c8784e');
    for (let yy = y0 + 4; yy < y0 + 80; yy += 4) Pix.rect(ctx, x0, yy, w, 1, '#b86a42');
    Pix.rect(ctx, x0, y0, w, 4, '#e8a878');
    // torre centrale con cupola
    const cx = x0 + w / 2;
    Pix.rect(ctx, cx - 18, y0 - 14, 36, 16, '#c8784e');
    Pix.rect(ctx, cx - 18, y0 - 14, 36, 2, '#e8a878');
    for (let yy = 0; yy <= 10; yy++) {
      const half = Math.round(Math.sqrt(1 - (yy / 11) ** 2) * 12);
      Pix.rect(ctx, cx - half, y0 - 14 - yy, half * 2, 1, yy < 3 ? '#4f7a5a' : '#5a8a6a');
    }
    Pix.rect(ctx, cx - 1, y0 - 30, 2, 6, '#f2c14e');
    // finestre ad arco
    for (let wx = x0 + 8; wx < x0 + w - 10; wx += 14) {
      for (const wy of [y0 + 26, y0 + 46]) {
        Pix.rect(ctx, wx, wy, 8, 12, '#f4e0c0');
        Pix.rect(ctx, wx + 1, wy + 1, 6, 11, '#3a4a5a');
        Pix.rect(ctx, wx + 1, wy, 6, 1, '#e8a878');
      }
    }
    // insegna
    Pix.rect(ctx, x0 + 40, y0 + 6, w - 80, 16, '#24523a');
    Pix.rect(ctx, x0 + 40, y0 + 6, w - 80, 1, '#f2c14e');
    Pix.rect(ctx, x0 + 40, y0 + 21, w - 80, 1, '#f2c14e');
    const tw = glyphTextWidth('HARRODS', 2);
    drawGlyphText(ctx, 'HARRODS', Math.round(cx - tw / 2), y0 + 4, '#f2c14e', 1.5 > 1 ? 2 : 1);
    // tende verdi
    for (let ax = x0; ax < x0 + w; ax += 16) {
      if (ax >= 33 * TILE && ax < 37 * TILE) continue;
      Pix.rect(ctx, ax + 1, y0 + 62, 14, 6, '#2f6a4a');
      for (let k = 0; k < 14; k += 4) Pix.rect(ctx, ax + 1 + k, y0 + 62, 2, 6, '#f4f0e0');
      Pix.rect(ctx, ax + 1, y0 + 68, 14, 1, '#1e4a32');
    }
    // vetrine
    for (let ax = x0 + 4; ax < x0 + w - 8; ax += 32) {
      if (ax >= 33 * TILE - 8 && ax < 37 * TILE) continue;
      Pix.rect(ctx, ax, y0 + 70, 24, 10, '#f4e0c0');
      Pix.rect(ctx, ax + 1, y0 + 71, 22, 9, '#5a6a7a');
      Pix.rect(ctx, ax + 4, y0 + 75, 4, 5, '#c8945a');
      Pix.rect(ctx, ax + 14, y0 + 74, 5, 6, '#f2c14e');
    }
    // porta d'ingresso
    const dx = 34 * TILE;
    Pix.rect(ctx, dx - 4, y0 + 52, 40, 28, '#f2c14e');
    Pix.rect(ctx, dx - 2, y0 + 54, 36, 26, '#2a3a3a');
    Pix.rect(ctx, dx + 15, y0 + 54, 2, 26, '#f2c14e');
    Pix.rect(ctx, dx, y0 + 56, 4, 2, '#8aa0b0');
    Pix.rect(ctx, dx + 20, y0 + 56, 4, 2, '#8aa0b0');
  }

  drawGenericBuilding(ctx, 42 * TILE, 32, '#a8604a');

  // Buckingham Palace
  {
    const x0 = 66 * TILE, w = 22 * TILE, y0 = 32;
    Pix.rect(ctx, x0, y0 - 6, w, 54, '#e8e0cc');
    Pix.rect(ctx, x0, y0 - 6, w, 3, '#f8f2e4');
    for (let bx = x0; bx < x0 + w; bx += 4) Pix.rect(ctx, bx, y0 - 10, 2, 4, '#e8e0cc');
    Pix.rect(ctx, x0, y0 - 10, w, 1, '#f8f2e4');
    for (let wx = x0 + 6; wx < x0 + w - 6; wx += 10) {
      for (const wy of [y0 + 2, y0 + 18, y0 + 32]) {
        Pix.rect(ctx, wx, wy, 5, 9, '#4a4a5a');
        Pix.rect(ctx, wx - 1, wy - 1, 7, 1, '#c8bea8');
      }
    }
    const cx = x0 + w / 2;
    Pix.rect(ctx, cx - 44, y0 - 14, 88, 62, '#efe8d6');
    Pix.rect(ctx, cx - 40, y0 - 20, 80, 6, '#e8e0cc');
    for (let k = -36; k <= 36; k += 12) Pix.rect(ctx, cx + k, y0 - 4, 4, 50, '#f8f2e4');
    Pix.rect(ctx, cx - 30, y0 + 14, 60, 4, '#c8323a');
    Pix.rect(ctx, cx - 30, y0 + 18, 60, 2, '#9c2a2a');
    // pennone e bandiera
    Pix.rect(ctx, cx, 2, 1, y0 - 22, '#5a5a60');
    Pix.rect(ctx, cx + 1, 3, 14, 9, '#2f4f86');
    Pix.rect(ctx, cx + 1, 7, 14, 1, '#ffffff');
    Pix.rect(ctx, cx + 7, 3, 1, 9, '#ffffff');
    Pix.rect(ctx, cx + 1, 7, 14, 1, '#c8323a');
    Pix.rect(ctx, cx + 7, 3, 1, 9, '#c8323a');
    // cancellata
    const fy = 5 * TILE;
    Pix.rect(ctx, x0, fy, w, 16, '#cfc8bc');
    Pix.rect(ctx, x0, fy + 3, w, 1, '#1e1e26');
    Pix.rect(ctx, x0, fy + 12, w, 1, '#1e1e26');
    for (let bx = x0; bx < x0 + w; bx += 3) {
      Pix.rect(ctx, bx, fy + 1, 1, 14, '#1e1e26');
      Pix.px(ctx, bx, fy, '#f2c14e');
    }
    for (const gx of [cx - 20, cx + 4]) {
      Pix.rect(ctx, gx, fy - 2, 16, 18, '#1e1e26');
      Pix.rect(ctx, gx + 2, fy, 12, 14, '#c8a050');
      Pix.rect(ctx, gx + 4, fy + 2, 8, 10, '#1e1e26');
      Pix.disc(ctx, gx + 8, fy + 7, 2, '#f2c14e');
    }
    // garitte delle guardie
    for (const gc of [71, 81]) {
      const gx = gc * TILE;
      Pix.rect(ctx, gx, 6 * TILE - 12, 16, 26, '#1e1e26');
      Pix.rect(ctx, gx + 2, 6 * TILE - 8, 12, 22, '#3a3a46');
      Pix.rect(ctx, gx - 1, 6 * TILE - 14, 18, 3, '#2a2a36');
    }
  }

  // Bar "Pret a Caso"
  drawGenericBuilding(ctx, 88 * TILE, 32, '#c8b090');
  {
    // portoncino con gradino (dove Francesca si siede)
    const gx = 88 * TILE + 3;
    Pix.rect(ctx, gx, 32 + 52, 14, 26, '#e8e0d0');
    Pix.rect(ctx, gx + 2, 32 + 56, 10, 22, '#2f4f86');
    Pix.px(ctx, gx + 10, 32 + 68, '#f2c14e');
    Pix.rect(ctx, gx - 3, 32 + 77, 20, 3, '#bdb6aa');
    Pix.rect(ctx, gx - 3, 32 + 77, 20, 1, '#d8d2c6');
  }
  drawGenericBuilding(ctx, 96 * TILE, 32, '#b8604a');
  {
    const x0 = 90 * TILE, w = 6 * TILE, y0 = 32;
    Pix.rect(ctx, x0, y0, w, 80, '#b8604a');
    for (let yy = y0 + 2; yy < y0 + 30; yy += 3) Pix.rect(ctx, x0, yy, w, 1, '#9a4a38');
    for (let wx = x0 + 10; wx < x0 + w - 10; wx += 26) { Pix.rect(ctx, wx, y0 + 6, 12, 16, '#ffffff'); Pix.rect(ctx, wx + 1, y0 + 7, 10, 14, '#4a5a78'); }
    Pix.rect(ctx, x0, y0 + 30, w, 50, '#2f5a4a');
    Pix.rect(ctx, x0 + 4, y0 + 32, w - 8, 12, '#f4ecd8');
    const tw = glyphTextWidth('PRET A CASO');
    drawGlyphText(ctx, 'PRET A CASO', Math.round(x0 + w / 2 - tw / 2), y0 + 32, '#2f5a4a');
    for (let k = 0; k < w; k += 8) {
      Pix.rect(ctx, x0 + k, y0 + 46, 8, 7, (k / 8) % 2 ? '#f4ecd8' : '#c8323a');
      Pix.rect(ctx, x0 + k + 1, y0 + 53, 6, 1, (k / 8) % 2 ? '#f4ecd8' : '#c8323a');
    }
    Pix.rect(ctx, x0 + 4, y0 + 56, 26, 22, '#e8d8b8');
    Pix.rect(ctx, x0 + 5, y0 + 57, 24, 20, '#5a6a7a');
    for (let k = 0; k < 3; k++) { Pix.rect(ctx, x0 + 8 + k * 7, y0 + 70, 4, 4, '#ffffff'); Pix.rect(ctx, x0 + 9 + k * 7, y0 + 71, 2, 1, '#7a4a2a'); }
    Pix.rect(ctx, x0 + 66, y0 + 56, 26, 22, '#e8d8b8');
    Pix.rect(ctx, x0 + 67, y0 + 57, 24, 20, '#5a6a7a');
    // bancone esterno dove sta il barista
    Pix.rect(ctx, 92 * TILE - 2, y0 + 54, 20, 26, '#1e3a30');
    Pix.rect(ctx, 92 * TILE, y0 + 56, 16, 20, '#3a2a20');
    Pix.rect(ctx, 92 * TILE - 2, y0 + 74, 20, 4, '#c8a050');
  }
  // tavolini fuori
  for (const tc of [90, 94]) {
    const tx = tc * TILE, ty = 8 * TILE;
    Pix.rect(ctx, tx - 2, ty + 6, 3, 6, '#2f5a4a');
    Pix.rect(ctx, tx + 15, ty + 6, 3, 6, '#2f5a4a');
    Pix.disc(ctx, tx + 8, ty + 7, 6, '#2a2a2a');
    Pix.disc(ctx, tx + 8, ty + 7, 5, '#f4f0e8');
    Pix.rect(ctx, tx + 6, ty + 5, 3, 3, '#ffffff');
    Pix.px(ctx, tx + 7, ty + 6, '#7a4a2a');
  }

  // Parlamento
  {
    const x0 = 98 * TILE, w = 20 * TILE, y0 = 32;
    Pix.rect(ctx, x0, y0, w, 80, '#d8b878');
    Pix.rect(ctx, x0, y0, w, 6, '#6a7a6a');
    for (let px = x0 + 2; px < x0 + w; px += 12) {
      Pix.rect(ctx, px, y0 - 8, 3, 10, '#d8b878');
      Pix.px(ctx, px + 1, y0 - 10, '#d8b878');
      Pix.px(ctx, px + 1, y0 - 9, '#d8b878');
      Pix.rect(ctx, px + 2, y0 - 8, 1, 10, '#b89858');
    }
    for (let wx = x0 + 6; wx < x0 + w - 6; wx += 12) {
      Pix.rect(ctx, wx - 3, y0 + 6, 1, 74, '#c8a868');
      for (const wy of [y0 + 12, y0 + 36, y0 + 58]) {
        Pix.rect(ctx, wx, wy, 5, 16, '#4a4a5a');
        Pix.px(ctx, wx + 2, wy - 1, '#4a4a5a');
        Pix.rect(ctx, wx, wy + 8, 5, 1, '#b89858');
      }
    }
    Pix.rect(ctx, x0, y0 + 78, w, 2, '#b89858');
  }

  // Tamigi: argini e parapetti del ponte
  {
    const x0 = 118 * TILE, x1 = 128 * TILE;
    Pix.rect(ctx, x0, 0, 3, 7 * TILE, '#b8a888');
    Pix.rect(ctx, x1 - 3, 0, 3, 7 * TILE, '#b8a888');
    Pix.rect(ctx, x0, 15 * TILE, 3, 4 * TILE, '#b8a888');
    Pix.rect(ctx, x1 - 3, 15 * TILE, 3, 4 * TILE, '#b8a888');
    for (const py of [7 * TILE - 2, 15 * TILE - 2]) {
      Pix.rect(ctx, x0, py, x1 - x0, 4, '#3f7a5a');
      Pix.rect(ctx, x0, py, x1 - x0, 1, '#6aa888');
      for (let k = x0; k < x1; k += 4) Pix.rect(ctx, k, py - 4, 1, 4, '#3f7a5a');
      Pix.rect(ctx, x0, py - 5, x1 - x0, 1, '#3f7a5a');
    }
    // archi del ponte sotto
    for (let k = x0 + 8; k < x1; k += 40) {
      Pix.rect(ctx, k, 15 * TILE + 2, 24, 3, '#2a4a68');
    }
  }

  // Sud di Londra: case di mattoni e la casa degli zii
  for (let col = 128; col + 2 <= 163; col += 3) drawTerraceHouse(ctx, col * TILE, rnd, true);
  drawGenericBuilding(ctx, 164 * TILE, 32, '#c8b090');
  for (let col = 171; col + 2 <= 174; col += 3) drawTerraceHouse(ctx, col * TILE, rnd, true);
  drawGenericBuilding(ctx, 174 * TILE, 32, '#a8604a');
  {
    const x0 = 166 * TILE, w = 5 * TILE, y0 = 32;
    Pix.rect(ctx, x0, y0, w, 12, '#5a6070');
    for (let k = 2; k < 12; k += 3) Pix.rect(ctx, x0, y0 + k, w, 1, '#4a5060');
    Pix.rect(ctx, x0 + 10, y0 - 10, 10, 12, '#a85a44');
    Pix.rect(ctx, x0 + 58, y0 - 10, 10, 12, '#a85a44');
    Pix.rect(ctx, x0, y0 + 12, w, 68, '#c86a50');
    for (let yy = y0 + 14; yy < y0 + 80; yy += 3) Pix.rect(ctx, x0, yy, w, 1, '#a85440');
    Pix.rect(ctx, x0, y0 + 12, w, 3, '#e8e0d0');
    for (const wx of [x0 + 8, x0 + 58]) {
      for (const wy of [y0 + 20, y0 + 46]) {
        Pix.rect(ctx, wx, wy, 14, 16, '#ffffff');
        Pix.rect(ctx, wx + 1, wy + 1, 12, 14, '#ffd88a');
        Pix.rect(ctx, wx + 1, wy + 8, 12, 1, '#ffffff');
        Pix.rect(ctx, wx + 7, wy + 1, 1, 14, '#ffffff');
        Pix.rect(ctx, wx - 1, wy + 16, 16, 3, '#6a4028');
        for (let k = 0; k < 5; k++) Pix.px(ctx, wx + 1 + k * 3, wy + 15, ['#e8506a', '#f2c14e', '#f7a6bb'][k % 3]);
      }
    }
    const dx = 168 * TILE;
    Pix.rect(ctx, dx - 2, y0 + 44, 20, 36, '#e8e0d0');
    Pix.rect(ctx, dx + 1, y0 + 54, 14, 24, '#2f5fa6');
    Pix.rect(ctx, dx + 2, y0 + 55, 12, 1, '#5a8ad0');
    Pix.rect(ctx, dx + 2, y0 + 48, 12, 5, '#ffd88a');
    Pix.px(ctx, dx + 12, y0 + 66, '#f2c14e');
    drawGlyphText(ctx, '22', dx + 4, y0 + 56, '#f2c14e');
    Pix.rect(ctx, dx - 4, y0 + 77, 24, 3, '#bdb6aa');
  }

  Pix.addTexture(scene, 'london', c);

  // --- Oggetti alti ---
  {
    const [l, lc] = Pix.canvas(10, 38);
    Pix.rect(lc, 4, 10, 2, 26, '#1e1e26');
    Pix.rect(lc, 3, 34, 4, 4, '#1e1e26');
    Pix.rect(lc, 2, 20, 6, 1, '#1e1e26');
    Pix.rect(lc, 1, 3, 8, 8, '#1e1e26');
    Pix.rect(lc, 2, 4, 6, 6, '#ffe8a8');
    Pix.rect(lc, 4, 0, 2, 3, '#1e1e26');
    Pix.addTexture(scene, 'lampLondon', l);
  }
  {
    const [t, tc] = Pix.canvas(30, 38);
    Pix.rect(tc, 13, 22, 4, 16, '#7a6a5a');
    Pix.rect(tc, 13, 24, 2, 3, '#a89a88');
    Pix.disc(tc, 15, 13, 13, '#2f5a34');
    Pix.disc(tc, 15, 12, 12, '#4a8a44');
    Pix.disc(tc, 12, 9, 7, '#62a456');
    Pix.disc(tc, 20, 15, 4, '#3f7a3a');
    Pix.addTexture(scene, 'planeTree', t);
  }
  Pix.addTexture(scene, 'phoneBox', Pix.gridCanvas([
    '...KKKKKKKK...',
    '..KRRRRRRRRK..',
    '..KRWWWWWWRK..',
    '..KRRRRRRRRK..',
    '..KRGGRRGGRK..',
    '..KRGgRRGgRK..',
    '..KRGGRRGGRK..',
    '..KRRRRRRRRK..',
    '..KRGGRRGGRK..',
    '..KRGgRRGgRK..',
    '..KRGGRRGGRK..',
    '..KRRRRRRRRK..',
    '..KRGGRRGGRK..',
    '..KRGgRRGgRK..',
    '..KRGGRRGGRK..',
    '..KRRRRRRRRK..',
    '..KRGGRRGGRK..',
    '..KRGgRRGgRK..',
    '..KRGGRRGGRK..',
    '..KRRRRRRRRK..',
    '..KrrrrrrrrK..',
    '..KrrrrrrrrK..',
    '..KKKKKKKKKK..',
  ], { '.': null, K: '#2a1d1a', R: '#d9323a', r: '#a8222a', G: '#8ab0c8', g: '#c8e0f0', W: '#ffffff' }));
  Pix.addTexture(scene, 'postBox', Pix.gridCanvas([
    '..KKKKKK..',
    '.KRRRRRRK.',
    'KRRWRRRRrK',
    'KKKKKKKKKK',
    '.KRRRRRrK.',
    '.KKKKKKKK.',
    '.KRRRRRrK.',
    '.KRYYRRrK.',
    '.KRRRRRrK.',
    '.KRRRRRrK.',
    '.KRRRRRrK.',
    '.KRRRRRrK.',
    '.KRRRRRrK.',
    'KKKKKKKKKK',
    'KrrrrrrrrK',
    'KKKKKKKKKK',
  ].map(r => r.padEnd(10, '.')), { '.': null, K: '#2a1d1a', R: '#d9323a', r: '#a8222a', W: '#ffffff', Y: '#f2c14e' }));
  {
    // Big Ben
    const [b, bc] = Pix.canvas(48, 116);
    const S = '#d8b878', s2 = '#b89858', D = '#6a7a6a';
    Pix.rect(bc, 10, 44, 28, 72, S);
    for (let yy = 50; yy < 116; yy += 8) { Pix.rect(bc, 14, yy, 3, 6, '#4a4a5a'); Pix.rect(bc, 31, yy, 3, 6, '#4a4a5a'); }
    Pix.rect(bc, 22, 44, 1, 72, s2);
    Pix.rect(bc, 36, 44, 2, 72, s2);
    Pix.rect(bc, 7, 26, 34, 20, S);
    Pix.rect(bc, 7, 26, 34, 2, '#e8d098');
    Pix.disc(bc, 24, 36, 8, '#c8a050');
    Pix.disc(bc, 24, 36, 7, '#f8f4e8');
    Pix.rect(bc, 24, 30, 1, 6, '#1e1e26');
    Pix.rect(bc, 24, 36, 4, 1, '#1e1e26');
    for (let k = 0; k < 12; k++) {
      const a = k / 12 * Math.PI * 2;
      Pix.px(bc, Math.round(24 + Math.cos(a) * 6), Math.round(36 + Math.sin(a) * 6), '#8a7a5a');
    }
    Pix.rect(bc, 9, 16, 30, 10, S);
    for (let k = 12; k < 36; k += 6) Pix.rect(bc, k, 18, 3, 7, '#4a4a5a');
    for (let yy = 0; yy < 16; yy++) {
      const half = Math.round(15 - yy * 0.9);
      Pix.rect(bc, 24 - half, 15 - yy, half * 2, 1, yy % 4 === 0 ? '#c8a050' : D);
    }
    Pix.rect(bc, 23, 0, 2, 2, '#f2c14e');
    Pix.rect(bc, 5, 44, 38, 3, '#e8d098');
    Pix.addTexture(scene, 'bigBen', b);
  }
  // Veicoli (di profilo, rivolti a destra)
  {
    const [b, bc] = Pix.canvas(60, 36);
    Pix.box(bc, 0, 0, 60, 32, '#d9323a', '#2a1d1a');
    Pix.rect(bc, 1, 1, 58, 2, '#ef5a60');
    Pix.rect(bc, 1, 24, 58, 6, '#a8222a');
    for (let k = 4; k < 50; k += 9) { Pix.rect(bc, k, 5, 7, 7, '#3a4a5a'); Pix.rect(bc, k + 1, 6, 2, 2, '#8aa0b8'); }
    for (let k = 4; k < 44; k += 9) { Pix.rect(bc, k, 15, 7, 7, '#3a4a5a'); Pix.rect(bc, k + 1, 16, 2, 2, '#8aa0b8'); }
    Pix.rect(bc, 52, 4, 6, 8, '#1e1e1e');
    drawGlyphText(bc, '22', 52, 3, '#f2c14e');
    Pix.rect(bc, 48, 14, 10, 14, '#3a4a5a');
    Pix.rect(bc, 50, 15, 3, 3, '#8aa0b8');
    Pix.rect(bc, 57, 25, 3, 2, '#ffe8a8');
    for (const wx of [12, 47]) { Pix.disc(bc, wx, 31, 4, '#1e1e1e'); Pix.disc(bc, wx, 31, 1, '#8a8a8a'); }
    Pix.addTexture(scene, 'bus', b);
    const [t, tc] = Pix.canvas(34, 20);
    Pix.rect(tc, 2, 7, 30, 9, '#1e1e26');
    Pix.rect(tc, 7, 2, 18, 7, '#1e1e26');
    Pix.rect(tc, 9, 3, 6, 4, '#5a6a7a');
    Pix.rect(tc, 17, 3, 6, 4, '#5a6a7a');
    Pix.rect(tc, 13, 0, 6, 2, '#f2c14e');
    Pix.rect(tc, 2, 9, 30, 1, '#3a3a46');
    Pix.rect(tc, 30, 10, 2, 2, '#ffe8a8');
    for (const wx of [8, 26]) { Pix.disc(tc, wx, 16, 3, '#101010'); Pix.px(tc, wx, 16, '#8a8a8a'); }
    Pix.addTexture(scene, 'taxi', t);
  }
  // Icone degli oggetti (12x12)
  Pix.addTexture(scene, 'itemTeddy', Pix.gridCanvas([
    '.KK....KK...',
    'KbbK..KbbK..',
    'KbBKKKKBbK..',
    '.KBBBBBBK...',
    '.KBEBBEBK...',
    '.KBBnnBBK...',
    '..KBBBBK....',
    '.KRRRRRRK...',
    'KBKBBBBKBK..',
    'KBKBbbBKBK..',
    '.KKBBBBKK...',
    '..KK..KK....',
  ], { '.': null, K: '#2a1d1a', B: '#a8703e', b: '#d8a070', E: '#2a1d1a', n: '#5a3a28', R: '#d9434f' }));
  Pix.addTexture(scene, 'itemCoffee', Pix.gridCanvas([
    '...w..w.....',
    '..w..w......',
    '...w..w.....',
    '............',
    'KKKKKKKKK...',
    'KWccccccWKK.',
    'KWWWWWWWWKWK',
    'KWWWWWWWWKWK',
    '.KWWWWWWKKK.',
    '..KWWWWK....',
    'KKKKKKKKKKK.',
    '.KKKKKKKKK..',
  ], { '.': null, K: '#2a1d1a', W: '#ffffff', c: '#7a4a2a', w: '#c8c8d0' }));
  Pix.addTexture(scene, 'itemTea', Pix.gridCanvas([
    '....KK......',
    '...KWWK.....',
    '.KKKKKKKK...',
    'KWWWWWWWWK.K',
    'KWpWWWpWWKKW',
    'KWWWWWWWWWWK',
    'KWWpWWWpWWK.',
    'KWWWWWWWWK..',
    'KWpWWWpWWK..',
    '.KWWWWWWK...',
    '..KKKKKK....',
    '............',
  ], { '.': null, K: '#2a1d1a', W: '#f4f0e8', p: '#e8506a' }));
  // il sigaro Capitol trovato davanti al Big Ben
  Pix.addTexture(scene, 'itemCigar', Pix.gridCanvas([
    '............',
    '............',
    '............',
    '............',
    '.KKKKKKKKKK.',
    'KbBBYYrYBBBK',
    'KBBbYrYYBbBK',
    'KbBBYYYYBBbK',
    '.KKKKKKKKKK.',
    '............',
    '............',
    '............',
  ], { '.': null, K: '#2a1d1a', B: '#7a4a2a', b: '#5e3820', Y: '#f2c14e', r: '#c8323a' }));
  Pix.addSheet(scene, 'pigeon', Pix.gridCanvas([
    '...KK....' + '.........',
    '..KGGK...' + 'KK.....KK',
    '..KGEKY..' + 'KGK...KGK',
    '.KGGGK...' + '.KGKKKGK.',
    'KGGgGGK..' + '..KGGEKY.',
    'KGGGGGK..' + '...KGGK..',
    '.KKYKK...' + '....KK...',
  ], { '.': null, K: '#2a2a32', G: '#8a8a9a', g: '#5a8a7a', E: '#e8a03a', Y: '#d8783a' }), 9, 7);
  Pix.addTexture(scene, 'arrow', Pix.gridCanvas([
    'KK.......',
    'KRKK.....',
    'KRRRKK...',
    'KRRRRRKK.',
    'KRRRRRRRK',
    'KRRRRRKK.',
    'KRRRKK...',
    'KRKK.....',
    'KK.......',
  ], { '.': null, K: '#2a1d1a', R: '#f2c14e' }));
  {
    const [r, rc] = Pix.canvas(2, 7);
    Pix.rect(rc, 0, 0, 1, 7, 'rgba(200,220,255,0.7)');
    Pix.rect(rc, 1, 0, 1, 3, 'rgba(200,220,255,0.4)');
    Pix.addTexture(scene, 'rain', r);
  }
  Pix.addTexture(scene, 'swan', Pix.gridCanvas([
    '...KK.....',
    '..KWWK....',
    '..KEWOO...',
    '...KWK....',
    '...KWK....',
    'K..KWK....',
    'KWKWWWKK..',
    'KWWWWWWWK.',
    '.KWWWWWWWK',
    '..KKKKKKK.',
  ], { '.': null, K: '#2a1d1a', W: '#f8f6f0', E: '#2a1d1a', O: '#f2783a' }));
  // scoiattolo grigio con la coda folta (2 fotogrammi: fermo / salto)
  const squirrelRows = [[
    '.KK.....',
    'KTTK.KK.',
    'KTTTKGGK',
    'KTTKGgGK',
    '.KTKGGEK',
    '.KTKGGK.',
    '..KGGGK.',
    '..KKKKK.',
  ], [
    'KK......',
    'KTK..KK.',
    'KTTKKGGK',
    'KTTKGgGK',
    '.KTKGGEK',
    '..KGGGK.',
    '.KGK.KGK',
    '.KK...KK',
  ]];
  const sqPal = { '.': null, K: '#2a1d1a', T: '#9a8a7a', G: '#8a7a6a', g: '#c8b8a8', E: '#2a1d1a' };
  {
    const [sq, sqc] = Pix.canvas(16, 8);
    Pix.grid(sqc, squirrelRows[0], sqPal, 0, 0);
    Pix.grid(sqc, squirrelRows[1], sqPal, 8, 0);
    Pix.addSheet(scene, 'squirrel', sq, 8, 8);
  }

  // Mappa di Londra vista dall'alto
  {
    const [m, mc] = Pix.canvas(480, 270);
    ditherGradient(mc, 0, 0, 480, 270, ['#f2e4c4', '#ead8b0', '#e4cfa4']);
    const r2 = Pix.rng(5);
    for (let i = 0; i < 70; i++) {
      const sx = Math.floor(r2() * 480), sy = Math.floor(r2() * 270);
      const len = 20 + Math.floor(r2() * 60);
      if (r2() < 0.5) Pix.rect(mc, sx, sy, len, 1, '#d8c498'); else Pix.rect(mc, sx, sy, 1, len, '#d8c498');
    }
    const park = (x, y, w, h) => { Pix.box(mc, x, y, w, h, '#a8c880', '#7a9a5a'); for (let i = 0; i < w * h / 40; i++) Pix.px(mc, x + 2 + Math.floor(r2() * (w - 4)), y + 2 + Math.floor(r2() * (h - 4)), '#7aa860'); };
    park(120, 82, 66, 40);
    Pix.rect(mc, 136, 100, 26, 4, '#7aa8c8');
    park(196, 134, 46, 18);
    park(228, 26, 60, 34);
    // il Tamigi
    const river = [[0, 176], [60, 190], [120, 182], [180, 196], [240, 194], [286, 182], [300, 196], [330, 190], [380, 168], [430, 160], [480, 172]];
    for (let i = 0; i < river.length - 1; i++) {
      const [ax, ay] = river[i], [bx, by] = river[i + 1];
      const n = Math.ceil(Math.hypot(bx - ax, by - ay));
      for (let k = 0; k <= n; k++) {
        const t = k / n;
        const px = ax + (bx - ax) * t, py = ay + (by - ay) * t;
        Pix.disc(mc, Math.round(px), Math.round(py), 7, '#5a8ab8');
      }
    }
    for (let i = 0; i < river.length - 1; i++) {
      const [ax, ay] = river[i], [bx, by] = river[i + 1];
      for (let k = 0; k < 1; k += 0.08) Pix.rect(mc, Math.round(ax + (bx - ax) * k), Math.round(ay + (by - ay) * k) - 2, 3, 1, '#8ab4d8');
    }
    Pix.rect(mc, 288, 178, 3, 22, '#c8b48a');
    // icone dei luoghi
    const icon = (x, y, rows, pal) => Pix.grid(mc, rows, pal, x - Math.floor(rows[0].length / 2), y - rows.length);
    const KP = { '.': null, K: '#2a1d1a' };
    icon(112, 146, ['KKKKKKK', 'KOOOOOK', 'KOGOGOK', 'KOOOOOK', 'KKKKKKK'], { ...KP, O: '#c8784e', G: '#f2c14e' });
    icon(205, 150, ['KKKKKKKKK', 'KWWWWWWWK', 'KWKWKWKWK', 'KWWWWWWWK', 'KKKKKKKKK'], { ...KP, W: '#f4f0e0' });
    icon(282, 170, ['.K.', 'KYK', 'KSK', 'KSK', 'KSK', 'KSK', 'KKK'], { ...KP, Y: '#f2c14e', S: '#d8b878' });
    icon(258, 160, ['KKKKK.', 'KWWWKK', 'KWWWK.', 'KKKK..'], { ...KP, W: '#ffffff' });
    icon(372, 224, ['..K..', '.KRK.', 'KRRRK', 'KBBBK', 'KBDBK', 'KKKKK'], { ...KP, R: '#c86a50', B: '#e8d8c0', D: '#2f5fa6' });
    // cornice
    Pix.rect(mc, 0, 0, 480, 3, '#8a6a4a');
    Pix.rect(mc, 0, 267, 480, 3, '#8a6a4a');
    Pix.rect(mc, 0, 0, 3, 270, '#8a6a4a');
    Pix.rect(mc, 477, 0, 3, 270, '#8a6a4a');
    Pix.rect(mc, 5, 5, 470, 1, '#b89a6a');
    Pix.rect(mc, 5, 264, 470, 1, '#b89a6a');
    // rosa dei venti
    Pix.rect(mc, 446, 214, 1, 30, '#8a6a4a');
    Pix.rect(mc, 432, 229, 30, 1, '#8a6a4a');
    drawGlyphText(mc, 'N', 444, 202, '#8a6a4a');
    drawGlyphText(mc, 'LONDRA', 16, 14, '#8a5a3a', 2);
    Pix.addTexture(scene, 'londonMap', m);
  }
}

function fmtSteps(n) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// ---------------------------------------------------------------------------

class Level3Scene extends BaseScene {
  constructor() { super('Level3'); }

  create() {
    this.initBase();
    Save.setLevel('Level3');
    buildLondonArt(this);
    this.add.image(0, 0, 'london').setOrigin(0, 0).setDepth(0);

    this.world = new GridWorld(L3_MAP, L3_WALK);
    this.addObjects();

    const fr = new Character(this, 'francesca', 0, 0, 'right');
    this.player = fr;
    this.mover = new GridMover(this, this.world, fr, 2, 8);
    this.mover.onStep = (c, r) => this.onStep(c, r);
    this.mover.onBump = (c, r) => this.onBump(c, r);
    this.simone = new Character(this, 'simone', 0, 0, 'right');
    this.mover.attachFollower(this.simone, 1, 8);
    const s = this.simone;
    this.humSongs = [
      [[fr, '♪ Mr. Sky… ♪'], [s, '♪ …na na naa! ♪']],
      [[s, '♪ Mr. Skyyy… ♪'], [fr, 'stonato ♥']],
      [[fr, '♪ la la la… ♪'], [s, '♪ (fischietta) ♪']],
      [[s, '♪ Mr. Sky… ♪'], [fr, '♪ …Mr. Sky! ♪']],
    ];

    this.stage = 0;          // 0: verso Harrods, 1: verso il bar, 2: verso gli zii, 3: fatto
    this.items = [];
    this.steps = 0;
    this.tired = 0;
    this.inside = null;
    this.bubbles = [];
    this.bumpCooldown = 0;
    this.gates = { 43: 1, 117: 2 }; // colonna -> tappa necessaria per passare
    for (const col of Object.keys(this.gates)) for (let r = 7; r <= 17; r++) this.world.blocked.add(`${col},${r}`);
    // strada e marciapiede in basso chiusi finché non è passata la scena di quel tratto (si passa dal marciapiede in alto)
    this.sceneGates = { 52: 'Passiamo dal parco, dai! Voglio vedere gli scoiattoli!', 84: 'Il bar è di là, sul marciapiede di sopra. Andiamo!',
      162: 'Gli zii abitano sul marciapiede di sopra, Picci. Torniamo su.' };
    for (const col of Object.keys(this.sceneGates)) for (let r = 11; r <= 17; r++) this.world.blocked.add(`${col},${r}`);
    this.checkpoint = { c: 2, r: 8 };
    this.carHits = 0;
    this.vehicles = [];

    this.addNPCs();
    this.enableChallenges();
    this.addHUD();
    this.addRain();
    this.exclaim = new ExclaimMarker(this);
    this.arrow = this.add.image(0, 0, 'arrow').setScrollFactor(0).setDepth(940).setVisible(false);

    this.setOutdoorCamera();
    this.vehicleTimer = this.time.addEvent({ delay: 2200, loop: true, callback: () => this.spawnVehicle() });
    this.spawnVehicle(true);
    this.walkers = [];
    this.time.addEvent({ delay: 3500, loop: true, callback: () => this.spawnWalker() });

    Audio8.playSong(SONGS.london);
    this.busy = true;
    this.events.once('shutdown', () => {
      this.challengeSession = null;
      if (this.battle) this.battle.destroy();
      this.battle = null;
      this.npcMenuTick = null;
    });
    this.intro();
  }

  setOutdoorCamera() {
    const cam = this.cameras.main;
    if (this.roomMask) { this.roomMask.destroy(); this.roomMask = null; }
    cam.setBounds(0, 0, L3_W * TILE, L3_OUT_ROWS * TILE);
    cam.setRoundPixels(true);
    cam.startFollow(this.player.sprite, true, 0.15, 0.15, 0, 20);
  }

  setRoomCamera(c0, c1, r0, r1) {
    const cam = this.cameras.main;
    // tutto nero attorno alla stanza
    if (this.roomMask) this.roomMask.destroy();
    const x0 = c0 * TILE, y0 = r0 * TILE, x1 = (c1 + 1) * TILE, y1 = (r1 + 1) * TILE;
    this.roomMask = this.add.graphics().setDepth(899).fillStyle(0x0e0a12, 1)
      .fillRect(x0 - 600, y0 - 600, x1 - x0 + 1200, 600)
      .fillRect(x0 - 600, y1, x1 - x0 + 1200, 600)
      .fillRect(x0 - 600, y0, 600, y1 - y0)
      .fillRect(x1, y0, 600, y1 - y0);
    const cx = (c0 + c1 + 1) * TILE / 2;
    const cy = (r0 + r1 + 1) * TILE / 2;
    cam.stopFollow();
    cam.setBounds(cx - 240, cy - 135, 480, 270);
    cam.centerOn(cx, cy);
  }

  addObjects() {
    const depthAt = (r) => 10 + r * TILE + 13;
    for (let r = 0; r < L3_OUT_ROWS; r++) {
      for (let c = 0; c < L3_W; c++) {
        const ch = L3_MAP[r][c];
        const x = c * TILE + 8;
        const y = (r + 1) * TILE;
        if (ch === 'L') this.add.image(x, y - 1, 'lampLondon').setOrigin(0.5, 1).setDepth(depthAt(r));
        else if (ch === 'T') this.add.image(x, y, 'planeTree').setOrigin(0.5, 1).setDepth(depthAt(r));
        else if (ch === 'B') this.add.image(x, y, 'phoneBox').setOrigin(0.5, 1).setDepth(depthAt(r));
        else if (ch === 'M') this.add.image(x, y - 1, 'postBox').setOrigin(0.5, 1).setDepth(depthAt(r));
        else if (ch === 'b') {
          const g = this.add.graphics().setDepth(depthAt(r) - 10);
          g.fillStyle(0x2a1d1a).fillRect(x - 13, y - 13, 26, 10);
          g.fillStyle(0x2f5a4a).fillRect(x - 12, y - 12, 24, 3).fillRect(x - 12, y - 8, 24, 4);
          g.fillStyle(0x1e1e26).fillRect(x - 12, y - 4, 2, 3).fillRect(x + 10, y - 4, 2, 3);
        }
      }
    }
    this.add.image(114 * TILE + 8, 7 * TILE, 'bigBen').setOrigin(0.5, 1).setDepth(depthAt(6));
    // piccioni che beccano davanti al Big Ben
    this.pigeons = [[110, 9], [112, 10], [116, 9], [113, 8]].map(([c, r], i) => {
      const g = this.add.sprite(c * TILE + 4 + i * 3, r * TILE + 10, 'pigeon', 0).setDepth(depthAt(r) - 2).setFlipX(i % 2 === 1);
      this.tweens.add({ targets: g, y: g.y + 1, duration: 260 + i * 40, yoyo: true, repeat: -1, delay: i * 90 });
      return g;
    });
    // tantissimi cigni sul laghetto di St James's Park
    for (let i = 0; i < 9; i++) {
      const sx = 51 * TILE + (i % 5) * 26 + (i > 4 ? 12 : 0);
      const sy = 3 * TILE + 12 + Math.floor(i / 5) * 20 + (i % 2) * 4;
      const d = this.add.image(sx, sy, 'swan').setDepth(5).setFlipX(i % 2 === 0);
      this.tweens.add({ targets: d, x: sx + 14 + (i % 3) * 6, duration: 3000 + i * 500, yoyo: true, repeat: -1, ease: 'Sine.InOut',
        onYoyo: () => d.setFlipX(!d.flipX), onRepeat: () => d.setFlipX(!d.flipX) });
      this.tweens.add({ targets: d, y: sy + 1, duration: 700 + i * 60, yoyo: true, repeat: -1 });
    }
    // e tantissimi scoiattoli sul prato
    this.squirrels = [];
    [[45, 7], [49, 9], [54, 9], [59, 7], [61, 9], [64, 7], [58, 2], [47, 3]].forEach(([c, r]) => {
      const q = this.add.sprite(c * TILE + 8, r * TILE + 12, 'squirrel', 0).setDepth(10 + r * TILE + 12);
      q.home = { x: q.x, y: q.y };
      this.squirrels.push(q);
    });
    this.time.addEvent({ delay: 450, loop: true, callback: () => this.hopSquirrel() });
  }

  hopSquirrel() {
    const q = this.squirrels[Math.floor(Math.random() * this.squirrels.length)];
    if (!q || q.busy) return;
    const tx = q.home.x + (Math.random() - 0.5) * 36;
    const ty = q.home.y + (Math.random() - 0.5) * 14;
    q.setFlipX(tx > q.x);
    q.setFrame(1);
    this.tweens.add({ targets: q, x: tx, y: ty, duration: 260, ease: 'Quad.Out', onComplete: () => q.setFrame(0) });
  }

  // Il ricordo del parco: foto ai cigni e lo scoiattolo sulle Timberland
  async squirrelScene() {
    this.squirrelDone = true;
    this.openSceneGate(52);
    this.busy = true;
    await this.wait(250);
    const s = this.simone;
    // Simone si mette due passi a destra di Francesca, lontano dagli alberi: la scena si vede tutta.
    const fol = this.mover.follower;
    const home = { c: fol.c, r: fol.r };
    const spot = [2, 3, 1].map(d => this.mover.c + d).find(c => this.world.isWalkable(c, this.mover.r) && !this.world.occupied.has(this.world.key(c, this.mover.r)));
    if (spot !== undefined) {
      await this.autoWalk(s, spot, this.mover.r, 50);
      this.placeFollower(spot, this.mover.r, 'up');
    }
    s.face('up');
    this.player.face(dirFromVector(s.x - this.player.x, s.y - this.player.y, 'left'));
    await this.talk([['Simone', 'Aspetta aspetta! Guarda quanti cigni! E gli scoiattoli!!']]);
    const flash = this.add.rectangle(0, 0, 480, 270, 0xffffff, 0).setOrigin(0, 0).setScrollFactor(0).setDepth(1100);
    for (let i = 0; i < 5; i++) {
      s.face(i % 2 ? 'up' : 'right');
      this.sayBubble(s, 'click!', 300);
      Audio8.noise(0.05, { freq: 4000, vol: 0.3 });
      flash.fillAlpha = 0.7;
      this.tweens.add({ targets: flash, fillAlpha: 0, duration: 160 });
      await this.wait(420);
    }
    await this.talk([[null, 'Simone scatta circa trecento foto. Ai cigni. Agli scoiattoli. A ogni singolo scoiattolo.']]);

    // uno scoiattolo si avvicina… e sale sulle Timberland
    const q = this.add.sprite(s.x + 70, s.y - 2, 'squirrel', 0).setDepth(s.sprite.depth + 1);
    s.face('right');
    for (let i = 0; i < 4; i++) {
      q.setFrame(1);
      await this.tweenP({ targets: q, x: q.x - 15, y: s.y - 6, duration: 160, ease: 'Quad.Out' });
      q.setFrame(0);
      await this.wait(i === 3 ? 100 : 220);
    }
    q.setFlipX(false);
    await this.tweenP({ targets: q, x: s.x + 3, y: s.y - 3, duration: 200 });
    q.setDepth(s.sprite.depth + 1);
    s.face('down');
    await this.wait(300);
    this.sayBubble(s, '…', 1200);
    await this.wait(1300);

    // l'urlo
    Audio8.tone(1300, 0.5, { vol: 0.12, slide: 700 });
    Audio8.tone(1350, 0.5, { type: 'sawtooth', vol: 0.05, slide: 750, delay: 0.02 });
    this.cameras.main.shake(400, 0.01);
    s.lift = 0;
    this.tweens.add({ targets: s, lift: 6, duration: 110, yoyo: true, onUpdate: () => s.sync() });
    const scream = this.sayBubble(s, 'AAAAAAAAAH!', 1400);
    q.setFlipX(true);
    q.setFrame(1);
    this.tweens.add({ targets: q, x: q.x + 260, y: q.y - 20, duration: 700, onComplete: () => q.destroy() });
    await scream;

    // e giù a ridere
    this.sayBubble(this.player, 'ahahahah!', 1800);
    await this.wait(250);
    this.sayBubble(s, 'ahahah!', 1600, 17);
    for (let i = 0; i < 5; i++) {
      const h = this.add.image((s.x + this.player.x) / 2 + (Math.random() - 0.5) * 20, s.y - 20, 'heart').setDepth(2000);
      this.tweens.add({ targets: h, y: h.y - 30, alpha: 0, delay: i * 180, duration: 900, onComplete: () => h.destroy() });
    }
    await this.wait(1900);
    await this.talk([
      [null, 'E siete scoppiati a ridere, lì in mezzo al parco.'],
      ['Simone', 'Le Timberland erano nuove! …Andiamo a prendere questo caffè, va\'.'],
    ]);
    if (spot !== undefined) {
      await this.autoWalk(s, home.c, home.r, 50);
      this.placeFollower(home.c, home.r, this.player.dir);
    }
    flash.destroy();
    this.busy = false;
  }

  addNPCs() {
    const W = this.world;
    const talk = (npc, lines) => async () => { npc.ch.face(OPPOSITE[this.player.dir]); await this.talk(lines); };
    this.londoner = W.placeNPC(this, 'londoner', 12, 8, 'down');
    W.setInteract(12, 8, talk(this.londoner, [['Londinese', 'Lovely day for a walk, innit? Well… for a short one.']]));

    this.guard1 = W.placeNPC(this, 'guardia', 71, 6, 'down');
    let tries = 0;
    W.setInteract(71, 6, async () => {
      tries++;
      if (tries === 1) await this.guardScene();
      else await this.talk([[null, 'La guardia non muove un muscolo. Però da quando è passato Simone trattiene il respiro.']]);
    });
    this.guard2 = W.placeNPC(this, 'guardia', 81, 6, 'down');
    W.setInteract(81, 6, async () => { await this.talk([[null, 'Neanche questa guardia si muove. Ma ti è sembrato che ti abbia fatto l\'occhiolino?']]); });

    this.barista = W.placeNPC(this, 'barista', 92, 6, 'down');
    W.setInteract(92, 6, () => this.talkBarista());

    this.turista = W.placeNPC(this, 'turistaB', 108, 8, 'up');
    W.setInteract(108, 8, talk(this.turista, [
      ['Turista', 'Lo sapevi che Big Ben è il nome della campana, non della torre?'],
      ['Simone', 'Lo sapevo.'],
      [null, 'Non lo sapeva.'],
    ]));

    this.signora = W.placeNPC(this, 'nonna', 150, 8, 'down');
    W.setInteract(150, 8, talk(this.signora, [['Signora', 'Oh dear, you look tired! Not far now, sweetheart.']]));

    // Big Ben: i rintocchi, un selfie e qualche chiacchiera
    this.benTalks = 0;
    for (const c of [113, 114, 115]) W.setInteract(c, 6, () => this.bigBenScene());
    // il sigaro Capitol, per terra sotto la pioggia
    this.cigar = this.add.image(111 * TILE + 8, 7 * TILE + 11, 'itemCigar').setDepth(10 + 7 * TILE + 8);
    this.cigarSpark = this.add.image(111 * TILE + 12, 7 * TILE + 6, 'sparkle').setDepth(10 + 7 * TILE + 9).setScale(0.6);
    this.tweens.add({ targets: this.cigarSpark, alpha: 0.1, scale: 0.3, duration: 500, yoyo: true, repeat: -1 });
    W.blocked.add('111,7');
    W.setInteract(111, 7, () => this.cigarScene());

    // Celebrità sul marciapiede in basso, di là dalla strada
    const celeb = (key, c, dir, lines) => {
      const npc = W.placeNPC(this, key, c, 16, dir);
      W.setInteract(c, 16, async () => { npc.ch.face(OPPOSITE[this.player.dir]); await this.talk(lines); });
      return npc;
    };
    this.celebs = [
      [celeb('paddington', 8, 'down', [
        ['Paddington', 'Buongiorno! Gradisce un panino alla marmellata? Ne tengo sempre uno sotto il cappello, per le emergenze.'],
        ['Simone', 'Picci, guarda! Paddington! Quello vero!'],
        ['Paddington', 'Un consiglio, signorina: a Londra si cammina tanto. Mai uscire senza un panino.'],
        ['Simone', 'Picci, segnatelo. Vale più di una cartina.'],
      ]), 'paddington'],
      [celeb('mrBean', 30, 'down', [
        [null, 'Mr Bean non dice una parola. Ti mostra il suo orsacchiotto, Teddy.'],
        [null, 'Poi guarda Simone dall\'alto in basso e nasconde Teddy dietro la schiena.'],
        ['Simone', 'Perché mi fissa così?'],
      ]), 'mrBean'],
      [celeb('sherlock', 57, 'down', [
        ['Sherlock', 'Interessante. Scarpe consumate, polpacci in fiamme, e un uomo che la segue a un passo esatto di distanza.'],
        ['Sherlock', 'Deduzione: state attraversando Londra a piedi. Per scelta. Per scelta di lei.'],
        ['Simone', 'Come ha fatto?!'],
        ['Sherlock', 'Elementare. La signorina è innamorata di Londra, e il giovanotto è innamorato di lei. Altrimenti sareste in metro.'],
      ]), 'sherlock'],
      [celeb('maryPoppins', 68, 'down', [
        ['Mary Poppins', 'Che tempo delizioso! Basta un ombrello e un po\' di pioggia, e tutto diventa più bello.'],
        ['Mary Poppins', 'E lei, cara, è praticamente perfetta sotto ogni aspetto.'],
        ['Simone', 'Lo dico sempre anch\'io!'],
        ['Mary Poppins', 'Lei invece, giovanotto, è praticamente… presente. Che è già molto.'],
      ]), 'maryPoppins'],
      [celeb('deSica', 79, 'down', [
        ['Christian De Sica', 'Aò! Che ce fate a Londra sotto \'st\'acqua? Pure io: sto a girà "Natale a Buckingham".'],
        ['Simone', 'Ma… è Christian De Sica?!'],
        ['Christian De Sica', 'In carne, ossa e cappotto de cammello. Ma che, siete venuti da Roma a piedi?'],
        ['Francesca', 'Quasi. Quarantamila passi.'],
        ['Christian De Sica', 'Ma che sete matti?! …Però bella coppia, eh.'],
        ['Christian De Sica', 'Tienitelo stretto \'sto ragazzo: uno che te segue sotto la pioggia nun se trova a ogni angolo.'],
      ]), 'deSica'],
      [celeb('hughGrant', 97, 'right', [
        ['Hugh Grant', 'Oh, ehm, scusate, terribilmente… sapete per caso da che parte è Notting Hill? Ho una libreria da aprire.'],
        ['Simone', 'Ehm… sorry, siamo di Roma.'],
        ['Hugh Grant', 'Ah. Splendido. Anch\'io mi perdo sempre. È una cosa molto inglese.'],
      ]), 'hughGrant'],
      [celeb('julia', 98, 'left', [
        ['Julia Roberts', 'Sono solo una ragazza… che sta davanti a un ragazzo… e gli chiede di amarla.'],
        [null, 'Julia Roberts sta provando la battuta più famosa di Notting Hill. Hugh Grant annuisce, commosso.'],
        ['Francesca', 'Che bella frase.'],
        ['Simone', 'A me non hai dovuto chiederlo. Al Gianicolo avevo già capito tutto.'],
      ]), 'julia'],
      [celeb('harryPotter', 134, 'down', [
        ['Harry Potter', 'Scusate, sapete dov\'è il binario 9 e 3/4? Ho perso il treno per Hogwarts.'],
        ['Simone', 'Noi veramente non prendiamo nessun mezzo. Andiamo a piedi.'],
        ['Harry Potter', 'A piedi? E fino a dove?'],
        ['Francesca', 'Dagli zii. Dall\'altra parte di Londra.'],
        ['Harry Potter', '…Questi Babbani sono matti.'],
      ]), 'harryPotter'],
      [celeb('beckham', 146, 'down', [
        ['David Beckham', 'Hey! Vi insegno il tiro a giro? Piede aperto, colpisci di lato… e la palla curva così.'],
        [null, 'Beckham disegna una curva perfetta nell\'aria.'],
        ['Simone', 'Come la nostra camminata di oggi: tutta curve, ma alla fine arriviamo in porta.'],
        ['David Beckham', 'Bend it like… you two. Lovely.'],
      ]), 'beckham'],
    ];

    // Porte
    W.setInteract(34, 6, () => this.enterHarrods());
    W.setInteract(35, 6, () => this.enterHarrods());
    W.setInteract(168, 6, () => this.enterZii());

    // Interni
    this.commessa = W.placeNPC(this, 'commessa', 9, 23, 'down');
    W.setInteract(9, 23, () => this.talkCommessa());
    this.zio = W.placeNPC(this, 'zioPaul', 27, 25, 'right');
    this.zia = W.placeNPC(this, 'ziaDorota', 31, 25, 'left');
    const ziiTalk = async () => { await this.talk([['Zia Dorota', 'More tea, love?']]); };
    W.setInteract(27, 25, ziiTalk);
    W.setInteract(31, 25, ziiTalk);
  }

  // I cittadini di Londra si possono sfidare (non chi serve alla storia: commessa, barista, zii).
  enableChallenges() {
    this.challengeSession = {};
    this.battle = null;
    this.npcMenuTick = null;
    if (!this.textures.exists('londonBattleBg')) buildLondonBattleBg(this);
    this.challengeNPCs = [];
    for (const [npc, opponent] of [[this.londoner, 'londoner'], [this.guard1, 'guardia'], [this.guard2, 'guardia'],
      [this.turista, 'londonTurista'], [this.signora, 'londonSignora'], ...this.celebs.map(([npc, key]) => [npc, key])]) {
      const key = this.world.key(npc.c, npc.r);
      const original = this.world.interact.get(key);
      this.challengeNPCs.push(npc);
      this.world.setInteract(npc.c, npc.r, () => GianicoloBattle.offer(this, npc, original,
        { opponent, returnSong: SONGS.london, background: 'londonBattleBg' }));
    }
  }

  addHUD() {
    this.add.rectangle(4, 4, 104, 16, 0x1a1020, 0.6).setOrigin(0, 0).setScrollFactor(0).setDepth(950);
    this.stepText = addText(this, 9, 7, '', { color: 0xfbf3e4, fixed: true, depth: 951 });
    this.slots = [];
    for (let i = 0; i < 3; i++) {
      const x = 112 + i * 18;
      this.add.rectangle(x, 4, 16, 16, 0x1a1020, 0.6).setOrigin(0, 0).setScrollFactor(0).setDepth(950)
        .setStrokeStyle(1, 0xfbf3e4, 0.5);
      const icon = this.add.image(x + 8, 12, 'itemTeddy').setScrollFactor(0).setDepth(951).setVisible(false);
      this.slots.push(icon);
    }
    this.updateSteps();
  }

  updateSteps() {
    this.stepText.setText(`👣 ${fmtSteps(this.steps)} / 40.000`);
  }

  addRain() {
    this.rainDrops = [];
    for (let i = 0; i < 70; i++) {
      const d = this.add.image(Math.random() * 500, Math.random() * 280, 'rain').setScrollFactor(0).setDepth(930).setVisible(false);
      d.speed = 160 + Math.random() * 80;
      this.rainDrops.push(d);
    }
    this.rainTint = this.add.rectangle(0, 0, 480, 270, 0x40506a, 0).setOrigin(0, 0).setScrollFactor(0).setDepth(929);
    this.raining = false;
    this.rainedOnce = false;
  }

  setRain(on) {
    if (on === this.raining) return;
    this.raining = on;
    this.rainDrops.forEach(d => d.setVisible(on));
    this.tweens.add({ targets: this.rainTint, fillAlpha: on ? 0.15 : 0, duration: 800 });
    if (on && !this.rainedOnce) {
      this.rainedOnce = true;
      this.sayBubble(this.simone, 'Tipico.', 2200);
    }
  }

  sayBubble(ch, text, ms = 2400, dy = 0) {
    const b = Art.bubble(this, text);
    const entry = { b, ch, dy, until: this.time.now + ms };
    this.bubbles.push(entry);
    return new Promise(r => this.time.delayedCall(ms, r));
  }

  // Autobus rossi e taxi neri che passano sulla strada (si guida a sinistra: verso est la corsia in alto)
  spawnVehicle(initial) {
    if (this.inside) return;
    const cam = this.cameras.main;
    const east = Math.random() < 0.5;
    const type = Math.random() < 0.55 ? 'bus' : 'taxi';
    const w = type === 'bus' ? 60 : 34;
    const y = east ? 12 * TILE + 13 : 14 * TILE + 13;
    const x = initial ? cam.scrollX + 100 + Math.random() * 280 : (east ? cam.scrollX - 70 : cam.scrollX + 550);
    if (this.vehicles.some(o => o.east === east && Math.abs(o.img.x - x) < (o.w + w) / 2 + 24)) return;
    const img = this.add.image(x, y, type).setOrigin(0.5, 1).setDepth(10 + y).setFlipX(!east);
    this.vehicles.push({ img, east, w, speed: type === 'bus' ? 70 : 105, travelled: 0 });
  }

  // Corsia in cui stanno i piedi di un personaggio: true = verso est (in alto), false = verso ovest, null = marciapiede
  laneAt(y) {
    if (y >= 11 * TILE + 6 && y < 13 * TILE + 5) return true;
    if (y >= 13 * TILE + 5 && y <= 14 * TILE + 22) return false;
    return null;
  }

  updateVehicles(dt) {
    if (this.inside) {
      this.vehicles.forEach(v => v.img.destroy());
      this.vehicles = [];
      return;
    }
    const people = [this.player, this.simone];
    // alle strisce si fermano se qualcuno attraversa o aspetta sul bordo
    const zebras = [20 * TILE, 140 * TILE].filter(zx => people.some(p => p.x > zx - 4 && p.x < zx + 36 && p.y > 10 * TILE + 8 && p.y < 15 * TILE + 16));
    for (const v of this.vehicles) {
      const dirX = v.east ? 1 : -1;
      const front = v.img.x + dirX * v.w / 2;
      let move = v.speed * dt;
      for (const zx of zebras) {
        const line = v.east ? zx - 6 : zx + 34;
        const gap = (line - front) * dirX;
        if (gap >= 0) move = Math.min(move, gap);
      }
      // durante un dialogo nessuno investe nessuno: ci si ferma davanti a chi è in corsia
      if (this.locked) {
        for (const p of people) {
          if (this.laneAt(p.y) !== v.east) continue;
          const gap = (p.x - dirX * 12 - front) * dirX;
          if (gap >= -4) move = Math.min(move, Math.max(0, gap));
        }
      }
      for (const o of this.vehicles) {
        if (o === v || o.east !== v.east || (o.img.x - v.img.x) * dirX <= 0) continue;
        const gap = (o.img.x - dirX * o.w / 2 - front) * dirX - 10;
        move = Math.min(move, Math.max(0, gap));
      }
      v.img.x += dirX * move;
      v.travelled += move;
    }
    this.vehicles = this.vehicles.filter((v) => {
      if (v.travelled < 1100) return true;
      v.img.destroy();
      return false;
    });
    if (this.hitting || this.locked) return;
    for (const p of people) {
      const lane = this.laneAt(p.y);
      if (lane === null) continue;
      if (zebras.some(zx => p.x > zx - 2 && p.x < zx + 34)) continue; // sulle strisce si è al sicuro
      const v = this.vehicles.find(o => o.east === lane && Math.abs(o.img.x - p.x) < o.w / 2 + 3);
      if (v) { this.carHit(p); return; }
    }
  }

  // Investiti (con delicatezza): stelline, giravolta e si riparte dall'ultimo marciapiede
  async carHit(victim) {
    this.hitting = true;
    this.busy = true;
    const f = this.player, s = this.simone, fol = this.mover.follower;
    this.tweens.killTweensOf(f);
    this.tweens.killTweensOf(s);
    this.mover.moving = false;
    fol.moving = false;
    this.exclaim.hide();
    Audio8.tone(415, 0.16, { type: 'square', vol: 0.09 });
    Audio8.tone(330, 0.24, { type: 'square', vol: 0.09, delay: 0.18 });
    Audio8.sfx('fall');
    this.cameras.main.shake(250, 0.008);
    const stars = [0, 1, 2].map(() => this.add.image(victim.x, victim.y - 26, 'star').setDepth(2000));
    const orbit = { a: 0 };
    this.tweens.add({ targets: orbit, a: Math.PI * 6, duration: 1100,
      onUpdate: () => stars.forEach((st, i) => st.setPosition(victim.x + Math.cos(orbit.a + i * 2.1) * 9, victim.y - 26 + Math.sin(orbit.a + i * 2.1) * 3)) });
    const dirs = ['down', 'left', 'up', 'right'];
    for (let i = 0; i < 12; i++) { victim.face(dirs[i % 4]); await this.wait(80); }
    stars.forEach(st => st.destroy());
    await this.fade(true);
    const cp = this.checkpoint;
    this.mover.teleport(cp.c, cp.r, 'down');
    const spot = [[-1, 0], [1, 0], [0, -1], [0, 1], [-2, 0], [2, 0]].map(([dc, dr]) => ({ c: cp.c + dc, r: cp.r + dr }))
      .find(t => this.world.isWalkable(t.c, t.r) && this.laneAt(tileFeet(t.c, t.r).y) === null);
    if (spot) this.placeFollower(spot.c, spot.r, 'down');
    else this.placeFollower(cp.c, cp.r, 'down');
    this.cameras.main.centerOn(f.x, f.y);
    await this.fade(false);
    this.carHits++;
    if (this.carHits === 1) {
      await this.talk(victim === s ? [
        ['Simone', 'Tutto ok, tutto ok! Mi ha preso solo… tutto.'],
        ['Simone', 'Qui guidano a SINISTRA, le macchine arrivano dalla parte sbagliata. Sulle strisce però si fermano!'],
      ] : [
        ['Simone', 'Picci! Tutto bene?! Ti sei fatta male?'],
        ['Simone', 'Qui guidano a SINISTRA, le macchine arrivano dalla parte sbagliata. Attraversiamo sulle strisce, lì si fermano.'],
        ['Simone', '…Mi hai fatto prendere un colpo. Io ti voglio intera.'],
      ]);
    } else {
      const lines = ['Le strisce, Picci! Le strisce!', 'Guarda a destra! No, a sinistra! …Guarda ovunque!', 'Mind the gap… e anche i bus.', 'Ancora?! Il mio cuore…'];
      this.sayBubble(s, lines[(this.carHits - 2) % lines.length], 2400);
    }
    this.hitting = false;
    this.busy = false;
  }

  spawnWalker() {
    if (this.inside) return;
    const cam = this.cameras.main;
    const right = Math.random() < 0.5;
    const keys = ['fanA', 'fanB', 'fanC', 'fanD', 'londoner', 'turistaA', 'kidB', 'kidC'];
    const key = keys[Math.floor(Math.random() * keys.length)];
    const x = right ? cam.scrollX - 20 : cam.scrollX + 500;
    const ch = new Character(this, key, x, 17 * TILE + 13, right ? 'right' : 'left');
    ch.walk(right ? 'right' : 'left', 0.8);
    this.tweens.add({ targets: ch, x: x + (right ? 560 : -560), duration: 560 / 34 * 1000, onUpdate: () => ch.sync(), onComplete: () => ch.destroy() });
  }

  goalPos() {
    if (this.stage === 0) return tileFeet(34.5, 6);
    if (this.stage === 1) return tileFeet(92, 6);
    if (this.stage === 2) return tileFeet(168, 6);
    return null;
  }

  async intro() {
    await this.wait(400);
    await this.levelCard(3, 'Londra, 40.000 passi');
    await this.showMap(-1);
    await this.talk([
      [null, 'Londra, il vostro primo anno insieme. Siete ospiti di zia Dorota e zio Paul.'],
      ['Simone', 'Allora: Harrods, un caffè e poi torniamo dagli zii. Prendiamo la metro?'],
      ['Francesca', 'No, facciamo tutto a piedi! Passiamo per dentro, così ci vediamo tutta la città.'],
      [null, 'Francesca è follemente innamorata di Londra e della sua atmosfera.'],
      ['Simone', 'Mmh… sembra un\'idea folle e spiacevole…'],
      ['Simone', '…FACCIAMOLO!'],
      [null, 'Segui la freccia gialla: Simone ti viene dietro.'],
      [null, 'Di là dalla strada c\'è un marciapiede pieno di gente famosa. Ma attenta: qui guidano a sinistra! Attraversa sulle strisce.'],
      [null, 'Anche qui puoi sfidare i londinesi che incontri. E stavolta a combattere può andarci pure Simone!'],
    ]);
    this.busy = false;
  }

  tick(time) {
    if (this.npcMenuTick) this.npcMenuTick();
    if (this.battle) this.battle.update();
    const free = !this.locked;
    this.mover.update(time, free);
    this.humTick(time, this.humSongs, !this.inside && !this.hitting);

    // fumetti che seguono i personaggi
    this.bubbles = this.bubbles.filter((e) => {
      if (time > e.until) { e.b.destroy(); return false; }
      e.b.setPosition(Math.round(e.ch.x), Math.round(e.ch.y - 24 - e.dy));
      return true;
    });

    const dt = Math.min(this.game.loop.delta, 50) / 1000;
    this.updateVehicles(dt);

    // pioggerella tra Buckingham Palace e il Big Ben
    if (!this.inside) this.setRain(this.mover.c >= 67 && this.mover.c <= 117);
    if (this.raining) {
      for (const d of this.rainDrops) {
        d.y += d.speed * dt;
        d.x -= d.speed * (this.windy ? 1.1 : 0.25) * dt;
        if (d.y > 275) { d.y = -8; d.x = Math.random() * 520; }
      }
    }

    this.updateArrow(time);

    const f = this.mover.facing();
    const fn = free && !this.mover.moving ? this.world.interact.get(`${f.c},${f.r}`) : null;
    if (fn) {
      const isNPC = this.world.occupied.has(`${f.c},${f.r}`);
      this.exclaim.show(f.c, f.r, isNPC ? 24 : 12);
      if (Controls.consumeA()) { this.exclaim.hide(); fn(); }
    } else {
      this.exclaim.hide();
      if (free) Controls.consumeA();
    }
  }

  updateArrow(time) {
    const g = this.goalPos();
    if (!g || this.inside || this.locked) { this.arrow.setVisible(false); return; }
    const cam = this.cameras.main;
    const sx = g.x - cam.scrollX;
    const sy = g.y - cam.scrollY;
    const bob = Math.sin(time / 180) * 2;
    this.arrow.setVisible(true);
    if (sx < 12) this.arrow.setPosition(10 - bob, 130).setAngle(180);
    else if (sx > 468) this.arrow.setPosition(470 + bob, 130).setAngle(0);
    else this.arrow.setPosition(Math.round(sx), Math.round(sy - 34 + bob)).setAngle(90);
  }

  onStep(c, r) {
    if (this.inside) {
      if (L3_MAP[r][c] === 'e') this.exitInside();
      return;
    }
    if (this.finalSteps) {
      // gli ultimi tre passi verso la porta
      this.steps = L3_GOAL - (r - 7);
      this.updateSteps();
      this.bigCounter.setText(`👣 ${fmtSteps(this.steps)}`);
      Audio8.tone(NOTE_FREQ[['C6', 'E5', 'D5', 'C5'][r - 7] || 'C5'], 0.12, { vol: 0.12 });
      this.tweens.add({ targets: this.bigCounter, scale: 1.15, duration: 90, yoyo: true });
      if (r === 7) this.arriveAtDoor();
      return;
    }
    if (this.laneAt(tileFeet(c, r).y) === null) this.checkpoint = { c, r };
    if (this.stage === 1 && !this.squirrelDone && r <= 10 && c >= 53 && c <= 64) this.squirrelScene();
    if (this.stage === 1 && !this.stepDone && r <= 10 && c >= 85 && c <= 89) this.giveUpScene();
    if (this.stage === 2 && !this.finalDone && r <= 10 && c >= 163) this.finalApproach();
    if (!this.pigeonsGone && Math.abs(c - 113) <= 4 && r >= 7 && r <= 10) this.scarePigeons();
    const mult = this.tired ? 34 + Math.random() * 12 : 22 + Math.random() * 9;
    this.steps = Math.min(39000, this.steps + mult);
    this.updateSteps();

    // stanchezza nell'ultimo tratto prima degli zii
    if (this.stage === 2 && this.tired === 0 && c >= 138) {
      this.tired = 1;
      this.mover.speed = 0.62;
      this.sayBubble(this.player, 'i miei piedi…', 2400).then(() => this.sayBubble(this.simone, 'manca poco… credo', 2400));
    }
    if (this.stage === 2 && this.tired === 1 && c >= 155) {
      this.tired = 2;
      this.mover.speed = 0.55;
      this.sayBubble(this.player, 'ma quanto manca?', 2200).then(() => this.sayBubble(this.simone, '…sicura che era di qua?', 2400));
    }
  }

  async onBump(c, r) {
    if (this.sceneGates[c] && r >= 11 && this.world.blocked.has(`${c},${r}`) && !this.locked && this.time.now >= this.bumpCooldown) {
      this.bumpCooldown = this.time.now + 1500;
      await this.say('Simone', this.sceneGates[c]);
      return;
    }
    const need = this.gates[c];
    if (!need || this.stage >= need || this.time.now < this.bumpCooldown || this.locked) return;
    this.bumpCooldown = this.time.now + 1500;
    if (need === 1) await this.say('Simone', 'Aspetta! Prima passiamo da Harrods, lo so che ci vuoi entrare.');
    else await this.say('Simone', 'Prima un caffè, ti prego. Senza caffè non attraverso il Tamigi.');
  }

  // Avanza di tappa e apre i "cancelli" invisibili che non servono più
  setStage(n) {
    this.stage = n;
    for (const [col, need] of Object.entries(this.gates)) {
      if (n >= need) for (let r = 7; r <= 17; r++) this.world.blocked.delete(`${col},${r}`);
    }
  }

  openSceneGate(col) {
    for (let r = 11; r <= 17; r++) this.world.blocked.delete(`${col},${r}`);
  }

  // Davanti a Buckingham Palace: Simone prova a far ridere la guardia con la sua arma segreta
  async guardScene() {
    this.busy = true;
    const s = this.simone;
    const g = this.guard1.ch;
    await this.talk([
      [null, 'La guardia non muove un muscolo.'],
      ['Simone', 'Lascia fare a me. Ho un\'arma segreta.'],
    ]);
    s.face(dirFromVector(g.x - s.x, g.y - s.y, 'up'));
    await this.wait(500);
    Audio8.noise(0.7, { freq: 140, sweep: 70, vol: 0.5, filter: 'lowpass' });
    Audio8.tone(90, 0.6, { type: 'sawtooth', vol: 0.06, slide: 60 });
    this.cameras.main.shake(300, 0.004);
    await this.sayBubble(s, 'PRRRRRT', 1300);
    await this.talk([
      [null, 'La guardia non muove un muscolo. Neanche le narici.'],
      ['Francesca', 'SIMONE!'],
      ['Simone', 'Eh eh eh...'],
    ]);
    await this.wait(400);
    await this.talk([
      [null, 'La guardia resta immobile. Ma il colbacco, forse, si è leggermente afflosciato.'],
      ['Simone', 'Visto? Un piccolo cedimento. Ci siamo quasi.'],
      ['Francesca', 'Andiamo via prima che chiamino il Re.'],
    ]);
    this.busy = false;
  }

  // Il Big Ben: i rintocchi di Westminster e il selfie numero trecentouno
  async bigBenScene() {
    this.busy = true;
    const s = this.simone;
    this.benTalks++;
    const chime = (notes, gap = 0.42) => notes.forEach((n, i) => {
      const fq = 440 * Math.pow(2, (n - 69) / 12);
      Audio8.tone(fq, 0.9, { type: 'triangle', vol: 0.16, delay: i * gap });
      Audio8.tone(fq * 2, 0.5, { type: 'sine', vol: 0.05, delay: i * gap });
    });
    if (this.benTalks === 1) {
      Audio8.stopSong(0.4);
      chime([64, 68, 66, 59, 64, 66, 68, 64]);
      await this.wait(3700);
      chime([52, 52], 1.1);
      await this.wait(2400);
      await this.talk([
        ['Simone', 'Senti? Suona per noi.'],
        ['Francesca', 'Suona ogni ora, Simone.'],
        ['Simone', 'Dai, selfie col Big Ben! Più vicina… sorridi!'],
      ]);
      s.face('down');
      this.player.face('down');
      await this.wait(300);
      const flash = this.add.rectangle(0, 0, 480, 270, 0xffffff, 0.85).setOrigin(0, 0).setScrollFactor(0).setDepth(1100);
      Audio8.noise(0.06, { freq: 4000, vol: 0.3 });
      await this.tweenP({ targets: flash, fillAlpha: 0, duration: 250 });
      flash.destroy();
      await this.selfieCard();
      await this.talk([[null, 'Simone ha trecento foto di scoiattoli. Ma come sfondo del telefono mette questa.']]);
      Audio8.playSong(SONGS.london);
    } else if (this.benTalks === 2) {
      await this.talk([
        ['Simone', 'Lo sapevi che Big Ben è il nome della campana, non della torre?'],
        ['Francesca', 'Te l\'ha detto la turista cinque minuti fa.'],
        ['Simone', 'Sì, ma io lo sapevo già da prima'],
        [null, 'Sta mentendo di nuovo.'],
      ]);
    } else {
      chime([68, 64, 66, 59]);
      await this.wait(1200);
      await this.say('Simone', 'Hai sentito? Ha suonato di nuovo per noi.');
    }
    this.busy = false;
  }

  // La foto: Francesca e Simone col Big Ben dietro, in una polaroid
  async selfieCard() {
    const c = this.add.container(240, 120).setScrollFactor(0).setDepth(1250);
    const g = this.add.graphics();
    g.fillStyle(0x2a1d1a).fillRect(-62, -78, 124, 150);
    g.fillStyle(0xfbf3e4).fillRect(-61, -77, 122, 148);
    g.fillStyle(0x6a7a9a).fillRect(-54, -70, 108, 104);
    g.fillStyle(0x8a9ab8).fillRect(-54, -70, 108, 40);
    c.add(g);
    const ben = this.add.image(0, 34, 'bigBen').setOrigin(0.5, 1);
    ben.setScale(Math.min(1, 100 / ben.height, 100 / ben.width));
    c.add(ben);
    const fr = this.add.sprite(-12, 34, 'francesca', 0).setOrigin(0.5, 1).setScale(2);
    const si = this.add.sprite(14, 34, 'simone', 0).setOrigin(0.5, 1).setScale(2);
    c.add([fr, si]);
    const heart = this.add.image(40, -58, 'heart');
    c.add(heart);
    c.add(addText(this, 0, 44, 'Foto n. 301', { color: 0x6a3a2a, origin: [0.5, 0.5] }));
    c.add(addText(this, 0, 58, 'la più bella', { color: 0xd0607e, origin: [0.5, 0.5] }));
    c.setScale(0).setAngle(-4);
    await this.tweenP({ targets: c, scale: 1, angle: 3, duration: 400, ease: 'Back.Out' });
    await this.wait(400);
    await this.waitA();
    await this.tweenP({ targets: c, scale: 0, duration: 250 });
    c.destroy();
  }

  // I piccioni volano via quando arrivi
  scarePigeons() {
    this.pigeonsGone = true;
    this.pigeons.forEach((g, i) => {
      this.tweens.killTweensOf(g);
      g.setFrame(1).setDepth(1800);
      const right = i % 2 === 0;
      g.setFlipX(!right);
      this.tweens.add({ targets: g, x: g.x + (right ? 220 : -220), y: g.y - 160 - i * 20, duration: 1600 + i * 200, delay: i * 120,
        onUpdate: () => g.setFrame(Math.floor(this.time.now / 90) % 2), onComplete: () => g.destroy() });
    });
    Audio8.noise(0.4, { freq: 900, vol: 0.12 });
    this.sayBubble(this.simone, 'aspettate! una foto!', 1800);
  }

  // Il sigaro Capitol: citazione di Metal Gear Solid… e niente da fare con questo vento
  async cigarScene() {
    this.busy = true;
    const s = this.simone;
    this.world.interact.delete('111,7');
    this.world.blocked.delete('111,7');
    this.cigar.destroy();
    this.cigarSpark.destroy();
    await this.talk([[null, 'Per terra, sotto la pioggia, c\'è un sigaro Capitol ancora incartato.']]);
    await this.itemPopup('itemCigar', 'un sigaro Capitol');
    // l'allarme di Metal Gear
    const alert = this.add.image(s.x, s.y - 26, 'exclaim').setOrigin(0.5, 1).setDepth(2000).setScale(0);
    Audio8.tone(1568, 0.07, { type: 'square', vol: 0.12 });
    Audio8.tone(2093, 0.3, { type: 'square', vol: 0.12, delay: 0.07 });
    Audio8.tone(1047, 0.3, { type: 'sawtooth', vol: 0.05, delay: 0.07 });
    await this.tweenP({ targets: alert, scale: 1.6, duration: 120, ease: 'Back.Out' });
    await this.wait(700);
    alert.destroy();
    s.face(dirFromVector(this.player.x - s.x, this.player.y - s.y, 'left'));
    await this.talk([
      ['Simone', '…Kept you waiting, huh?'],
      ['Francesca', 'Eh?'],
      ['Simone', 'Metal Gear Solid, Picci! Snake che si accende il sigaro sotto la pioggia. Momento leggendario.'],
    ]);
    // tre tentativi con l'accendino, mentre il vento gira
    this.windy = true;
    for (let i = 0; i < 3; i++) {
      Audio8.noise(0.05, { freq: 5000, vol: 0.25 });
      const sp = this.add.image(s.x + 5, s.y - 12, 'star').setDepth(2000).setScale(0.6);
      this.tweens.add({ targets: sp, alpha: 0, y: sp.y - 4, duration: 200, onComplete: () => sp.destroy() });
      Audio8.noise(0.6, { freq: 500, sweep: 1400, vol: 0.12 });
      this.sayBubble(s, i < 2 ? 'click…' : 'click… click…', 650);
      await this.wait(800);
    }
    await this.talk([
      ['Simone', 'Con \'sto vento e \'sta pioggia non si accende…'],
      ['Simone', 'Snake non ha mai avuto questi problemi.'],
      [null, 'Il sigaro finisce nella tasca di Simone. Sarà per la prossima missione.'],
    ]);
    this.windy = false;
    this.busy = false;
  }

  gainItem(id) {
    this.items.push(id);
    const slot = this.slots[this.items.length - 1];
    slot.setTexture(L3_ITEMS[id].icon).setVisible(true).setScale(0);
    this.tweens.add({ targets: slot, scale: 1, duration: 400, ease: 'Back.Out' });
  }

  async popupItem(id) {
    const it = L3_ITEMS[id];
    await this.itemPopup(it.icon, it.name, () => this.gainItem(id));
  }

  // --- Harrods ---
  async enterHarrods() {
    this.busy = true;
    await this.fade(true);
    this.inside = 'harrods';
    this.mover.teleport(9, 28, 'up');
    this.placeFollower(9, 29, 'up');
    this.setRoomCamera(2, 16, 20, 29);
    this.setRain(false);
    await this.fade(false);
    this.busy = false;
  }

  placeFollower(c, r, dir) {
    const f = this.mover.follower;
    f.c = c; f.r = r;
    const p = tileFeet(c, r);
    f.ch.setPos(p.x, p.y);
    f.ch.face(dir);
  }

  async exitInside() {
    if (this.inside !== 'harrods' || this.busy) return;
    this.busy = true;
    await this.fade(true);
    this.goOutsideHarrods();
    await this.fade(false);
    this.busy = false;
  }

  goOutsideHarrods() {
    this.inside = null;
    this.mover.teleport(34, 7, 'down');
    this.placeFollower(35, 7, 'down');
    this.setOutdoorCamera();
    this.cameras.main.centerOn(this.player.x, this.player.y);
  }

  async talkCommessa() {
    this.commessa.ch.face('down');
    if (this.stage > 0) {
      await this.say('Commessa', 'Torna a trovarci, darling!');
      return;
    }
    this.busy = true;
    await this.talk([['Commessa', 'Benvenuta da Harrods! Questo orsetto ti stava aspettando.']]);
    await this.popupItem('teddy');
    this.setStage(1);
    await this.say('Simone', 'Bene. Adesso andiamo a prendere un caffè… a piedi, ovviamente.');
    await this.fade(true);
    this.goOutsideHarrods();
    await this.showMap(0, true);
    this.busy = false;
  }

  // --- Bar ---
  async talkBarista() {
    if (this.stage !== 1) {
      await this.say('Barista', this.stage > 1 ? 'Cheers! Come again!' : 'Hello there!');
      return;
    }
    this.busy = true;
    await this.talk([
      ['Barista', 'Two coffees, that\'s six pounds, please!'],
      ['Simone', 'SEI STERLINE?!'],
    ]);
    await this.popupItem('coffee');
    this.setStage(2);
    await this.fade(true);
    await this.showMap(1, true);
    this.sayBubble(this.simone, 'sei sterline… non mi riprendo', 2600);
    this.busy = false;
  }

  // cammina "a mano" (fuori dalla griglia) fino al tile (c, r): prima in verticale poi in orizzontale
  async autoWalk(ch, c, r, speed = 40) {
    const p = tileFeet(c, r);
    if (Math.abs(ch.y - p.y) > 0.5) await ch.walkTo(ch.x, p.y, speed);
    if (Math.abs(ch.x - p.x) > 0.5) await ch.walkTo(p.x, p.y, speed);
  }

  // Prima del caffè: Francesca si siede su un gradino, pronta ad arrendersi
  async giveUpScene() {
    this.stepDone = true;
    this.openSceneGate(84);
    this.busy = true;
    const f = this.player;
    await Promise.all([this.autoWalk(f, 88, 7, 30), this.autoWalk(this.simone, 88, 9, 34)]);
    this.mover.teleport(88, 7, 'down');
    this.placeFollower(88, 9, 'up');
    if (!this.textures.exists('francescaSit')) {
      const src = this.textures.get('francesca').getSourceImage();
      const [sc, sx] = Pix.canvas(16, 22);
      sx.drawImage(src, 0, 0, 16, 19, 0, 2, 16, 19);
      Pix.grid(sx, ['..KJJJJKKJJJJK..', '.KOOOK....KOOOK.'], { '.': null, K: '#3a241e', J: '#5a6a9a', O: '#3c302c' }, 0, 20);
      Pix.addTexture(this, 'francescaSit', sc);
    }
    f.sprite.setTexture('francescaSit');
    Audio8.tone(300, 0.3, { type: 'triangle', vol: 0.15, slide: 160 });
    await this.sayBubble(f, 'pfff…', 1200);
    await this.talk([
      [null, 'A un passo dal caffè, Francesca si siede su un gradino.'],
      ['Francesca', 'Non ce la faccio più… mi arrendo. Lasciami qui, mandami una cartolina.'],
    ]);
    this.simone.face('up');
    await this.talk([
      ['Simone', 'Ehi. Guardami. Abbiamo attraversato mezza Londra, ed era un\'idea tua!'],
      ['Simone', 'Il caffè è lì, a dieci passi. Dai, Picci Picci: ancora un piccolo sforzo. Io sono qui con te.'],
    ]);
    f.sprite.setTexture('francesca');
    f.face('down');
    Audio8.sfx('pop');
    const h = this.add.image(f.x, f.y - 30, 'heart').setDepth(2000);
    this.tweens.add({ targets: h, y: h.y - 16, alpha: 0, duration: 900, onComplete: () => h.destroy() });
    await this.say('Francesca', '…va bene. Ma il caffè lo offri tu.');
    await this.say('Simone', 'Affare fatto! Quanto vuoi che costi un caffè?');
    this.busy = false;
  }

  // Quasi arrivati: 39.997 passi, gli ultimi tre fino alla porta, il bacino e si entra
  async finalApproach() {
    this.finalDone = true;
    this.openSceneGate(162);
    this.busy = true;
    await Promise.all([this.autoWalk(this.player, 168, 10, 30), this.autoWalk(this.simone, 167, 10, 30)]);
    this.mover.teleport(168, 10, 'up');
    this.placeFollower(167, 10, 'right');
    const counter = { v: this.steps };
    this.bigCounter = addText(this, 240, 70, `👣 ${fmtSteps(this.steps)}`, { scale: 3, color: 0xffd84a, shadow: 0x5a2a1a, origin: [0.5, 0.5] })
      .setScrollFactor(0).setDepth(1260);
    await this.tweenP({ targets: counter, v: L3_GOAL - 3, duration: 1200,
      onUpdate: () => { this.steps = counter.v; this.updateSteps(); this.bigCounter.setText(`👣 ${fmtSteps(counter.v)}`); } });
    this.steps = L3_GOAL - 3;
    this.updateSteps();
    this.bigCounter.setText(`👣 ${fmtSteps(this.steps)}`);
    await this.talk([
      ['Simone', 'Aspetta aspetta! Guarda il contapassi: 39.997!'],
      ['Simone', 'Mancano tre passi. E la porta degli zii è… esattamente a tre passi.'],
      [null, 'Fai gli ultimi tre passi fino alla porta!'],
    ]);
    // solo dritto verso la porta
    this.lockedCols = [];
    for (const col of [167, 169]) for (let r = 7; r <= 10; r++) { this.world.blocked.add(`${col},${r}`); this.lockedCols.push(`${col},${r}`); }
    this.world.blocked.add('168,11');
    this.mover.speed = 0.45;
    this.finalSteps = true;
    this.busy = false;
  }

  async arriveAtDoor() {
    this.finalSteps = false;
    this.busy = true;
    this.lockedCols.forEach(k => this.world.blocked.delete(k));
    this.tweens.add({ targets: this.bigCounter, alpha: 0, duration: 300, onComplete: () => this.bigCounter.destroy() });
    this.player.face('up');
    Audio8.stopSong(0.3);
    this.cameras.main.shake(300, 0.006);
    this.fanfare();
    const big = addText(this, 240, 90, '40.000!', { scale: 5, color: 0xffd84a, shadow: 0x7a3a1a, origin: [0.5, 0.5] })
      .setScrollFactor(0).setDepth(1260).setScale(0);
    const sub = addText(this, 240, 130, 'passi', { scale: 2, color: 0xfbf3e4, shadow: 0x3a2340, origin: [0.5, 0.5] })
      .setScrollFactor(0).setDepth(1260).setAlpha(0);
    this.tweens.add({ targets: big, scale: 1, duration: 500, ease: 'Back.Out' });
    this.tweens.add({ targets: sub, alpha: 1, delay: 300, duration: 400 });
    for (let i = 0; i < 24; i++) {
      const st = this.add.image(240, 100, i % 2 ? 'star' : 'heart').setScrollFactor(0).setDepth(1259);
      const a = Math.random() * Math.PI * 2;
      const d = 60 + Math.random() * 140;
      this.tweens.add({ targets: st, x: 240 + Math.cos(a) * d, y: 100 + Math.sin(a) * d * 0.7, alpha: 0, angle: 360,
        duration: 900 + Math.random() * 600, onComplete: () => st.destroy() });
    }
    await this.wait(2200);
    this.tweens.add({ targets: [big, sub], alpha: 0, duration: 400, onComplete: () => { big.destroy(); sub.destroy(); } });

    // il bacino davanti alla porta
    const f = this.player;
    const s = this.simone;
    const p1 = tileFeet(167, 8);
    const p2 = tileFeet(167, 7);
    await s.walkTo(p1.x, p1.y, 30);
    await s.walkTo(p2.x, p2.y, 30);
    this.placeFollower(167, 7, 'right');
    f.face('left');
    s.face('right');
    await this.wait(400);
    Audio8.playSong(SONGS.title);
    this.tweens.add({ targets: f, x: f.x - 3, duration: 300, onUpdate: () => f.sync() });
    await this.tweenP({ targets: s, x: s.x + 3, duration: 300, onUpdate: () => s.sync() });
    Audio8.sfx('pop');
    const heart = this.add.image((f.x + s.x) / 2, f.y - 30, 'heartBig').setDepth(2000).setScale(0);
    this.tweens.add({ targets: heart, scale: 1, duration: 400, ease: 'Back.Out' });
    for (let i = 0; i < 10; i++) {
      const h = this.add.image((f.x + s.x) / 2 + (Math.random() - 0.5) * 26, f.y - 20, Math.random() < 0.5 ? 'heart' : 'heartPink').setDepth(2001);
      this.tweens.add({ targets: h, y: h.y - 30 - Math.random() * 30, x: h.x + (Math.random() - 0.5) * 30, alpha: 0,
        delay: i * 120, duration: 1100, onComplete: () => h.destroy() });
    }
    await this.wait(2000);
    this.tweens.add({ targets: heart, alpha: 0, y: heart.y - 10, duration: 500, onComplete: () => heart.destroy() });
    f.face('up');
    s.face('up');
    await this.wait(500);
    this.busy = false;
    this.enterZii();
  }

  // --- Casa degli zii ---
  async enterZii() {
    if (this.stage < 2) {
      await this.talk([[null, 'La porta è chiusa. Forse prima bisogna fare un bel giro…']]);
      return;
    }
    this.busy = true;
    await this.fade(true);
    this.inside = 'zii';
    this.setRain(false);
    this.mover.speed = 1;
    this.mover.teleport(29, 27, 'up');
    this.placeFollower(28, 27, 'up');
    this.setRoomCamera(22, 36, 20, 29);
    this.steps = L3_GOAL;
    this.updateSteps();
    await this.fade(false);
    await this.wait(400);

    this.zio.ch.face('down');
    this.zia.ch.face('down');
    await this.talk([
      ['Zia Dorota', 'Oh my goodness! Where have you two walked from?!'],
      ['Simone', 'Ehm… from Harrods. Via Buckingham Palace. And Big Ben. And a coffee.'],
      ['Zio Paul', 'Blimey. You do know the Tube works brilliantly in London, yeah?'],
    ]);
    this.setStage(3);
    await this.fade(true);
    await this.showMap(2, true);
    // e quella sera stessa… (il terzo oggetto arriva nella scena della febbre)
    this.goTo('LondonNight');
  }

  fanfare() {
    const N = NOTE_FREQ;
    [[N.C5, 0], [N.E5, 0.12], [N.G5, 0.24], [N.C6, 0.36], [N.G5, 0.6], [N.C6, 0.72]].forEach(([f, d]) => {
      Audio8.tone(f, d >= 0.72 ? 0.6 : 0.12, { vol: 0.12, delay: d });
      Audio8.tone(f / 2, d >= 0.72 ? 0.6 : 0.12, { type: 'triangle', vol: 0.15, delay: d });
    });
  }

  fade(out) {
    const cam = this.cameras.main;
    return new Promise((r) => {
      if (out) { cam.fadeOut(350, ...FADE_RGB); cam.once('camerafadeoutcomplete', r); }
      else { cam.fadeIn(350, ...FADE_RGB); cam.once('camerafadeincomplete', r); }
    });
  }

  // Mappa di Londra dall'alto con la linea tratteggiata che si allunga (alla Indiana Jones).
  // leg = -1: solo il programma della giornata
  async showMap(leg, fromBlack = false) {
    const ov = this.add.container(0, 0).setScrollFactor(0).setDepth(1400);
    ov.add(this.add.image(0, 0, 'londonMap').setOrigin(0, 0));
    const labels = [
      ['Harrods', LONDON_PTS.harrods, -16, -22], ['Buckingham', LONDON_PTS.buck, -40, 2], ['Big Ben', LONDON_PTS.bigben, 6, -12],
      ['caffè', LONDON_PTS.bar, -10, -20], ['zii', LONDON_PTS.zii, 8, -10], ['partenza', LONDON_PTS.start, -20, -16],
    ];
    for (const [t, [x, y], dx, dy] of labels) ov.add(addText(this, x + dx, y + dy, t, { color: 0x6a4a2a }));
    const g = this.add.graphics();
    ov.add(g);
    const drawDash = (pts, upTo) => {
      // tratteggio lungo la spezzata fino alla lunghezza upTo
      let walked = 0;
      for (let i = 0; i < pts.length - 1; i++) {
        const [ax, ay] = pts[i], [bx, by] = pts[i + 1];
        const len = Math.hypot(bx - ax, by - ay);
        for (let d = 0; d < len; d += 6) {
          if (walked + d > upTo) return [ax + (bx - ax) * d / len, ay + (by - ay) * d / len];
          const t0 = d / len, t1 = Math.min(1, (d + 3) / len);
          g.fillStyle(0xc8323a);
          g.fillRect(Math.round(ax + (bx - ax) * t0) - 1, Math.round(ay + (by - ay) * t0) - 1, 3, 3);
          if (t1 < 1) g.fillRect(Math.round(ax + (bx - ax) * t1) - 1, Math.round(ay + (by - ay) * t1) - 1, 3, 3);
        }
        walked += len;
      }
      return pts[pts.length - 1];
    };
    const legLen = (pts) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
    const pin = this.add.image(LONDON_PTS.start[0], LONDON_PTS.start[1], 'heart');
    ov.add(pin);
    const counterTxt = addText(this, 240, 232, '', { scale: 2, color: 0x6a3a2a, origin: [0.5, 0.5] });
    ov.add(counterTxt);
    const capBox = this.add.rectangle(240, 46, 10, 15, 0xfbf3e4, 0.92).setStrokeStyle(1, 0x8a6a4a);
    ov.add(capBox);
    const caption = addText(this, 240, 46, '', { color: 0x6a3a2a, origin: [0.5, 0.5] });
    ov.add(caption);
    const captions = [
      'Il programma: Harrods, un caffè, poi dagli zii. Tutto a piedi.',
      'Prima tappa: Harrods. Fatto!',
      "St James's Park, Buckingham Palace, Big Ben… e finalmente un caffè.",
      'Mezza Londra attraversata a piedi. 40.000 passi!',
    ];
    caption.setText(captions[leg + 1]);
    capBox.setSize(FontMetrics.measure(fontText(captions[leg + 1])) + 14, 15);
    const targets = [12480, 31250, L3_GOAL];
    const from = this.steps;
    const to = leg >= 0 ? Math.max(from, targets[leg]) : 0;
    counterTxt.setText(`👣 ${fmtSteps(from)} / 40.000`);

    const prev = [];
    for (let i = 0; i < leg; i++) prev.push(LONDON_LEGS[i]);
    prev.forEach(p => drawDash(p, Infinity));
    if (leg > 0) pin.setPosition(...LONDON_LEGS[leg - 1][LONDON_LEGS[leg - 1].length - 1]);

    if (fromBlack) {
      await this.fade(false);
    } else {
      ov.setAlpha(0);
      await this.tweenP({ targets: ov, alpha: 1, duration: 400 });
    }

    if (leg >= 0) {
      const pts = LONDON_LEGS[leg];
      const total = legLen(pts);
      const prog = { t: 0 };
      await this.tweenP({
        targets: prog, t: 1, duration: 2600, ease: 'Sine.InOut',
        onUpdate: () => {
          g.clear();
          prev.forEach(p => drawDash(p, Infinity));
          const end = drawDash(pts, total * prog.t);
          pin.setPosition(Math.round(end[0]), Math.round(end[1]) - 4);
          this.steps = from + (to - from) * prog.t;
          counterTxt.setText(`👣 ${fmtSteps(this.steps)} / 40.000`);
          if (Math.random() < 0.25) Audio8.sfx('blip');
        },
      });
      this.steps = to;
      this.updateSteps();
      Audio8.sfx('checkpoint');
    }
    this.tweens.add({ targets: pin, scale: 1.6, duration: 300, yoyo: true, repeat: -1 });
    const prompt = addText(this, 240, 252, Controls.isTouch ? 'Tocca per continuare' : 'Premi A per continuare', { color: 0x8a5a3a, origin: [0.5, 0.5] });
    ov.add(prompt);
    this.tweens.add({ targets: prompt, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });
    await this.wait(500);
    await this.waitA();
    await this.tweenP({ targets: ov, alpha: 0, duration: 400 });
    ov.destroy();
  }
}
