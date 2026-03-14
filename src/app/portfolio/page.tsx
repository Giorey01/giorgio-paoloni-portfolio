// Importazioni necessarie per mostrare i componenti visivi e leggere i file
import PortfolioCard from "@/components/portfoliocard";
import fs from 'fs/promises'; // Modulo di Node.js per interagire col file system del server (lettura/scrittura asincrona)
import path from 'path';      // Modulo per gestire in modo corretto i percorsi ai file, su Windows, Mac o Linux.
import MasonryWrapper from '@/components/MasonryWrapper';

// Definisce che tipo di dati ha l'immagine (in TypeScript si usa 'interface')
interface ImageDetail {
  url: string;            // Il vero URL web dell'immagine
  blurDataURL: string;    // L'URL dell'immagine sfocata a bassa risoluzione
}

// Definisce l'oggetto totale che leggiamo dal JSON, che contiene diverse cartelle
interface ImageUrlsData {
  [folderKey: string]: ImageDetail[]; // Un dizionario chiave-valore (nome cartella -> array di immagini)
}

// Questo è un "Server Component". Viene eseguito solo sul server prima di arrivare al browser.
// Il vantaggio è che può eseguire codice backend (come accedere ai file fisici) e restituire HTML leggero al client.
// Definiamo questa funzione `async` perché dovrà attendere la lettura del file (che è un'operazione asincrona).
const PortfolioPage = async () => {
  // Prepariamo una variabile vuota dove salveremo i dati
  let imageData: ImageUrlsData = {};

  // Otteniamo la "strada" (path) corretta del file "image_urls.json".
  // 'process.cwd()' restituisce la cartella principale (root) da cui viene avviato il server Node.js.
  const jsonFilePath = path.join(process.cwd(), 'src', 'data', 'image_urls.json');

  try {
    // Il server attende (await) che il file venga letto interamente
    const fileContent = await fs.readFile(jsonFilePath, 'utf-8');
    // Trasformiamo la stringa di testo letta in un oggetto JavaScript utilizzabile dal nostro codice (parsing).
    imageData = JSON.parse(fileContent) as ImageUrlsData;
  } catch (error) {
    // Se la lettura fallisce (es. il file non c'è), stampiamo un log per il programmatore (nel terminale del server)...
    console.error("Failed to read or parse image_urls.json:", error);
    // ... e restituiamo una pagina con un messaggio di errore chiaro per l'utente, interrompendo l'esecuzione qui.
    return (
      <div>
        <h1 className="text-3xl text-center font-bold p-10 lg:p-16">
          Dive into my world
        </h1>
        <p className="text-center text-red-500">Could not load portfolio items. Please try again later.</p>
      </div>
    );
  }

  // Processiamo l'oggetto `imageData` estratto in un singolo passaggio tramite reduce()
  const portfolioFolders = Object.entries(imageData).reduce((acc: { folderKey: string; coverImageUrl: string; blurDataURL: string }[], [folderKey, imageObjects]) => {
    if (folderKey.startsWith("Portfolio/") && imageObjects && imageObjects.length > 0 && imageObjects[0] && imageObjects[0].url) {
      acc.push({
        folderKey,
        coverImageUrl: imageObjects[0].url,
        blurDataURL: imageObjects[0].blurDataURL || "",
      });
    }
    return acc;
  }, []);

  // Determina in quante colonne suddividere la griglia Masonry a seconda della larghezza dello schermo (responsiveness)
  const breakpointColumnsObj = {
    default: 3, // Desktop: 3 colonne
    900: 2,     // Tablet o schermi più piccoli: 2 colonne
    750: 1      // Smartphone: 1 colonna (tutto impilato)
  };

  return (
    <div>
      <h1 className="text-3xl text-center font-bold p-6 md:p-10 lg:p-16">
        Dive into my world
      </h1>
      <div className="p-4 md:p-8 lg:p-14">
        {/* Il componente MasonryWrapper crea una visualizzazione sfalsata (tipo muri a mattoni). */}
        <MasonryWrapper
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto gap-4 md:gap-8"
          columnClassName="bg-clip-padding flex flex-col gap-4 md:gap-8"
        >
          {/* Scorriamo tutto il nostro array (portfolioFolders) e generiamo una componente 'PortfolioCard' per ogni elemento.
              .map(funzione) ci permette di restituire blocchi di HTML/Componenti in ciclo. */}
          {portfolioFolders.map(({ folderKey, coverImageUrl, blurDataURL }, index) => {
            // Un ultimo controllo di sicurezza nel caso, per qualche strano motivo, l'immagine non ci sia
            // (il commento in inglese fa notare che, grazie al filtro precedente, questo è tecnicamente ridondante, ma è una precauzione)
            if (!coverImageUrl) {
              console.warn(`Skipping folder ${folderKey} due to missing cover image URL.`);
              return null; // Ritorna null, che indica a React di "non stampare nulla" per questo elemento
            }
            return (
              // Ogni elemento in una lista React deve avere una 'key' unica in modo da renderizzare e aggiornare la UI in modo ottimizzato.
              <div key={folderKey || index}>
                <PortfolioCard
                  folderKey={folderKey}            // Parametro passato al componente (Prop)
                  coverImageUrl={coverImageUrl}    // Parametro passato al componente (Prop)
                  blurDataURL={blurDataURL || ""}  // Parametro passato al componente (Prop)
                />
              </div>
            );
          })}
        </MasonryWrapper>
      </div>
    </div>
  );
};

export default PortfolioPage;
