// Download esplicito: nessuna conferma finché il service worker non verifica tutti i file.
const OfflineGame = {
  registration: null,
  ready: false,
  downloading: false,

  isAppleBrowser() {
    const apple = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    return apple && navigator.standalone !== true &&
      !window.matchMedia('(display-mode: standalone)').matches &&
      !window.matchMedia('(display-mode: fullscreen)').matches;
  },

  init() {
    this.dialog = document.getElementById('offline-dialog');
    this.status = document.getElementById('offline-status');
    this.progress = document.getElementById('offline-progress');
    this.downloadButton = document.getElementById('offline-download');
    this.closeButton = document.getElementById('offline-close');
    this.launcher = document.getElementById('offline-open');
    this.launcher.addEventListener('click', () => this.open());
    this.downloadButton.addEventListener('click', () => this.download());
    this.closeButton.addEventListener('click', () => this.dialog.close());
    this.dialog.addEventListener('cancel', e => { if (this.downloading) e.preventDefault(); });
    this.dialog.addEventListener('close', () => {
      Controls.enabled = this.previousControls;
      Controls.reset();
      document.documentElement.classList.remove('offline-open');
    });
    for (const event of ['pointerdown', 'pointerup', 'click', 'keydown', 'keyup']) {
      this.dialog.addEventListener(event, e => e.stopPropagation());
    }
    if (window.isSecureContext && 'serviceWorker' in navigator) {
      this.check().catch(() => {}); // Il gioco online continua anche se il download non è supportato.
    }
  },

  async worker() {
    if (!window.isSecureContext || !('serviceWorker' in navigator)) {
      throw new Error('Per scaricare il gioco apri il link HTTPS del sito. Il link HTTP sulla rete locale serve solo per le prove online.');
    }
    try {
      if (!this.registration) {
        const existing = await navigator.serviceWorker.getRegistration('./');
        this.registration = existing?.scope === new URL('./', location.href).href ? existing :
          await navigator.serviceWorker.register('sw.js', { scope: './' });
      }
      const registration = await navigator.serviceWorker.ready;
      return registration.active;
    } catch (_) {
      throw new Error('Non riesco a preparare il download. Controlla la connessione e che il sito sia ancora online.');
    }
  },

  async request(type, onProgress) {
    const worker = await this.worker();
    return new Promise((resolve, reject) => {
      const channel = new MessageChannel();
      let timer;
      const finish = (error, data) => {
        clearTimeout(timer);
        channel.port1.close();
        if (error) reject(error); else resolve(data);
      };
      const renew = () => {
        clearTimeout(timer);
        timer = setTimeout(() => finish(new Error('Il download non risponde. Controlla la connessione e riprova.')), 45000);
      };
      channel.port1.onmessage = ({ data }) => {
        renew();
        if (data.type === 'PROGRESS') { onProgress?.(data); return; }
        finish(data.error ? new Error(data.error) : null, data);
      };
      renew();
      worker.postMessage({ type }, [channel.port2]);
    });
  },

  async check() {
    const result = await this.request('STATUS');
    this.ready = result.ready;
    I18n.text(this.launcher, this.ready ? 'Gioco disponibile offline ✓' : 'Scarica gioco offline');
    return this.ready;
  },

  async open() {
    if (this.dialog.open) return;
    this.previousControls = Controls.enabled;
    Controls.enabled = false;
    Controls.reset();
    document.documentElement.classList.add('offline-open');
    this.dialog.showModal();
    this.progress.hidden = true;
    this.downloadButton.hidden = false;
    if (this.isAppleBrowser()) {
      I18n.text(this.status, 'Prima aggiungi il gioco alla Home: Safari → Condividi → Aggiungi alla schermata Home. Poi aprilo dalla nuova icona e scaricalo da lì.');
      this.downloadButton.disabled = true;
      return;
    }
    this.downloadButton.disabled = true;
    I18n.text(this.status, 'Controllo la copia sul dispositivo…');
    try {
      const ready = await this.check();
      I18n.text(this.status, ready ? 'Pronto per giocare offline! Tutti i file sono sul dispositivo, anche se il sito viene disattivato.' : 'Il gioco non è ancora scaricato. Tocca “Scarica tutto” mentre il sito è online.');
      I18n.text(this.downloadButton, ready ? 'Controlla aggiornamenti' : 'Scarica tutto');
      this.downloadButton.disabled = false;
    } catch (error) {
      I18n.text(this.status, error.message);
      this.downloadButton.disabled = !window.isSecureContext || !('serviceWorker' in navigator);
    }
  },

  async download() {
    if (this.downloading || this.isAppleBrowser()) return;
    this.downloading = true;
    this.downloadButton.disabled = true;
    this.closeButton.disabled = true;
    this.progress.hidden = false;
    this.progress.value = 0;
    I18n.text(this.status, 'Scarico il gioco. Lascia aperta questa finestra…');
    // La richiesta avviene durante un gesto dell'utente; il browser può concedere dati persistenti.
    const persistence = navigator.storage?.persist?.().catch(() => false);
    try {
      await this.request('DOWNLOAD', ({ done, total }) => {
        this.progress.max = total;
        this.progress.value = done;
        I18n.text(this.status, `Scarico il gioco: ${done} / ${total} file. Resta online fino alla conferma.`);
      });
      if (!await this.check()) throw new Error('La verifica dei file non è riuscita. Resta online e riprova.');
      I18n.text(this.status, 'Pronto per giocare offline! Ora puoi chiudere il gioco e riaprirlo dall’icona anche senza Internet. Provalo in modalità aereo prima che il sito venga disattivato.');
      I18n.text(this.downloadButton, 'Controlla aggiornamenti');
    } catch (error) {
      I18n.text(this.status, `Download non completato. ${error.message} ${this.ready ? 'La copia già scaricata resta disponibile.' : 'Puoi riprovare senza perdere i salvataggi.'}`);
    } finally {
      // Non aspettiamo una decisione sullo spazio per confermare i file già verificati.
      void persistence;
      this.downloading = false;
      this.downloadButton.disabled = false;
      this.closeButton.disabled = false;
    }
  },
};
