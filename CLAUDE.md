# Il gioco di Picci Picci — regalo di compleanno per Francesca

Videogioco browser in stile Pokémon (pixel art, visuale dall'alto), regalo di compleanno di Simone per la sua ragazza Francesca. Compleanno: **22 ottobre**. Il gioco deve essere pronto, testato e pubblicato entro la sera del 21. Simone ha un esame il 28: lavora in modo autonomo, chiedi solo quando serve davvero.

Lingua di tutti i testi del gioco: **italiano**. Tono: tenero, ironico, mai sdolcinato in modo forzato.

---

## Stack tecnico (decisioni già prese)

- **Phaser 4** caricato da CDN con un tag script, nessun bundler, nessun `npm install` obbligatorio:
  `https://cdnjs.cloudflare.com/ajax/libs/phaser/4.0.0/phaser.min.js`
  Prima di scrivere codice, leggi le skill ufficiali per agenti nella cartella `skills/` del repository `phaserjs/phaser` su GitHub (c'è anche quella di migrazione da v3). Se qualcosa di Phaser 4 dà problemi seri, ripiega su Phaser 3.90 e dillo.
- Struttura: `index.html` + `src/*.js` (una scena per file) + `assets/`.
- Configurazione: `pixelArt: true`, risoluzione interna 480×270, `Scale.FIT` + `CENTER_BOTH`, orizzontale.
- **Mobile prima di tutto**: Francesca giocherà dal telefono. Croce direzionale touch in basso a sinistra, tasto **A** (interagisci/avanti) in basso a destra, semitrasparenti. Da desktop: frecce/WASD + Spazio/Invio. Mostra un avviso "gira il telefono" in verticale.
- Mappe: matrici di tile scritte nel codice (niente Tiled). Tile 16×16.
- Grafica: tutta pixel art generata in codice (texture da array di pixel o Graphics → texture), con una palette coerente e calda. Niente asset esterni con licenze dubbie.
- Test locale: `python3 -m http.server 8000` dalla cartella del progetto.
- Pubblicazione: GitHub Pages (repo pubblico o privato con Pages), link da mandare a Francesca.
- Selettore livelli nascosto per i test (es. tenere premuto sul titolo 3 secondi, o `?level=2` nell'URL).

## Personaggi (già pronti)

In `assets/`:
- `francesca_sheet.png` — giocatrice
- `simone_sheet.png` — NPC (e compagno di viaggio a Londra)

Formato di entrambi: frame **16×22 px**, griglia 3 colonne × 4 righe (immagine 48×88).
- Righe: 0 = giù, 1 = sinistra, 2 = destra, 3 = su
- Colonne: 0 = fermo, 1 = passo A, 2 = passo B
- Animazione camminata: frame `[1, 0, 2, 0]` a ~8 fps. Da fermo: colonna 0.
- Scala: lascia i pixel nitidi, niente smoothing.

Tutti gli altri personaggi (pattinatori, Verdone sindaco, zii, passanti) vanno disegnati nello stesso stile 16×22 con la stessa palette di contorno scuro.

## Sistemi comuni

- **Dialoghi**: riquadro in basso stile Pokémon, testo che compare lettera per lettera, tasto A per accelerare/avanzare, nome di chi parla in alto a sinistra del riquadro.
- **Interazione**: quando Francesca è vicina a un NPC o oggetto e guarda verso di esso, appare un piccolo "!" sopra; A per interagire.
- **Transizioni tra livelli**: schermata "Livello completato!" con il messaggio del livello (vedi sotto), cuoricini che salgono, A per continuare.
- **Niente game over** in nessun livello: si riprova sempre, nessuna frustrazione.
- Salvataggio del livello raggiunto in `localStorage` (con try/catch), così se chiude la pagina riprende da lì.
- Musica opzionale: se c'è tempo, musichetta chiptune generata con Web Audio; altrimenti solo piccoli effetti sonori. Parte solo dopo il primo tocco.

---

## Schermata iniziale

Titolo: **"Il gioco di Picci Picci"**. Sottotitolo piccolo: "un'avventura in tre livelli". Sfondo con cielo al tramonto pixelato e cuoricini che fluttuano. "Tocca per iniziare".

Breve introduzione con Simone che parla:
> "Ciao Picci Picci! Oggi è il tuo compleanno… e visto che tu mi hai fatto delle slide, io non potevo essere da meno. Ti ho fatto un videogioco. Pronta?"

---

## Livello 1 — Il Gianicolo

**Il ricordo**: è il posto del primo bacio. Prima uscita a Trastevere, poi la salita al Gianicolo. In cima c'erano dei ragazzi che giocavano a "ninja"; Simone ha sfidato Francesca, il primo round l'ha vinto lei, il secondo lui… e poi si sono baciati. Il Gianicolo è anche il posto dove Simone l'ha raggiunta e consolata in un giorno difficile, ed è dove Simone ha festeggiato il suo compleanno.

**Ambientazione**: si parte in basso nei vicoli di Trastevere (sanpietrini, edere, lampioni), si sale lungo una strada a tornanti con alberi fino alla terrazza panoramica in alto, con la balaustra e Roma al tramonto sullo sfondo (cupole, tetti arancioni). Mappa verticale, telecamera che segue.

**Obiettivo**: raccogliere **5 cuoricini** sparsi lungo la salita. L'ultimo tratto verso la terrazza è bloccato (es. da un gruppetto di turisti o un cancelletto) finché non li ha tutti. Contatore cuori in alto.

**Tappe lungo la strada**:
1. **La panchina** (a metà salita, obbligatoria da attraversare). Interagendo:
   > "Questa panchina la conosciamo bene. Qui ci siamo abbracciati in un giorno difficile. Ricordati sempre che io ci sarò, in quelli belli e in quelli brutti."
   Nessun riferimento esplicito all'esame o alla bocciatura.
2. **Easter egg — il Sindaco** (opzionale, un po' nascosto): un omino con fascia tricolore da sindaco, stile caricatura generica (non un ritratto realistico di una persona reale). Interagendo recita il discorso "del fiume" che Simone ha fatto alla sua festa citando Verdone sindaco di Roma.
   Testo: `[SIMONE: scrivi qui la tua versione della citazione, come l'hai detta tu alla festa]`
   Poi una riga: "…Simone l'ha detto davvero, al suo compleanno. Proprio qui."
3. **I ragazzi che giocano a ninja**: un gruppetto di 3-4 NPC in cerchio vicino alla terrazza, che si muovono a scatti. Se ci parla: "Stiamo giocando a ninja! Ma c'è qualcuno che ti aspetta laggiù…"

**In cima — la sfida ninja**: Simone è alla balaustra.
> Simone: "Ehi… ti va una sfida a ninja?"

Minigioco a tempismo: una barra orizzontale con un cursore che oscilla avanti e indietro e una zona verde al centro. Francesca deve premere A quando il cursore è nella zona verde per "colpire la mano" di Simone. Animazione dei due personaggi uno di fronte all'altra.
- **Round 1**: vince Francesca (come nella realtà). Se manca la zona, il cursore rallenta e riprova, finché non vince.
  > Simone: "Ok ok, hai vinto tu. Ma esigo la rivincita!"
- **Round 2**: comunque vada, vince Simone (scriptato con ironia: se lei colpisce, Simone "schiva" all'ultimo).
  > Simone: "Pareggio! E adesso…"
- **Finale**: musica che si ferma, schermo che sfuma sul tramonto su Roma, i due personaggi si avvicinano, appare un cuore grande tra di loro. Scritta: **"Qui è iniziato tutto."**

**Messaggio di fine livello**: "Livello completato! Qui hai trovato Roma ai tuoi piedi… e un orsacchiotto al tuo fianco."

---

## Livello 2 — La pista di pattinaggio

**Il ricordo**: la pista di pattinaggio al ghiaccio al chiuso è uno dei loro posti speciali.

**Ambientazione**: pista vista dall'alto, ghiaccio azzurrino con riflessi, bordi in legno/plastica, luci e festoni, gente sugli spalti ai lati.

**Inizio**: Francesca è al bordo in basso. Scritta a schermo:
> "Oh no! Simone è cascato dall'altra parte della pista! Vallo a recuperare!"
Simone è seduto sul ghiaccio in alto, con un fumetto "aiuto…" o "tutto ok, tutto ok!".

**Meccanica**: sul ghiaccio Francesca **scivola** (accelerazione dolce, attrito basso, non si ferma subito). Pattinatori NPC si muovono con schemi semplici (avanti e indietro in orizzontale, in cerchio, uno veloce, uno lento). Difficoltà crescente verso Simone ma mai frustrante.
- Se tocca un pattinatore: piccola animazione di caduta con stelline, ritorno all'ultimo checkpoint (metà pista) o all'inizio. Niente game over.
- Facoltativo: qualche cuoricino sul ghiaccio da raccogliere per bonus, non obbligatorio.

**Arrivo da Simone**:
> Simone: "Piccina! Sapevo che saresti venuta a prendermi."
> Francesca (testo narrato): "Il tuo orsacchiotto è salvo."

**Messaggio di fine livello**: "Anche quando scivoliamo, ci teniamo per mano. Livello superato, piccina!"

---

## Livello 3 — Londra, 40.000 passi

**Il ricordo**: nel primo anno di relazione sono stati a Londra, ospiti degli zii di Francesca. Un giorno hanno fatto circa **40.000 passi**, attraversando a piedi quasi tutta Londra centrale da una parte all'altra. Gli zii li hanno presi in giro: "Ma lo sapete che a Londra i mezzi funzionano molto bene?"

**Deve trasmettere l'idea di un viaggio lunghissimo a piedi**, non di un quartierino.

**Ambientazione**: mappa lunga a scorrimento (orizzontale, o a S) che attraversa più zone di Londra: case vittoriane, cabine telefoniche rosse, bus rossi a due piani che passano, taxi neri, il Tamigi con un ponte, il Big Ben, Buckingham Palace con le guardie, parchi verdi, pioggerella leggera ogni tanto. Simone cammina dietro Francesca come compagno (segue i suoi passi, stile Pokémon follower).

**HUD**: contapassi in alto ("👣 12.480 / 40.000"), che sale a ogni passo con un moltiplicatore generoso; inventario con 3 slot vuoti; freccia sul bordo dello schermo che indica la prossima meta.

**Tappe** (in ordine):
1. **Harrods**: un grande edificio con l'insegna. Entrando (porta interagibile) c'è un piccolo interno con scaffali di orsetti. Commessa NPC:
   > "Benvenuta da Harrods! Questo orsetto ti stava aspettando."
   Popup: **"Oggetto sbloccato: l'orsetto di Londra 🧸"**
2. **Il bar**: un piccolo caffè con tavolini fuori. Barista NPC.
   `[SIMONE: nome del bar, se te lo ricordi; altrimenti "un bar a caso"]`
   > Barista: "Two coffees, that's six pounds, please!"
   > Simone: "SEI STERLINE?!"
   Popup: **"Oggetto sbloccato: il caffè da 6 sterline ☕ (un botto)"**
3. **Casa degli zii**: la porta è chiusa finché non ha i primi due oggetti. Dentro, gli zii.
   `[SIMONE: nomi degli zii]`
   Il contapassi arriva a **40.000** con un effetto speciale.
   > Zio: "Ma voi due da dove arrivate a piedi?"
   > Zia: "Ma lo sapete che a Londra i mezzi funzionano molto bene?"
   Popup: **"Oggetto sbloccato: la tazza di tè degli zii 🫖"**

**Tra una tappa e l'altra — la mappa**: dopo ogni oggetto parte una breve scena con la mappa di Londra vista dall'altissimo (stilizzata, con il Tamigi che la attraversa), una linea tratteggiata che si allunga dal punto precedente a quello nuovo, alla Indiana Jones, e il contapassi che sale velocissimo. Poi si torna a camminare.

**Stanchezza**: nell'ultimo tratto prima degli zii, Francesca cammina un po' più lenta e compare un fumetto "i miei piedi…", Simone risponde "manca poco… credo". Così la battuta degli zii fa ancora più ridere.

**Messaggio di fine livello**: "Ci siamo già stati, ma la prossima volta sarà ancora più bella."

---

## Finale

Schermata con i due personaggi davanti al Big Ben di notte, fuochi d'artificio/coriandoli pixelati, i tre oggetti dell'inventario esposti.

> **"Buon compleanno, Picci Picci."**
> "Premio sbloccato: un viaggio a Londra con me, a novembre… e un tè caldo che ti aspetta adesso."
> "— il tuo orsacchiotto"

A questo punto Simone le consegna davvero il set di tè e le rose. Un tasto discreto "Gioca di nuovo".

---

## Ordine di lavoro (tempo limitato)

1. Base: `index.html`, config Phaser, caricamento sprite, movimento a 4 direzioni con animazioni, controlli touch, sistema dialoghi, transizioni. Verifica subito che funzioni da telefono.
2. **Livello 2** (il più semplice): fallo completo e rifinito.
3. **Livello 1**.
4. **Livello 3**.
5. Schermata iniziale e finale.
6. Pubblicazione su GitHub Pages e test da telefono vero.

Se il tempo stringe, meglio tre livelli semplici ma rifiniti e senza bug che uno spettacolare e due rotti. Dopo ogni livello: fermati, fai provare a Simone, poi prosegui.

## Cose da chiedere a Simone (segnaposto nel testo)

- La sua versione della citazione di Verdone (livello 1)
- Il nome del bar a Londra (livello 3), se lo ricorda
- I nomi degli zii (livello 3)
