// Test browser: dipendenza opzionale puppeteer-core, non necessaria al gioco.
// Vedere tests/README.md per prerequisiti e modalità di isolamento asset.
const puppeteer = require(process.env.PUPPETEER_PATH || 'puppeteer-core');
const assert = require('node:assert/strict');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
 const browser = await puppeteer.launch({executablePath:process.env.CHROME_PATH || '/usr/bin/chromium-browser', headless:true, args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader']});
 try {
  const page=await browser.newPage();
  await page.setViewport({width:960,height:540});
  const errors=[]; page.on('pageerror',e=>{errors.push(e.message);console.log('PAGEERROR',e.stack)});
  if (process.env.TEST_USE_COMMITTED_SPRITE === '1') {
  const originalSprite=require('node:child_process').execFileSync('git',['show','HEAD:assets/francesca_sheet.png'],{cwd:require('node:path').resolve(__dirname,'..')});
  await page.setRequestInterception(true);
  page.on('request',r=>r.url().endsWith('/assets/francesca_sheet.png')?r.respond({status:200,contentType:'image/png',body:originalSprite}):r.continue());
  }
  await page.goto((process.env.GAME_URL || 'http://localhost:8000/')+'?level=1',{waitUntil:'networkidle0'});
  await page.waitForFunction(()=>typeof game!=='undefined' && game.scene.isActive('Level1'));
  async function until(fn,timeout=20000){const t=Date.now();while(Date.now()-t<timeout){if(await page.evaluate(fn))return;await page.evaluate(()=>{const s=game.scene.getScene('Level1');if(s.dialog.active||s.aWaiter)Controls.pressA()});await sleep(90)}throw Error('Timeout: '+fn)}
  await until(()=>!game.scene.getScene('Level1').locked);
  assert.equal(await page.evaluate(()=>game.scene.getScene('Level1').challengeNPCs.length),10);
  // Cammina realmente dal punto iniziale al cameriere (nessun teletrasporto).
  for(const [c,r] of [[14,58],[13,58],[13,54],[12,54]]){
   await page.evaluate(async([c,r])=>{const s=game.scene.getScene('Level1');const t=Date.now();while(s.mover.c!==c||s.mover.r!==r){if(Date.now()-t>12000)throw Error('Cammino bloccato: '+s.mover.c+','+s.mover.r+' verso '+c+','+r+' locked='+s.locked+' dir='+s.player.dir+' enabled='+Controls.enabled+' loop='+game.loop.running+' time='+s.time.now+' delta='+game.loop.delta);if(!s.mover.moving){Controls.keyOrder=[s.mover.r!==r?(s.mover.r>r?'up':'down'):(s.mover.c>c?'left':'right')]}await new Promise(r=>setTimeout(r,20));if(s.mover.moving)Controls.keyOrder=[]}Controls.keyOrder=[];while(s.mover.moving)await new Promise(r=>setTimeout(r,20));s.player.face('up')},[c,r]);
  }
  await page.keyboard.press('Space');
  await page.waitForFunction(()=>!!game.scene.getScene('Level1').npcMenuTick);
  await page.screenshot({path:'/tmp/gianicolo-menu.png'});
  console.log('Menu NPC aperto camminando dal punto iniziale');
  await page.evaluate(()=>{const orig=GianicoloBattle.choose;GianicoloBattle.choose=async function(...args){const i=await orig.apply(this,args);console.log('SCELTA',args[1],i);return i}});
  page.on('console',m=>{if(m.text().startsWith('SCELTA'))console.log(m.text())});
  async function click(x,y){const rect=await page.$eval('#game canvas',e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}});await (page.viewport().hasTouch?page.touchscreen.tap(rect.x+x/480*rect.w,rect.y+y/270*rect.h):page.mouse.click(rect.x+x/480*rect.w,rect.y+y/270*rect.h));await sleep(70)}
  async function pick(index,battle=false){await page.waitForFunction(()=>!!game.scene.getScene('Level1').npcMenuTick);await sleep(120);const {hits,confirm}=await page.evaluate(()=>{const t=game.scene.getScene('Level1').npcMenuTick;return {hits:t.hits,confirm:t.confirm}});await click(hits[index].x,hits[index].y);if(!battle)return; /* menu NPC compatto: il tocco sceglie subito */ assert.equal(await page.evaluate(()=>!!game.scene.getScene('Level1').npcMenuTick),true,'Il tap deve solo selezionare');await click(confirm.x,confirm.y)}
  async function challenge(fighter=0){await pick(1);if(fighter===null)return; /* contro Simone combatte solo Francesca */ await pick(fighter)}
  await challenge(0);
  await until(()=>!!game.scene.getScene('Level1').npcMenuTick);
  await page.screenshot({path:'/tmp/gianicolo-battle.png'});
  await page.evaluate(()=>{game.scene.getScene('Level1').tweens.timeScale=5});
  // Potenziamento, debuff e multi-colpo in una partita reale.
  await pick(1,true); await until(()=>!!game.scene.getScene('Level1').npcMenuTick);
  assert.equal(await page.evaluate(()=>game.scene.getScene('Level1').battle.state.spritsStacks),1);
  await pick(2,true); await until(()=>!!game.scene.getScene('Level1').npcMenuTick);
  assert.equal(await page.evaluate(()=>game.scene.getScene('Level1').battle.state.pretty),true);
  const before=await page.evaluate(()=>game.scene.getScene('Level1').battle.state.enemyHP);
  await pick(0,true);await until(()=>!!game.scene.getScene('Level1').npcMenuTick);
  assert((await page.evaluate(()=>game.scene.getScene('Level1').battle.state.enemyHP))<before);
  await pick(3,true);await until(()=>!game.scene.getScene('Level1').locked);
  assert.equal(await page.evaluate(()=>game.scene.getScene('Level1').heartCount),0);
  console.log('OK: quattro mosse, ritorno alla mappa, nessun cuore modificato');
  // Annulla è raggiungibile anche con tastiera e non apre una battaglia.
  await page.evaluate(()=>{const s=game.scene.getScene('Level1');s.offerChallenge(s.nonna,()=>Promise.resolve())});
  await page.waitForFunction(()=>!!game.scene.getScene('Level1').npcMenuTick);
  for(let i=0;i<2;i++){await page.keyboard.down('ArrowDown');await sleep(90);await page.keyboard.up('ArrowDown');await sleep(60)} /* lista verticale: Annulla è la terza voce */ await page.keyboard.press('Space');
  await until(()=>!game.scene.getScene('Level1').locked);
  assert.equal(await page.evaluate(()=>game.scene.getScene('Level1').battle),null);
  // Ciascun personaggio è sfidabile; fuga e rivincita non cambiano la storia.
  for(const key of await page.evaluate(()=>Object.keys(GIANICOLO_OPPONENTS))){
   await page.evaluate(key=>{const s=game.scene.getScene('Level1');s.offerChallenge(s.challengeNPCs.find(n=>n.key===key),()=>Promise.resolve())},key);
   await challenge(key==='simone'?null:0);await until(()=>!!game.scene.getScene('Level1').npcMenuTick);
   assert.equal(await page.evaluate(()=>game.scene.getScene('Level1').battle.state.playerHP),100);
   await pick(3,true);await until(()=>!game.scene.getScene('Level1').locked);
  }
  console.log('OK: sfida e fuga contro tutti i 10 NPC');
  // Vittoria naturale (niente PS nemici alterati) usando solo Spara Pipas.
  await page.evaluate(()=>{const s=game.scene.getScene('Level1');s.offerChallenge(s.nonna,()=>Promise.resolve())});
  await challenge(0);await until(()=>!!game.scene.getScene('Level1').npcMenuTick);
  await page.evaluate(()=>window.testBattle=game.scene.getScene('Level1').battle);
  for(let i=0;i<12;i++){if(await page.evaluate(()=>!game.scene.getScene('Level1').locked))break;await pick(0,true);await until(()=>!!game.scene.getScene('Level1').npcMenuTick||!game.scene.getScene('Level1').locked)}
  assert.equal(await page.evaluate(()=>window.testBattle.state.outcome),'victory');
  console.log('OK: vittoria completa');
  // Simone come combattente: le sue mosse e la sua vittoria.
  await page.evaluate(()=>{const s=game.scene.getScene('Level1');s.offerChallenge(s.nonna,()=>Promise.resolve())});
  await challenge(1);await until(()=>!!game.scene.getScene('Level1').npcMenuTick);
  await page.evaluate(()=>window.testBattle=game.scene.getScene('Level1').battle);
  assert.equal(await page.evaluate(()=>window.testBattle.state.fighter),'simone');
  await page.screenshot({path:'/tmp/gianicolo-simone.png'});
  await pick(2,true);await until(()=>!!game.scene.getScene('Level1').npcMenuTick);
  assert.equal(await page.evaluate(()=>window.testBattle.state.enemyPoisoned),true);
  for(let i=0;i<12;i++){if(await page.evaluate(()=>!game.scene.getScene('Level1').locked))break;await pick(0,true);await until(()=>!!game.scene.getScene('Level1').npcMenuTick||!game.scene.getScene('Level1').locked)}
  assert.equal(await page.evaluate(()=>window.testBattle.state.outcome),'victory');
  console.log('OK: Simone combatte e vince');
  // Perdita naturale ripetendo i buff, e ripresa senza game over.
  await page.evaluate(()=>{const s=game.scene.getScene('Level1');s.offerChallenge(s.simone,()=>Promise.resolve())});
  await challenge(null);await until(()=>!!game.scene.getScene('Level1').npcMenuTick);
  await page.evaluate(()=>window.testBattle=game.scene.getScene('Level1').battle);
  for(let i=0;i<12;i++){if(await page.evaluate(()=>!game.scene.getScene('Level1').locked))break;await pick(1,true);await until(()=>!!game.scene.getScene('Level1').npcMenuTick||!game.scene.getScene('Level1').locked)}
  assert.equal(await page.evaluate(()=>window.testBattle.state.outcome),'defeat');
  console.log('OK: sconfitta senza game over');
  // La panchina dà ancora il quinto cuore e i turisti mantengono le interazioni spostandosi.
  await page.evaluate(()=>{const s=game.scene.getScene('Level1');s.useBench()});await until(()=>!game.scene.getScene('Level1').locked);await sleep(200);
  assert.equal(await page.evaluate(()=>game.scene.getScene('Level1').heartCount),1);
  await page.evaluate(()=>game.scene.getScene('Level1').moveTourists());await sleep(1000);
  assert.equal(await page.evaluate(()=>{const s=game.scene.getScene('Level1');return typeof s.world.interact.get('12,12')}),'function');
  // Simone: Parla avvia ancora ninja; non sbloccare il movimento durante la scena.
  await page.evaluate(()=>{const s=game.scene.getScene('Level1');s.mover.teleport(15,9,'up');s.world.interact.get('15,8')()});await pick(0);
  await until(()=>!!game.scene.getScene('Level1').mini);assert.equal(await page.evaluate(()=>game.scene.getScene('Level1').busy),true);
  console.log('OK: panchina, turisti e avvio ninja');
  // Mobile: scelta con tap, conferma, fuga e cleanup durante un cambio livello.
  await page.setViewport({width:844,height:390,isMobile:true,hasTouch:true,isLandscape:true});
  await page.evaluate(()=>{const s=game.scene.getScene('Level1');try{s.scene.restart()}catch(e){console.log('RESTART',e.stack);throw e}});await sleep(500);await until(()=>!game.scene.getScene('Level1').locked);
  await page.evaluate(()=>{const s=game.scene.getScene('Level1');s.offerChallenge(s.sindaco,()=>Promise.resolve())});await challenge(0);await until(()=>!!game.scene.getScene('Level1').npcMenuTick);
  assert.equal(await page.$eval('#touch',e=>e.style.visibility),'hidden');
  await page.screenshot({path:'/tmp/gianicolo-mobile.png'});
  await page.evaluate(()=>game.scene.getScene('Level1').scene.start('Level2'));await sleep(800);
  assert.notEqual(await page.$eval('#touch',e=>e.style.visibility),'hidden');
  console.log('OK: menu mobile e cleanup su cambio scena');
  console.log('ERRORI',JSON.stringify(errors)); assert.deepEqual(errors,[]);
 } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
