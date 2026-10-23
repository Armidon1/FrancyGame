// node tests/audio-scheduling.test.cjs — senza dipendenze o uscita audio.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
let tick = null;
const sandbox = {
  setInterval(callback) { tick = callback; return 1; },
  clearInterval() { tick = null; },
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/audio.js'), 'utf8') + '\nthis.audio = Audio8;', sandbox);
const audio = sandbox.audio;
audio.ctx = { currentTime: 0, state: 'running' };
audio.musicGain = { gain: { cancelScheduledValues() {}, setValueAtTime() {} } };
audio.echoSend = { gain: {} };
audio.useFiles = false;
let notes = [];
audio.voice = (frequency, duration, instrument, volume, at) => notes.push({ frequency, at });
const song = { bpm: 120, tracks: [{ type: 'triangle', vol: 0.2, notes: 'C4 D4 E4 F4 G4 A4 B4 C5' }] };
audio.playSong(song);
assert.deepEqual(notes.map(n => n.at), [0.1, 0.225]);
notes = [];
audio.ctx.currentTime = 0.11;
tick();
assert.equal(notes.length, 1);
assert.equal(notes[0].at, 0.35);

// Due secondi di ritardo: poche note future, nessun recupero simultaneo delle passate.
notes = [];
audio.ctx.currentTime = 2;
tick();
assert.ok(notes.length > 0 && notes.length <= 2);
assert.ok(notes.every(n => n.at > 2 && n.at < 2.25));
// La fase musicale resta quella giusta: dopo due secondi riparte il secondo giro.
assert.equal(notes[0].frequency, 261.6255653005986);
assert.equal(notes[0].at, 2.1);

// Le interruzioni non generano nuove note; al ritorno si saltano i passi persi.
for (const state of ['suspended', 'interrupted']) {
  notes = [];
  audio.ctx.state = state;
  audio.ctx.currentTime += 10;
  tick();
  assert.equal(notes.length, 0);
}
audio.ctx.state = 'running';
tick();
assert.ok(notes.length > 0 && notes.length <= 2);
assert.ok(notes.every(n => n.at > audio.ctx.currentTime));
audio.stopSong();
assert.equal(tick, null);
console.log('OK: ritmo normale, ritardo, fase del brano, sospensione/interruzione e ripresa senza raffiche di note.');
