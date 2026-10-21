// Livello 3 — Londra, 40.000 passi.
// Una lunga passeggiata da Kensington a Harrods, St James's Park, Buckingham Palace, Big Ben,
// il caffè da 6 sterline, il Tamigi e finalmente la casa degli zii. Simone segue Francesca.

// Legenda: ~ cielo  H edifici  D porta  s marciapiede  r strada  v/u fascia bassa  g prato  p vialetto
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
  'vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvwwwwwwwwwwvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv', // 15
  'uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuwwwwwwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu', // 16
  'uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuwwwwwwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu', // 17
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

const L3_WALK = 'sgpqFCe';
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

  // fascia bassa: giardini, ringhiere, siepi
  const lowY = 16 * TILE;
  for (let x = 0; x < W; x += 16) {
    const colI = Math.floor(x / 16);
    if (colI >= 118 && colI <= 127) continue;
    if (!(colI >= 44 && colI <= 87)) {
      Pix.rect(ctx, x, lowY + 2, 16, 1, '#1e1e26');
      for (let k = 0; k < 16; k += 3) Pix.rect(ctx, x + k, lowY, 1, 8, '#1e1e26');
      if (rnd() < 0.6) { Pix.disc(ctx, x + 8, lowY + 16, 6, '#3f7a3a'); Pix.rect(ctx, x + 4, lowY + 11, 6, 1, '#56944a'); }
      if (rnd() < 0.3) for (let k = 0; k < 4; k++) Pix.px(ctx, x + 3 + k * 3, lowY + 26, ['#e8506a', '#f2c14e', '#ffffff'][k % 3]);
    } else {
      if (rnd() < 0.35) { Pix.disc(ctx, x + 8, lowY + 20, 8, '#2f5a34'); Pix.disc(ctx, x + 6, lowY + 18, 5, '#4f8e44'); }
      if (colI >= 66 && rnd() < 0.5) for (let k = 0; k < 5; k++) Pix.rect(ctx, x + 2 + k * 3, lowY + 34, 2, 3, '#e8506a');
    }
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

    this.stage = 0;          // 0: verso Harrods, 1: verso il bar, 2: verso gli zii, 3: fatto
    this.items = [];
    this.steps = 0;
    this.tired = 0;
    this.inside = null;
    this.bubbles = [];
    this.bumpCooldown = 0;
    this.gates = { 43: 1, 117: 2 }; // colonna -> tappa necessaria per passare
    for (const col of Object.keys(this.gates)) for (let r = 7; r <= 10; r++) this.world.blocked.add(`${col},${r}`);

    this.addNPCs();
    this.enableChallenges();
    this.addHUD();
    this.addRain();
    this.exclaim = new ExclaimMarker(this);
    this.arrow = this.add.image(0, 0, 'arrow').setScrollFactor(0).setDepth(940).setVisible(false);

    this.setOutdoorCamera();
    this.vehicleTimer = this.time.addEvent({ delay: 2600, loop: true, callback: () => this.spawnVehicle() });
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
    // lampioni decorativi sul marciapiede in basso
    for (let c = 3; c < L3_W; c += 7) {
      if (c >= 118 && c <= 127) continue;
      this.add.image(c * TILE + 8, 15 * TILE + 14, 'lampLondon').setOrigin(0.5, 1).setDepth(10 + 15 * TILE);
    }
    this.add.image(114 * TILE + 8, 7 * TILE, 'bigBen').setOrigin(0.5, 1).setDepth(depthAt(6));
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
      if (tries === 1) {
        await this.talk([
          [null, 'La guardia non muove un muscolo.'],
          ['Simone', 'Scommetto che la faccio ridere.'],
          ['Simone', 'Ehi! Lo sai qual è il colmo per una guardia? …Non avere la guardia alta!'],
          [null, '…'],
          [null, 'Non ride.'],
        ]);
      } else {
        await this.talk([[null, 'La guardia continua a non muovere un muscolo. Professionisti.']]);
      }
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
      [this.turista, 'londonTurista'], [this.signora, 'londonSignora']]) {
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

  // Autobus rossi e taxi neri che passano sulla strada
  spawnVehicle(initial) {
    if (this.inside) return;
    const cam = this.cameras.main;
    const east = Math.random() < 0.5;
    const type = Math.random() < 0.55 ? 'bus' : 'taxi';
    const y = east ? 12 * TILE + 13 : 14 * TILE + 13;
    const x = initial ? cam.scrollX + 100 + Math.random() * 280 : (east ? cam.scrollX - 70 : cam.scrollX + 550);
    const v = this.add.image(x, y, type).setOrigin(0.5, 1).setDepth(10 + y).setFlipX(!east);
    const speed = (type === 'bus' ? 70 : 105) * (east ? 1 : -1);
    const dist = 900;
    this.tweens.add({ targets: v, x: x + speed / Math.abs(speed) * dist, duration: dist / Math.abs(speed) * 1000, onComplete: () => v.destroy() });
  }

  spawnWalker() {
    if (this.inside) return;
    const cam = this.cameras.main;
    const right = Math.random() < 0.5;
    const keys = ['fanA', 'fanB', 'fanC', 'fanD', 'londoner', 'turistaA', 'kidB', 'kidC'];
    const key = keys[Math.floor(Math.random() * keys.length)];
    const x = right ? cam.scrollX - 20 : cam.scrollX + 500;
    const ch = new Character(this, key, x, 15 * TILE + 13, right ? 'right' : 'left');
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
      [null, 'Anche qui puoi sfidare i londinesi che incontri. E stavolta a combattere può andarci pure Simone!'],
    ]);
    this.busy = false;
  }

  tick(time) {
    if (this.npcMenuTick) this.npcMenuTick();
    if (this.battle) this.battle.update();
    const free = !this.locked;
    this.mover.update(time, free);

    // fumetti che seguono i personaggi
    this.bubbles = this.bubbles.filter((e) => {
      if (time > e.until) { e.b.destroy(); return false; }
      e.b.setPosition(Math.round(e.ch.x), Math.round(e.ch.y - 24 - e.dy));
      return true;
    });

    // pioggerella tra Buckingham Palace e Westminster
    if (!this.inside) this.setRain(this.mover.c >= 67 && this.mover.c <= 100);
    if (this.raining) {
      const dt = Math.min(this.game.loop.delta, 50) / 1000;
      for (const d of this.rainDrops) {
        d.y += d.speed * dt;
        d.x -= d.speed * 0.25 * dt;
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
    if (this.stage === 1 && !this.squirrelDone && c >= 53 && c <= 64) this.squirrelScene();
    if (this.stage === 1 && !this.stepDone && c >= 85 && c <= 89) this.giveUpScene();
    if (this.stage === 2 && !this.finalDone && c >= 163) this.finalApproach();
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
      if (n >= need) for (let r = 7; r <= 10; r++) this.world.blocked.delete(`${col},${r}`);
    }
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
