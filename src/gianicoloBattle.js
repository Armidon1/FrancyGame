// Battaglie facoltative: nessun accesso a cuori, salvataggi o progressione.
// Script classico, come actors.js e toiletBattle.js; nessuna dipendenza Phaser nel modello.
const GIANICOLO_OPPONENTS = Object.freeze(Object.fromEntries([
  ['nonna', 'La signora', 48, [['Porzione bis', 12, 'Un altro piatto. Non era una domanda.'], ['Pizzicotto affettuoso', 10, 'Le guance non erano al sicuro.']]],
  ['cameriere', 'Il cameriere', 46, [['Conto alla romana', 13, 'Il conto arriva anche senza chiederlo.'], ['Vassoio volante', 11, 'Servizio rapidissimo!']]],
  ['turistaA', 'Turista col selfie', 44, [['Selfie infinito', 10, 'Solo un altro scatto, promesso.'], ['Zaino ingombrante', 12, 'Dentro deve esserci tutta Roma.']]],
  ['turistaB', 'Turista con mappa', 45, [['Mappa spiegazzata', 11, 'Il nord era dalla parte opposta.'], ['Domanda stradale', 13, 'Scusi, il Colosseo è qui dietro?']]],
  ['kidA', 'Ninja del salto', 42, [['Salto del grillo', 12, 'Atterraggio quasi elegante.'], ['Mano fulminea', 10, 'La mano era qui un attimo fa.']]],
  ['kidB', 'Ninja della felpa', 44, [['Manica segreta', 11, 'Una tecnica molto comoda.'], ['Passetto laterale', 12, 'Ha studiato il pavimento.']]],
  ['kidC', 'Ninja delle finte', 46, [['Finta della finta', 13, 'Neanche lui sa quale fosse quella vera.'], ['Indice rotante', 10, 'Un dito, grandi ambizioni.']]],
  ['kidD', 'Ninja tranquillo', 43, [['Sbadiglio tattico', 10, 'La calma è una tecnica.'], ['Palmo gentile', 12, 'Chiede scusa prima di colpire.']]],
  ['sindaco', 'Il Sindaco', 58, [['Discorso sul fiume', 14, 'Il discorso ha preso una lunga deviazione.'], ['Fascia tricolore', 12, 'Una mossa istituzionale.']]],
  // Effetti: 'curse' = attacco di Francesca -65% e difesa di Simone su per CURSE_TURNS; 'poison' = -5% PS a ogni round.
  ['simone', 'Simone', 56, [
    ['Bestemmia Lampo', 0, 'Un lampo di parole irripetibili! Francesca è troppo scandalizzata per colpire forte, e Simone si sente invincibile.', 'curse'],
    ['Abbraccione MAX', 16, 'Una stretta da orso: morbidissima, ma toglie il fiato.'],
    ['Scorreggia', 0, 'Un attacco chimico silenzioso ma letale. Francesca è avvelenata!', 'poison'],
  ]],
].map(([key, name, hp, moves]) => [key, Object.freeze({ key, name, hp, moves: Object.freeze(moves.map(([name, damage, text, effect = null]) => Object.freeze({ name, damage, text, effect }))) })])));

// Londra: cittadini sfidabili nel livello 3 (chiave profilo -> sprite).
const LONDON_OPPONENTS = Object.freeze(Object.fromEntries([
  ['londoner', 'londoner', 'Il londinese', 47, [['Chiacchiera sul meteo', 11, 'Venti minuti sulla pioggia di domani.'], ['Spallata in metro', 13, 'Mind the gap!']]],
  ['guardia', 'guardia', 'La guardia reale', 55, [['Sguardo immobile', 10, 'Non sbatte le palpebre da tre ore.'], ['Colbacco pesante', 14, 'Un cappello che è praticamente un\'arma.']]],
  ['londonTurista', 'turistaB', 'Turista con la guida', 45, [['Fatto curioso', 11, 'Lo sapevi che… sì, lo sapevi.'], ['Foto col Big Ben', 12, 'Il flash era acceso. Di giorno.']]],
  ['londonSignora', 'nonna', 'La signora inglese', 48, [['Tè bollente', 13, 'Più bollente dell\'orgoglio britannico.'], ['Oh dear!', 10, 'Un sospiro così educato da fare male.']]],
].map(([key, sprite, name, hp, moves]) => [key, Object.freeze({ key, sprite, name, hp, moves: Object.freeze(moves.map(([name, damage, text]) => Object.freeze({ name, damage, text, effect: null }))) })])));

