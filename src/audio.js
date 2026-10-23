// Suoni e musichette generati con Web Audio. Partono solo dopo il primo tocco.
// Le musiche usano un motore "16 bit" (stile Super Nintendo): strumenti con inviluppo morbido,
// due oscillatori un po' scordati, filtro, vibrato sulle note lunghe, eco e accordi ("C4+E4+G4").

const NOTE_FREQ = (() => {
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const f = {};
  for (let o = 1; o <= 7; o++) {
    names.forEach((n, i) => { f[n + o] = 440 * Math.pow(2, (o * 12 + i - 57) / 12); });
  }
  return f;
})();

const Audio8 = {
  ctx: null,
  master: null,
  musicGain: null,
  muted: false,
  song: null,
  songTimer: null,
  noiseBuf: null,

  useFiles: true,

  init() {
    try { this.muted = localStorage.getItem('picci_muted') === '1'; } catch (_) { /* ok */ }
    try { this.useFiles = localStorage.getItem('picci_music') !== 'chip'; } catch (_) { /* ok */ }
  },

  // Ci sono le nostre canzoni (local/songs.js)? Allora si può scegliere tra quelle e le musichette del gioco
  hasFiles() {
    return Object.values(SONGS).some(s => s.file);
  },

  setUseFiles(on) {
    this.useFiles = on;
    try { localStorage.setItem('picci_music', on ? 'files' : 'chip'); } catch (_) { /* ok */ }
    const cur = this.song;
    if (cur) { this.stopSong(); this.playSong(cur); }
  },

  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.5;
      this.master.connect(this.ctx.destination);
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.55;
      this.musicGain.connect(this.master);
      // eco: ritardo con ritorno e filtro, come il riverbero delle cartucce SNES
      const delay = this.ctx.createDelay(1);
      delay.delayTime.value = 0.22;
      const fb = this.ctx.createGain(); fb.gain.value = 0.18;
      const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1800;
      const wet = this.ctx.createGain(); wet.gain.value = 0.18;
      this.echoSend = this.ctx.createGain();
      this.musicGain.connect(this.echoSend); this.echoSend.connect(delay); delay.connect(lp); lp.connect(fb); fb.connect(delay);
      lp.connect(wet); wet.connect(this.master);
      const len = this.ctx.sampleRate * 0.5;
      this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = this.noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      if (this.pendingSong) { const s = this.pendingSong; this.pendingSong = null; this.playSong(s); }
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  },

  setMuted(m) {
    this.muted = m;
    try { localStorage.setItem('picci_muted', m ? '1' : '0'); } catch (_) { /* ok */ }
    if (this.master) this.master.gain.setTargetAtTime(m ? 0 : 0.5, this.ctx.currentTime, 0.02);
  },

  tone(freq, dur, opts = {}) {
    if (!this.ctx) return;
    const t = (opts.at !== undefined ? opts.at : this.ctx.currentTime) + (opts.delay || 0);
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = opts.type || 'square';
    o.frequency.setValueAtTime(freq, t);
    if (opts.slide) o.frequency.exponentialRampToValueAtTime(opts.slide, t + dur);
    const v = opts.vol !== undefined ? opts.vol : 0.15;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(v, t + 0.005);
    g.gain.setValueAtTime(v, t + Math.max(0.006, dur * 0.6));
    g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(g);
    g.connect(opts.dest || this.master);
    o.start(t);
    o.stop(t + dur + 0.02);
  },

  noise(dur, opts = {}) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + (opts.delay || 0);
    const s = this.ctx.createBufferSource();
    s.buffer = this.noiseBuf;
    const f = this.ctx.createBiquadFilter();
    f.type = opts.filter || 'bandpass';
    f.frequency.setValueAtTime(opts.freq || 1800, t);
    if (opts.sweep) f.frequency.exponentialRampToValueAtTime(opts.sweep, t + dur);
    const g = this.ctx.createGain();
    const v = opts.vol || 0.25;
    g.gain.setValueAtTime(v, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    s.connect(f); f.connect(g); g.connect(this.master);
    s.start(t);
    s.stop(t + dur);
  },

  // Puzzetta: un ronzio basso che "sbatte" (modulato a scatti), con la musica che si fa da parte
  fart(dur = 1.1) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(110, t);
    o.frequency.linearRampToValueAtTime(82, t + dur * 0.5);
    o.frequency.linearRampToValueAtTime(64, t + dur);
    const wob = this.ctx.createOscillator();
    const wobG = this.ctx.createGain();
    wob.frequency.value = 7; wobG.gain.value = 9;
    wob.connect(wobG); wobG.connect(o.frequency);
    // il "brrr": il volume si apre e si chiude ~30 volte al secondo
    const flap = this.ctx.createOscillator();
    const flapG = this.ctx.createGain();
    flap.type = 'square';
    flap.frequency.setValueAtTime(34, t);
    flap.frequency.linearRampToValueAtTime(18, t + dur);
    flapG.gain.value = 0.5;
    const am = this.ctx.createGain();
    am.gain.value = 0.5;
    flap.connect(flapG); flapG.connect(am.gain);
    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 900; lp.Q.value = 4;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.55, t + 0.03);
    g.gain.setValueAtTime(0.55, t + dur * 0.75);
    g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(am); am.connect(lp); lp.connect(g); g.connect(this.master);
    for (const n of [o, wob, flap]) { n.start(t); n.stop(t + dur + 0.05); }
    this.noise(dur * 0.8, { freq: 300, sweep: 120, vol: 0.18, filter: 'lowpass' });
    if (this.musicGain) {
      const mg = this.musicGain.gain, v = mg.value;
      mg.cancelScheduledValues(t);
      mg.setValueAtTime(v, t);
      mg.linearRampToValueAtTime(v * 0.15, t + 0.05);
      mg.setValueAtTime(v * 0.15, t + dur + 0.4);
      mg.linearRampToValueAtTime(v, t + dur + 1.2);
    }
  },

  sfx(name) {
    if (!this.ctx) return;
    const N = NOTE_FREQ;
    switch (name) {
      case 'blip': this.tone(880, 0.03, { vol: 0.05 }); break;
      case 'select': this.tone(N.E5, 0.06, { vol: 0.1 }); this.tone(N.A5, 0.08, { vol: 0.1, delay: 0.06 }); break;
      case 'heart':
        [N.C6, N.E6, N.G6, N.C7].forEach((f, i) => this.tone(f, 0.08, { vol: 0.09, delay: i * 0.055 }));
        break;
      case 'fall':
        this.tone(N.A5, 0.35, { type: 'square', vol: 0.1, slide: N.A3 });
        this.noise(0.25, { freq: 600, vol: 0.2, delay: 0.3 });
        break;
      case 'bump': this.tone(140, 0.08, { type: 'triangle', vol: 0.25, slide: 80 }); break;
      case 'checkpoint':
        this.tone(N.G5, 0.1, { type: 'triangle', vol: 0.2 });
        this.tone(N.D6, 0.25, { type: 'triangle', vol: 0.2, delay: 0.1 });
        break;
      case 'hit': this.noise(0.12, { freq: 2500, vol: 0.4 }); this.tone(N.C5, 0.08, { vol: 0.08 }); break;
      case 'whoosh': this.noise(0.25, { freq: 400, sweep: 3000, vol: 0.3 }); break;
      case 'miss': this.tone(N.E4, 0.12, { vol: 0.08, slide: N.C4 }); break;
      case 'item':
        [N.G5, N.C6, N.E6, N.G6, N.E6, N.G6].forEach((f, i) =>
          this.tone(f, i === 5 ? 0.3 : 0.09, { vol: 0.1, delay: i * 0.09 }));
        break;
      case 'jingle': {
        const seq = [[N.C5, 1], [N.E5, 1], [N.G5, 1], [N.C6, 2], [N.G5, 1], [N.C6, 4]];
        let t = 0;
        for (const [f, d] of seq) {
          this.tone(f, d * 0.11, { vol: 0.12, delay: t });
          this.tone(f / 2, d * 0.11, { type: 'triangle', vol: 0.15, delay: t });
          t += d * 0.12;
        }
        break;
      }
      case 'pop': this.tone(N.C6, 0.05, { vol: 0.08, slide: N.C7 }); break;
      default: break;
    }
  },

  // --- Musica -----------------------------------------------------------
  // Un brano: { bpm, steps per battuta implicito, tracks: [{ type, vol, notes: 'C5 . E5 - ...' }] }
  // Ogni token è un sedicesimo: nota, '.' pausa, '-' prolunga la nota precedente.
  // Strumenti del motore 16 bit: forme d'onda, scordatura, filtro, inviluppo (attacco, decadimento, sostegno, rilascio)
  INSTRUMENTS: {
    lead:  { waves: ['sawtooth', 'square'], detune: 5, cut: 3200, a: 0.01, d: 0.18, s: 0.7, r: 0.06, vib: 5, gain: 0.55 },
    soft:  { waves: ['triangle', 'sine'], detune: 4, cut: 3000, a: 0.01, d: 0.2, s: 0.7, r: 0.12, vib: 4, gain: 1 },
    piano: { waves: ['triangle', 'square'], detune: 3, cut: 2200, a: 0.004, d: 0.5, s: 0.2, r: 0.2, vib: 0, gain: 0.8 },
    pad:   { waves: ['sawtooth', 'sawtooth'], detune: 12, cut: 1100, a: 0.08, d: 0.3, s: 0.8, r: 0.3, vib: 0, gain: 0.5 },
    bass:  { waves: ['triangle', 'square'], detune: 0, cut: 600, a: 0.006, d: 0.2, s: 0.5, r: 0.05, vib: 0, gain: 1 },
    bell:  { waves: ['sine', 'sine'], ratio: 2.01, cut: 5000, a: 0.003, d: 0.6, s: 0.15, r: 0.3, vib: 0, gain: 1 },
  },
  LEGACY: { square: 'lead', triangle: 'soft', sine: 'bell', sawtooth: 'pad' },

  voice(freq, dur, inst, vol, at) {
    const I = this.INSTRUMENTS[inst] || this.INSTRUMENTS.soft;
    const c = this.ctx;
    const v = vol * I.gain;
    const end = at + dur;
    const g = c.createGain();
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(v, at + I.a);
    g.gain.setTargetAtTime(v * I.s, at + I.a, I.d / 3);
    g.gain.setTargetAtTime(0, end, I.r / 3);
    const f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = Math.min(I.cut, freq * 8);
    f.connect(g);
    g.connect(this.musicGain);
    const oscs = I.waves.map((w, i) => {
      const o = c.createOscillator();
      o.type = w;
      o.frequency.value = freq * (i && I.ratio ? I.ratio : 1);
      o.detune.value = i ? I.detune || 0 : -(I.detune || 0);
      const og = c.createGain();
      og.gain.value = i ? (I.ratio ? 0.25 : 0.5) : 1;
      o.connect(og); og.connect(f);
      o.start(at); o.stop(end + I.r * 2);
      return o;
    });
    // vibrato solo sulle note lunghe, entra piano piano
    if (I.vib && dur > 0.35) {
      const lfo = c.createOscillator();
      lfo.frequency.value = 5.5;
      const depth = c.createGain();
      depth.gain.setValueAtTime(0, at);
      depth.gain.linearRampToValueAtTime(0, at + 0.2);
      depth.gain.linearRampToValueAtTime(I.vib, at + 0.5);
      lfo.connect(depth);
      oscs.forEach(o => depth.connect(o.detune));
      lfo.start(at); lfo.stop(end + I.r * 2);
    }
  },

  playSong(song) {
    if (this.song === song) return;
    this.stopSong();
    if (!song) return;
    if (!this.ctx) { this.pendingSong = song; return; }
    this.song = song;
    const file = song.file && this.useFiles;
    this.echoSend.gain.value = file ? 0 : 1; // le basi vere non vogliono l'eco
    if (file) { this.playFile(song); return; }
    const tracks = song.tracks.map(t => ({ ...t, inst: t.inst || this.LEGACY[t.type] || 'soft', tokens: t.notes.trim().split(/\s+/) }));
    const len = Math.max(...tracks.map(t => t.tokens.length));
    const stepDur = 60 / song.bpm / 4;
    let step = 0;
    let nextTime = this.ctx.currentTime + 0.1;
    this.musicGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.musicGain.gain.setValueAtTime(0.55 * (song.gain || 1), this.ctx.currentTime);
    const tick = () => {
      if (this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;
      // Un frame lento non deve far partire insieme tutte le note ormai passate.
      // Saltiamo i passi persi mantenendo il tempo e il punto del brano.
      if (nextTime < now) {
        const skipped = Math.ceil((now + 0.02 - nextTime) / stepDur);
        nextTime += skipped * stepDur;
        step = (step + skipped) % len;
      }
      while (nextTime < now + 0.25) {
        for (const tr of tracks) {
          const tok = tr.tokens[step % tr.tokens.length];
          if (tok && tok !== '.' && tok !== '-') {
            let n = 1;
            while (tr.tokens[(step + n) % tr.tokens.length] === '-' && n < 32) n++;
            for (const name of tok.split('+')) {
              const f = NOTE_FREQ[name];
              if (f) this.voice(f, n * stepDur * 0.92, tr.inst, tr.vol, nextTime);
            }
          }
        }
        nextTime += stepDur;
        step = (step + 1) % len;
      }
    };
    tick();
    this.songTimer = setInterval(tick, 50);
  },

  // Base audio vera (musiche private in local/): caricata una volta, suonata in loop sul canale musica
  playFile(song) {
    const start = (buf) => {
      if (this.song !== song) return;
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      src.connect(this.musicGain);
      src.start();
      this.fileSrc = src;
    };
    this.musicGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.musicGain.gain.setValueAtTime(0.55 * (song.gain || 1), this.ctx.currentTime);
    if (song.buf) { start(song.buf); return; }
    fetch(song.file).then(r => r.arrayBuffer())
      .then(data => new Promise((ok, ko) => this.ctx.decodeAudioData(data, ok, ko)))
      .then((buf) => { song.buf = buf; start(buf); })
      .catch(() => { /* file mancante: niente musica */ });
  },

  stopSong(fade) {
    if (this.fileSrc) {
      const src = this.fileSrc;
      this.fileSrc = null;
      try { src.stop(this.ctx.currentTime + (fade || 0)); } catch (_) { /* già fermo */ }
    }
    if (this.songTimer) clearInterval(this.songTimer);
    this.songTimer = null;
    this.song = null;
    this.pendingSong = null;
    if (fade && this.ctx) {
      const t = this.ctx.currentTime;
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, t);
      this.musicGain.gain.linearRampToValueAtTime(0, t + fade);
    }
  },
};

