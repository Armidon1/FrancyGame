// Effetto "televisore a tubo catodico": righe di scansione allineate ai pixel del gioco, un filo di sfocatura
// che ammorbidisce i pixel, colori un po' più accesi e bordi scuri come il vetro bombato. Di base è acceso.

const Crt = {
  on: true,

  init(game) {
    try { this.on = localStorage.getItem('picci_crt') !== '0'; } catch (_) { /* ok */ }
    this.game = game;
    this.el = document.getElementById('crt');
    const fit = () => this.fit();
    window.addEventListener('resize', () => setTimeout(fit, 60));
    game.scale.on('resize', () => setTimeout(fit, 0));
    game.events.once('ready', fit);
    this.apply();
  },

  set(on) {
    this.on = on;
    try { localStorage.setItem('picci_crt', on ? '1' : '0'); } catch (_) { /* ok */ }
    this.apply();
  },

  apply() {
    document.body.classList.toggle('crt', this.on);
    this.fit();
  },

  // Il velo segue esattamente il canvas (che Phaser ridimensiona e centra)
  fit() {
    const c = this.game && this.game.canvas;
    if (!c || !this.el) return;
    const r = c.getBoundingClientRect();
    const row = r.height / 270;
    Object.assign(this.el.style, {
      left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`,
    });
    this.el.style.setProperty('--row', `${row}px`);
    document.body.style.setProperty('--crt-blur', `${(row * 0.3).toFixed(2)}px`);
  },
};
