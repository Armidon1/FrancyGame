# Giocare dopo la disattivazione del sito

1. Simone pubblica temporaneamente il sito sul suo indirizzo HTTPS abituale.
2. Su iPhone: aprire in Safari, Condividi → Aggiungi alla schermata Home, lasciando attivo “Apri come app web” se presente.
3. Aprire **dall'icona sulla Home**, toccare **Scarica gioco offline** nel titolo (o nel menu di pausa), poi **Scarica tutto**.
4. Restare online con la finestra aperta fino alla scritta **Pronto per giocare offline!**. Il download comprende tutti i livelli, gli sprite, il motore Phaser e le tre musiche configurate.
5. Chiudere il gioco, attivare la modalità aereo e riaprirlo dall'icona. Verificare anche l'avvio di un livello.
6. Quando tutti hanno completato la prova, Simone può disattivare Pages e rendere privato il repository. Non serve distribuire ZIP o tenere un computer acceso.

La copia scaricata viene usata anche se il sito risponde 404. Non eliminare l'icona o i dati del sito. Cambiando telefono, cancellando i dati o se il sistema li elimina, occorre scaricare di nuovo il gioco: Simone dovrà ripubblicarlo temporaneamente **allo stesso indirizzo**. Il browser decide se concedere lo spazio persistente richiesto dal gioco; non è una garanzia di conservazione permanente. [Politica di archiviazione di WebKit](https://webkit.org/blog/14403/updates-to-storage-policy/).

## Prima di ogni pubblicazione

Dopo aver modificato codice, immagini, HTML o musiche:

```sh
node tools/build-offline.cjs
node tools/build-offline.cjs --check
```

Committare anche `offline-manifest.json`. L'elenco contiene gli script dell'HTML, gli sprite, le icone e gli MP3 configurati in `local/songs.js`. Le impronte verificano che ogni file locale sia completo e corrisponda alla versione pubblicata. Non richiede npm o un bundler.

Il download è esplicito: una registrazione del service worker da sola non equivale a una copia offline. Una copia incompleta non sostituisce quella già funzionante. Le copie scaricate non si aggiornano automaticamente: mentre il sito è online, aprire la finestra offline e toccare **Controlla aggiornamenti**, attendere la conferma e chiudere e riaprire il gioco. I progressi restano salvati. Conservare la stessa URL per le successive finestre di distribuzione.

Il download richiede HTTPS oppure `localhost`. L'indirizzo HTTP del computer sulla rete Wi-Fi resta valido per provare il gioco online, ma non per installare il service worker sul telefono.

## Verifica automatica

`node tests/offline.browser.cjs` usa un server temporaneo su localhost, con percorso `/FrancyGame/`, Chromium e una copia già disponibile di `playwright-core` (variabile `PLAYWRIGHT_PATH`). Verifica download fallito e riprovato, tutti i file inclusi gli MP3 e Phaser, sito disattivato con risposta 404, nuove aperture e avvio di ogni scena senza rete, decodifica delle musiche e conservazione dei progressi. Non sostituisce la prova su Safari/iPhone reale.