function battleOpponent(key) {
  for (const table of [GIANICOLO_OPPONENTS, LONDON_OPPONENTS]) {
    if (Object.prototype.hasOwnProperty.call(table, key)) return table[key];
  }
  return null;
}

const CURSE_TURNS = 2;     // turni di Francesca indeboliti dopo Bestemmia Lampo
const CURSE_ATTACK = 0.35; // attacco di Francesca -65%
const GUARD_DEFENSE = 0.5; // danni ricevuti da Simone dimezzati
const POISON_RATIO = 0.05; // veleno: 5% dei PS massimi a round

const GIANICOLO_MOVES = Object.freeze([
  { name: 'Spara Pipas', description: '2–5 pipas, 3–5 danni ciascuna.' },
  { name: 'Campari Sprits', description: 'Attacco x1,5; danni subiti x1,35. Max 2.' },
  { name: 'Pretty Priviledge', description: 'Attacco nemico -65%. Non cumulativo.' },
  { name: 'Fuggi', description: 'Via con eleganza. Nessun contrattacco.' },
]);

// Se combatte Simone: le sue mosse da avversario, rivolte al nemico.
const SIMONE_FIGHTER_MOVES = Object.freeze([
  { name: 'Abbraccione MAX', description: 'Una stretta da orso: 14–18 danni.' },
  { name: 'Bestemmia Lampo', description: 'Attacco nemico -65% e difesa su per 2 turni.' },
  { name: 'Scorreggia', description: 'Avvelena: -5% PS al nemico a ogni round.' },
  { name: 'Fuggi', description: 'Via con eleganza. Nessun contrattacco.' },
]);
const FIGHTER_NAMES = Object.freeze({ francesca: 'Francesca', simone: 'Simone' });

