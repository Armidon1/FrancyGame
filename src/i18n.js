// Italiano predefinito, inglese scelto dall'utente. I testi sorgente restano italiani:
// chiavi, salvataggi, animazioni e decisioni di gioco non dipendono dalla lingua.
const I18n = {
  lang: 'it',
  revision: 0,
  listeners: new Set(),
  dom: [],
  domText: new Map(),
  patterns: [],

  init() {
    try { if (localStorage.getItem('picci_language') === 'en') this.lang = 'en'; } catch (_) { /* memoria non disponibile */ }
    for (const [source, translation] of I18N_EN) {
      if (!source.includes('{')) continue;
      const names = [];
      const escaped = source.replace(/[.*+?^$()|[\]\\]/g, '\\$&');
      const expression = escaped.replace(/\{(\w+)\}/g, (_, name) => {
        names.push(name);
        if (['hp', 'max', 'count', 'n', 'turns', 'damage', 'attack', 'defence', 'percent', 'done', 'total'].includes(name)) return '([0-9.,]+)';
        if (name === 'fighter') return '(Francesca|Simone)';
        return '(.+?)';
      });
      this.patterns.push({ source, translation, names, regex: new RegExp('^' + expression + '$', 's') });
    }
    // Le frasi più specifiche precedono i modelli brevi e generici.
    this.patterns.sort((a, b) => b.source.replace(/\{\w+\}/g, '').length - a.source.replace(/\{\w+\}/g, '').length);
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.nodeValue.trim() && !['SCRIPT', 'STYLE'].includes(node.parentElement?.tagName)) {
        this.dom.push({ node, source: node.nodeValue });
      }
    }
    for (const node of document.querySelectorAll('[aria-label]')) {
      this.dom.push({ node, attribute: 'aria-label', source: node.getAttribute('aria-label') });
    }
    this.refreshDOM();
  },

  t(value, language = this.lang, depth = 0) {
    const text = String(value ?? '');
    if (language !== 'en' || !text || depth > 5) return text;
    if (I18N_EN.has(text)) return I18N_EN.get(text);
    const trimmed = text.trim();
    if (trimmed !== text && trimmed) {
      return text.slice(0, text.indexOf(trimmed)) + this.t(trimmed, language, depth + 1) + text.slice(text.indexOf(trimmed) + trimmed.length);
    }
    for (const pattern of this.patterns) {
      const match = pattern.regex.exec(text);
      if (!match) continue;
      const values = Object.fromEntries(pattern.names.map((name, i) => [name, this.t(match[i + 1], language, depth + 1)]));
      return pattern.translation.replace(/\{(\w+)\}/g, (_, name) => values[name]);
    }
    // Descrizioni composte e righe degli stati alterati mantengono le loro interruzioni.
    if (text.includes('\n')) return text.split('\n').map(line => this.t(line, language, depth + 1)).join('\n');
    const sentences = text.replace(/([.!?])\s+(?=[A-ZÀ-Ý])/g, '$1\u0000').split('\u0000');
    if (sentences.length > 1) return sentences.map(sentence => this.t(sentence, language, depth + 1)).join(' ');
    if (text.includes('  ')) return text.split('  ').map(part => this.t(part, language, depth + 1)).join('  ');
    if (/^[👣\uE000]/u.test(text)) return text.replace(/\.(?=\d{3}(?:\D|$))/g, ',');
    return text;
  },

  set(language) {
    if (!['it', 'en'].includes(language) || language === this.lang) return;
    this.lang = language;
    this.revision++;
    try { localStorage.setItem('picci_language', language); } catch (_) { /* scelta valida nella sessione */ }
    this.refreshDOM();
    for (const listener of [...this.listeners]) listener();
  },

  refreshDOM() {
    document.documentElement.lang = this.lang;
    for (const { node, attribute, source } of this.dom) {
      if (attribute) node.setAttribute(attribute, this.t(source));
      else node.nodeValue = this.t(source);
    }
    for (const [node, source] of this.domText) node.textContent = this.t(source);
  },

  text(node, source) {
    this.domText.set(node, source);
    node.textContent = this.t(source);
  },

  bind(object, redraw) {
    this.listeners.add(redraw);
    object.once('destroy', () => this.listeners.delete(redraw));
    return () => this.listeners.delete(redraw);
  },
};

I18n.init();
