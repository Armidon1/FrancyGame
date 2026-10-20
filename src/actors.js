// Personaggi: sprite 16x22 con ombra, animazioni di camminata a 4 direzioni.

const DIR_ROW = { down: 0, left: 1, right: 2, up: 3 };
const DIR_VEC = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] };
const OPPOSITE = { down: 'up', up: 'down', left: 'right', right: 'left' };

function createCharAnims(scene, key) {
  Object.entries(DIR_ROW).forEach(([d, r]) => {
    const k = `${key}-walk-${d}`;
    if (scene.anims.exists(k)) return;
    scene.anims.create({
      key: k,
      frames: [1, 0, 2, 0].map(c => ({ key, frame: r * 3 + c })),
      frameRate: 8,
      repeat: -1,
    });
  });
}

function dirFromVector(x, y, fallback) {
  if (x === 0 && y === 0) return fallback;
  if (Math.abs(x) > Math.abs(y)) return x > 0 ? 'right' : 'left';
  return y > 0 ? 'down' : 'up';
}

class Character {
  // (x, y) = punto dei piedi
  constructor(scene, key, x, y, dir = 'down') {
    this.scene = scene;
    this.key = key;
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.shadow = scene.add.image(0, 0, 'shadow').setDepth(2);
    this.sprite = scene.add.sprite(0, 0, key, DIR_ROW[dir] * 3).setOrigin(0.5, 1);
    this.lift = 0; // sollevamento (salti, cadute)
    this.sync();
  }

  sync() {
    const rx = Math.round(this.x);
    const ry = Math.round(this.y);
    this.sprite.setPosition(rx, ry + 1 - Math.round(this.lift));
    this.shadow.setPosition(rx, ry);
    this.sprite.setDepth(10 + ry);
  }

  setPos(x, y) {
    this.x = x;
    this.y = y;
    this.sync();
    return this;
  }

  face(dir) {
    this.dir = dir;
    this.sprite.anims.stop();
    this.sprite.setFrame(DIR_ROW[dir] * 3);
    return this;
  }

  walk(dir, rate) {
    this.dir = dir;
    const k = `${this.key}-walk-${dir}`;
    if (this.sprite.anims.currentAnim?.key !== k || !this.sprite.anims.isPlaying) this.sprite.play(k);
    this.sprite.anims.timeScale = rate || 1;
    return this;
  }

  // Cammina fino a (x, y) a velocità costante (px/s), restituisce una Promise
  walkTo(x, y, speed = 60) {
    return new Promise((res) => {
      const dx = x - this.x;
      const dy = y - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 0.5) { res(); return; }
      this.walk(dirFromVector(dx, dy, this.dir));
      this.scene.tweens.add({
        targets: this,
        x, y,
        duration: dist / speed * 1000,
        onUpdate: () => this.sync(),
        onComplete: () => { this.face(this.dir); res(); },
      });
    });
  }

  setVisible(v) {
    this.sprite.setVisible(v);
    this.shadow.setVisible(v);
    return this;
  }

  destroy() {
    this.sprite.destroy();
    this.shadow.destroy();
  }
}
