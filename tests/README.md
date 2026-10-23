# Verifiche delle battaglie al Gianicolo

## Italiano e inglese

`node tests/i18n.test.cjs` verifica il catalogo, i segnaposto dei testi dinamici, l'italiano predefinito, il salvataggio della preferenza e l'assenza di modifiche ai progressi. Non richiede dipendenze.

`node tests/i18n.browser.cjs` richiede Chromium e `playwright-core` già disponibile (`PLAYWRIGHT_PATH` e `CHROME_PATH` facoltativi). Avvia un server temporaneo solo su localhost e prova i menu con tocchi reali simulati: lingua dal titolo, preferenza dopo il riavvio, cambio durante un dialogo senza perdere posizione e progressi, battaglie e scene in inglese, mappa e contapassi. Salva anteprime in `/tmp/francygame-english-settings.png` e `/tmp/francygame-english-battle.png`. La verifica offline comprende anche la preferenza inglese e la finestra di download senza rete.

## Prova manuale

1. Dalla radice avvia python3 -m http.server 8000 e apri http://localhost:8000/?level=1.
2. Avvicinati a un personaggio, guardalo e premi A: scegli Parla, Sfida! oppure Annulla.
3. In battaglia usa direzioni e A da tastiera; da telefono tocca una mossa e poi Conferma oppure il pulsante A. Durante lotte e dialoghi la croce è nascosta e A resta visibile, sopra il pannello delle mosse. Nei menu con risposte la croce torna disponibile.
4. Verifica Spara Pipas (2–5 colpi), Campari Sprits (più attacco e vulnerabilità, massimo due usi efficaci), Pretty Priviledge (-65% attacco nemico, non cumulativo), Fuggi (sempre riuscita senza contrattacco).
5. Sfida Simone: Bestemmia Lampo (attacco di Francesca -65% e difesa di Simone su per 2 turni), Abbraccione MAX (16 danni), Scorreggia (veleno: -5 PS a ogni round). Simone non ripete un effetto ancora attivo.
6. Riprova una sfida: PS e modificatori devono ripartire da zero. Nessun esito modifica cuori, posizione o storia. Parlando con Simone rimane la sfida ninja originale.

## Test logica senza dipendenze

Comando: node tests/gianicoloBattle.test.cjs

Copre tutti i 10 avversari, danni e numero colpi agli estremi RNG, turni, buff/debuff e relativi limiti, fuga senza contrattacco, vittoria, sconfitta e reset.

## Test browser opzionale

Il gioco non richiede npm. Il test browser richiede invece un ambiente che abbia già puppeteer-core e Chromium; non sono aggiunti alle dipendenze del progetto.

Con il server locale attivo, eseguire node tests/gianicoloBattle.browser.cjs. Variabili facoltative:

- PUPPETEER_PATH: percorso della libreria puppeteer-core (altrimenti risoluzione Node normale).
- CHROME_PATH: eseguibile Chromium (default /usr/bin/chromium-browser).
- GAME_URL: URL base del server (default http://localhost:8000/).
- TEST_USE_COMMITTED_SPRITE=1: intercetta esclusivamente la risposta browser per francesca_sheet.png usando git show HEAD:assets/francesca_sheet.png. NON modifica gli asset su disco. Usare solo per isolare un problema locale e non confondere il risultato con un test degli asset effettivi.

Il test cammina dal punto iniziale al cameriere, verifica la separazione selezione/conferma, le quattro mosse, tutti gli avversari, vittoria/sconfitta naturali, PS ripristinati, invariabilità dei cuori, panchina, turisti spostati, avvio ninja, riavvio, input touch simulato e cleanup al cambio scena. Gli altri NPC sono invocati direttamente per controllare ogni profilo; non è una partita integrale del livello. Salva screenshot in /tmp/gianicolo-menu.png, /tmp/gianicolo-battle.png e /tmp/gianicolo-mobile.png.

## Esito di questa implementazione

Per verificare i comandi touch aggiornati: `node tests/mobile-controls.browser.cjs`, con il server locale attivo e `playwright-core` già disponibile. `PLAYWRIGHT_PATH` permette di indicare il percorso della libreria; `CHROME_PATH` e `GAME_URL` funzionano come nel test precedente. Non serve installare dipendenze per giocare.

Questo test verifica un dialogo avanzato con A, una risposta scelta con croce e A, una mossa selezionata con tap e confermata con A, l'assenza di sovrapposizioni tra A e il pannello delle mosse a 844×390, 667×375 e 568×320, la pausa sopra un dialogo e il ripristino dei comandi al riavvio. Screenshot della lotta mobile: `/tmp/francygame-mobile-controls.png`. Si tratta di Chromium con touch simulato, non di Safari su telefono fisico.

Test logica, sintassi e browser desktop/mobile simulato superati senza errori JavaScript. Nessuna prova su telefono fisico. Non è stata riprovata l'intera conclusione ninja né gli altri livelli.

Durante i test gli asset locali assets/francesca_sheet.png e assets/preview.png risultavano modificati rispetto a HEAD e non riconosciuti come PNG. Il primo provocava un errore di animazione durante il cammino. Sono stati lasciati intatti: il test browser è passato con TEST_USE_COMMITTED_SPRITE=1. Prima di una prova normale o di una pubblicazione, correggere o ripristinare consapevolmente gli asset; lo sprite sostitutivo del test non ripara il gioco su disco. Nessun commit, push o deploy eseguito.
