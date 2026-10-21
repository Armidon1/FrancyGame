// Converte file MIDI nelle musiche 16 bit del gioco (formato di SONGS in src/audio.js).
// Il risultato va in local/songs.js, che è escluso da git: resta solo sul tuo computer.
//
// Elencare le tracce di un MIDI:
//   node tools/midi2song.cjs --list local/cosa_sara.mid
// Convertire (chiave del brano = file, opzioni facoltative dopo il "?"):
//   node tools/midi2song.cjs gianicolo=local/cosa_sara.mid ice=local/amore_disperato.mid "london=local/mr_sky.mid?melody=2&bass=5"
// Opzioni: melody=N, bass=N, extra=N (numeri da --list), start=battuta iniziale, bars=quante battute, bpm=N
// Se il MIDI ha una traccia sola con tutto dentro (es. fatto con Basic Pitch da un mp3), la divide da solo
// per altezza in melodia, accordi e basso. Opzioni in quel caso: min=durata minima in ms (90), vel=velocità minima (30),
// split=nota sotto cui è basso (52), top=nota più alta della melodia (88), from=secondi da saltare, len=secondi da tenere,
// gain=volume del brano (2.2), chords=1 per aggiungere gli accordi (di default spenti, impastano),
// mvel=velocità minima della melodia (45), mmin=durata minima della melodia in ms (130),
// melfile=local/voce.mid per prendere la melodia da un MIDI della sola voce (molto più riconoscibile).
// Chiavi utili: gianicolo (livello 1), ice (livello 2), london (livello 3), title, lullaby, battle, ninja.

const fs = require('node:fs');
const path = require('node:path');

const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function readMidi(file) {
  const buf = fs.readFileSync(file);
  let pos = 0;
  const u32 = () => { const v = buf.readUInt32BE(pos); pos += 4; return v; };
  const u16 = () => { const v = buf.readUInt16BE(pos); pos += 2; return v; };
  const varlen = () => { let v = 0, b; do { b = buf[pos++]; v = (v << 7) | (b & 0x7f); } while (b & 0x80); return v; };
  if (buf.toString('latin1', 0, 4) !== 'MThd') throw new Error(file + ': non è un file MIDI');
  pos = 4; const hlen = u32(); u16(); const ntrks = u16(); const division = u16(); pos = 8 + hlen;
  if (division & 0x8000) throw new Error(file + ': formato SMPTE non supportato');
  let tempo = null;
  const voices = new Map(); // "traccia:canale" -> { name, notes }
  for (let t = 0; t < ntrks; t++) {
    if (buf.toString('latin1', pos, pos + 4) !== 'MTrk') break;
    pos += 4; const end = pos + 4 + buf.readUInt32BE(pos); pos += 4;
    let tick = 0, status = 0, name = '';
    const open = new Map();
    while (pos < end) {
      tick += varlen();
      let b = buf[pos];
      if (b & 0x80) { status = b; pos++; }
      if (status === 0xff) {
        const type = buf[pos++], len = varlen();
        if (type === 0x51 && tempo === null) tempo = buf.readUIntBE(pos, 3);
        if (type === 0x03) name = buf.toString('latin1', pos, pos + len).trim();
        pos += len; status = 0;
        continue;
      }
      if (status === 0xf0 || status === 0xf7) { pos += varlen(); status = 0; continue; }
      const kind = status & 0xf0, ch = status & 0x0f;
      const d1 = buf[pos++], d2 = (kind === 0xc0 || kind === 0xd0) ? 0 : buf[pos++];
      if (ch === 9 || (kind !== 0x90 && kind !== 0x80)) continue; // niente batteria
      const id = `${t}:${ch}`;
      if (!voices.has(id)) voices.set(id, { id, name, notes: [] });
      const key = `${ch}:${d1}`;
      if (kind === 0x90 && d2 > 0) {
        if (!open.has(key)) open.set(key, { tick, vel: d2 });
      } else if (open.has(key)) {
        const o = open.get(key);
        voices.get(id).notes.push({ pitch: d1, start: o.tick, end: tick, vel: o.vel });
        open.delete(key);
      }
    }
    pos = end;
    for (const v of voices.values()) if (!v.name && v.id.startsWith(t + ':')) v.name = name;
  }
  const list = [...voices.values()].filter(v => v.notes.length);
  for (const v of list) v.avg = v.notes.reduce((s, n) => s + n.pitch, 0) / v.notes.length;
  return { division, bpm: Math.round(60e6 / (tempo || 500000)), voices: list };
}