class GianicoloBattleState {
  constructor(key, rng = Math.random, fighter = 'francesca') {
    this.opponent = battleOpponent(key);
    if (!this.opponent) throw new Error('Avversario sconosciuto: ' + key);
    if (!FIGHTER_NAMES[fighter]) throw new Error('Combattente sconosciuto: ' + fighter);
    this.fighter = fighter;
    this.moves = fighter === 'simone' ? SIMONE_FIGHTER_MOVES : GIANICOLO_MOVES;
    this.rng = rng;
    this.playerMaxHP = this.playerHP = 100;
    this.enemyMaxHP = this.enemyHP = this.opponent.hp;
    this.spritsStacks = 0;
    this.pretty = false;
    this.weakTurns = 0;
    this.guardTurns = 0;
    this.poisoned = false;
    // Effetti delle mosse di Simone quando combatte lui (contano gli attacchi nemici).
    this.enemyWeakTurns = 0;
    this.playerGuardTurns = 0;
    this.enemyPoisoned = false;
    this.fled = false;
    this.turn = 'player';
  }
  get outcome() {
    return this.fled ? 'flee' : this.enemyHP <= 0 ? 'victory' : this.playerHP <= 0 ? 'defeat' : null;
  }
  roll(min, max) {
    return min + Math.floor(Math.max(0, Math.min(0.999999999, this.rng())) * (max - min + 1));
  }
  playerMove(index) {
    if (!Number.isInteger(index) || index < 0 || index > 3) throw new RangeError('Mossa non valida');
    if (this.outcome || this.turn !== 'player') return { skipped: true, damage: 0, hits: [], buff: null, flee: this.fled, outcome: this.outcome };
    const report = { index, name: this.moves[index].name, damage: 0, hits: [], buff: null, flee: false };
    if (index === 3) {
      this.fled = report.flee = true;
    } else if (this.fighter === 'simone') {
      if (index === 0) {
        report.damage = this.roll(14, 18);
        report.hits.push(report.damage);
        report.appliedDamage = Math.min(this.enemyHP, report.damage);
        this.enemyHP = Math.max(0, this.enemyHP - report.damage);
      } else if (index === 1) {
        report.buff = { type: 'curse', changed: !this.enemyWeakTurns };
        this.enemyWeakTurns = this.playerGuardTurns = CURSE_TURNS;
      } else {
        report.buff = { type: 'poison', changed: !this.enemyPoisoned };
        this.enemyPoisoned = true;
      }
    } else if (index === 0) {
      const count = this.roll(2, 5);
      const factor = Math.pow(1.5, this.spritsStacks) * (this.weakTurns ? CURSE_ATTACK : 1) * (this.guardTurns ? GUARD_DEFENSE : 1);
      for (let i = 0; i < count; i++) report.hits.push(Math.max(1, Math.round(this.roll(3, 5) * factor)));
      report.damage = report.hits.reduce((a, b) => a + b, 0);
      report.appliedDamage = Math.min(this.enemyHP, report.damage);
      this.enemyHP = Math.max(0, this.enemyHP - report.damage);
    } else if (index === 1) {
      const before = this.spritsStacks;
      this.spritsStacks = Math.min(2, before + 1);
      report.buff = { type: 'sprits', stacks: this.spritsStacks, changed: before !== this.spritsStacks, attack: Math.pow(1.5, this.spritsStacks), incoming: Math.pow(1.35, this.spritsStacks) };
    } else if (index === 2) {
      report.buff = { type: 'pretty', changed: !this.pretty, enemyAttack: 0.35 };
      this.pretty = true;
    }
    // Gli effetti di Bestemmia Lampo durano un numero di turni di Francesca.
    if (this.weakTurns) this.weakTurns--;
    if (this.guardTurns) this.guardTurns--;
    this.turn = this.outcome ? 'done' : 'enemy';
    report.outcome = this.outcome;
    return report;
  }
  enemyMove() {
    if (this.outcome || this.turn !== 'enemy') return { skipped: true, damage: 0, hits: [], buff: null, flee: this.fled, outcome: this.outcome };
    // Non ripete un effetto ancora attivo.
    const usable = this.opponent.moves.filter(m =>
      !(m.effect === 'curse' && (this.weakTurns || this.guardTurns)) && !(m.effect === 'poison' && this.poisoned));
    const move = usable[this.roll(0, usable.length - 1)];
    let damage = 0;
    if (move.effect === 'curse') {
      this.weakTurns = this.guardTurns = CURSE_TURNS;
    } else if (move.effect === 'poison') {
      this.poisoned = true;
    } else {
      damage = Math.max(1, Math.round(move.damage * (this.pretty ? 0.35 : 1) * Math.pow(1.35, this.spritsStacks)
        * (this.enemyWeakTurns ? CURSE_ATTACK : 1) * (this.playerGuardTurns ? GUARD_DEFENSE : 1)));
    }
    if (this.enemyWeakTurns) this.enemyWeakTurns--;
    if (this.playerGuardTurns) this.playerGuardTurns--;
    const appliedDamage = Math.min(this.playerHP, damage);
    this.playerHP = Math.max(0, this.playerHP - damage);
    let poison = 0;
    if (this.poisoned && !this.outcome) {
      poison = Math.min(this.playerHP, Math.round(this.playerMaxHP * POISON_RATIO));
      this.playerHP -= poison;
    }
    let enemyPoison = 0;
    if (this.enemyPoisoned && !this.outcome) {
      enemyPoison = Math.min(this.enemyHP, Math.max(1, Math.round(this.enemyMaxHP * POISON_RATIO)));
      this.enemyHP -= enemyPoison;
    }
    this.turn = this.outcome ? 'done' : 'player';
    return { name: move.name, text: move.text, effect: move.effect, damage, appliedDamage, poison, enemyPoison, hits: damage ? [damage] : [], buff: null, flee: false, outcome: this.outcome };
  }
}

// Stati alterati su al massimo due righe dentro il riquadro.
function statusLines(items) {
  const lines = [];
  for (const it of items) {
    const last = lines.length - 1;
    if (last >= 0 && FontMetrics.measure(fontText(lines[last] + '  ' + it)) <= 190) lines[last] += '  ' + it;
    else lines.push(it);
  }
  return lines.slice(0, 2).join('\n');
}

// Base ovale di pietra chiara, da scalare x3 come gli sprite.
function battleBaseCanvas() {
  const w = 34, h = 9;
  const [c, ctx] = Pix.canvas(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const nx = (x + 0.5 - w / 2) / (w / 2), ny = (y + 0.5 - h / 2) / (h / 2);
      const d = nx * nx + ny * ny;
      if (d > 1) continue;
      let col = '#d8c39b';
      if (d > 0.72) col = ny > 0 ? '#7d6248' : '#a68a68';
      else if (ny > 0.25) col = '#c0a77e';
      else if (ny < -0.1 && d < 0.4) col = '#eadbb6';
      Pix.px(ctx, x, y, col);
    }
  }
  return c;
}

