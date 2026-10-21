// Grafica comune generata in codice: cuori, stelline, ombre, fumetti, altri personaggi.

const HEART_ROWS = [
  '.KK.KK.',
  'KRRKrRK',
  'KRWRRRK',
  'KRRRRRK',
  '.KRRRK.',
  '..KRK..',
  '...K...',
];

const Art = {
  build(scene) {
    const heartPal = { '.': null, K: PAL.outline, R: '#e8506a', r: '#f07a8c', W: '#ffd6de' };
    Pix.addTexture(scene, 'heart', Pix.gridCanvas(HEART_ROWS, heartPal));
    Pix.addTexture(scene, 'heartPink', Pix.gridCanvas(HEART_ROWS,
      { '.': null, K: '#b04a6a', R: '#f7a6bb', r: '#ffc4d2', W: '#fff0f4' }));
    Pix.addTexture(scene, 'heartEmpty', Pix.gridCanvas(HEART_ROWS,
      { '.': null, K: PAL.outline, R: '#7a5a5a', r: '#8a6a6a', W: '#9a7a7a' }));

    // Cuore grande 15x13
    Pix.addTexture(scene, 'heartBig', Pix.gridCanvas([
      '...KKK...KKK...',
      '..KRRRK.KRRRK..',
      '.KRWWRRKRRRRRK.',
      'KRWWRRRRRRRRRRK',
      'KRWRRRRRRRRRRRK',
      'KRRRRRRRRRRRRrK',
      '.KRRRRRRRRRRrK.',
      '..KRRRRRRRRrK..',
      '...KRRRRRRrK...',
      '....KRRRRrK....',
      '.....KRRrK.....',
      '......KrK......',
      '.......K.......',
    ], { '.': null, K: PAL.outline, R: '#e8506a', r: '#c03a56', W: '#ffd6de' }));

    Pix.addTexture(scene, 'star', Pix.gridCanvas([
      '..K..',
      '.KYK.',
      'KYWYK',
      '.KYK.',
      '..K..',
    ], { '.': null, K: '#8a5a1a', Y: '#ffd84a', W: '#fffbe0' }));

    Pix.addTexture(scene, 'sparkle', Pix.gridCanvas([
      '..W..',
      '..W..',
      'WWWWW',
      '..W..',
      '..W..',
    ], { '.': null, W: '#ffffff' }));

    // Ombra ellittica sotto i personaggi
    {
      const [c, ctx] = Pix.canvas(12, 4);
      ctx.fillStyle = 'rgba(42,29,26,0.28)';
      ctx.fillRect(2, 0, 8, 4);
      ctx.fillRect(0, 1, 12, 2);
      Pix.addTexture(scene, 'shadow', c);
    }

    // "!" sopra NPC e oggetti
    Pix.addTexture(scene, 'exclaim', Pix.gridCanvas([
      '.KKKKK.',
      'KWWWWWK',
      'KWWRWWK',
      'KWWRWWK',
      'KWWRWWK',
      'KWWWWWK',
      'KWWRWWK',
      '.KKKKK.',
      '...K...',
    ], { '.': null, K: PAL.outline, W: PAL.cream, R: PAL.red }));

    // Personaggi secondari (stesso stile 16x22)
    for (const [key, def] of Object.entries(NPC_DEFS)) {
      const tpl = CHAR_TEMPLATES[def.tpl];
      const pal = def.tpl === 'boy' ? boyPal(def.pal) : girlPal(def.pal);
      Pix.addSheet(scene, key, buildCharSheet(tpl, pal, def.patch), 16, 22);
    }
  },

  // Fumetto con testo, restituisce un container (origine: punta in basso al centro)
  bubble(scene, text, opts = {}) {
    const str = fontText(text);
    const w = FontMetrics.measure(str) + 10;
    const h = 15;
    const key = `bubble_${w}`;
    if (!scene.textures.exists(key)) {
      const [c, ctx] = Pix.canvas(w, h + 4);
      Pix.box(ctx, 0, 0, w, h, '#ffffff', PAL.outline);
      const mx = Math.floor(w / 2);
      Pix.rect(ctx, mx - 2, h - 1, 5, 1, '#ffffff');
      Pix.rect(ctx, mx - 3, h - 1, 1, 2, PAL.outline);
      Pix.rect(ctx, mx + 3, h - 1, 1, 2, PAL.outline);
      Pix.rect(ctx, mx - 2, h, 5, 1, '#ffffff');
      Pix.rect(ctx, mx - 1, h + 1, 3, 1, '#ffffff');
      Pix.rect(ctx, mx - 2, h + 1, 1, 1, PAL.outline);
      Pix.rect(ctx, mx + 2, h + 1, 1, 1, PAL.outline);
      Pix.rect(ctx, mx, h + 2, 1, 1, '#ffffff');
      Pix.rect(ctx, mx - 1, h + 2, 1, 1, PAL.outline);
      Pix.rect(ctx, mx + 1, h + 2, 1, 1, PAL.outline);
      Pix.rect(ctx, mx, h + 3, 1, 1, PAL.outline);
      Pix.addTexture(scene, key, c);
    }
    const cont = scene.add.container(0, 0);
    const img = scene.add.image(0, 0, key).setOrigin(0.5, 1);
    const t = addText(scene, -Math.floor(w / 2) + 5, -h - 4 + 3, text, { color: opts.color || 0x2a1d1a });
    cont.add([img, t]);
    cont.setDepth(opts.depth || 900);
    return cont;
  },
};