// Una voce sola (monofonica) a sedicesimi: negli accordi tiene la nota più alta (o più bassa per il basso)
function line(voice, step, from, steps, preferLow, octaves) {
  const slots = new Array(steps).fill(null);
  const notes = [...voice.notes].sort((a, b) => a.start - b.start || (preferLow ? b.pitch - a.pitch : a.pitch - b.pitch));
  for (const n of notes) {
    const s = Math.round(n.start / step) - from;
    const e = Math.max(s + 1, Math.round(n.end / step) - from);
    if (e <= 0 || s >= steps) continue;
    if (s >= 0) slots[s] = { pitch: n.pitch, onset: true };
    // l'ultima nota arrivata vince sulle code delle precedenti, mai sull'attacco di un'altra
    for (let k = Math.max(s + 1, 0); k < Math.min(e, steps); k++) if (!slots[k] || !slots[k].onset) slots[k] = { pitch: n.pitch, onset: false };
  }
  // ottave spostate nella zona che suona bene sul chip
  const [lo, hi] = octaves;
  const avg = voice.avg;
  let shift = 0;
  while ((avg + shift) / 12 - 1 < lo) shift += 12;
  while ((avg + shift) / 12 - 1 > hi + 1) shift -= 12;
  let prev = null;
  return slots.map((sl) => {
    if (!sl) { prev = null; return '.'; }
    let p = sl.pitch + shift;
    while (p < 24) p += 12;
    while (p > 107) p -= 12;
    const tok = (!sl.onset && prev === p) ? '-' : NAMES[p % 12] + (Math.floor(p / 12) - 1);
    prev = p;
    return tok;
  }).join(' ');
}

const tok = (p) => { while (p < 24) p += 12; while (p > 107) p -= 12; return NAMES[p % 12] + (Math.floor(p / 12) - 1); };

// Segue la melodia come una voce: preferisce note forti, salti piccoli e frasi continue (algoritmo di Viterbi)
function track(slots, ok) {
  const REST = -1;
  const cand = slots.map((list, k) => {
    const by = new Map();
    for (const n of list) if (ok(n)) by.set(n.pitch, (by.get(n.pitch) || 0) + n.vel * (n.s === k ? 1.3 : 1));
    return [REST, ...by.keys()].map(p => ({ p, sal: p === REST ? 0 : by.get(p) }));
  });
  const emit = c => (c.p === REST ? 3.5 : -c.sal / 18 - c.p * 0.04);
  const move = (a, b) => (a === b ? 0 : (a === REST || b === REST) ? 2.5 : 1.5 + Math.abs(a - b) * 0.35);
  let cost = cand[0].map(emit), back = [];
  for (let k = 1; k < slots.length; k++) {
    const prev = cand[k - 1], nc = [], bk = [];
    for (const c of cand[k]) {
      let best = Infinity, bi = 0;
      prev.forEach((q, i) => { const v = cost[i] + move(q.p, c.p); if (v < best) { best = v; bi = i; } });
      nc.push(best + (c.p === REST && cand[k].length === 1 ? 0 : emit(c))); bk.push(bi);
    }
    cost = nc; back.push(bk);
  }
  const path = new Array(slots.length);
  let i = cost.indexOf(Math.min(...cost));
  for (let k = slots.length - 1; k >= 0; k--) { path[k] = cand[k][i].p; if (k) i = back[k - 1][i]; }
  // piccoli buchi di 1-2 slot dentro una frase: la nota prima continua (più legato, più cantabile)
  for (let k = 1; k < path.length - 2; k++) {
    if (path[k] === REST && path[k - 1] !== REST) {
      let e = k; while (e < path.length && path[e] === REST && e - k < 3) e++;
      if (e - k <= 2 && path[e] !== REST) for (let j = k; j < e; j++) path[j] = path[k - 1];
    }
  }
  return path.map((p, k) => {
    if (p === REST) return '.';
    const again = slots[k].some(n => n.pitch === p && n.s === k && ok(n));
    return (k && path[k - 1] === p && !again) ? '-' : tok(p);
  }).join(' ');
}

