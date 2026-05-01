# Portfolio Fotografico Personale

Questo progetto è il mio portfolio fotografico personale, un'applicazione web moderna e performante costruita con **Next.js 14**, **React 18** e **Tailwind CSS**. Il sito è progettato per offrire un'esperienza utente immersiva, con un'estetica minimalista ed editoriale che richiama la fotografia analogica e lo stile "scrapbook".

### Live Demo
[Visita il sito web qui](https://giorgio-paoloni-portfolio-git-main-giorey01s-projects.vercel.app/)

---

## Anteprime del Sito

### Versione Mobile
![Mobile Version](https://github.com/Giorey01/giorgio-paoloni-portfolio/assets/61801344/88f71b53-8f9d-4e2a-9e0b-20e92b29770b)

### Versione Tablet
![Tablet Version](https://github.com/Giorey01/giorgio-paoloni-portfolio/assets/61801344/7fb8a645-35f6-4925-b9d5-3b26de9c536b)

### Versione Desktop
![Desktop Version](https://github.com/Giorey01/giorgio-paoloni-portfolio/assets/61801344/28298b32-5e17-4bb8-97c0-ce0e7555d797)

---

## Architettura e Infrastruttura

Il sito non è solo un semplice frontend statico, ma un'applicazione full-stack ottimizzata che sfrutta diverse tecnologie cloud per garantire massima velocità e sicurezza. Ecco come funziona l'infrastruttura nel dettaglio.

### 1. Framework Frontend: Next.js 14 (App Router)
L'intera applicazione sfrutta l'architettura **App Router** di Next.js. Questo permette di separare nettamente i **Server Components** dai **Client Components**:
- **Server Components:** Vengono utilizzati per generare l'HTML lato server, riducendo il peso del JavaScript inviato al browser. Ad esempio, il layout della pagina, l'intestazione e il footer sono interamente pre-renderizzati lato server.
- **Client Components:** Vengono caricati dinamicamente (es. `ImageGallery` o le gallerie Masonry) per gestire interazioni complesse come le lightbox o i caroselli, assicurando un'interfaccia reattiva senza appesantire il caricamento iniziale.

Il design è gestito tramite **Tailwind CSS**, utilizzando variabili personalizzate nel file `tailwind.config.ts` per mantenere la palette di colori coerente (es. *gallery-white*, *gallery-gray*, *gallery-dark*) e implementando un tema "editorial scrapbook" con decorazioni in formato SVG.

### 2. Pipeline Immagini con AWS S3 e Plaiceholder
Il caricamento delle immagini è uno degli aspetti più complessi e ottimizzati di questo progetto. Tutte le fotografie sono ospitate su un bucket **Amazon S3** (`giorgio-paoloni-gallery-storage`).

Per evitare chiamate di rete lente durante il rendering e superare i limiti di esecuzione delle funzioni serverless su piattaforme come Vercel, è stato implementato uno script Node.js custom che viene eseguito **prima** della fase di build (`scripts/fetch-image-urls.ts`).
Ecco cosa fa lo script:
1. **Connessione a S3:** Utilizza `@aws-sdk/client-s3` per connettersi al bucket cloud.
2. **Paginazione e Scansione:** Naviga all'interno della cartella radice `Portfolio/` per estrarre l'elenco delle sottocartelle e le rispettive immagini, gestendo in modo robusto i token di paginazione forniti da AWS S3.
3. **Generazione dei Placeholder:** Lo script scarica temporaneamente in memoria RAM ciascuna immagine. Sfruttando la libreria **`plaiceholder`**, calcola e genera una stringa Base64 ultra-leggera che funge da anteprima sfocata (blur placeholder) da mostrare all'utente nei primi istanti di caricamento del sito.
4. **Salvataggio Dati:** I risultati finali, ossia gli URL pubblici delle immagini S3 e le stringhe Base64 dei relativi blur, vengono serializzati nel file statico locale `src/data/image_urls.json`.

Durante la navigazione dell'utente, i componenti Server di Next.js leggono questo file JSON precompilato, restituendo immediatamente le informazioni necessarie per renderizzare l'HTML con l'effetto sfocatura "blur" (fornito dal framework Next.js tramite l'attributo `blurDataURL`) in tempo zero, senza interrogare il bucket AWS o alcun database durante il Runtime della pagina.

### 3. API del Modulo di Contatto (Nodemailer)
La pagina "About" include un modulo di contatto form che comunica con un endpoint RESTful personalizzato in Next.js all'indirizzo `/api/contact/route.ts`.

Questo endpoint si occupa in autonomia di:
- **Validazione Server-side:** Controlla rigorosamente la lunghezza dei campi inseriti dall'utente (es. email max 254 caratteri, messaggio max 5000) e sanitizza l'input tramite escaping HTML per prevenire vulnerabilità di tipo XSS.
- **Invio Email in Produzione:** Utilizza **Nodemailer** per stabilire una connessione sicura con un server SMTP (configurato tramite variabili d'ambiente `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, ecc.) e recapitare le richieste di contatto al destinatario.
- **Ambiente di Sviluppo (Fallback):** Per facilitare lo sviluppo locale ed evitare errori (Status 500) qualora non fossero state configurate le variabili di sistema per il protocollo SMTP, l'API intercetta la condizione in cui viene processata localmente (`NODE_ENV === 'development'`) e autogenera un account fittizio tramite la piattaforma di test **Ethereal** (`nodemailer.createTestAccount()`). Questo account "mock" viene poi salvato in cache globale per l'intera durata del ciclo di sviluppo iterativo.

### 4. Sistema Blog
Oltre al portfolio, è stato implementato un sistema nativo per la gestione di articoli blog. I post vengono scritti direttamente in formato testuale **Markdown** e memorizzati all'interno della directory root `/posts`.
L'applicazione sfrutta il package `gray-matter` per leggere ed estrapolare i metadati in Frontmatter (titolo, data, URL dell'immagine di copertina, ecc.) e la libreria `markdown-to-jsx` per compilare in tempo reale il Markdown in nodi e componenti React navigabili. Lo slug dinamico delle pagine del blog (`src/app/blog/[slug]/page.tsx`) viene validato stringendo il parsing ad una specifica Regex alfanumerica, eliminando totalmente il rischio che venga perpetuato un attacco Path Traversal mediante l'URL.

---

## Guida per lo Sviluppo Locale (Getting Started)

Se desideri clonare ed eseguire il progetto localmente, ecco le istruzioni:

### 1. Installazione delle dipendenze
Assicurati di possedere un runtime Node.js recente installato, dopodiché lancia il comando per i pacchetti:
```bash
npm install
```
*(Nota: L'ambiente nativo del repository impiega `bun`, ma i normali comandi `npm` o `pnpm` sono nativamente pienamente supportati e interscambiabili)*

### 2. Configurazione Variabili d'Ambiente
Crea un file `.env.local` nella directory radice del progetto. Dovrai settare le seguenti chiavi (o lasciarle vuote per consentire il fallback fittizio in modalità locale):

**Credenziali AWS S3 (per estrarre le foto dal bucket):**
```env
AWS_ACCESS_KEY_ID=la_tua_access_key
AWS_SECRET_ACCESS_KEY=la_tua_secret_key
AWS_REGION=eu-north-1
```
*Attenzione: Se queste chiavi non vengono fornite, in locale lo script di build rileverà la mancanza e popolerà automaticamente le gallerie con immagini dummy generate tramite via.placeholder.com per sbloccare la costruzione dell'app.*

**Credenziali SMTP (per il backend del modulo di contatto):**
```env
EMAIL_HOST=smtp.tuoserver.com
EMAIL_PORT=587
EMAIL_USER=il_tuo_username
EMAIL_PASS=la_tua_password
EMAIL_FROM="Modulo Contatto <noreply@tuosito.com>"
EMAIL_TO=tua_email_personale@example.com
```

### 3. Comandi Principali per il Terminale

- **Avvio Server di Sviluppo Interattivo:**
  ```bash
  npm run dev
  ```
  Questo avvierà il processo Node che compilerà l'App Next.js sulla porta `http://localhost:3000`.

- **Compilazione per Ambiente di Produzione (Static Generation + Build):**
  ```bash
  npm run build
  ```
  **Attenzione:** Questo script è custom. Eseguirà esplicitamente in anticipo lo script Node (`ts-node --compiler-options "{\"module\":\"CommonJS\"}" ./scripts/fetch-image-urls.ts`) prima di attivare le build native del framework Next.js (`next build`). Tale ordine sequenziale risulta l'anello cardine dell'intera architettura per generare il database `.json` contenente le immagini di backup `blurDataURL` ed espanderle in tempo per le pagine server in produzione statiche.

- **Check della Qualità del Codice (Linting):**
  ```bash
  npm run lint
  ```

## Test Email Fallback in Local Development

If you'd like to use the Ethereal test email fallback locally without configuring full SMTP settings, set the `ENABLE_TEST_EMAIL` feature flag to `true` in your environment.

```
ENABLE_TEST_EMAIL=true
```