// Patch comuni
const PATCH = {
  // Berretto di lana (sostituisce le prime righe dei capelli)
  beanie: {
    down: { 0: '......KKKK......', 1: '....KKXXXXKK....', 2: '...KXXxXXxXXK...', 3: '..KXXxXXxXXxXK..', 4: '..KxxxxxxxxxxK..' },
    up: { 0: '......KKKK......', 1: '....KKXXXXKK....', 2: '...KXXxXXxXXK...', 3: '..KXXxXXxXXxXK..', 4: '..KxxxxxxxxxxK..' },
    left: { 0: '......KKKK......', 1: '....KKXXXXKK....', 2: '...KXXxXXxXXK...', 3: '..KXxXXxXXxXXK..', 4: '..KxxxxxxxxxxK..' },
  },
  // Capelli corti / pelato con frangia rada (per lo zio, ecc.)
  bald: {
    down: { 1: '....KKSSSSKK....', 2: '...KSSSSSSSSK...', 3: '..KHSSSSSSSSHK..', 4: '..KHSSSSSSSSHK..' },
    up: { 1: '....KKSSSSKK....', 2: '...KSSSSSSSSK...', 3: '..KSSSSSSSSSSK..', 4: '..KHSSSSSSSSHK..' },
    left: { 1: '....KKSSSSKK....', 2: '...KSSSSSSSSK...', 3: '..KSSSSSSSSHHK..', 4: '..KSSSSSSSSHHK..' },
  },
};