const SONGS = {
  title: {
    bpm: 92,
    tracks: [
      { type: 'triangle', vol: 0.16, notes:
        'E5 - - - G5 - E5 - D5 - - - C5 - - - D5 - E5 - G5 - - - A5 - G5 - E5 - - - ' +
        'F5 - - - A5 - F5 - E5 - - - D5 - - - C5 - D5 - E5 - G5 - D5 - - - - - - - ' },
      { type: 'square', vol: 0.035, notes:
        'C4 . G4 . C5 . G4 . A3 . E4 . A4 . E4 . F3 . C4 . F4 . C4 . G3 . D4 . G4 . D4 . ' +
        'F3 . C4 . F4 . C4 . C4 . G4 . C5 . G4 . F3 . C4 . A4 . C4 . G3 . D4 . B4 . D4 . ' },
    ],
  },
  // Livello 2: new wave anni '80 col basso che corre (atmosfera alla "Amore disperato", melodia originale)
  ice: {
    bpm: 140,
    tracks: [
      { type: 'square', vol: 0.045, notes:
        'B4 . B4 . E5 - D5 . E5 - - . G5 . F#5 . E5 - - - C5 - - . . . E5 . G5 . E5 . D5 . D5 . G5 - F#5 . G5 - - . B5 . A5 . F#5 - - - D5 - - . A4 . . . . . . . ' +
        'C5 . C5 . E5 - D5 . C5 - - . A4 . C5 . E5 - - - G5 - - . E5 . D5 . C5 . D5 . F#5 - - . A5 - - . F#5 . E5 . D5 . F#5 . D#5 - - - - - - - B4 . . . . . . . ' },
      { type: 'triangle', vol: 0.2, notes:
        'E2 . E3 . E2 . E3 . E2 . E3 . E2 . E3 . C3 . C4 . C3 . C4 . C3 . C4 . C3 . C4 . G2 . G3 . G2 . G3 . G2 . G3 . G2 . G3 . D3 . D4 . D3 . D4 . D3 . D4 . D3 . D4 . ' +
        'A2 . A3 . A2 . A3 . A2 . A3 . A2 . A3 . C3 . C4 . C3 . C4 . C3 . C4 . C3 . C4 . D3 . D4 . D3 . D4 . D3 . D4 . D3 . D4 . B2 . B3 . B2 . B3 . B2 . B3 . B2 . B3 . ' },
      { type: 'sine', vol: 0.05, notes:
        '. . G5 . . . G5 . . . G5 . . . G5 . . . E5 . . . E5 . . . E5 . . . E5 . . . B5 . . . B5 . . . B5 . . . B5 . . . A5 . . . A5 . . . A5 . . . A5 . ' +
        '. . C6 . . . C6 . . . C6 . . . C6 . . . G5 . . . G5 . . . G5 . . . G5 . . . F#5 . . . F#5 . . . F#5 . . . F#5 . . . D#5 . . . D#5 . . . D#5 . . . D#5 . ' },
    ],
  },
  // Livello 1: lenta e malinconica, al tramonto (atmosfera alla "Cosa sarà", melodia originale)
  gianicolo: {
    bpm: 84,
    tracks: [
      { type: 'triangle', vol: 0.17, notes:
        'E5 - - - C5 - D5 - E5 - - - A4 - - - F5 - - - E5 - D5 - C5 - - - - - - - G5 - - - E5 - C5 - D5 - E5 - G5 - - - D5 - - - - - B4 - D5 - - - - - - - ' +
        'E5 - - - A5 - G5 - E5 - - - C5 - - - F5 - - - A5 - C6 - B5 - A5 - F5 - - - D5 - F5 - A5 - - - G#5 - - - B5 - - - A5 - - - - - - - - - - - - - - - ' },
      { type: 'square', vol: 0.03, notes:
        'A3 . E4 . A4 . C5 . A4 . E4 . C4 . E4 . F3 . C4 . F4 . A4 . F4 . C4 . A3 . C4 . C4 . G4 . C5 . E5 . C5 . G4 . E4 . G4 . G3 . D4 . G4 . B4 . G4 . D4 . B3 . D4 . ' +
        'A3 . E4 . A4 . C5 . A4 . E4 . C4 . E4 . F3 . C4 . F4 . A4 . F4 . C4 . A3 . C4 . D4 . F4 . A4 . F4 . E4 . G#4 . B4 . G#4 . A3 . E4 . A4 . C5 . A4 . . . . . . . ' },
      { type: 'triangle', vol: 0.15, notes:
        'A2 - - - - - - - E3 - - - - - - - F2 - - - - - - - C3 - - - - - - - C3 - - - - - - - G3 - - - - - - - G2 - - - - - - - D3 - - - - - - - ' +
        'A2 - - - - - - - E3 - - - - - - - F2 - - - - - - - C3 - - - - - - - D3 - - - - - - - E3 - - - - - - - A2 - - - - - - - A2 - - - - - - - ' },
    ],
  },
  ninja: {
    bpm: 150,
    tracks: [
      { type: 'square', vol: 0.045, notes:
        'E5 . E5 G5 . E5 D5 . E5 . B4 . D5 . E5 . E5 . E5 G5 . E5 D5 . A5 . G5 . E5 - - - ' +
        'E5 . E5 G5 . E5 D5 . E5 . B4 . D5 . E5 . A5 . G5 . E5 . D5 . E5 - - - . . . . ' },
      { type: 'triangle', vol: 0.2, notes:
        'E3 . E3 . E3 . E3 . E3 . E3 . D3 . D3 . E3 . E3 . E3 . E3 . C3 . C3 . D3 . D3 . ' +
        'E3 . E3 . E3 . E3 . E3 . E3 . D3 . D3 . C3 . C3 . D3 . D3 . E3 . E3 . E3 . . . ' },
    ],
  },
  // Livello 3: leggera e ariosa, da passeggiata infinita (atmosfera alla "Mr. Sky", melodia originale)
  london: {
    bpm: 112,
    tracks: [
      { type: 'square', vol: 0.04, notes:
        'C5 . F5 . A5 - G5 . F5 . . . C5 . D5 . F5 - - - E5 . D5 . A4 - - - . . . . D5 . F5 . A#5 - A5 . G5 . . . F5 . G5 . A5 - - - G5 . E5 . C5 - - - . . . . ' +
        'C5 . F5 . A5 - C6 . A5 . . . F5 . A5 . C6 - - - B5 . A5 . E5 - - - . . . . D6 - C6 . A#5 . A5 . G5 - - . E5 . G5 . F5 - - - - - - - . . . . . . . . ' },
      { type: 'triangle', vol: 0.18, notes:
        'F2 . . . C3 . . . F2 . . . C3 . . . D3 . . . A3 . . . D3 . . . A3 . . . A#2 . . . F3 . . . A#2 . . . F3 . . . C3 . . . G3 . . . C3 . . . G3 . . . ' +
        'F2 . . . C3 . . . F2 . . . C3 . . . A2 . . . E3 . . . A2 . . . E3 . . . A#2 . . . F3 . . . C3 . . . G3 . . . F2 . . . C3 . . . F2 . . . C3 . . . ' },
      { type: 'sine', vol: 0.05, notes:
        '. . . . A5 . . . . . . . A5 . . . . . . . F5 . . . . . . . F5 . . . . . . . D6 . . . . . . . D6 . . . . . . . E5 . . . . . . . E5 . . . ' +
        '. . . . A5 . . . . . . . A5 . . . . . . . C6 . . . . . . . C6 . . . . . . . D6 . . . . . . . E6 . . . . . . . A5 . . . . . . . C6 . . . ' },
    ],
  },
  lullaby: {
    bpm: 76,
    tracks: [
      { type: 'sine', vol: 0.12, notes:
        'C5 - - - A4 - F4 - G4 - - - - - - - A4 - - - F4 - D4 - C4 - - - - - - - ' +
        'F4 - - - A4 - C5 - D5 - - - C5 - - - A#4 - - - G4 - E4 - F4 - - - - - - - ' },
      { type: 'triangle', vol: 0.1, notes:
        'F3 - - - - - - - C3 - - - - - - - D3 - - - - - - - A2 - - - - - - - ' +
        'A#2 - - - - - - - F3 - - - - - - - C3 - - - - - - - F3 - - - - - - - ' },
    ],
  },
  battle: {
    bpm: 168,
    tracks: [
      { type: 'square', vol: 0.045, notes:
        'A4 . A4 . C5 . A4 . D5 . C5 . A4 . G4 . A4 . A4 . C5 . A4 . E5 . D5 . C5 . B4 . ' +
        'A4 . A4 . C5 . A4 . D5 . C5 . A4 . G4 . F4 . G4 . A4 . C5 . B4 . G#4 . A4 - - - ' },
      { type: 'triangle', vol: 0.2, notes: 'A2 A3 A2 A3 A2 A3 A2 A3 F2 F3 F2 F3 G2 G3 G2 G3 ' },
    ],
  },
};
