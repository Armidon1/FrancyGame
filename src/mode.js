// Modalità di gioco: "Viaggio" (lotte come sempre) o "Arduo" (lotte più toste, i PS persi restano
// e si recuperano con gli spuntini dello zaino). Si sceglie solo dal menu principale.

const SNACKS = Object.freeze({
  pipas: { name: 'Pipas', heal: 0.15, icon: 'snackPipas' },
  yogurt: { name: 'Yogurt greco 0%', heal: 0.30, icon: 'snackYogurt' },
  taralli: { name: 'Taralli napoletani', heal: 0.50, icon: 'snackTaralli' },
  torta: { name: 'Torta rustica', heal: 1, icon: 'snackTorta' },
});
const SNACK_KEYS = Object.keys(SNACKS);

const Mode = {
  key: 'picci_mode_v1',
  data: null,

  fresh(mode = 'viaggio') {
    return { mode, hp: { francesca: 100, simone: 100 }, items: { pipas: 0, yogurt: 0, taralli: 0, torta: 0 } };
  },

  load() {
    if (this.data) return this.data;
    let d = null;
    try { d = JSON.parse(localStorage.getItem(this.key)); } catch (_) { /* niente salvataggio */ }
    const f = this.fresh(d && d.mode === 'arduo' ? 'arduo' : 'viaggio');
    if (d && d.hp) for (const k of ['francesca', 'simone']) if (Number.isFinite(d.hp[k])) f.hp[k] = Math.max(0, Math.min(100, d.hp[k]));
    if (d && d.items) for (const k of SNACK_KEYS) if (Number.isFinite(d.items[k])) f.items[k] = Math.max(0, d.items[k] | 0);
    if (d && d.items && Number.isFinite(d.items.cornetto)) f.items.taralli += Math.max(0, d.items.cornetto | 0); // i vecchi cornetti diventano taralli
    return (this.data = f);
  },

  store() {
    try { localStorage.setItem(this.key, JSON.stringify(this.load())); } catch (_) { /* pazienza */ }
  },

  get mode() { return this.load().mode; },
  get hard() { return this.mode === 'arduo'; },
  label(mode = this.mode) { return mode === 'arduo' ? 'Arduo' : 'Viaggio'; },

  // Nuova partita: PS pieni e zaino vuoto
  start(mode) {
    this.data = this.fresh(mode === 'arduo' ? 'arduo' : 'viaggio');
    this.store();
  },

  hp(fighter) { return this.hard ? this.load().hp[fighter] : 100; },
  setHP(fighter, v) {
    if (!this.hard) return;
    this.load().hp[fighter] = Math.max(0, Math.min(100, Math.round(v)));
    this.store();
  },

  count(item) { return this.load().items[item] || 0; },
  total() { return SNACK_KEYS.reduce((n, k) => n + this.count(k), 0); },
  add(item, n = 1) {
    this.load().items[item] = this.count(item) + n;
    this.store();
  },

  // Usa uno spuntino: restituisce i PS recuperati (0 se non serviva o non c'era)
  use(item, fighter) {
    const d = this.load();
    if (!this.count(item) || d.hp[fighter] >= 100) return 0;
    const before = d.hp[fighter];
    d.hp[fighter] = Math.min(100, before + Math.ceil(100 * SNACKS[item].heal));
    d.items[item]--;
    this.store();
    return d.hp[fighter] - before;
  },

  // Spuntino a caso: i più piccoli capitano più spesso
  randomSnack(rng = Math.random) {
    const r = rng();
    return r < 0.4 ? 'pipas' : r < 0.7 ? 'yogurt' : r < 0.9 ? 'taralli' : 'torta';
  },

  // Icone 12×12 in pixel art, create una volta per scena
  textures(scene) {
    if (scene.textures.exists('snackTorta')) return;
    const K = '#2a1d1a';
    const icons = {
      snackPipas: [['....KKKK....', '...KyyyyK...', '..KyKKKKyK..', '..KyyyyyyK..', '..KrrrrrrK..', '..KrwrrwrK..', '..KrrrrrrK..', '..KrwwwwrK..', '..KrrrrrrK..', '..KrrrrrrK..', '..KKKKKKKK..', '............'],
        { y: '#e8c45a', r: '#d9434f', w: '#fbf3e4' }],
      snackYogurt: [['............', '..KKKKKKKK..', '.KbbbbbbbbK.', '.KKKKKKKKKK.', '..KwwwwwwK..', '..KwbbbbwK..', '..KwbwwbwK..', '..KwbbbbwK..', '..KwwwwwwK..', '...KwwwwK...', '...KKKKKK...', '............'],
        { b: '#5a8fd0', w: '#fbf3e4' }],
      // tarallo napoletano: anello intrecciato dorato, con le mandorle
      snackTaralli: [['....KKKK....', '..KKhoohKK..', '.KhomhhomhK.', '.KoK....KoK.', 'KhoK....KhmK', 'KmhK....KohK', 'KohK....KmoK', 'KhmK....KhoK', '.KoK....KoK.', '.KhmohhmohK.', '..KKohhoKK..', '....KKKK....'],
        { o: '#c98a3a', h: '#f0c878', m: '#7a4524' }],
      snackTorta: [['............', '............', '...KKKKKK...', '.KKccccccKK.', 'KccgcccrcccK', 'KcrccgcccgcK', 'KKccccccccKK', 'KpKKKKKKKKpK', 'KppppppppppK', 'KpgprpgpprpK', '.KKKKKKKKKK.', '............'],
        { c: '#e8c45a', p: '#c98a4a', g: '#5aa04a', r: '#d9434f' }],
    };
    for (const [key, [rows, pal]] of Object.entries(icons)) {
      Pix.addTexture(scene, key, Pix.gridCanvas(rows, { '.': null, K, ...pal }));
    }
  },

  // "Oggetto sbloccato!" con l'icona dello spuntino, poi va nello zaino
  async give(scene, item) {
    this.textures(scene);
    await scene.itemPopup(SNACKS[item].icon, SNACKS[item].name, () => this.add(item));
  },

  // Nascondigli di spuntini (solo in Arduo): un sottoinsieme fisso dei posti adatti, uno spuntino ciascuno per visita
  // chars: le caselle adatte (alberi, statue, cabine); every: uno ogni tanti
  hideSnacks(scene, world, chars, every = 3) {
    if (!this.hard) return;
    scene.snackSpots = new Set();
    const spots = [];
    world.map.forEach((row, r) => [...row].forEach((ch, c) => {
      // ci si deve poter avvicinare da una casella libera accanto
      const near = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dc, dr]) => world.isWalkable(c + dc, r + dr));
      if (chars.includes(ch) && near && !world.interact.has(world.key(c, r))) spots.push([c, r]);
    }));
    spots.forEach(([c, r], i) => {
      if (i % every) return;
      const k = world.key(c, r);
      const item = SNACK_KEYS[[0, 1, 0, 2, 1, 0, 3, 1][(i / every) % 8]];
      scene.snackSpots.add(k);
      world.setInteract(c, r, async () => {
        if (scene.busy || !scene.snackSpots.has(k)) return;
        scene.busy = true;
        scene.exclaim.hide();
        try {
          scene.snackSpots.delete(k);
          world.interact.delete(k);
          await scene.say(null, spotLine(world.tile(c, r)));
          await this.give(scene, item);
        } finally {
          Controls.reset();
          scene.busy = false;
        }
      });
    });
  },
};

function spotLine(tile) {
  switch (tile) {
    case 'B': return 'Nella cabina telefonica qualcuno ha dimenticato uno spuntino!';
    case 'S': case 'U': return 'Ai piedi della statua c\'è qualcosa di buono...';
    default: return 'Tra i rami dell\'albero spunta qualcosa di buono...';
  }
}
