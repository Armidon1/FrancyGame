// Movimento a griglia stile Pokémon (livelli 1 e 3): passi da un tile, interazioni col "!",
// compagno che segue i passi.

const TILE = 16;

// Piedi del personaggio nel tile (c, r)
function tileFeet(c, r) {
  return { x: c * TILE + 8, y: r * TILE + 14 };
}

class GridWorld {
  constructor(map, walkChars) {
    this.map = map;
    this.w = map[0].length;
    this.h = map.length;
    this.walk = new Set(walkChars);
    this.occupied = new Map();  // "c,r" -> oggetto (NPC)
    this.interact = new Map();  // "c,r" -> funzione
    this.blocked = new Set();   // blocchi extra (cancelli, ecc.)
  }

  key(c, r) { return `${c},${r}`; }

  tile(c, r) {
    if (r < 0 || r >= this.h || c < 0 || c >= this.w) return null;
    return this.map[r][c];
  }

  isWalkable(c, r) {
    const t = this.tile(c, r);
    if (!t || !this.walk.has(t)) return false;
    const k = this.key(c, r);
    return !this.occupied.has(k) && !this.blocked.has(k);
  }

  setInteract(c, r, fn) { this.interact.set(this.key(c, r), fn); }

  // NPC: occupa il tile e diventa interagibile
  placeNPC(scene, key, c, r, dir, onTalk) {
    const p = tileFeet(c, r);
    const ch = new Character(scene, key, p.x, p.y, dir);
    const npc = { ch, c, r, key };
    this.occupied.set(this.key(c, r), npc);
    if (onTalk) this.setInteract(c, r, onTalk);
    return npc;
  }

  moveNPC(npc, c, r) {
    const fn = this.interact.get(this.key(npc.c, npc.r));
    this.occupied.delete(this.key(npc.c, npc.r));
    this.interact.delete(this.key(npc.c, npc.r));
    npc.c = c;
    npc.r = r;
    this.occupied.set(this.key(c, r), npc);
    if (fn) this.interact.set(this.key(c, r), fn);
  }
}

class GridMover {
  constructor(scene, world, ch, c, r) {
    this.scene = scene;
    this.world = world;
    this.ch = ch;
    this.c = c;
    this.r = r;
    this.moving = false;
    this.stepMs = 200;
    this.speed = 1;          // < 1 = più lento (stanchezza)
    this.turnUntil = 0;
    this.lastDir = null;
    this.onStep = null;      // (c, r) => void, dopo ogni passo
    this.onBump = null;      // (c, r, dir) => void, quando si sbatte contro qualcosa
    this.follower = null;
    this.trail = [];
    const p = tileFeet(c, r);
    ch.setPos(p.x, p.y);
  }

  facing() {
    const [dx, dy] = DIR_VEC[this.ch.dir];
    return { c: this.c + dx, r: this.r + dy };
  }

  teleport(c, r, dir) {
    this.c = c;
    this.r = r;
    const p = tileFeet(c, r);
    this.ch.setPos(p.x, p.y);
    if (dir) this.ch.face(dir);
    this.trail = [];
  }

  update(time, canMove) {
    if (this.moving) return;
    const d = canMove ? Controls.dir() : null;
    if (!d) {
      if (this.ch.sprite.anims.isPlaying) this.ch.face(this.ch.dir);
      this.lastDir = null;
      if (this.follower && this.follower.ch.sprite.anims.isPlaying && !this.follower.moving) {
        this.follower.ch.face(this.follower.ch.dir);
      }
      return;
    }
    // un tocco breve in un'altra direzione gira solo il personaggio
    if (d !== this.ch.dir && this.lastDir === null) {
      this.ch.face(d);
      this.turnUntil = time + 90;
      this.lastDir = d;
      return;
    }
    this.lastDir = d;
    if (time < this.turnUntil) return;
    const [dx, dy] = DIR_VEC[d];
    const nc = this.c + dx;
    const nr = this.r + dy;
    if (!this.world.isWalkable(nc, nr)) {
      this.ch.face(d);
      if (this.onBump) this.onBump(nc, nr, d);
      return;
    }
    this.step(d, nc, nr);
  }

  step(d, nc, nr) {
    const prev = { c: this.c, r: this.r, dir: d };
    this.moving = true;
    this.ch.walk(d, this.speed);
    const p = tileFeet(nc, nr);
    const dur = this.stepMs / this.speed;
    this.scene.tweens.add({
      targets: this.ch, x: p.x, y: p.y, duration: dur,
      onUpdate: () => this.ch.sync(),
      onComplete: () => {
        this.c = nc;
        this.r = nr;
        this.moving = false;
        if (this.onStep) this.onStep(nc, nr);
      },
    });
    if (this.follower) this.follower.stepTo(prev.c, prev.r, dur);
  }

  // Il compagno può stare sul tile appena lasciato
  attachFollower(ch, c, r) {
    const f = {
      ch, c, r, moving: false,
      stepTo: (tc, tr, dur) => {
        const dx = tc - f.c;
        const dy = tr - f.r;
        if (dx === 0 && dy === 0) return;
        const dir = dirFromVector(dx, dy, f.ch.dir);
        f.moving = true;
        f.ch.walk(dir, this.speed);
        const p = tileFeet(tc, tr);
        this.scene.tweens.add({
          targets: f.ch, x: p.x, y: p.y, duration: dur,
          onUpdate: () => f.ch.sync(),
          onComplete: () => { f.c = tc; f.r = tr; f.moving = false; },
        });
      },
    };
    const p = tileFeet(c, r);
    ch.setPos(p.x, p.y);
    this.follower = f;
    return f;
  }
}

// Il "!" sopra NPC e oggetti quando Francesca li guarda da vicino
class ExclaimMarker {
  constructor(scene) {
    this.img = scene.add.image(0, 0, 'exclaim').setOrigin(0.5, 1).setDepth(1900).setVisible(false);
    scene.tweens.add({ targets: this.img, scaleY: 1.12, duration: 300, yoyo: true, repeat: -1 });
  }

  show(c, r, lift = 22) {
    this.img.setPosition(c * TILE + 8, r * TILE + 14 - lift).setVisible(true);
  }

  hide() { this.img.setVisible(false); }
}
