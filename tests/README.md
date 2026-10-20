# Verifiche delle battaglie al Gianicolo

## Prova manuale

1. Dalla radice avvia python3 -m http.server 8000 e apri http://localhost:8000/?level=1.
2. Avvicinati a un personaggio, guardalo e premi A: scegli Parla, Sfida! oppure Annulla.
3. In battaglia usa direzioni e A da tastiera; da telefono tocca una mossa e poi Conferma. Il menu nasconde temporaneamente la croce HTML per non coprire le mosse. Durante i dialoghi i controlli tornano disponibili.
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

Test logica, sintassi e browser desktop/mobile simulato superati senza errori JavaScript. Nessuna prova su telefono fisico. Non è stata riprovata l'intera conclusione ninja né gli altri livelli.

Durante i test gli asset locali assets/francesca_sheet.png e assets/preview.png risultavano modificati rispetto a HEAD e non riconosciuti come PNG. Il primo provocava un errore di animazione durante il cammino. Sono stati lasciati intatti: il test browser è passato con TEST_USE_COMMITTED_SPRITE=1. Prima di una prova normale o di una pubblicazione, correggere o ripristinare consapevolmente gli asset; lo sprite sostitutivo del test non ripara il gioco su disco. Nessun commit, push o deploy eseguito.
