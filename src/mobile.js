// Su iOS le barre del browser si eliminano avviando il gioco dalla Home.
// Non occorre un service worker: il gioco continua a caricarsi dalla rete.
(() => {
  const standalone = window.matchMedia('(display-mode: standalone)');
  const fullscreen = window.matchMedia('(display-mode: fullscreen)');
  const isAppleMobile = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const hint = document.getElementById('ios-install');
  let dismissed = false;
  const update = () => {
    const hide = !isAppleMobile || dismissed || navigator.standalone === true ||
      standalone.matches || fullscreen.matches;
    document.documentElement.classList.toggle('ios-install-open', !hide);
    if (!hide && !hint.open) hint.showModal();
    else if (hide && hint.open) hint.close();
  };
  hint.querySelector('button').addEventListener('click', () => hint.close());
  hint.addEventListener('close', () => {
    dismissed = true;
    document.documentElement.classList.remove('ios-install-open');
  });
  // Il dialog rende inerte il gioco; blocchiamo anche i suoi listener su window.
  for (const event of ['pointerdown', 'pointerup', 'click', 'keydown', 'keyup']) {
    hint.addEventListener(event, e => e.stopPropagation());
  }
  standalone.addEventListener('change', update);
  fullscreen.addEventListener('change', update);
  window.addEventListener('pageshow', update);
  update();
})();
