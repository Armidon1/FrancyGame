// Avvio del gioco: configurazione Phaser, selettore livelli nascosto, audio, orientamento.

const LevelSelect = {
  isOpen: false,
  open() {
    const el = document.getElementById('levelselect');
    el.innerHTML = '';
    const title = document.createElement('p');
    I18n.text(title, 'Selettore livelli (segreto)');
    el.appendChild(title);
    const items = [
      ['Introduzione', () => { Save.clear(); return 'Title'; }],
      ['Livello 1 — Il Gianicolo', () => 'Level1'],
      ['Livello 2 — La pista', () => 'Level2'],
      ['Livello 3 — Londra', () => 'Level3'],
      ['Londra — quella sera', () => 'LondonNight'],
      ['Finale', () => 'Finale'],
      ['Ricomincia da capo', () => { Save.clear(); return 'Title'; }],
      ['Chiudi', () => null],
    ];
    for (const [label, fn] of items) {
      const b = document.createElement('button');
      I18n.text(b, label);
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        const target = fn();
        this.close();
        if (target) {
          game.scene.getScenes(true).forEach(s => { if (s.scene.key !== target) s.scene.stop(); });
          game.scene.start(target);
        } else {
          const t = game.scene.getScene('Title');
          if (t && t.scene.isActive()) t.started = false;
        }
      });
      el.appendChild(b);
    }
    el.style.display = 'flex';
    this.isOpen = true;
  },
  close() {
    document.getElementById('levelselect').style.display = 'none';
    this.isOpen = false;
    Controls.reset();
  },
};

function setupMuteButton() {
  const b = document.getElementById('mute');
  const draw = () => { b.textContent = '♪'; b.classList.toggle('off', Audio8.muted); };
  b.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    Audio8.unlock();
    Audio8.setMuted(!Audio8.muted);
    draw();
  });
  draw();
}

// Menu di pausa: Esc da tastiera o il tasto in alto a destra
function setupPause() {
  window.addEventListener('keydown', (e) => {
    if (e.code !== 'Escape' || e.repeat) return;
    e.preventDefault();
    Pause.open();
  });
  const btn = document.getElementById('pausebtn');
  // il tasto si vede solo dove la pausa ha senso (non sul titolo)
  setInterval(() => {
    const on = game.scene.getScenes(true).some(s => PAUSABLE.includes(s.scene.key) || s.scene.key === 'Pause');
    btn.style.display = on ? '' : 'none';
    document.getElementById('offline-open').hidden = !game.scene.getScenes(true)
      .some(s => s.scene.key === 'Title' || s.scene.key === 'Pause');
  }, 300);
  btn.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    Audio8.unlock();
    Pause.open();
  });
}

// In verticale su telefono mettiamo in pausa (c'è l'avviso "gira il telefono")
function setupOrientation() {
  const check = () => {
    const portrait = Controls.isTouch && window.innerHeight > window.innerWidth;
    document.body.classList.toggle('portrait', portrait);
    if (!game.loop) return;
    if (portrait && game.loop.running) game.loop.sleep();
    else if (!portrait && !game.loop.running) game.loop.wake();
  };
  window.addEventListener('resize', check);
  window.addEventListener('orientationchange', () => setTimeout(check, 200));
  game.events.once('ready', check);
}

Audio8.init();
document.addEventListener('visibilitychange', () => {
  if (!Audio8.ctx) return;
  if (document.hidden) Audio8.ctx.suspend(); else Audio8.ctx.resume();
});
Controls.init();
document.body.classList.toggle('touch', Controls.isTouch);

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 480,
  height: 270,
  pixelArt: true,
  backgroundColor: '#1a1020',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  audio: { noAudio: true },
  input: { activePointers: 3 },
  banner: false,
  scene: [
    BootScene, TitleScene, Level1Scene, Level2Scene, Level3Scene, LondonNightScene, LevelCompleteScene, FinaleScene, PauseScene,
  ],
});

setupMuteButton();
setupOrientation();
setupPause();
Crt.init(game);
OfflineGame.init();
