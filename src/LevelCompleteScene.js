// "Livello completato!" con il messaggio del livello, cuoricini che salgono, A per continuare.

class LevelCompleteScene extends BaseScene {
  constructor() { super('LevelComplete'); }

  init(data) {
    this.num = data.num || 1;
    this.next = data.next || 'Title';
  }

  create() {
    this.initBase();
    if (!this.textures.exists('completeBg')) {
      const [c, ctx] = Pix.canvas(480, 270);
      ditherGradient(ctx, 0, 0, 480, 270, ['#3a2350', '#6a3a74', '#b0567e', '#e8828a']);
      Pix.addTexture(this, 'completeBg', c);
    }
    this.add.image(0, 0, 'completeBg').setOrigin(0, 0);
    this.floatHearts(22, { x: 0, y: 0, w: 480, h: 270 }, { depth: 3 });

    const level = LEVELS.find(l => l.num === this.num);
    const title = addText(this, 240, 46, 'Livello completato!', {
      scale: 3, color: 0xffd6de, shadow: 0x5a1a3a, origin: [0.5, 0.5], depth: 10,
    });
    title.setScale(0);
    this.tweens.add({ targets: title, scale: 1, duration: 600, ease: 'Back.Out' });

    const lines = FontMetrics.wrap(fontText(level.message), 200);
    const msg = addText(this, 240, 108, lines.join('\n'), {
      scale: 2, color: 0xfbf3e4, shadow: 0x3a2340, origin: [0.5, 0.5], align: 1, depth: 10,
    });
    msg.setLineSpacing(2);
    I18n.bind(msg, () => msg.setText(FontMetrics.wrap(fontText(level.message), 200).join('\n')));
    msg.setAlpha(0);
    this.tweens.add({ targets: msg, alpha: 1, delay: 500, duration: 700 });

    // I due personaggi che saltellano felici
    const f = this.add.sprite(222, 214, 'francesca', 0).setOrigin(0.5, 1).setScale(2).setDepth(10);
    const s = this.add.sprite(258, 214, 'simone', 0).setOrigin(0.5, 1).setScale(2).setDepth(10);
    const h = this.add.image(240, 160, 'heartBig').setDepth(10).setScale(0);
    this.tweens.add({ targets: h, scale: 1, delay: 900, duration: 500, ease: 'Back.Out' });
    this.tweens.add({ targets: h, y: 156, delay: 1400, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.tweens.add({ targets: f, y: 208, duration: 260, yoyo: true, repeat: -1, repeatDelay: 500, ease: 'Quad.Out' });
    this.tweens.add({ targets: s, y: 208, duration: 260, yoyo: true, repeat: -1, repeatDelay: 500, delay: 380, ease: 'Quad.Out' });

    this.prompt = addText(this, 240, 248, Controls.isTouch ? 'Tocca per continuare' : 'Premi A (Spazio) per continuare', {
      color: 0xfde3a0, shadow: 0x3a2340, origin: [0.5, 0.5], depth: 10,
    });
    this.prompt.setAlpha(0);

    Audio8.stopSong();
    Audio8.sfx('jingle');
    this.run();
  }

  async run() {
    await this.wait(1600);
    this.tweens.add({ targets: this.prompt, alpha: { from: 0.2, to: 1 }, duration: 600, yoyo: true, repeat: -1 });
    await this.waitA();
    this.goTo(this.next);
  }
}
