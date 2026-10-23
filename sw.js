// Le copie complete restano utilizzabili anche con il sito spento o una risposta 404.
// Nessun download automatico: si avvia soltanto con il pulsante nel gioco.
const PREFIX = 'picci-offline:' + self.registration.scope;
const META = PREFIX + 'meta';
const POINTER = new URL('__offline_active__', self.registration.scope).href;
const MARKER = new URL('__offline_ready__', self.registration.scope).href;
const PHASER = 'https://cdnjs.cloudflare.com/ajax/libs/phaser/4.0.0/phaser.min.js';
let installing = false;

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

async function activeCopy(verify = false) {
  const meta = await caches.open(META);
  const pointer = await meta.match(POINTER);
  if (!pointer) return null;
  const { name } = await pointer.json();
  if (!name.startsWith(PREFIX + 'copy-') || !await caches.has(name)) return null;
  const cache = await caches.open(name);
  const marker = await cache.match(MARKER);
  if (!marker) return null;
  const info = await marker.json();
  if (verify) {
    for (const url of info.files) if (!await cache.match(url)) return null;
  }
  return { cache, name, info };
}

async function fetchFile(url) {
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), 30000);
  try {
    const response = await fetch(url, { cache: 'no-store', mode: 'cors', signal: abort.signal });
    if (!response.ok || response.type === 'opaque') throw new Error('Un file del gioco non è disponibile.');
    // Legge anche il corpo entro il timeout (soprattutto per le musiche).
    const bytes = await response.arrayBuffer();
    return { bytes, response: new Response(bytes, { status: response.status, headers: response.headers }) };
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Non riesco a scaricare un file. Controlla la connessione e che il sito sia ancora online.');
  } finally { clearTimeout(timer); }
}

async function download(port) {
  if (installing) throw new Error('Un download è già in corso. Attendi e riapri questa finestra.');
  installing = true;
  let stageName;
  try {
    const manifestURL = new URL('offline-manifest.json', self.registration.scope).href;
    const { response } = await fetchFile(manifestURL);
    const manifest = await response.json();
    if (!/^[a-f0-9]{16}$/.test(manifest.version) || !Array.isArray(manifest.assets) ||
        !manifest.assets.some(a => a.url === 'index.html')) throw new Error('Elenco dei file non valido.');
    const assets = manifest.assets.map(asset => {
      const url = new URL(asset.url, self.registration.scope).href;
      if (!url.startsWith(self.registration.scope) && url !== PHASER) throw new Error('Indirizzo di un file non valido.');
      return { ...asset, url };
    });
    stageName = PREFIX + 'copy-' + manifest.version;
    const previous = await activeCopy(true);
    if (previous?.name === stageName) return;
    // Una copia parziale non diventa mai la copia attiva.
    await caches.delete(stageName);
    const cache = await caches.open(stageName);
    port.postMessage({ type: 'PROGRESS', done: 0, total: assets.length });
    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      const { bytes, response: file } = await fetchFile(asset.url);
      if (asset.sha256) {
        const digest = await crypto.subtle.digest('SHA-256', bytes);
        const hash = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
        if (hash !== asset.sha256) throw new Error('Il gioco è stato aggiornato durante il download. Riprova.');
      }
      await cache.put(asset.url, file);
      port.postMessage({ type: 'PROGRESS', done: i + 1, total: assets.length });
    }
    await cache.put(MARKER, Response.json({ files: assets.map(a => a.url), version: manifest.version }));
    const meta = await caches.open(META);
    await meta.put(POINTER, Response.json({ name: stageName }));
    // Elimina solo le vecchie copie di questo gioco, dopo aver attivato quella completa.
    for (const name of await caches.keys()) {
      if (name.startsWith(PREFIX + 'copy-') && name !== stageName) await caches.delete(name);
    }
  } catch (error) {
    if (stageName) {
      const current = await activeCopy();
      if (current?.name !== stageName) await caches.delete(stageName);
    }
    throw error;
  } finally { installing = false; }
}

self.addEventListener('message', event => {
  const port = event.ports[0];
  if (!port || !['STATUS', 'DOWNLOAD'].includes(event.data?.type)) return;
  event.waitUntil((async () => {
    try {
      if (event.data.type === 'DOWNLOAD') await download(port);
      const copy = await activeCopy(true);
      port.postMessage({ type: 'DONE', ready: !!copy });
    } catch (error) {
      port.postMessage({ type: 'DONE', error: error.name === 'QuotaExceededError'
        ? 'Non c’è abbastanza spazio sul dispositivo.'
        : error.name === 'AbortError' ? 'La connessione è troppo lenta. Riprova.' : error.message });
    }
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith((async () => {
    const copy = await activeCopy();
    if (copy) {
      const url = new URL(event.request.url);
      const home = new URL(self.registration.scope);
      const navigation = event.request.mode === 'navigate' && url.origin === home.origin &&
        (url.pathname === home.pathname || url.pathname === home.pathname + 'index.html');
      const key = navigation ? new URL('index.html', home).href : event.request;
      const cached = await copy.cache.match(key);
      if (cached) return cached;
    }
    return fetch(event.request);
  })());
});
