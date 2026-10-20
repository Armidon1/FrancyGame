// Riquadro dei dialoghi in stile Pokémon: testo lettera per lettera, A per accelerare/avanzare,
// nome di chi parla in alto a sinistra.

const DIALOG = {
  x: 4, y: 206, w: 472, h: 60,
  padX: 11, padY: 9,
  lines: 3,
  cps: 45, // caratteri al secondo
};

const SPEAKER_COLORS = {
  Simone: 0x2f4f86,
  Francesca: 0xc0506e,
};

function dialogBoxCanvas(w, h) {
  const [c, ctx] = Pix.canvas(w, h);
  // Bordo doppio: scuro esterno, crema, linea calda interna
  Pix.box(ctx, 0, 0, w, h, PAL.cream, PAL.outline);
  Pix.rect(ctx, 2, 2, w - 4, 1, PAL.pink);
  Pix.rect(ctx, 2, h - 3, w - 4, 1, PAL.pink);
  Pix.rect(ctx, 2, 2, 1, h - 4, PAL.pink);
  Pix.rect(ctx, w - 3, 2, 1, h - 4, PAL.pink);
  Pix.rect(ctx, 3, 3, w - 6, 1, '#fffaf0');
  return c;
}

function nameTabCanvas(w) {
  const h = 14;
  const [c, ctx] = Pix.canvas(w, h);
  Pix.box(ctx, 0, 0, w, h, PAL.cream, PAL.outline);
  Pix.rect(ctx, 2, 2, w - 4, 1, '#fffaf0');
  return c;
}

class DialogBox {
  constructor(scene) {
    this.scene = scene;
    const D = DIALOG;
    const key = `dlg_${D.w}x${D.h}`;
    if (!scene.textures.exists(key)) Pix.addTexture(scene, key, dialogBoxCanvas(D.w, D.h));
    this.root = scene.add.container(0, 0).setScrollFactor(0).setDepth(1000).setVisible(false);
    this.bg = scene.add.image(D.x, D.y, key).setOrigin(0, 0);
    this.tab = scene.add.image(D.x + 6, D.y - 11, '__DEFAULT').setOrigin(0, 0).setVisible(false);
    this.nameText = addText(scene, 0, D.y - 8, '', { color: 0x2a1d1a });
    this.text = addText(scene, D.x + D.padX, D.y + D.padY, '', { color: 0x2a1d1a });
    this.text.setLineSpacing(1);
    this.arrow = addText(scene, D.x + D.w - 14, D.y + D.h - 13, '▼', { color: 0xd0607e });
    this.root.add([this.bg, this.tab, this.nameText, this.text, this.arrow]);
    this.queue = [];
    this.pages = [];
    this.active = false;
    this.resolve = null;
    scene.tweens.add({ targets: this.arrow, y: '+=2', duration: 350, yoyo: true, repeat: -1 });
  }

  // lines: [{ who, text }] oppure [['Simone', 'testo'], [null, 'narrazione']]
  show(lines) {
    if (!Array.isArray(lines[0]) && typeof lines[0] !== 'object') lines = [lines];
    this.queue = lines.map(l => (Array.isArray(l) ? { who: l[0], text: l[1] } : l));
    this.active = true;
    this.root.setVisible(true);
    Controls.reset();
    this.nextLine();
    return new Promise(res => { this.resolve = res; });
  }

  nextLine() {
    const line = this.queue.shift();
    if (!line) { this.close(); return; }
    this.setSpeaker(line.who);
    const wrapped = FontMetrics.wrap(fontText(line.text), DIALOG.w - DIALOG.padX * 2);
    this.pages = [];
    for (let i = 0; i < wrapped.length; i += DIALOG.lines) {
      this.pages.push(wrapped.slice(i, i + DIALOG.lines).join('\n'));
    }
    this.nextPage();
  }

  nextPage() {
    this.full = this.pages.shift();
    this.shown = 0;
    this.acc = 0;
    this.text.setText('');
    this.arrow.setVisible(false);
  }

  setSpeaker(who) {
    if (!who) {
      this.tab.setVisible(false);
      this.nameText.setVisible(false);
      return;
    }
    const w = FontMetrics.measure(fontText(who)) + 14;
    const key = `dlgtab_${w}`;
    if (!this.scene.textures.exists(key)) Pix.addTexture(this.scene, key, nameTabCanvas(w));
    this.tab.setTexture(key).setVisible(true);
    this.nameText.setText(fontText(who)).setVisible(true);
    this.nameText.x = this.tab.x + 7;
    this.nameText.y = this.tab.y + 3;
    this.nameText.setTint(SPEAKER_COLORS[who] || 0x6e4426);
  }

  close() {
    this.active = false;
    this.root.setVisible(false);
    const r = this.resolve;
    this.resolve = null;
    if (r) r();
  }

  update(delta) {
    if (!this.active) return;
    const a = Controls.consumeA();
    const done = this.shown >= this.full.length;
    if (!done) {
      if (a) {
        this.shown = this.full.length;
      } else {
        this.acc += delta / 1000 * DIALOG.cps;
        const n = Math.floor(this.acc);
        if (n > 0) {
          this.acc -= n;
          const before = this.shown;
          this.shown = Math.min(this.full.length, this.shown + n);
          if (Math.floor(before / 2) !== Math.floor(this.shown / 2)) Audio8.sfx('blip');
        }
      }
      this.text.setText(this.full.slice(0, this.shown));
      if (this.shown >= this.full.length) this.arrow.setVisible(true);
    } else if (a) {
      Audio8.sfx('select');
      if (this.pages.length) this.nextPage();
      else this.nextLine();
    }
  }
}
