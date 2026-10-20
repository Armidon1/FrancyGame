// Salvataggio del livello raggiunto (localStorage può non esserci: sempre in try/catch).

const Save = {
  key: 'picci_save_v1',

  load() {
    try { return JSON.parse(localStorage.getItem(this.key)) || {}; } catch (_) { return {}; }
  },

  store(data) {
    try { localStorage.setItem(this.key, JSON.stringify(data)); } catch (_) { /* pazienza */ }
  },

  level() {
    return this.load().level || null;
  },

  setLevel(sceneKey) {
    const d = this.load();
    d.level = sceneKey;
    this.store(d);
  },

  clear() {
    try { localStorage.removeItem(this.key); } catch (_) { /* ok */ }
  },
};
