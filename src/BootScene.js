// Caricamento sprite, generazione di font/grafica/animazioni, poi via alla scena giusta.

class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    this.load.spritesheet('francesca', 'assets/francesca_sheet.png', { frameWidth: 16, frameHeight: 22 });
    this.load.spritesheet('simone', 'assets/simone_sheet.png', { frameWidth: 16, frameHeight: 22 });
  }

  create() {
    buildPixelFont(this);
    Art.build(this);
    ['francesca', 'simone', ...Object.keys(NPC_DEFS)].forEach(k => createCharAnims(this, k));

    const target = startSceneFromURL() || 'Title';
    this.scene.start(target);
  }
}

// ?level=1 / 2 / 3 / finale / title per i test
function startSceneFromURL() {
  const v = new URLSearchParams(location.search).get('level');
  if (!v) return null;
  const map = { 1: 'Level1', 2: 'Level2', 3: 'Level3', finale: 'Finale', title: 'Title', fine: 'Finale', notte: 'LondonNight' };
  return map[v.toLowerCase()] || null;
}
