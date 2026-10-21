// Menu di pausa in stile Octopath Traveler: pannelli blu notte, cornice dorata, cursore a rombo.
// Si apre con Esc o con il tasto menu in alto (accanto alla nota); il livello sotto resta fermo finché non si riprende.

const PAUSABLE = ['Level1', 'Level2', 'Level3', 'LondonNight', 'LevelComplete', 'Finale'];
const PARTNER_SCENES = ['Level3', 'LondonNight']; // dove Simone viaggia (e combatte) con Francesca
const PAUSE_COL = { text: 0xf3ead2, sel: 0xffe6a0, dim: 0x8a8fa8, gold: 0xd8b46a };

const Pause = {
  // Apre il menu sopra la scena in corso (se si può mettere in pausa)
  open() {
    const pause = game.scene.getScene('Pause');
    if (pause.scene.isActive()) { pause.back(); return; }
    const s = game.scene.getScenes(true).find(sc => PAUSABLE.includes(sc.scene.key));
    if (!s || s.leaving || LevelSelect.isOpen) return;
    Audio8.sfx('select');
    s.scene.pause();
    game.scene.run('Pause', { from: s.scene.key });
    game.scene.bringToTop('Pause');
  },
};

// Cornice ornata: fondo sfumato, doppio filo d'oro, rombi agli angoli
function pausePanelCanvas(w, h) {
  const [c, ctx] = Pix.canvas(w, h);
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, 'rgba(24, 34, 62, 0.94)');
  g.addColorStop(1, 'rgba(8, 12, 26, 0.94)');
  ctx.fillStyle = g;
  ctx.fillRect(2, 2, w - 4, h - 4);
  Pix.rect(ctx, 1, 1, w - 2, 1, '#5e4c2a'); Pix.rect(ctx, 1, h - 2, w - 2, 1, '#5e4c2a');
  Pix.rect(ctx, 1, 1, 1, h - 2, '#5e4c2a'); Pix.rect(ctx, w - 2, 1, 1, h - 2, '#5e4c2a');
  Pix.rect(ctx, 4, 3, w - 8, 1, '#d8b46a'); Pix.rect(ctx, 4, h - 4, w - 8, 1, '#d8b46a');
  Pix.rect(ctx, 3, 4, 1, h - 8, '#d8b46a'); Pix.rect(ctx, w - 4, 4, 1, h - 8, '#d8b46a');
  for (const [x, y] of [[3, 3], [w - 4, 3], [3, h - 4], [w - 4, h - 4]]) {
    Pix.rect(ctx, x - 1, y, 3, 1, '#ffe6a0');
    Pix.rect(ctx, x, y - 1, 1, 3, '#ffe6a0');
  }
  return c;
}

// Riga dorata con rombo al centro, sotto i titoli
function pauseRuleCanvas(w) {
  const [c, ctx] = Pix.canvas(w, 5);
  const g = ctx.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0, 'rgba(216, 180, 106, 0)');
  g.addColorStop(0.5, 'rgba(216, 180, 106, 1)');
  g.addColorStop(1, 'rgba(216, 180, 106, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 2, w, 1);
  const m = Math.floor(w / 2);
  Pix.rect(ctx, m - 1, 1, 3, 3, '#d8b46a');
  Pix.rect(ctx, m, 0, 1, 5, '#ffe6a0');
  Pix.rect(ctx, m - 2, 2, 5, 1, '#ffe6a0');
  return c;
}

// Fascia luminosa dietro la voce selezionata
function pauseBandCanvas(w) {
  const [c, ctx] = Pix.canvas(w, 13);
  const g = ctx.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0, 'rgba(216, 180, 106, 0.45)');
  g.addColorStop(1, 'rgba(216, 180, 106, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, 13);
  ctx.fillStyle = 'rgba(255, 230, 160, 0.6)';
  ctx.fillRect(0, 0, Math.floor(w * 0.6), 1);
  ctx.fillRect(0, 12, Math.floor(w * 0.6), 1);
  return c;
}

class PauseScene extends Phaser.Scene {
  constructor() { super('Pause'); }

  init(data) {
    this.from = data.from;
  }

