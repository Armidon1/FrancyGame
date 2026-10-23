// node tests/i18n.test.cjs — nessuna dipendenza.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
function boot(saved, blocked = false) {
  const storage = new Map([['picci_save_v1', '{"level":"Level3"}'], ['picci_mode_v1', '{"mode":"arduo","hp":{"francesca":42}}']]);
  if (saved) storage.set('picci_language', saved);
  const document = { documentElement: {}, createTreeWalker: () => ({ nextNode: () => false }), querySelectorAll: () => [] };
  const sandbox = { document, NodeFilter: { SHOW_TEXT: 4 }, localStorage: {
    getItem(key) { if (blocked) throw Error('storage blocked'); return storage.get(key); },
    setItem(key, value) { if (blocked) throw Error('storage blocked'); storage.set(key, value); },
  } };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(root, 'src/i18n-en.js'), 'utf8') + '\nthis.catalog = I18N_EN;', sandbox);
  vm.runInContext(fs.readFileSync(path.join(root, 'src/i18n.js'), 'utf8') + '\nthis.api = I18n;', sandbox);
  return { ...sandbox, storage };
}
const { api, catalog, storage, document } = boot();
assert.equal(api.lang, 'it');
assert.equal(api.t('Nuova partita'), 'Nuova partita');
assert.equal(boot('en').api.lang, 'en');
assert.equal(boot('xx').api.lang, 'it');
const save = storage.get('picci_save_v1'), mode = storage.get('picci_mode_v1');
api.set('en');
assert.equal(document.documentElement.lang, 'en');
assert.equal(storage.get('picci_language'), 'en');
assert.equal(storage.get('picci_save_v1'), save);
assert.equal(storage.get('picci_mode_v1'), mode);
const samples = new Map([
  ['Nuova partita', 'New game'],
  ['Cuoricino trovato! 3/5', 'Heart found! 3/5'],
  ['Il Sindaco usa Discorso sul fiume!', 'The Mayor uses River speech!'],
  ['Cosa farà Francesca? Tocca, poi Conferma.', 'What will Francesca do? Tap, then Confirm.'],
  ['Un altro piatto. Non era una domanda. Francesca perde 12 PS.', "Another plateful. That wasn't a question. Francesca loses 12 HP."],
  ['Attacco +60%, danni subiti -50% per due turni.', 'Attack +60%, damage taken -50% for two turns.'],
  ['La scorreggia fa ancora effetto. Il Sindaco perde 5 PS.', 'The fart is still working. The Mayor loses 5 HP.'],
  ['Carico: ATK+ DIF+ (2)  Avvelenata', 'Boost: ATK+ DEF+ (2)  Poisoned'],
  ['Yogurt greco 0% x3', '0% Greek yogurt x3'],
  ['3. Londra, 40.000 passi', '3. London, 40,000 steps'],
  ['Livello 3 – Londra, 40.000 passi', 'Level 3 – London, 40,000 steps'],
  ['👣 12.480 / 40.000', '👣 12,480 / 40,000'],
  ['+ un abbraccio', '+ a hug'],
  ['Cosa farà\nSimone?', 'What will\nSimone do?'],
  ['La CACCA DI SIMONE usa PUZZA TREMENDA!', "SIMONE'S POO uses TERRIBLE STENCH!"],
  ['Lingua: English', 'Language: English'],
  ['Scarico il gioco: 12 / 41 file. Resta online fino alla conferma.', "Downloading the game: 12 / 41 files. Stay online until it's confirmed."],
]);
for (const [source, expected] of samples) assert.equal(api.t(source), expected, source);

// Ogni modello mantiene esattamente i propri valori dinamici, senza perdere segnaposto.
for (const [source, translated] of catalog) {
  const parameters = s => [...s.matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort().join(',');
  assert.equal(parameters(source), parameters(translated), source);
  assert.ok(translated.trim(), source);
}
const node = { textContent: '' };
api.text(node, 'Torna al gioco');
assert.equal(node.textContent, 'Back to the game');
api.set('it');
assert.equal(node.textContent, 'Torna al gioco');
assert.equal(document.documentElement.lang, 'it');
assert.equal(api.t('Questa frase rimane italiana.'), 'Questa frase rimane italiana.');
const withoutStorage = boot(null, true).api;
withoutStorage.set('en');
assert.equal(withoutStorage.t('Impostazioni'), 'Settings');
console.log(`OK: ${catalog.size} traduzioni, modelli dinamici, italiano predefinito, preferenza salvata, DOM e progressi invariati.`);