// Personaggi secondari: template + palette (+ patch)
const NPC_DEFS = {
  skaterA: { tpl: 'boy', pal: { H: '#c9a04a', h: '#e8c46a', A: '#3f7fbf', a: '#2c5f96', C: '#e8e0d0', c: '#bfb6a6', P: '#2d3a5a', X: '#d9434f', x: '#f2f2f2' }, patch: PATCH.beanie },
  skaterB: { tpl: 'girl', pal: { H: '#2a1d1a', h: '#4a3530', d: '#1a1210', M: '#8a5ab8', m: '#6a3e96', J: '#2a2a3a', Y: '#ffffff' } },
  skaterC: { tpl: 'boy', pal: { H: '#2a1d1a', h: '#4a3530', S: '#c98e64', s: '#a8704c', A: '#f2c14e', a: '#c08a2e', C: '#4f9a5a', c: '#36713f', P: '#33333f', X: '#3f7fbf', x: '#9fd0ff' }, patch: PATCH.beanie },
  skaterD: { tpl: 'girl', pal: { H: '#d9714a', h: '#f0965e', d: '#a8502e', M: '#5ab8b0', m: '#3e968e', J: '#4a3a5a', Y: '#f29bb0' } },
  skaterE: { tpl: 'boy', pal: { H: '#8a8a8a', h: '#b0b0b0', A: '#d9434f', a: '#9c2a3a', C: '#2a2a3a', c: '#1a1a26', P: '#5a4a3a' } },
  fanA: { tpl: 'girl', pal: { H: '#e8c46a', h: '#fbe08a', d: '#b08a3a', M: '#f2a65a', m: '#d0823a' } },
  fanB: { tpl: 'boy', pal: { H: '#6e4832', h: '#8a5e44', A: '#5a8a4a', a: '#3e6a32', C: '#5a8a4a', c: '#3e6a32' } },
  fanC: { tpl: 'girl', pal: { H: '#4a2e22', h: '#6e4832', d: '#2a1d1a', M: '#d9434f', m: '#9c2a3a', S: '#c98e64', s: '#a8704c' } },
  fanD: { tpl: 'boy', pal: { H: '#2a1d1a', h: '#3a2a26', A: '#f2c14e', a: '#c08a2e', C: '#3f7fbf', c: '#2c5f96', X: '#f2c14e', x: '#ffffff' }, patch: PATCH.beanie },

  // Gianicolo
  sindaco: {
    tpl: 'boy',
    pal: { H: '#9a9a9a', h: '#c4c4c4', C: '#3a3a4a', c: '#2a2a36', A: '#f4f0e8', a: '#d9434f', V: '#3a9a4a', W: '#f6f6f6', Q: '#d9434f', P: '#2a2a36', O: '#1e1a18' },
    patch: {
      down: {
        1: '....KKSSSSKK....', 2: '...KHSSSSSSHK...', 3: '..KHHSSSSSSHHK..',
        11: '...KSHHHHHHSK...',
        13: '...KCVWQAACCK...', 14: '..KCCCVWQACCCK..', 15: '..KCCCCVWQCCCK..',
        16: '.KCCCCCCVWQCCCK.', 17: '.KSCCCCCCVWQCSK.', 18: '..KCCCCCCCVWQK..',
      },
      up: {
        1: '....KKSSSSKK....', 2: '...KHSSSSSSHK...',
        13: '...KCCAAQWVCK...', 14: '..KCCCAQWVCCCK..', 15: '..KCCCQWVCCCCK..',
        16: '.KCCCQWVCCCCCCK.', 17: '.KSCQWVCCCCCCSK.', 18: '..KQWVCCCCCCCK..',
      },
      left: {
        1: '....KKSSSSKK....', 2: '...KSSSSSSHHK...',
        11: '..KHHSSSSSK.....',
        13: '...KAACVWQK.....', 14: '..KCAACVWQCK....', 15: '..KCCCVWQCCK....',
        16: '..KCCVWQCCCK....', 17: '..KCVWQCCCCK....', 18: '..KVWQCcCCCK....',
      },
    },
  },
  turistaA: { tpl: 'boy', pal: { H: '#d9a04a', h: '#f0c46a', A: '#f2c14e', a: '#d9434f', C: '#4fb8c9', c: '#3a8c9a', P: '#e8dcc0', O: '#8a5a3a', X: '#f4f0e0', x: '#d8c8a0' }, patch: PATCH.beanie },
  turistaB: { tpl: 'girl', pal: { H: '#e8c46a', h: '#fbe08a', d: '#b08a3a', M: '#f29bb0', m: '#d0607e', J: '#f4f0e0', Y: '#4fb8c9' } },
  kidA: { tpl: 'boy', pal: { H: '#2a1d1a', h: '#4a3530', A: '#4f9a5a', a: '#36713f', C: '#4f9a5a', c: '#36713f', P: '#3b3b52' } },
  kidB: { tpl: 'girl', pal: { H: '#6e4832', h: '#8a5e44', d: '#4a2e22', M: '#f2a65a', m: '#d0823a', J: '#3b3b52' } },
  kidC: { tpl: 'boy', pal: { H: '#c9a04a', h: '#e8c46a', A: '#ffffff', a: '#d9434f', C: '#d9434f', c: '#9c2a3a', P: '#2a2a3a' } },
  kidD: { tpl: 'girl', pal: { H: '#2a1d1a', h: '#4a3530', d: '#1a1210', M: '#7ac0ff', m: '#4f8fcf', J: '#2a2a3a', S: '#c98e64', s: '#a8704c' } },
  cameriere: { tpl: 'boy', pal: { H: '#2a1d1a', h: '#3a2a26', A: '#ffffff', a: '#e8e0d0', C: '#2a2a2a', c: '#1a1a1a', P: '#2a2a2a', O: '#1a1a1a' } },
  nonna: { tpl: 'girl', pal: { H: '#c8c8c8', h: '#e8e8e8', d: '#9a9a9a', M: '#8a5ab8', m: '#6a3e96', J: '#4a3a5a', Y: '#f2c14e' } },

  // Londra
  guardia: {
    tpl: 'boy',
    pal: { X: '#1e1a1e', x: '#3a343a', C: '#c8323a', c: '#9c2a2a', A: '#f2c14e', a: '#f4f4f4', P: '#1e1e26', O: '#101010' },
    patch: {
      down: {
        0: '.....KKKKKK.....', 1: '....KXXXXXXK....', 2: '...KXXxXXXXXK...', 3: '...KXXXXXxXXK...',
        4: '...KXxXXXXXXK...', 5: '..KXXXXXXXXXXK..', 6: '..KXXXXXXXXXXK..',
      },
      up: {
        0: '.....KKKKKK.....', 1: '....KXXXXXXK....', 2: '...KXXxXXXXXK...', 3: '...KXXXXXxXXK...',
        4: '...KXxXXXXXXK...', 5: '..KXXXXXXXXXXK..', 6: '..KXXXXXXXXXXK..',
      },
      left: {
        0: '.....KKKKKK.....', 1: '....KXXXXXXK....', 2: '...KXXXXXXXXK...', 3: '...KXxXXXXXXK...',
        4: '..KXXXXXXxXXK...', 5: '..KXXXXXXXXXXK..', 6: '.KSSSSSXXXXXXK..',
      },
    },
  },
  commessa: { tpl: 'girl', pal: { H: '#2a1d1a', h: '#4a3530', d: '#1a1210', M: '#2f6a4a', m: '#24523a', Y: '#f2c14e', J: '#24523a' } },
  barista: { tpl: 'boy', pal: { H: '#1e1a1a', h: '#3a3030', A: '#ffffff', a: '#e8e0d0', C: '#7a5a3a', c: '#5a4028', P: '#2a2a3a' } },
  zioPaul: {
    tpl: 'boy',
    // brizzolato, capelli pettinati indietro, barba grigia, camicia bianca e giacca nera
    pal: { H: '#8a847c', h: '#c4beb4', B: '#a8a29a', C: '#26262c', c: '#18181c', A: '#f4f4f0', a: '#d8d8d0', P: '#2a2a32', O: '#1a1614' },
    patch: {
      down: {
        2: '...KHhhhHhhHK...', 3: '..KHhHhHHhHhHK..', 4: '..KHHSSSSSSHHK..', 5: '..KHSSSSSSSSHK..',
        9: '..KBSSSSSSSSBK..', 10: '...KBSBBBBSBK...', 11: '...KBBBMMBBBK...', 12: '....KBBBBBBK....',
        13: '...KAAaAAaAAK...',
      },
      up: { 2: '...KHhhhHhhHK...', 3: '..KHhHhHHhHhHK..', 4: '..KHHhHHhHHhHK..' },
      left: {
        2: '...KHhhHhhHHK...', 3: '..KSHHhHHhHHHK..', 4: '..KSSHHhHHHhHK..',
        9: '.KSSSSSSBBHHK...', 10: '..KBBSSSBBHK....', 11: '..KBMBBBBBK.....', 12: '...KBBBBBK......',
      },
    },
  },
  // il film sul soffitto: caricature di Hugh Grant (ciuffo anni '90, completo blu) e Bridget Jones
  hughGrant: {
    tpl: 'boy',
    pal: { H: '#3a2418', h: '#5e3c26', C: '#2c3a5a', c: '#1e2840', A: '#f4f4f0', a: '#8a2a3a', P: '#26304a', O: '#141018' },
    patch: {
      down: { 5: '..KHHhHSSHHhHK..', 6: '..KHhSSSSSShHK..' },
      left: { 5: '..KHHHHHHHHHHK..', 6: '.KHHSSSHHHHHHK..' },
    },
  },
  bridget: { tpl: 'girl', pal: { H: '#b07a44', h: '#d4a466', d: '#875a30', M: '#d9434f', m: '#a8303c', J: '#2a2a36', j: '#1e1e28', Y: '#f4f4f0' } },
  ziaDorota: { tpl: 'girl', pal: { H: '#2a1d1a', h: '#4a3028', d: '#1a1210', M: '#c06a8a', m: '#9a4a6a', J: '#4a4a5a', Y: '#f4f4f4' } },
  londoner: { tpl: 'boy', pal: { H: '#4a2e22', h: '#6e4832', X: '#1e1a1e', x: '#3a3a3a', C: '#3a3a4a', c: '#2a2a36', A: '#d9434f', a: '#9c2a3a' }, patch: PATCH.beanie },

  // Celebrità sul marciapiede in basso (caricature affettuose)
  paddington: {
    tpl: 'boy',
    // orsetto col cappello rosso e il montgomery blu
    pal: { H: '#c8323a', h: '#e85a4a', S: '#a8703a', s: '#8a5a2a', R: '#a8703a', T: '#dcb482', L: '#2a1d1a',
      C: '#3f6fbf', c: '#2c4f8f', A: '#3f6fbf', a: '#f2c14e', P: '#8a5a2a', O: '#6a4220' },
    patch: {
      down: {
        0: '.....KKKKKK.....', 1: '....KHHHHHHK....', 2: '....KHhHHHHK....', 3: '....KHHHHHHK....',
        4: '.KKKHHHHHHHHKKK.', 5: '.KHHHHHHHHHHHHK.', 6: '..KSSSSSSSSSSK..',
        10: '...KSSTTTTSSK...', 11: '...KSTTLLTTSK...', 12: '....KSTTTTSK....',
      },
      up: {
        0: '.....KKKKKK.....', 1: '....KHHHHHHK....', 2: '....KHhHHHHK....', 3: '....KHHHHHHK....',
        4: '.KKKHHHHHHHHKKK.', 5: '.KHHHHHHHHHHHHK.', 6: '..KSSSSSSSSSSK..', 7: '..KSSSSSSSSSSK..',
        8: '..KSSSSsSSSSSK..', 9: '..KsSSSSSSSSsK..', 10: '...KSSSSSSSSK...',
      },
      left: {
        0: '.....KKKKKK.....', 1: '....KHHHHHHK....', 2: '....KHhHHHHK....', 3: '....KHHHHHHK....',
        4: '.KKKHHHHHHHHKK..', 5: '.KHHHHHHHHHHHHK.', 6: '.KSSSSSSSSSSSK..', 7: '.KSSSSSSSSSSSK..',
        8: '.KSESSSSSSSSK...', 9: '.KLTSSSSssSSK...', 10: '..KTTSSSSsSK....', 11: '..KTTSSSSSK.....',
      },
    },
  },
  // giacca di tweed, cravattino sottile, sopracciglia perennemente alzate
  mrBean: {
    tpl: 'boy',
    pal: { H: '#4a3020', h: '#6a4630', C: '#7a5a3a', c: '#5e4428', A: '#f4f0e6', a: '#7a2a2a', P: '#4a4a52', O: '#1e1a18' },
    patch: {
      down: { 7: '..KSLLSSSSLLSK..', 11: '...KSSMMMMSSK...' },
      left: { 7: '.KLLSSSSHHHHHK..' },
    },
  },
  // cappello da cacciatore a quadri e cappotto lungo
  sherlock: {
    tpl: 'boy',
    pal: { H: '#2a1d1a', h: '#3a2a26', X: '#9a7a52', x: '#6e5434', C: '#4a4a54', c: '#34343c', A: '#4a5a8a', a: '#34406e', P: '#34343c', O: '#1a1614' },
    patch: PATCH.beanie,
  },
  // cappello nero col fiore e cappotto blu notte
  maryPoppins: {
    tpl: 'girl',
    pal: { H: '#2a1d1a', h: '#4a3028', d: '#1a1210', X: '#1e1a1e', M: '#2c3a6a', m: '#1e2850', Y: '#d9434f', J: '#2c3a6a', j: '#1e2850', O: '#1a1614' },
    patch: {
      down: { 0: '.....KKKKKK.....', 1: '....KXXXXXXK....', 2: '....KXYXXXXK....', 3: 'KKKKXXXXXXXXKKKK', 4: 'KXXXXXXXXXXXXXXK' },
      up: { 0: '.....KKKKKK.....', 1: '....KXXXXXXK....', 2: '....KXXXXYXK....', 3: 'KKKKXXXXXXXXKKKK', 4: 'KXXXXXXXXXXXXXXK' },
      left: { 0: '.....KKKKKK.....', 1: '....KXXXXXXK....', 2: '....KXXXXXYK....', 3: 'KKKKXXXXXXXXKKK.', 4: 'KXXXXXXXXXXXXXK.' },
    },
  },
  // capelli all'indietro lucidi, occhiali scuri, cappotto cammello: il re del cinepanettone
  deSica: {
    tpl: 'boy',
    pal: { H: '#1a1414', h: '#4a4040', S: '#e8b088', s: '#c88e66', R: '#e09a7c', C: '#c89a5a', c: '#a07a40', A: '#f4f4f0', a: '#e8b088', P: '#2a2a32', O: '#1a1410', W: '#ffffff' },
    patch: {
      down: {
        2: '...KHhhhhhhHK...', 3: '..KHHhhhhhhHHK..', 4: '..KHHHHHHHHHHK..', 5: '..KHSSSSSSSSHK..',
        8: '..KSLLLLLLLLSK..', 11: '...KSMWWWWMSK...',
      },
      up: { 2: '...KHhhhhhhHK...', 3: '..KHHhhhhhhHHK..', 4: '..KHHhhhhhhHHK..' },
      left: { 2: '...KHhhhhhhHK...', 3: '..KHHhhhhhhHHK..', 8: '.KLLLSSSSHHHK...' },
    },
  },
  // capelli lunghi ramati e un sorriso enorme
  julia: { tpl: 'girl', pal: { H: '#8a3a22', h: '#b0562e', d: '#6a2a18', M: '#2a2a36', m: '#1e1e28', Y: '#f2c14e', J: '#3a5a8a', j: '#2c4a74', r: '#c4505a' },
    patch: { down: { 10: '.KHhHSrrrrSHhHK.' } } },
  // occhiali tondi, cicatrice, cravatta rossa e oro
  harryPotter: {
    tpl: 'boy',
    pal: { H: '#1e1a1a', h: '#3a3030', C: '#1e1a22', c: '#141018', A: '#c8323a', a: '#f2c14e', P: '#2a2a32', O: '#141010', Z: '#c8323a' },
    patch: {
      down: { 2: '...KHhHHhHHhK...', 3: '..KHhHHhHHHhHK..', 6: '..KHSSZSSSSSHK..', 8: '..KSLELSSLELSK..' },
      left: { 8: '.KLELSSSSHHHK...' },
    },
  },
  // maglia bianca dell'Inghilterra, ciuffo biondo
  beckham: {
    tpl: 'boy',
    pal: { H: '#c8a050', h: '#e8c878', C: '#f4f4f4', c: '#d0d0d8', A: '#f4f4f4', a: '#2a3a6a', P: '#2a3a6a', O: '#1a1a1a' },
    patch: { down: { 2: '...KHhhhhhHHK...', 3: '..KHHhhhhhHHHK..' } },
  },
};
