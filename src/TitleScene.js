// Schermata iniziale: tramonto su Roma, cuoricini, "Tocca per iniziare", poi l'introduzione di Simone.

class TitleScene extends BaseScene {
  constructor() { super('Title'); }

  create() {
    this.initBase();
    if (!this.textures.exists('titleSky')) {
      const [c, ctx] = Pix.canvas(480, 270);
      drawSunsetSky(ctx, 480, 270, { sunX: 300, sunY: 222 });
      drawRomeSkyline(ctx, 480, 270, { domeX: 330, towerX: 150, pines: [40, 74, 440] });
      Pix.addTexture(this, 'titleSky', c);
      for (let i = 0; i < 3; i++) Pix.addTexture(this, `cloud${i}`, cloudCanvas(11 + i * 7, 36 + i * 10));
    }
    this.add.image(0, 0, 'titleSky').setOrigin(0, 0);

    [[60, 40, 0], [300, 28, 1], [400, 70, 2], [170, 84, 0]].forEach(([x, y, i], n) => {
      const cl = this.add.image(x, y, `cloud${i}`).setAlpha(0.9);
      this.tweens.add({ targets: cl, x: x + 40 + n * 6, duration: 14000 + n * 3000, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    });

    this.floatHearts(14, { x: 0, y: 0, w: 480, h: 270 }, { depth: 5 });

    this.titleGroup = this.add.container(240, 78).setDepth(20);
    const t1 = addText(this, 0, -26, 'Il gioco di', { scale: 2, color: 0xfbf3e4, shadow: 0x3a2340, origin: [0.5, 0.5] });
    const t2 = addText(this, 0, 6, 'Picci Picci', { scale: 4, color: 0xffd6de, shadow: 0x7a2a4a, origin: [0.5, 0.5] });
    const t3 = addText(this, 0, 38, "un'avventura in tre livelli", { color: 0xfde3a0, shadow: 0x3a2340, origin: [0.5, 0.5] });
    const hl = this.add.image(-118, 6, 'heart').setScale(2);
    const hr = this.add.image(118, 6, 'heart').setScale(2);
    this.titleGroup.add([t1, t2, t3, hl, hr]);
    this.tweens.add({ targets: [hl, hr], scale: 2.4, duration: 500, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.tweens.add({ targets: this.titleGroup, y: 82, duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.InOut' });

    this.prompt = addText(this, 240, 196, Controls.isTouch ? 'Tocca per iniziare' : 'Premi Invio per iniziare',
      { scale: 2, color: 0xfbf3e4, shadow: 0x3a2340, origin: [0.5, 0.5], depth: 20 });
    this.tweens.add({ targets: this.prompt, alpha: 0.25, duration: 650, yoyo: true, repeat: -1 });

    Audio8.playSong(SONGS.title);
    this.started = false;

    // Selettore livelli nascosto: tieni premuto sul titolo per 3 secondi (o tasto L)
    const hit = this.add.zone(240, 80, 300, 90).setInteractive();
    this.titleDown = false;
    let holdTimer = null;
    hit.on('pointerdown', () => {
      this.titleDown = true;
      holdTimer = this.time.delayedCall(3000, () => {
        holdTimer = null;
        this.started = true;
        LevelSelect.open();
      });
    });
    hit.on('pointerup', () => {
      // tocco breve sul titolo: si parte normalmente
      if (holdTimer) { holdTimer.remove(); holdTimer = null; if (!this.started) this.begin(); }
      this.titleDown = false;
    });
    hit.on('pointerout', () => {
      if (holdTimer) { holdTimer.remove(); holdTimer = null; }
      this.titleDown = false;
    });
    this.input.keyboard.on('keydown-L', () => { this.started = true; LevelSelect.open(); });
  }

  tick() {
    if (this.npcMenuTick) this.npcMenuTick();
    if (this.started || this.locked || this.pending) return;
    if (!Controls.consumeA()) return;
    // Se il tocco è sul titolo, decide il rilascio (pressione lunga = selettore livelli)
    this.pending = true;
    this.time.delayedCall(120, () => {
      this.pending = false;
      if (!this.titleDown && !this.started && !LevelSelect.isOpen) this.begin();
    });
  }

  async begin() {
    if (this.started || this.npcMenuTick) return;
    this.started = true;
    Audio8.sfx('select');
    tryFullscreen();
    this.tweens.killTweensOf(this.prompt);
    this.prompt.setVisible(false);
    // Menu: continua da dove eri, nuova partita o scegli un livello
    const saved = Save.level();
    const canContinue = saved && saved !== 'Title' && this.scene.get(saved);
    const levelNames = ['Livello 1 – Il Gianicolo', 'Livello 2 – La pista', 'Livello 3 – Londra'];
    for (;;) {
      const main = canContinue ? ['Continua', 'Nuova partita', 'Scegli livello'] : ['Nuova partita', 'Scegli livello'];
      main.push('Impostazioni');
      const i = await GianicoloBattle.choose(this, 'Menu', main, { x: 240, y: 168 });
      if (i < 0) return;
      Audio8.sfx('select');
      if (main[i] === 'Continua') { this.goTo(saved); return; }
      if (main[i] === 'Nuova partita') {
        // La modalità si sceglie solo qui: Viaggio (com'è sempre stato) o Arduo (PS che restano, spuntini in giro)
        const m = await GianicoloBattle.choose(this, 'Che viaggio facciamo?', ['Viaggio: rilassato', 'Arduo: lotte toste e spuntini', 'Indietro'], { x: 240, y: 172 });
        if (m < 0 || m > 1) continue;
        Audio8.sfx('select');
        Mode.start(m === 1 ? 'arduo' : 'viaggio');
        break;
      }
      if (main[i] === 'Impostazioni') { await this.settings(); continue; }
      const lv = await GianicoloBattle.choose(this, 'Scegli livello', [...levelNames, 'Indietro'], { x: 240, y: 172 });
      if (lv >= 0 && lv < levelNames.length) { Audio8.sfx('select'); this.goTo(LEVELS[lv].key); return; }
    }
    Save.clear();
    this.busy = true;
    this.tweens.killTweensOf([this.titleGroup, this.prompt]);
    this.tweens.add({ targets: [this.titleGroup, this.prompt], alpha: 0, duration: 400 });
    const dim = this.add.rectangle(0, 0, 480, 270, 0x1a1020, 0).setOrigin(0, 0).setDepth(30);
    this.tweens.add({ targets: dim, fillAlpha: 0.35, duration: 400 });
    const sim = this.add.sprite(530, 200, 'simone', 3).setOrigin(0.5, 1).setScale(3).setDepth(40);
    sim.play('simone-walk-left');
    await this.tweenP({ targets: sim, x: 360, duration: 1100 });
    sim.anims.stop();
    sim.setFrame(0);
    await this.wait(200);
    await this.talk([
      ['Simone', 'Ciao Picci Picci! Oggi è il tuo compleanno…'],
      ['Simone', 'E visto che tu mi hai fatto delle slide, io non potevo essere da meno. Ti ho fatto un videogioco.'],
      ['Simone', 'Pronta?'],
    ]);
    Audio8.stopSong(0.6);
    this.goTo('Level1');
  }

  async settings() {
    for (;;) {
      const entries = [`Lingua: ${I18n.lang === 'en' ? 'English' : 'Italiano'}`];
      if (Audio8.hasFiles()) entries.push('Musica');
      entries.push(`Effetto TV: ${Crt.on ? 'sì' : 'no'}`, 'Indietro');
      const i = await GianicoloBattle.choose(this, 'Impostazioni', entries, { x: 240, y: 168 });
      if (i < 0 || entries[i] === 'Indietro') return;
      if (i === 0) {
        const language = await GianicoloBattle.choose(this, 'Lingua / Language', ['Italiano', 'English', 'Indietro'], { x: 240, y: 168 });
        if (language === 0 || language === 1) I18n.set(language === 1 ? 'en' : 'it');
      } else if (entries[i] === 'Musica') {
        const opts = MUSIC_CHOICES.map(([label, on]) => (on === Audio8.useFiles ? '♪ ' : '') + label);
        const m = await GianicoloBattle.choose(this, 'Che musica ascoltiamo?', [...opts, 'Indietro'], { x: 240, y: 168 });
        if (m >= 0 && m < MUSIC_CHOICES.length) Audio8.setUseFiles(MUSIC_CHOICES[m][1]);
      } else Crt.set(!Crt.on);
    }
  }
}

const MUSIC_CHOICES = [['Le nostre canzoni', true], ['Musichette del gioco', false]];

// A schermo intero va il contenitore (gioco + controlli touch), non solo il canvas
function tryFullscreen() {
  if (!Controls.isTouch || document.fullscreenElement) return;
  const el = document.getElementById('wrap');
  try {
    const p = el.requestFullscreen ? el.requestFullscreen({ navigationUI: 'hide' }) : null;
    if (p && p.then) {
      p.then(() => {
        if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => {});
      }).catch(() => {});
    }
  } catch (_) { /* iPhone: niente fullscreen, pazienza */ }
}
