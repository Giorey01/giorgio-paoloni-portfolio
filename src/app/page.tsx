// Importa il componente per mostrare la card di un progetto o album nel portfolio
import PortfolioCard from "@/components/portfoliocard";
// Importa il modulo del file system di Node.js (fs) nella sua versione a Promesse (asincrona)
// Questo ci permette di leggere i file fisici del server.
import fs from 'fs/promises';
// Importa il modulo path per gestire facilmente i percorsi dei file sul server
import path from 'path';
// Importa un componente wrapper (involucro) per creare l'effetto griglia "Masonry" (tipo Pinterest)
import MasonryWrapper from '@/components/MasonryWrapper';

// Definisce la struttura (tipo di dato) per un singolo dettaglio di un'immagine
interface ImageDetail {
  url: string;            // Il link all'immagine vera e propria
  blurDataURL: string;    // L'immagine sfocata a bassa risoluzione mostrata durante il caricamento
}

// Definisce un "dizionario" dove la chiave è il nome della cartella e il valore è la lista di immagini
interface ImageUrlsData {
  [folderKey: string]: ImageDetail[];
}

// Questa è una pagina definita come Server Component (è il comportamento predefinito in Next.js App Router).
// La funzione è 'async', il che significa che può "aspettare" il caricamento di dati prima di inviare il codice HTML al browser.
export default async function Home() {
  let imageData: ImageUrlsData = {};
  // Crea il percorso assoluto per il file json 'image_urls.json' unendo la directory corrente del processo e il percorso del file.
  const jsonFilePath = path.join(process.cwd(), 'src', 'data', 'image_urls.json');

  try {
    // Prova a leggere il contenuto del file JSON dal file system del server
    const fileContent = await fs.readFile(jsonFilePath, 'utf-8');
    // Converte il testo letto in un oggetto JavaScript utilizzabile
    imageData = JSON.parse(fileContent) as ImageUrlsData;
  } catch (error) {
    // Se qualcosa va storto (es. file non trovato), stampa l'errore nel terminale del server
    console.error("Failed to read or parse image_urls.json:", error);
  }

  // Prepara i dati del portfolio partendo dalle cartelle trovate nel JSON
  const portfolioFolders = Object.entries(imageData)
    // .filter: tieni solo le cartelle che iniziano con "Portfolio/"
    .filter(([folderKey]) => folderKey.startsWith("Portfolio/"))
    // .map: trasforma i dati in un formato più semplice e comodo per la pagina
    .map(([folderKey, imageObjects]) => {
      // Controlla che ci sia almeno un'immagine e che abbia un URL valido
      if (imageObjects && imageObjects.length > 0 && imageObjects[0] && imageObjects[0].url) {
        return {
          folderKey,
          coverImageUrl: imageObjects[0].url, // Usa la prima immagine come copertina (cover)
          blurDataURL: imageObjects[0].blurDataURL || "", // Fornisce un fallback per blurDataURL se mancante
        };
      }
      // Ritorna le proprietà undefined se non è stata trovata un'immagine valida come copertina
      return { folderKey, coverImageUrl: undefined, blurDataURL: undefined };
    })
    // .filter: infine rimuovi dall'array tutti quegli elementi senza immagine di copertina
    .filter(item => item.coverImageUrl !== undefined);

  // Configura quante colonne la griglia "Masonry" deve mostrare in base alla larghezza dello schermo
  const breakpointColumnsObj = {
    default: 3, // Per default 3 colonne (schermi grandi)
    900: 2,     // Sotto i 900px di larghezza, passa a 2 colonne
    750: 1      // Sotto i 750px di larghezza, passa a 1 colonna (es. smartphone)
  };

  return (
    <div>
      {/* Prima Sezione: Titolo e Descrizione di benvenuto */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif mb-6 md:mb-8 italic">Dive into my world</h2>
          <p className="text-gray-500 leading-relaxed font-light text-sm md:text-base">
            A curated selection of moments frozen in time, where the raw power of nature meets the delicate silence of the wilderness. From deep mossy forests to sun-drenched canyon rivers.
          </p>
        </div>
      </section>

      {/* Seconda Sezione: La griglia delle gallerie portfolio */}
      <section className="pb-16 md:pb-24 px-4 md:px-12 max-w-[1600px] mx-auto" id="portfolio">
        {portfolioFolders.length > 0 ? (
          /* Usa il wrapper Masonry per disporre gli elementi in modo irregolare ed estetico */
          <MasonryWrapper
            breakpointCols={breakpointColumnsObj}
            className="flex w-auto gap-4 md:gap-8"
            columnClassName="bg-clip-padding flex flex-col gap-4 md:gap-8"
          >
            {/* Scorre l'array di cartelle per creare una PortfolioCard per ciascuna.
                '.map' è come un ciclo 'for' di base che ritorna HTML (JSX) per ogni elemento. */}
            {portfolioFolders.map(({ folderKey, coverImageUrl, blurDataURL }, index) => {
              // Se manca l'url della copertina, ignora questo elemento e passa al successivo
              if (!coverImageUrl) return null;

              return (
                // 'key' è fondamentale in React quando si creano liste, aiuta React a riconoscere i singoli elementi
                <div key={folderKey || index}>
                  <PortfolioCard
                    folderKey={folderKey} // Passa il nome della cartella (es. "Portfolio/Giappone") come props
                    coverImageUrl={coverImageUrl} // Passa l'immagine di copertina come props
                    blurDataURL={blurDataURL || ""} // Passa i dati dell'immagine sfocata
                  />
                </div>
              );
            })}
          </MasonryWrapper>
        ) : (
          // Mostra un messaggio di errore all'utente se non sono state trovate cartelle/immagini
          <p className="text-center text-red-500">Could not load portfolio items. Please try again later.</p>
        )}
      </section>
    </div>
  );
}
