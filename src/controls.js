// Controlli unificati: tastiera (frecce/WASD + Spazio/Invio), controller e touch (croce + tasto A in HTML sopra il gioco).

const Controls = {
  keys: new Set(),
  keyOrder: [], // ultima direzione premuta ha la precedenza
  touchDir: null,
  touchVec: { x: 0, y: 0 },
  padDir: null, // controller: croce o levetta sinistra
  padVec: { x: 0, y: 0 },
  padPrev: [],
  aQueued: false,
  aHeld: false,
  enabled: true,
  isTouch: false,

  init() {
    const dirOf = {
      ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
      KeyW: 'up', KeyS: 'down', KeyA: 'left', KeyD: 'right',
    };
    window.addEventListener('keydown', (e) => {
      Audio8.unlock();
      const d = dirOf[e.code];
      if (d) {
        e.preventDefault();
        if (!this.keyOrder.includes(d)) this.keyOrder.push(d);
      } else if (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyZ' || e.code === 'KeyX') {
        e.preventDefault();
        if (!e.repeat) this.pressA();
        this.aHeld = true;
      }
    });
    window.addEventListener('keyup', (e) => {
      const d = dirOf[e.code];
      if (d) this.keyOrder = this.keyOrder.filter(k => k !== d);
      else if (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyZ' || e.code === 'KeyX') this.aHeld = false;
    });
    window.addEventListener('blur', () => { this.keyOrder = []; this.aHeld = false; this.setTouchDir(null, 0, 0); });

    const params = new URLSearchParams(location.search);
    this.isTouch = params.get('touch') === '1' ||
      (params.get('touch') !== '0' && (window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0));
    this.buildTouchUI();
    const poll = () => { this.pollGamepads(); requestAnimationFrame(poll); };
    requestAnimationFrame(poll);
  },

  // Controller (mappatura standard): croce/levetta per muoversi, A o X conferma,
  // B indietro nei menu (altrove vale come A), Start o Select apre la pausa
  pollGamepads() {
    const pads = navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(Boolean) : [];
    if (!pads.length) { if (this.padDir) this.setPadDir(null, 0, 0); return; }
    let x = 0, y = 0;
    const down = [];
    for (const gp of pads) {
      const b = (i) => !!(gp.buttons[i] && gp.buttons[i].pressed);
      if (b(14)) x = -1; if (b(15)) x = 1;
      if (b(12)) y = -1; if (b(13)) y = 1;
      const ax = gp.axes[0] || 0, ay = gp.axes[1] || 0;
      if (!x && !y && Math.hypot(ax, ay) > 0.5) {
        const oct = Math.round(Math.atan2(ay, ax) / (Math.PI / 4));
        x = Math.round(Math.cos(oct * Math.PI / 4));
        y = Math.round(Math.sin(oct * Math.PI / 4));
      }
      gp.buttons.forEach((btn, i) => { if (btn.pressed) down[i] = true; });
    }
    const d = !x && !y ? null : Math.abs(x) >= Math.abs(y) && x ? (x > 0 ? 'right' : 'left') : (y > 0 ? 'down' : 'up');
    if (d !== this.padDir || x !== this.padVec.x || y !== this.padVec.y) this.setPadDir(d, x, y);
    const pressed = (i) => down[i] && !this.padPrev[i];
    if (down.some(Boolean)) { Audio8.unlock(); this.usePadUI(); }
    const pause = typeof game !== 'undefined' && game.scene && game.scene.getScene('Pause');
    const paused = pause && pause.scene.isActive();
    if (pressed(9) || pressed(8)) Pause.open();
    else if (pressed(1) && paused) pause.back();
    else if (pressed(0) || pressed(2) || pressed(1)) this.pressA();
    this.padPrev = down;
  },

  setPadDir(d, x, y) {
    this.padDir = d;
    this.padVec = { x, y };
  },

  // Col controller la croce sullo schermo non serve: la nascondiamo (torna al primo tocco)
  usePadUI() {
    if (!this.isTouch) return;
    this.isTouch = false;
    const root = document.getElementById('touch');
    if (root) root.style.display = 'none';
  },

  pressA() {
    if (!this.enabled) return;
    this.aQueued = true;
  },

  // Da chiamare a ogni frame: true una sola volta per pressione
  consumeA() {
    const v = this.aQueued;
    this.aQueued = false;
    return v;
  },

  reset() {
    this.aQueued = false;
  },

  // Direzione dominante (4 direzioni) o null
  dir() {
    if (!this.enabled) return null;
    if (this.keyOrder.length) return this.keyOrder[this.keyOrder.length - 1];
    return this.padDir || this.touchDir;
  },

  // Vettore a 8 direzioni per il ghiaccio
  axis() {
    if (!this.enabled) return { x: 0, y: 0 };
    if (this.keyOrder.length) {
      let x = 0, y = 0;
      for (const k of this.keyOrder) {
        if (k === 'left') x = -1; if (k === 'right') x = 1;
        if (k === 'up') y = -1; if (k === 'down') y = 1;
      }
      return { x, y };
    }
    if (this.padDir) return { x: this.padVec.x, y: this.padVec.y };
    return { x: this.touchVec.x, y: this.touchVec.y };
  },

  setTouchDir(d, x, y) {
    this.touchDir = d;
    this.touchVec = { x, y };
    if (this.padEl) this.padEl.dataset.dir = d || '';
  },

  buildTouchUI() {
    const root = document.getElementById('touch');
    if (!root) return;
    if (!this.isTouch) { root.style.display = 'none'; }

    // Croce direzionale disegnata in pixel art
    const pad = document.createElement('div');
    pad.className = 'pad';
    pad.appendChild(this.padCanvas());
    root.appendChild(pad);
    this.padEl = pad;

    const a = document.createElement('div');
    a.className = 'abtn';
    a.appendChild(this.aCanvas());
    root.appendChild(a);
    this.aEl = a;

    let padPointer = null;
    const updatePad = (e) => {
      const r = pad.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dead = r.width * 0.12;
      if (Math.hypot(dx, dy) < dead) { this.setTouchDir(null, 0, 0); return; }
      const ang = Math.atan2(dy, dx);
      // 8 direzioni per il vettore, 4 per la direzione dominante
      const oct = Math.round(ang / (Math.PI / 4));
      const vx = Math.round(Math.cos(oct * Math.PI / 4));
      const vy = Math.round(Math.sin(oct * Math.PI / 4));
      const d = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
      this.setTouchDir(d, vx, vy);
    };
    pad.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      Audio8.unlock();
      padPointer = e.pointerId;
      try { pad.setPointerCapture(e.pointerId); } catch (_) { /* ok */ }
      updatePad(e);
    });
    pad.addEventListener('pointermove', (e) => { if (e.pointerId === padPointer) updatePad(e); });
    const endPad = (e) => {
      if (e.pointerId !== padPointer) return;
      padPointer = null;
      this.setTouchDir(null, 0, 0);
    };
    pad.addEventListener('pointerup', endPad);
    pad.addEventListener('pointercancel', endPad);
    pad.addEventListener('lostpointercapture', endPad);

    a.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      Audio8.unlock();
      a.classList.add('down');
      this.aHeld = true;
      this.pressA();
    });
    const endA = () => { a.classList.remove('down'); this.aHeld = false; };
    a.addEventListener('pointerup', endA);
    a.addEventListener('pointercancel', endA);
    a.addEventListener('pointerleave', endA);

    // Un tocco sul gioco vale come A (comodo per dialoghi e minigiochi)
    const game = document.getElementById('game');
    game.addEventListener('pointerdown', (e) => {
      Audio8.unlock();
      if (e.pointerType !== 'mouse' || e.button === 0) this.pressA();
    });

    // Se il primo input è touch su un dispositivo "desktop", mostriamo comunque i controlli
    window.addEventListener('touchstart', () => {
      if (!this.isTouch) { this.isTouch = true; root.style.display = ''; }
    }, { passive: true });

    for (const el of [root, pad, a]) el.addEventListener('contextmenu', e => e.preventDefault());
  },

  padCanvas() {
    const rows = [
      '.......KKKKKK.......',
      '.......KWWWWK.......',
      '.......KWWWWK.......',
      '.......KWwwWK.......',
      '.......KWwwWK.......',
      '.......KWWWWK.......',
      '.......KWWWWK.......',
      'KKKKKKKKWWWWKKKKKKKK',
      'KWWWWWWWWWWWWWWWWWWK',
      'KWWwwWWWWkkWWWWwwWWK',
      'KWWwwWWWWkkWWWWwwWWK',
      'KWWWWWWWWWWWWWWWWWWK',
      'KKKKKKKKWWWWKKKKKKKK',
      '.......KWWWWK.......',
      '.......KWWWWK.......',
      '.......KWwwWK.......',
      '.......KWwwWK.......',
      '.......KWWWWK.......',
      '.......KWWWWK.......',
      '.......KKKKKK.......',
    ];
    const c = Pix.gridCanvas(rows, { '.': null, K: '#2a1d1a', W: '#fbf3e4', w: '#c9b48f', k: '#e9d9bd' });
    c.className = 'pix';
    return c;
  },

  aCanvas() {
    const [c, ctx] = Pix.canvas(16, 16);
    Pix.disc(ctx, 8, 8, 7, '#2a1d1a');
    Pix.disc(ctx, 8, 8, 6, '#d9434f');
    Pix.disc(ctx, 7, 7, 4, '#ea6670');
    const A = ['.###.', '#...#', '#####', '#...#', '#...#'];
    Pix.grid(ctx, A, { '.': null, '#': '#fbf3e4' }, 6, 6);
    c.className = 'pix';
    return c;
  },
};