class GianicoloBattle {
  constructor(scene, npc, opts = {}) {
    this.scene = scene;
    this.npc = npc;
    const key = opts.opponent || (typeof npc === 'string' ? npc : (npc?.key || npc?.ch?.key || npc?.sprite?.texture?.key));
    this.state = new GianicoloBattleState(key, Math.random, opts.fighter || 'francesca');
    this.fighterName = FIGHTER_NAMES[this.state.fighter];
    this.returnSong = opts.returnSong || SONGS.gianicolo;
    this.background = opts.background || 'ninjaBg';
    this.dead = false;
    this.pending = new Set();
    this.tweens = new Set();
    this.cancelled = new Promise(resolve => { this.cancelRun = resolve; });
    this.onShutdown = () => this.destroy();
    scene.events.once('shutdown', this.onShutdown);
  }

  // "Parla / Sfida! / Annulla" davanti a un personaggio; con Sfida! si sceglie chi combatte.
  // La scena deve avere challengeSession, battle, npcMenuTick (eseguito nel suo tick), exclaim e mover.
  static async offer(scene, npc, original, opts = {}) {
    if (scene.locked || scene.mover.moving) return;
    const session = scene.challengeSession;
    const profile = battleOpponent(opts.opponent || npc.key);
    const alive = () => scene.sys.isActive() && scene.challengeSession === session;
    scene.busy = true;
    scene.exclaim.hide();
    npc.ch.face(OPPOSITE[scene.player.dir]);
    try {
      const choice = await GianicoloBattle.choose(scene, profile.name, ['Parla', 'Sfida!', 'Annulla']);
      if (!alive()) return;
      if (choice === 0) {
        if (original) await original();
      } else if (choice === 1) {
        // Simone non sfida se stesso.
        const fighters = profile.key === 'simone' ? ['francesca'] : ['francesca', 'simone'];
        let fighter = fighters[0];
        if (fighters.length > 1) {
          const pick = await GianicoloBattle.choose(scene, 'Chi combatte?', [...fighters.map(f => FIGHTER_NAMES[f]), 'Annulla']);
          if (!alive() || pick < 0 || pick >= fighters.length) return;
          fighter = fighters[pick];
        }
        scene.battle = new GianicoloBattle(scene, npc, { opponent: profile.key, fighter, returnSong: opts.returnSong, background: opts.background });
        await scene.battle.run();
      }
    } finally {
      if (scene.challengeSession === session) {
        if (scene.battle) scene.battle.destroy();
        scene.battle = null;
        Controls.reset();
        if (scene.sys.isActive() && (!opts.canUnlock || opts.canUnlock())) scene.busy = false;
      }
    }
  }

  // Il chiamante esegue npcMenuTick PRIMA di battle.update: un solo proprietario dell'input.
  update() {}