  create() {
    Controls.reset();
    if (!this.textures.exists('pausePanelL')) {
      Pix.addTexture(this, 'pausePanelL', pausePanelCanvas(176, 150));
      Pix.addTexture(this, 'pausePanelR', pausePanelCanvas(240, 150));
      Pix.addTexture(this, 'pausePanelB', pausePanelCanvas(424, 26));
      Pix.addTexture(this, 'pauseRule', pauseRuleCanvas(140));
      Pix.addTexture(this, 'pauseBand', pauseBandCanvas(150));
      Pix.addTexture(this, 'pauseCursor', Pix.gridCanvas([
        '...K...', '..KYK..', '.KYWYK.', 'KYWYYYK', '.KYYYK.', '..KYK..', '...K...',
      ], { '.': null, K: '#3a2a10', Y: '#d8b46a', W: '#fff4d0' }));
    }
    this.dim = this.add.rectangle(0, 0, 480, 270, 0x05070f, 0).setOrigin(0, 0);
    this.tweens.add({ targets: this.dim, fillAlpha: 0.55, duration: 180 });
    this.root = this.add.container(0, 0).setAlpha(0);
    this.tweens.add({ targets: this.root, alpha: 1, duration: 180 });

    // Pannello a destra: i due viaggiatori e dove sono
    const right = [this.add.image(212, 40, 'pausePanelR').setOrigin(0, 0)];
    const lv = LEVELS.find(l => l.key === this.from);
    const where = lv ? `Livello ${lv.num} – ${lv.name}` : { LondonNight: 'Londra – quella sera', LevelComplete: 'Tra un livello e l\'altro', Finale: 'Il finale' }[this.from] || '';
    right.push(addText(this, 332, 52, where, { color: PAUSE_COL.sel, origin: [0.5, 0] }));
    right.push(this.add.image(332, 66, 'pauseRule'));
    // In Arduo i PS restano tra una lotta e l'altra: li mostriamo sotto i nomi
    const hard = Mode.hard;
    this.psText = {};
    [['francesca', 'Francesca', 290], ['simone', 'Simone', 374]].forEach(([key, name, x]) => {
      const spr = this.add.sprite(x, hard ? 142 : 150, key, 0).setOrigin(0.5, 1).setScale(3);
      spr.play(`${key}-walk-down`);
      right.push(spr, addText(this, x, hard ? 148 : 158, name, { color: PAUSE_COL.text, origin: [0.5, 0] }));
      if (hard) right.push(this.psText[key] = addText(this, x, 162, '', { color: PAUSE_COL.sel, origin: [0.5, 0] }));
    });
    if (hard) right.push(addText(this, 332, 176, 'Modalità Arduo', { color: PAUSE_COL.dim, origin: [0.5, 0] }));
    this.updatePS();
    // Pannello in basso: suggerimento comandi (e messaggi dello zaino)
    this.hintLine = Controls.isTouch ? 'A  conferma      tasto menu  chiudi' : 'Invio  conferma      Esc  indietro';
    this.hint = addText(this, 240, 209, this.hintLine, { color: PAUSE_COL.dim, origin: [0.5, 0] });
    right.push(this.add.image(28, 200, 'pausePanelB').setOrigin(0, 0), this.hint);
    this.root.add(right);

    // Pannello a sinistra: le voci del menu
    this.root.add(this.add.image(28, 40, 'pausePanelL').setOrigin(0, 0));
    this.title = addText(this, 116, 52, 'Pausa', { color: PAUSE_COL.gold, origin: [0.5, 0] });
    this.root.add([this.title, this.add.image(116, 66, 'pauseRule')]);
    this.band = this.add.image(38, 0, 'pauseBand').setOrigin(0, 0.5);
    this.cursor = this.add.image(44, 0, 'pauseCursor');
    this.tweens.add({ targets: this.cursor, x: 46, duration: 380, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.root.add([this.band, this.cursor]);
    this.items = [];
    this.lastDir = null;
    this.repeatAt = 0;
    this.showMain();
  }

  // Voci: [testo, azione]
  setMenu(title, entries, sel = 0) {
    this.title.setText(title);
    this.items.forEach(it => it.destroy());
    this.entries = entries;
    this.items = entries.map(([label], i) => {
      const t = addText(this, 56, 80 + i * 20, label, { color: PAUSE_COL.text, origin: [0, 0.5] });
      this.root.add(t);
      return t;
    });
    // anche col dito: tocco su una voce = selezione e conferma
    if (this.hit) this.hit.forEach(h => h.destroy());
    this.hit = entries.map((_, i) => this.add.zone(34, 80 + i * 20 - 9, 164, 18).setOrigin(0, 0)
      .setInteractive().on('pointerdown', () => { this.select(i); this.confirm(); }));
    this.select(sel);
  }

  select(i) {
    this.sel = (i + this.entries.length) % this.entries.length;
    const y = 80 + this.sel * 20;
    this.band.setY(y);
    this.cursor.setY(y);
    this.items.forEach((t, k) => t.setTint(k === this.sel ? PAUSE_COL.sel : PAUSE_COL.text));
  }

  confirm() {
    Audio8.sfx('select');
    this.entries[this.sel][1]();
  }

  updatePS() {
    for (const [key, t] of Object.entries(this.psText)) {
      const hp = Mode.hp(key);
      t.setText(`PS ${hp}/100`).setTint(hp <= 0 ? 0xe86a6a : hp < 40 ? 0xf0b060 : PAUSE_COL.sel);
    }
  }

  // Un messaggio al posto del suggerimento comandi, per qualche secondo
  flash(msg) {
    this.hint.setText(msg).setTint(PAUSE_COL.sel);
    if (this.flashTimer) this.flashTimer.remove();
    this.flashTimer = this.time.delayedCall(2200, () => this.hint.setText(this.hintLine).setTint(PAUSE_COL.dim));
  }

  // sel: indice o nome della voce da selezionare (le voci cambiano con modalità e musica)
  showMain(sel = 0) {
    this.backAction = () => this.close();
    const entries = [
      ['Riprendi', () => this.close(), 'resume'],
    ];
    if (Mode.hard) entries.push([`Zaino (${Mode.total()})`, () => this.showBag(), 'bag']);
    entries.push(['Scegli livello', () => this.showLevels(), 'levels']);
    if (Audio8.hasFiles()) {
      entries.push([`Musica: ${Audio8.useFiles ? 'le nostre canzoni' : 'del gioco'}`, () => {
        Audio8.setUseFiles(!Audio8.useFiles);
        this.showMain('music');
      }, 'music']);
    }
    entries.push([`Schermo TV: ${Crt.on ? 'acceso' : 'spento'}`, () => {
      Crt.set(!Crt.on);
      this.showMain('tv');
    }, 'tv']);
    entries.push(['Menu principale', () => this.showConfirm(), 'title']);
    const at = typeof sel === 'string' ? Math.max(0, entries.findIndex(e => e[2] === sel)) : sel;
    this.setMenu('Pausa', entries, at);
  }

  // Zaino (solo Arduo): scegli lo spuntino, poi chi lo mangia
  showBag(sel = 0) {
    this.backAction = () => this.showMain('bag');
    const entries = SNACK_KEYS.map(k => [`${SNACKS[k].name} x${Mode.count(k)}`, () => {
      if (!Mode.count(k)) { this.flash('Questo spuntino è finito.'); return; }
      this.showEat(k, SNACK_KEYS.indexOf(k));
    }]);
    entries.push(['Indietro', () => this.showMain('bag')]);
    this.setMenu('Zaino', entries, sel);
    this.items.forEach((t, i) => { if (i < SNACK_KEYS.length && !Mode.count(SNACK_KEYS[i])) t.setAlpha(0.5); });
  }

  showEat(item, from) {
    const heal = Math.round(SNACKS[item].heal * 100);
    this.flash(`${SNACKS[item].name}: recupera il ${heal}% dei PS`);
    this.backAction = () => this.showBag(from);
    // Simone si può rifocillare solo dove è in viaggio con Francesca (Londra)
    const who = [['francesca', 'Francesca']];
    if (PARTNER_SCENES.includes(this.from)) who.push(['simone', 'Simone']);
    this.setMenu('A chi lo dai?', [
      ...who.map(([key, name]) => [`${name}  PS ${Mode.hp(key)}`, () => {
        const got = Mode.use(item, key);
        if (!got) { this.flash(`${name} è già in piena forma!`); return; }
        Audio8.sfx('item');
        this.updatePS();
        this.flash(`${name} mangia: +${got} PS. Gnam!`);
        this.showBag(from);
      }]),
      ['Indietro', () => this.showBag(from)],
    ]);
  }

  showLevels() {
    this.backAction = () => this.showMain('levels');
    this.setMenu('Scegli livello', [
      ...LEVELS.map(l => [`${l.num}. ${l.name}`, () => this.leave(l.key)]),
      ['Indietro', () => this.showMain('levels')],
    ]);
  }

  showConfirm() {
    this.backAction = () => this.showMain('title');
    this.setMenu('Tornare al menu?', [
      ['No, resto qui', () => this.showMain('title')],
      ['Sì, al menu', () => this.leave('Title')],
    ]);
  }

  back() {
    Audio8.sfx('select');
    this.backAction();
  }

  close() {
    Controls.reset();
    this.scene.resume(this.from);
    this.scene.stop();
  }

  leave(key) {
    Controls.reset();
    if (key === 'Title') Audio8.stopSong(0.4);
    this.scene.stop(this.from);
    this.scene.start(key);
  }

  update(time) {
    if (Controls.consumeA()) { this.confirm(); return; }
    const d = Controls.dir();
    const move = d === 'up' ? -1 : d === 'down' ? 1 : 0;
    if (!move) { this.lastDir = null; return; }
    // un passo alla pressione, poi ripetizione se tieni premuto
    if (d !== this.lastDir || time >= this.repeatAt) {
      this.repeatAt = time + (d !== this.lastDir ? 380 : 140);
      this.lastDir = d;
      Audio8.sfx('blip');
      this.select(this.sel + move);
    }
  }
}
