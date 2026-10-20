// Suoni e musichette chiptune generati con Web Audio. Partono solo dopo il primo tocco.

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

  init() {
    try { this.muted = localStorage.getItem('picci_muted') === '1'; } catch (_) { /* ok */ }
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
  playSong(song) {
    if (this.song === song) return;
    this.stopSong();
    if (!song) return;
    if (!this.ctx) { this.pendingSong = song; return; }
    this.song = song;
    const tracks = song.tracks.map(t => ({ ...t, tokens: t.notes.trim().split(/\s+/) }));
    const len = Math.max(...tracks.map(t => t.tokens.length));
    const stepDur = 60 / song.bpm / 4;
    let step = 0;
    let nextTime = this.ctx.currentTime + 0.1;
    this.musicGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.musicGain.gain.setValueAtTime(0.55, this.ctx.currentTime);
    const tick = () => {
      while (nextTime < this.ctx.currentTime + 0.25) {
        for (const tr of tracks) {
          const tok = tr.tokens[step % tr.tokens.length];
          if (tok && tok !== '.' && tok !== '-') {
            let n = 1;
            while (tr.tokens[(step + n) % tr.tokens.length] === '-' && n < 32) n++;
            const f = NOTE_FREQ[tok];
            if (f) this.tone(f, n * stepDur * 0.92, { type: tr.type, vol: tr.vol, at: nextTime, dest: this.musicGain });
          }
        }
        nextTime += stepDur;
        step = (step + 1) % len;
      }
    };
    tick();
    this.songTimer = setInterval(tick, 50);
  },

  stopSong(fade) {
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
  ice: {
    bpm: 138,
    tracks: [
      { type: 'square', vol: 0.045, notes:
        'C5 . E5 . G5 . E5 . A5 - G5 . E5 . C5 . D5 . F5 . A5 . F5 . G5 - - - . . . . ' +
        'E5 . G5 . C6 . G5 . A5 - G5 . F5 . E5 . D5 . E5 . F5 . D5 . C5 - - - . . . . ' },
      { type: 'triangle', vol: 0.2, notes:
        'C3 . . . G3 . . . A3 . . . E3 . . . D3 . . . A3 . . . G3 . . . G3 . B3 . ' +
        'C3 . . . G3 . . . F3 . . . C3 . . . G3 . . . G3 . . . C3 . . . G3 . E3 . ' },
      { type: 'sine', vol: 0.06, notes:
        '. . C6 . . . C6 . . . E6 . . . E6 . . . F6 . . . F6 . . . D6 . . . D6 . ' +
        '. . C6 . . . C6 . . . A5 . . . A5 . . . B5 . . . B5 . . . C6 . . . . . ' },
    ],
  },
  gianicolo: {
    bpm: 100,
    tracks: [
      { type: 'triangle', vol: 0.17, notes:
        'F5 - - - A5 - C6 - - - A5 - G5 - - - - - E5 - - - - - F5 - - - A5 - C6 - - - D6 - C6 - - - - - - - - - - - ' +
        'A#5 - - - D6 - F6 - - - D6 - C6 - - - A5 - F5 - - - G5 - A5 - - - G5 - E5 - - - D5 - F5 - - - - - - - - - - - ' },
      { type: 'square', vol: 0.03, notes:
        'A4 . C5 . F5 . C5 . A4 . C5 . G4 . C5 . E5 . C5 . G4 . C5 . A4 . C5 . F5 . C5 . A4 . C5 . A4 . C5 . F5 . C5 . A4 . C5 . ' +
        'A#4 . D5 . F5 . D5 . A#4 . D5 . A4 . C5 . F5 . C5 . A4 . C5 . G4 . C5 . E5 . C5 . G4 . C5 . A4 . C5 . F5 . C5 . A4 . . . ' },
      { type: 'triangle', vol: 0.16, notes:
        'F3 . . . . . C4 . . . . . C3 . . . . . G3 . . . . . F3 . . . . . C4 . . . . . F3 . . . . . A3 . . . . . ' +
        'A#2 . . . . . F3 . . . . . F3 . . . . . C4 . . . . . C3 . . . . . G3 . . . . . F3 . . . . . C4 . . . . . ' },
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
  london: {
    bpm: 118,
    tracks: [
      { type: 'square', vol: 0.04, notes:
        'G4 . B4 . D5 . G5 - F#5 . E5 . D5 - - - E5 . C5 . E5 . G5 - F#5 . D5 . A4 - - - ' +
        'G4 . B4 . D5 . G5 - A5 . G5 . F#5 . E5 . D5 . E5 . F#5 . A5 . G5 - - - . . . . ' },
      { type: 'triangle', vol: 0.18, notes:
        'G2 . . . D3 . . . G2 . . . D3 . . . C3 . . . G3 . . . D3 . . . A2 . . . ' +
        'G2 . . . D3 . . . E3 . . . B2 . . . C3 . . . D3 . . . G2 . . . D3 . . . ' },
      { type: 'sine', vol: 0.05, notes:
        '. . . . B5 . . . . . . . B5 . . . . . . . C6 . . . . . . . A5 . . . ' +
        '. . . . B5 . . . . . . . E6 . . . . . . . C6 . . . . . . . B5 . . . ' },
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