  static async choose(scene, title, options) {
    if (!options.length) return -1;
    if (scene.npcMenuTick) throw new Error('Un menu NPC è già aperto');
    const items = options.map(o => typeof o === 'string' ? { name: o, description: '' } : { name: o.name || o.label || '', description: o.description || '' });
    const root = scene.add.container(0, 0).setScrollFactor(0).setDepth(995);
    const text = (x, y, value, opts = {}) => {
      const t = addText(scene, x, y, value, { color: 0x2a1d1a, ...opts }); root.add(t); return t;
    };
    const battleMenu = options === GIANICOLO_MOVES || options === SIMONE_FIGHTER_MOVES;
    const cols = battleMenu ? 2 : 1;
    let index = 0, done = false, requested = false, ignoreUntil = 0;
    let prevDir = Controls.dir();
    const hits = []; // centri delle voci in coordinate schermo (usati anche dai test)
    const now = () => scene.time.now;
    const canvas = scene.game?.canvas;
    // Il listener globale del gioco trasforma ogni tap in A: qui i tap li gestiscono le voci.
    const canvasTap = () => { ignoreUntil = now() + 220; };
    canvas?.addEventListener('pointerdown', canvasTap, true);
    let paint, confirmAt = null;
    if (battleMenu) {
      // Le mosse stanno sotto gli sprite: tocca per selezionare, poi Conferma.
      root.add(scene.add.rectangle(240, 229.5, 478, 79, 0xfbf3e4).setStrokeStyle(2, 0x2a1d1a));
      text(18, 194, title + ' Tocca, poi Conferma.');
      const cards = [], labels = [];
      const desc = text(240, 258, '', { origin: [0.5, 0] });
      const confirm = scene.add.rectangle(405, 199, 126, 16, 0xe8b6a0).setStrokeStyle(1, 0x2a1d1a).setScrollFactor(0).setInteractive();
      root.add(confirm);
      text(405, 195, 'Conferma / A', { origin: [0.5, 0] });
      confirm.on('pointerdown', () => { requested = true; Controls.reset(); });
      items.forEach((o, i) => {
        const x = 122 + (i % 2) * 236, y = 220 + Math.floor(i / 2) * 23;
        const card = scene.add.rectangle(x, y, 228, 20, 0xfbf3e4).setStrokeStyle(1, 0xc7a682).setScrollFactor(0).setInteractive();
        root.add(card); cards.push(card); hits.push({ x, y });
        labels.push(text(x, y - 4, o.name, { origin: [0.5, 0] }));
        card.on('pointerdown', () => { index = i; ignoreUntil = now() + 220; Controls.reset(); paint(); });
      });
      confirmAt = { x: 405, y: 199 };
      paint = () => {
        cards.forEach((c, i) => c.setFillStyle(i === index ? 0xf4d8a8 : 0xfbf3e4));
        labels.forEach((t, i) => t.setTint(i === index ? 0xa33c59 : 0x2a1d1a));
        desc.setText(fontText(items[index].description));
      };
    } else {
      // Riquadro piccolo e scuro (stile Octopath), di lato a Francesca e all'interlocutore.
      const pad = 7, rowH = 13, headH = 17;
      const w = Math.max(FontMetrics.measure(fontText(title)), ...items.map(o => FontMetrics.measure(fontText(o.name)) + 10)) + pad * 2;
      const h = headH + items.length * rowH + 4;
      const cam = scene.cameras.main, p = scene.player;
      const px = p ? p.x - cam.scrollX : 240, py = p ? p.y - cam.scrollY : 135;
      // Dal lato con più spazio, abbastanza lontano da non coprire un NPC accanto a lei.
      let bx = px < 240 ? px + 40 : px - 40 - w;
      bx = Math.round(Math.max(6, Math.min(474 - w, bx)));
      const by = Math.round(Math.max(6, Math.min(200 - h, py - 11 - h / 2)));
      root.add(scene.add.rectangle(bx, by, w, h, 0x1a1020, 0.86).setOrigin(0, 0).setStrokeStyle(1, 0xe8d9b8));
      root.add(scene.add.rectangle(bx + 2, by + 2, w - 4, h - 4).setOrigin(0, 0).setStrokeStyle(1, 0xe8d9b8, 0.25));
      text(bx + w / 2, by + 4, title, { color: 0xc9b48a, origin: [0.5, 0] });
      root.add(scene.add.rectangle(bx + pad, by + headH - 3, w - pad * 2, 1, 0xe8d9b8, 0.45).setOrigin(0, 0));
      const cursor = text(bx + pad, 0, '►', { color: 0xffe2a0 });
      const labels = items.map((o, i) => {
        const y = by + headH + i * rowH;
        const zone = scene.add.rectangle(bx + 2, y - 2, w - 4, rowH, 0xffffff, 0.001).setOrigin(0, 0).setScrollFactor(0).setInteractive();
        root.add(zone); hits.push({ x: bx + w / 2, y: y + rowH / 2 - 2 });
        // Qui il tocco su una voce la sceglie subito.
        zone.on('pointerdown', () => { index = i; requested = true; Controls.reset(); paint(); });
        return text(bx + pad + 10, y, o.name, { color: 0xfbf3e4 });
      });
      paint = () => {
        labels.forEach((t, i) => t.setTint(i === index ? 0xffe2a0 : 0xfbf3e4));
        cursor.setPosition(bx + pad, by + headH + index * rowH);
      };
    }
    paint(); Controls.reset();
    let finish;
    const promise = new Promise(resolve => {
      finish = value => {
        if (done) return;
        done = true;
        if (scene.npcMenuTick === tick) scene.npcMenuTick = null;
        scene.events.off('shutdown', shutdown);
        canvas?.removeEventListener('pointerdown', canvasTap, true);
        if (touchUI) touchUI.style.visibility = previousTouchVisibility;
        root.destroy(); Controls.reset(); resolve(value);
      };
    });
    const shutdown = () => finish(-1);
    const tick = () => {
      if (done) return;
      if (requested) { finish(index); return; }
      const d = Controls.dir();
      if (d && d !== prevDir) {
        let target = index;
        if (cols === 2 && d === 'left') target = index % 2 ? index - 1 : index;
        if (cols === 2 && d === 'right') target = index % 2 ? index : index + 1;
        if (d === 'up') target = index - cols;
        if (d === 'down') target = index + cols;
        if (target >= 0 && target < items.length) { index = target; paint(); }
      }
      prevDir = d;
      const a = Controls.consumeA();
      if (a && now() >= ignoreUntil) finish(index);
    };
    tick.cancel = shutdown;
    tick.hits = hits;
    tick.confirm = confirmAt;
    scene.npcMenuTick = tick;
    scene.events.once('shutdown', shutdown);
    // Conserva anche valori inline diversi da quello predefinito e ripristinali in finish.
    const touchUI = battleMenu && typeof document !== 'undefined' ? document.getElementById('touch') : null;
    const previousTouchVisibility = touchUI ? touchUI.style.visibility : '';
    if (touchUI) touchUI.style.visibility = 'hidden';
    return promise;
  }