// Voce legata: una nota continua fino alla successiva se il buco è breve (respiri e consonanti);
// nelle parti strumentali lunghe (più di 2 secondi senza voce) suona la linea ricavata dal brano intero
function withFill(voice, full) {
  const v = voice.split(' '), f = full.split(' ');
  for (let k = 1; k < v.length; k++) {
    if (v[k] !== '.' || v[k - 1] === '.') continue;
    let e = k; while (e < v.length && v[e] === '.' && e - k < 7) e++;
    if (e < v.length && v[e] !== '.' && e - k <= 6) for (let j = k; j < e; j++) v[j] = '-';
  }
  for (let k = 0; k < v.length;) {
    if (v[k] !== '.') { k++; continue; }
    let e = k; while (e < v.length && v[e] === '.') e++;
    if (e - k >= 32) {
      let started = false;
      for (let j = k + 2; j < e - 2; j++) {
        if (!started && (f[j] === '-' || f[j] === '.')) continue;
        started = f[j] !== '.' ? true : false;
        v[j] = f[j];
      }
    }
    k = e;
  }
  return v.join(' ');
}

// Melodia presa da un MIDI della sola voce (es. Basic Pitch su una traccia vocale separata)
function voiceLine(file, first, step, steps) {
  const m = readMidi(file);
  const sec = 60 / m.bpm / m.division;
  const slots = Array.from({ length: steps }, () => []);
  for (const n of m.voices.flatMap(v => v.notes)) {
    const t0 = n.start * sec, t1 = n.end * sec;
    if (t1 - t0 < 0.08) continue;
    const x = { ...n, s: Math.round((t0 - first) / step), e: Math.round((t1 - first) / step) };
    for (let k = Math.max(0, x.s); k < Math.min(Math.max(x.e, x.s + 1), steps); k++) slots[k].push(x);
  }
  let p = 0, c = 0; slots.forEach(l => l.forEach(n => { p += n.pitch; c++; }));
  const shift = c && p / c < 60 ? 12 : 0;
  return track(slots, () => true).split(' ').map(t => (t === '.' || t === '-' || !shift) ? t : tok(nameToMidi(t) + shift)).join(' ');
}
const nameToMidi = t => { const m = t.match(/^([A-G]#?)(\d)$/); return NAMES.indexOf(m[1]) + (Number(m[2]) + 1) * 12; };

// Traccia unica polifonica: griglia fine (1/8 di battito), melodia = nota più alta, basso = più bassa, accordi in mezzo
function polySong(midi, opts) {
  const sec = 60 / midi.bpm / midi.division;
  const minDur = Number(opts.min || 90) / 1000, minVel = Number(opts.vel || 30);
  const split = Number(opts.split || 52), top = Number(opts.top || 88);
  let notes = midi.voices.flatMap(v => v.notes)
    .map(n => ({ ...n, t0: n.start * sec, t1: n.end * sec }))
    .filter(n => n.t1 - n.t0 >= minDur && n.vel >= minVel);
  const first = Math.min(...notes.map(n => n.t0)) + Number(opts.from || 0);
  const last = opts.len ? first + Number(opts.len) : Math.max(...notes.map(n => n.t1));
  const step = 60 / midi.bpm / 8;
  const steps = Math.ceil((last - first) / step / 16) * 16;
  const slots = Array.from({ length: steps }, () => []);
  for (const n of notes) {
    n.s = Math.round((n.t0 - first) / step);
    n.e = Math.max(n.s + 1, Math.round((n.t1 - first) / step));
    for (let k = Math.max(0, n.s); k < Math.min(n.e, steps); k++) slots[k].push(n);
  }
  // una nota per slot: onset batte coda, poi la più alta (melodia) o la più bassa (basso)
  const mono = (pick, inRange, ok = () => true) => {
    let prev = null;
    return slots.map((list) => {
      const c = list.filter(n => inRange(n.pitch) && ok(n));
      if (!c.length) { prev = null; return '.'; }
      const k = slots.indexOf(list);
      const fresh = c.filter(n => n.s === k);
      const n = pick(fresh.length ? fresh : c);
      const out = (n === prev && n.s !== k) ? '-' : tok(n.pitch);
      prev = n;
      return out;
    }).join(' ');
  };
  const high = l => l.reduce((a, b) => (b.pitch > a.pitch ? b : a));
  const low = l => l.reduce((a, b) => (b.pitch < a.pitch ? b : a));
  // melodia: solo note abbastanza forti e lunghe, il resto è rumore della trascrizione
  const mVel = Number(opts.mvel || 45), mMin = Number(opts.mmin || 130) / 1000;
  const full = track(slots, n => n.pitch >= split + 3 && n.pitch <= top && n.vel >= mVel && n.t1 - n.t0 >= mMin);
  const melody = opts.melfile ? withFill(voiceLine(opts.melfile, first, step, steps), full) : full;
  const bass = mono(low, p => p < split);
  const tracks = [
    { inst: 'lead', vol: 0.24, notes: melody },
    { inst: 'bass', vol: 0.26, notes: bass },
  ];
  if (opts.chords === '1') {
    // accordi: le note di mezzo (senza la melodia), al massimo 3, ripetute solo quando cambiano
    let prevKey = '';
    const chords = slots.map((list, k) => {
      const mel = list.filter(n => n.pitch >= split + 3 && n.pitch <= top);
      const m = mel.length ? high(mel) : null;
      const mid = list.filter(n => n !== m && n.pitch >= split - 4 && n.pitch <= 76)
        .sort((a, b) => b.vel - a.vel).slice(0, 3).sort((a, b) => a.pitch - b.pitch);
      if (!mid.length) { prevKey = ''; return '.'; }
      const key = [...new Set(mid.map(n => tok(n.pitch < 55 ? n.pitch + 12 : n.pitch)))].join('+');
      const out = (key === prevKey && !mid.some(n => n.s === k)) ? '-' : key;
      prevKey = key;
      return out;
    }).join(' ');
    tracks.push({ inst: 'pad', vol: 0.04, notes: chords });
  }
  return { bpm: Number(opts.bpm || midi.bpm * 2), gain: Number(opts.gain || 2.2), tracks };
}

function songFor(file, opts) {
  const midi = readMidi(file);
  const v = midi.voices;
  if (!v.length) throw new Error(file + ': nessuna nota trovata');
  if (v.length === 1 || opts.poly === '1') return polySong(midi, opts);
  const pick = (k, fallback) => (opts[k] !== undefined ? v[Number(opts[k])] : fallback);
  const byAvg = [...v].sort((a, b) => b.avg - a.avg);
  const melody = pick('melody', byAvg[0]);
  const bass = pick('bass', byAvg.length > 1 ? byAvg[byAvg.length - 1] : null);
  const extra = opts.extra !== undefined ? v[Number(opts.extra)] : null;
  const step = midi.division / 4;
  const last = Math.max(...v.flatMap(x => x.notes.map(n => n.end)));
  const from = (Number(opts.start || 1) - 1) * 16;
  let steps = Math.ceil(last / step) - from;
  if (opts.bars) steps = Math.min(steps, Number(opts.bars) * 16);
  steps = Math.ceil(steps / 16) * 16;
  const tracks = [{ inst: 'lead', vol: 0.1, notes: line(melody, step, from, steps, false, [4, 5]) }];
  if (bass && bass !== melody) tracks.push({ inst: 'bass', vol: 0.18, notes: line(bass, step, from, steps, true, [2, 3]) });
  if (extra) tracks.push({ inst: 'piano', vol: 0.06, notes: line(extra, step, from, steps, false, [4, 5]) });
  return { bpm: Number(opts.bpm || midi.bpm), tracks };
}

const args = process.argv.slice(2);
if (args[0] === '--list') {
  for (const file of args.slice(1)) {
    const m = readMidi(file);
    console.log(`${file}: ${m.bpm} bpm`);
    m.voices.forEach((v, i) => console.log(`  ${i}: ${v.name || '(senza nome)'} [${v.id}] ${v.notes.length} note, altezza media ${v.avg.toFixed(0)}`));
  }
  process.exit(0);
}
if (!args.length) { console.log('Uso: vedi i commenti in cima a tools/midi2song.cjs'); process.exit(1); }
let out = '// Generato da tools/midi2song.cjs: file privato, escluso da git.\n';
for (const a of args) {
  const [key, rest] = a.split('=', 2).length === 2 ? [a.slice(0, a.indexOf('=')), a.slice(a.indexOf('=') + 1)] : [null, null];
  if (!key) throw new Error('Formato: chiave=file.mid  (es. gianicolo=local/cosa_sara.mid)');
  const [file, query] = rest.split('?');
  const opts = Object.fromEntries(new URLSearchParams(query || ''));
  const song = songFor(file, opts);
  out += `SONGS.${key} = ${JSON.stringify(song)};\n`;
  console.log(`${key}: ${file} -> ${song.bpm} bpm, ${Math.round(song.tracks[0].notes.split(' ').length * 15 / song.bpm)} secondi, ${song.tracks.length} voci`);
}
const dest = path.join(__dirname, '..', 'local', 'songs.js');
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, out);
console.log('Scritto ' + path.relative(process.cwd(), dest));
