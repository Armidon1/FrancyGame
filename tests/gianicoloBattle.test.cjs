// Eseguire con: node tests/gianicoloBattle.test.cjs (nessuna dipendenza).
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(require('node:path').join(__dirname, '../src/gianicoloBattle.js'), 'utf8') + '\nthis.State = GianicoloBattleState; this.profiles = GIANICOLO_OPPONENTS;', sandbox);
const {State, profiles} = sandbox;
assert.equal(Object.keys(profiles).length, 10);
for (const [key, profile] of Object.entries(profiles)) {
 assert(profile.hp >= 42 && profile.hp <= 58);
 assert(profile.moves.length >= 2);
 assert(profile.moves.every(m => m.effect ? m.damage === 0 : m.damage >= 10 && m.damage <= 16));
 // Estremi della casualità: 2 colpi da 3 e 5 colpi da 5.
 for (const [rng, count, damage] of [[()=>0, 2, 6], [()=>0.999999, 5, 25]]) {
  const s = new State(key, rng), r = s.playerMove(0);
  assert.equal(r.hits.length, count); assert.equal(r.damage, damage);
  assert(r.hits.every(d => d >= 3 && d <= 5));
  assert(s.playerMove(0).skipped); // Non si può saltare il turno avversario.
 }
 if (key !== 'simone') {
 const base = new State(key, ()=>0); base.playerMove(0); const plain = base.enemyMove().damage;
 const buff = new State(key, ()=>0); buff.playerMove(1); const strong = buff.enemyMove().damage;
 assert(strong > plain); const boosted = buff.playerMove(0).damage; assert(boosted > 6);
 const pretty = new State(key, ()=>0); pretty.playerMove(2); const weak = pretty.enemyMove().damage;
 assert(weak <= Math.round(plain * .35));
 for(let i=0;i<3;i++){pretty.playerMove(2); pretty.enemyMove()}
 assert.equal(pretty.pretty,true); assert.equal(pretty.enemyMove().skipped,true);
 }
 const stack = new State(key, ()=>0); for(let i=0;i<4;i++){stack.playerMove(1);stack.enemyMove()}
 assert.equal(stack.spritsStacks,2);
 const flee = new State(key); flee.playerMove(3); assert.equal(flee.outcome,'flee'); assert(flee.enemyMove().skipped); assert.equal(flee.playerHP,100);
 const lose = new State(key,()=>0); for(let i=0;i<30&&!lose.outcome;i++){lose.playerMove(1);lose.enemyMove()}
 assert.equal(lose.outcome,'defeat'); assert.equal(lose.playerHP,0);
 // Anche nella peggior sequenza casuale la strategia difensiva vince (Simone ha test dedicati).
 if (key !== 'simone') {
 const win = new State(key,()=>0); win.playerMove(2); win.enemyMove();
 let turns=0; while(!win.outcome&&turns++<30){win.playerMove(0);win.enemyMove()}
 assert.equal(win.outcome,'victory'); assert.equal(win.enemyHP,0); assert(win.playerHP>0);
 }
 const fresh = new State(key); assert.equal(fresh.playerHP,100); assert.equal(fresh.spritsStacks,0); assert.equal(fresh.pretty,false);
 assert.throws(()=>fresh.playerMove(4));
}
// Simone: Bestemmia Lampo, Abbraccione MAX, Scorreggia.
{
 const moves = profiles.simone.moves.map(m => m.name).join();
 assert.equal(moves, 'Bestemmia Lampo,Abbraccione MAX,Scorreggia');
 // rng 0 sceglie la prima mossa disponibile.
 const s = new State('simone', ()=>0); s.playerMove(2);
 const curse = s.enemyMove(); assert.equal(curse.effect, 'curse'); assert.equal(curse.damage, 0);
 assert.equal(s.weakTurns, 2); assert.equal(s.guardTurns, 2);
 // Pipas: 3 x 0,35 x 0,5 -> minimo 1 a colpo.
 assert.equal(s.playerMove(0).hits.join(), '1,1'); assert.equal(s.weakTurns, 1);
 // Effetto attivo: non ripete Bestemmia, usa Abbraccione MAX (16 x 0,35 per Pretty).
 const hug = s.enemyMove(); assert.equal(hug.name, 'Abbraccione MAX'); assert.equal(hug.damage, 6);
 s.playerMove(0); assert.equal(s.weakTurns, 0); assert.equal(s.guardTurns, 0);
 assert.equal(s.playerMove(0).skipped, true);
 // Veleno: 5 PS a ogni round, non cumulativo.
 const p = new State('simone', ()=>0.999999); p.playerMove(2);
 const fart = p.enemyMove(); assert.equal(fart.effect, 'poison'); assert.equal(fart.poison, 5); assert.equal(p.playerHP, 95);
 p.playerMove(2); const next = p.enemyMove(); assert.notEqual(next.effect, 'poison'); assert.equal(next.poison, 5);
 // Senza effetti, il danno pieno di Abbraccione MAX è 16.
 const h = new State('simone', ()=>0.5); h.playerMove(3); assert.equal(h.outcome, 'flee');
 const full = new State('simone', ()=>0.5); full.playerMove(1); full.spritsStacks = 0; assert.equal(full.enemyMove().damage, 16);
 // Il veleno può concludere la lotta, sempre senza game over.
 const end = new State('simone', ()=>0.999999); end.playerHP = 5; end.playerMove(2); end.enemyMove();
 assert.equal(end.outcome, 'defeat');
}
console.log('OK: 10 avversari; multi-colpo, potenziamenti, limiti, turni, fuga, vittoria, sconfitta e reset; mosse speciali di Simone.');