  assertAlive() { if (this.dead) throw GianicoloBattle.CANCELLED; }
  async guarded(promise) {
    await Promise.race([promise, this.cancelled]);
    this.assertAlive();
  }
  async say(text) {
    this.assertAlive();
    const p = this.scene.say(null, text);
    this.dialogResolve = this.scene.dialog.resolve;
    try { await this.guarded(p); } finally { this.dialogResolve = null; }
  }
  animate(config) {
    this.assertAlive();
    return new Promise(resolve => {
      let tween;
      const finish = () => { this.pending.delete(finish); this.tweens.delete(tween); resolve(); };
      this.pending.add(finish);
      tween = this.scene.tweens.add({ ...config, onComplete: finish });
      this.tweens.add(tween);
    });
  }
  text(x, y, value, opts = {}) {
    this.assertAlive();
    const t = addText(this.scene, x, y, value, { color: 0x2a1d1a, ...opts });
    this.root.add(t); return t;
  }
  build() {
    this.assertAlive();
    const S = this.scene;
    this.root = S.add.container(0, 0).setScrollFactor(0).setDepth(995);
    this.root.add(S.add.image(0, 0, this.background).setOrigin(0, 0));
    // Basi ovali sotto i due personaggi, come nelle lotte Pokémon.
    if (!S.textures.exists('battleBase')) Pix.addTexture(S, 'battleBase', battleBaseCanvas());
    this.root.add(S.add.image(100, 186, 'battleBase').setScale(3));
    this.root.add(S.add.image(371, 118, 'battleBase').setScale(3));
    this.fr = S.add.sprite(100, 188, this.state.fighter, 6).setOrigin(0.5, 1).setScale(3);
    this.enemy = S.add.sprite(371, 120, this.state.opponent.sprite || this.state.opponent.key, 3).setOrigin(0.5, 1).setScale(3);
    this.root.add([this.fr, this.enemy]);
    // Riquadri alti abbastanza per due righe di stati alterati.
    const panel = (x, y) => this.root.add(S.add.rectangle(x, y, 208, 62, 0xfbf3e4).setOrigin(0, 0).setStrokeStyle(2, 0x2a1d1a));
    panel(14, 6); panel(256, 126);
    this.text(22, 11, this.state.opponent.name);
    this.text(264, 131, this.fighterName);
    this.enemyPS = this.text(22, 23, ''); this.playerPS = this.text(264, 143, '');
    const bar = (x, y) => {
      this.root.add(S.add.rectangle(x, y, 190, 5, 0x473333).setOrigin(0, 0));
      const fg = S.add.rectangle(x + 1, y + 1, 188, 3, 0x57b86a).setOrigin(0, 0);
      this.root.add(fg); return fg;
    };
    this.enemyBar = bar(22, 36); this.playerBar = bar(264, 156);
    this.enemyBuff = this.text(22, 44, '', { color: 0xa33c59 }).setLineSpacing(-1);
    this.playerBuff = this.text(264, 164, '', { color: 0xa33c59 }).setLineSpacing(-1);
    this.refresh();
  }
  refresh() {
    this.assertAlive();
    const s = this.state;
    this.enemyPS.setText('PS ' + s.enemyHP + '/' + s.enemyMaxHP);
    this.playerPS.setText('PS ' + s.playerHP + '/100');
    [[this.enemyBar, s.enemyHP / s.enemyMaxHP], [this.playerBar, s.playerHP / 100]].forEach(([b, ratio]) => {
      b.setDisplaySize(Math.max(0.01, 188 * ratio), 3);
      b.setFillStyle(ratio > 0.5 ? 0x57b86a : ratio > 0.2 ? 0xe6ad43 : 0xd9434f);
    });
    const enemy = [], player = [];
    if (s.pretty) enemy.push('Attacco -65%');
    if (s.guardTurns) enemy.push('Difesa + (' + s.guardTurns + ')');
    if (s.enemyWeakTurns) enemy.push('Attacco -65% (' + s.enemyWeakTurns + ')');
    if (s.enemyPoisoned) enemy.push('Veleno');
    if (s.playerGuardTurns) player.push('Difesa + (' + s.playerGuardTurns + ')');
    if (s.spritsStacks) player.push('Sprits ' + s.spritsStacks + '/2: ATK+ DIF-');
    if (s.weakTurns) player.push('Attacco -65% (' + s.weakTurns + ')');
    if (s.poisoned) player.push('Avvelenata');
    this.enemyBuff.setText(statusLines(enemy));
    this.playerBuff.setText(statusLines(player));
  }
  async pipas(report) {
    // Un proiettile reale per ogni colpo del modello, anche se il primo esaurisce i PS.
    for (const damage of report.hits) {
      this.assertAlive();
      const seed = this.scene.add.rectangle(this.fr.x + 18, this.fr.y - 36, 7, 3, 0xedd1a0).setStrokeStyle(1, 0x533c2b).setAngle(-25);
      this.root.add(seed);
      await this.guarded(this.animate({ targets: seed, x: this.enemy.x - 8, y: this.enemy.y - 28, angle: 330, duration: 190 }));
      seed.destroy();
      Audio8.sfx('hit');
      const label = this.text(this.enemy.x, this.enemy.y - 74, '-' + damage, { color: 0xffe2a0, shadow: 0x2a1d1a, scale: 2, origin: [0.5, 0] });
      await this.guarded(this.animate({ targets: label, y: label.y - 12, alpha: 0, duration: 140 }));
      label.destroy();
    }
  }
  // Le mosse di Simone quando combatte lui.
  async simoneMove(index, report) {
    const foe = this.state.opponent.name;
    if (index === 0) {
      const x = this.fr.x;
      await this.guarded(this.animate({ targets: this.fr, x: x + 150, y: this.fr.y - 40, duration: 220, ease: 'Quad.In' }));
      Audio8.sfx('hit');
      const label = this.text(this.enemy.x, this.enemy.y - 74, '-' + report.damage, { color: 0xffe2a0, shadow: 0x2a1d1a, scale: 2, origin: [0.5, 0] });
      await this.guarded(this.animate({ targets: this.enemy, alpha: 0.3, duration: 90, yoyo: true, repeat: 1 }));
      label.destroy();
      await this.guarded(this.animate({ targets: this.fr, x, y: 188, duration: 260, ease: 'Quad.Out' }));
      this.refresh();
      await this.say('Una stretta da orso: morbidissima, ma toglie il fiato. ' + report.damage + ' danni.');
      return;
    }
    Audio8.sfx(index === 2 ? 'bump' : 'whoosh');
    await this.guarded(this.animate({ targets: this.fr, y: this.fr.y - 10, duration: 110, yoyo: true, repeat: 1 }));
    this.enemy.setTint(index === 2 ? 0x9ad25a : 0x8fa8e8);
    await this.guarded(this.animate({ targets: this.enemy, alpha: 0.5, duration: 120, yoyo: true, repeat: 1 }));
    this.enemy.clearTint();
    this.refresh();
    if (index === 1) {
      await this.say(report.buff.changed
        ? 'Un lampo di parole irripetibili! ' + foe + ' resta senza parole: attacco -65%. E Simone si sente invincibile.'
        : 'Un\'altra bestemmia: l\'effetto dura di nuovo due turni.');
    } else {
      await this.say(report.buff.changed
        ? 'Un attacco chimico silenzioso ma letale! ' + foe + ' respira la puzza e si avvelena.'
        : 'La puzza è già nell\'aria. Non serve rincarare.');
    }
  }

  async play() {
    this.build();
    this.musicStarted = true;
    Audio8.playSong(SONGS.battle);
    await this.say(this.state.opponent.name + ' propone una sfida amichevole!');
    while (!this.state.outcome) {
      this.assertAlive();
      const choice = GianicoloBattle.choose(this.scene, 'Cosa farà ' + this.fighterName + '?', this.state.moves);
      this.menuTick = this.scene.npcMenuTick;
      let index;
      try {
        index = await Promise.race([choice, this.cancelled.then(() => -1)]);
      } finally { this.menuTick = null; }
      this.assertAlive();
      if (index < 0) return { outcome: 'cancelled', state: this.state };
      const report = this.state.playerMove(index);
      await this.say(this.fighterName + ' usa ' + report.name + '!');
      if (report.flee) break;
      if (this.state.fighter === 'simone') {
        await this.simoneMove(index, report);
      } else if (index === 0) {
        await this.pipas(report); this.refresh();
        await this.say(report.hits.length + ' colpi! ' + report.damage + ' danni. Le pipas non perdonano.');
      } else {
        const target = index === 1 ? this.fr : this.enemy;
        await this.guarded(this.animate({ targets: target, alpha: 0.35, duration: 120, yoyo: true, repeat: 1 }));
        this.refresh();
        await this.say(index === 1
          ? (report.buff.changed ? 'Coraggio liquido! Più attacco, ma anche più danni subiti.' : 'Due Sprits bastano: il bonus è già al massimo.')
          : (report.buff.changed ? 'Uno sguardo irresistibile: attacco nemico ridotto del 65%!' : 'Il fascino è già al massimo. Il malus non si somma.'));
      }
      if (this.state.outcome) break;
      const enemyReport = this.state.enemyMove();
      await this.say(this.state.opponent.name + ' usa ' + enemyReport.name + '!');
      if (enemyReport.damage) {
        await this.guarded(this.animate({ targets: this.enemy, x: this.enemy.x - 18, duration: 120, yoyo: true }));
        Audio8.sfx('hit');
        await this.guarded(this.animate({ targets: this.fr, alpha: 0.2, duration: 90, yoyo: true, repeat: 1 }));
        this.refresh();
        await this.say(enemyReport.text + ' ' + this.fighterName + ' perde ' + enemyReport.damage + ' PS.');
      } else {
        // Mosse di stato: Simone saltella, Francesca si colora dell'effetto.
        Audio8.sfx(enemyReport.effect === 'poison' ? 'bump' : 'whoosh');
        await this.guarded(this.animate({ targets: this.enemy, y: this.enemy.y - 10, duration: 110, yoyo: true, repeat: 1 }));
        this.fr.setTint(enemyReport.effect === 'poison' ? 0x9ad25a : 0x8fa8e8);
        await this.guarded(this.animate({ targets: this.fr, alpha: 0.5, duration: 120, yoyo: true, repeat: 1 }));
        this.fr.clearTint();
        this.refresh();
        await this.say(enemyReport.text);
      }
      if (enemyReport.poison) {
        this.fr.setTint(0x9ad25a);
        await this.guarded(this.animate({ targets: this.fr, alpha: 0.4, duration: 100, yoyo: true }));
        this.fr.clearTint();
        this.refresh();
        await this.say('Il veleno fa effetto: ' + this.fighterName + ' perde ' + enemyReport.poison + ' PS.');
      }
      if (enemyReport.enemyPoison) {
        this.enemy.setTint(0x9ad25a);
        await this.guarded(this.animate({ targets: this.enemy, alpha: 0.4, duration: 100, yoyo: true }));
        this.enemy.clearTint();
        this.refresh();
        await this.say('La scorreggia fa ancora effetto. ' + this.state.opponent.name + ' perde ' + enemyReport.enemyPoison + ' PS.');
      }
    }
    const outcome = this.state.outcome;
    if (outcome === 'victory') {
      await this.guarded(this.animate({ targets: this.enemy, alpha: 0.3, y: this.enemy.y + 10, duration: 300 }));
      Audio8.sfx('jingle');
      await this.say('Hai vinto! Si festeggia senza togliere cuoricini a nessuno.');
    } else if (outcome === 'defeat') {
      await this.say('Pausa merenda! Questa volta è andata così. Puoi riprovare quando vuoi: nessun game over.');
    } else {
      await this.say('Ritirata strategica! Nessuno ti insegue, promesso.');
    }
    return { outcome, state: this.state };
  }
  async run() {
    if (this.running) return this.running;
    if (this.dead) return { outcome: 'cancelled', state: this.state };
    this.running = (async () => {
      try { return await this.play(); }
      catch (error) {
        if (error !== GianicoloBattle.CANCELLED) throw error;
        return { outcome: 'cancelled', state: this.state };
      } finally { this.destroy(); }
    })();
    return this.running;
  }
  destroy() {
    if (this.dead) return;
    this.dead = true;
    this.scene.events.off('shutdown', this.onShutdown);
    this.menuTick?.cancel?.();
    this.menuTick = null;
    this.cancelRun();
    for (const t of this.tweens) t.stop();
    this.tweens.clear();
    for (const finish of [...this.pending]) finish();
    // Chiude soltanto il dialogo avviato da questa battaglia.
    if (this.dialogResolve && this.scene.dialog.resolve === this.dialogResolve) this.scene.dialog.close();
    this.root?.destroy(); this.root = null;
    Controls.reset();
    if (this.musicStarted) {
      this.musicStarted = false;
      Audio8.playSong(this.returnSong);
    }
  }
}
GianicoloBattle.CANCELLED = Symbol('Battaglia annullata');
