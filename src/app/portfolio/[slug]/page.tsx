import React from "react";
// Importazioni per leggere file dal server e gestire percorsi
import fs from 'fs/promises';
import path from 'path';
// Importa il componente Client per gestire la visualizzazione interattiva delle immagini
import ImageGallery from "@/components/ImageGallery";

// Definisce le Props per questa pagina.
// Dato che la cartella si chiama "[slug]", Next.js passerà dinamicamente un parametro "slug" alla pagina.
// Es. Se l'URL è /portfolio/giappone, lo slug sarà "giappone"
interface PortfolioPageProps {
  params: {
    slug: string; // 'slug' è il termine tecnico per l'ultima parte di un URL (es. il titolo di un articolo)
  };
}

// Definisce la struttura (tipo di dato) per un singolo dettaglio di un'immagine
interface ImageDetail {
  url: string;            // Link dell'immagine
  blurDataURL: string;    // Immagine sfocata di anteprima (base64)
}

// Dizionario che fa corrispondere i nomi delle cartelle agli array di immagini
interface ImageUrlsData {
  [folderKey: string]: ImageDetail[];
}

// Funzione "aiutante" (helper) per trasformare il nome originale della cartella in uno slug valido per l'URL.
// Es. "Portfolio/La Mia Vacanza/" diventa "la-mia-vacanza"
const getSlugFromFolderKey = (folderKey: string): string | null => {
  if (!folderKey.startsWith("Portfolio/")) return null;
  return folderKey
    .replace(/^Portfolio\//i, "") // Rimuove il prefisso "Portfolio/" ignorando maiuscole/minuscole
    .replace(/\/$/, "")           // Rimuove lo slash finale se c'è
    .toLowerCase();               // Trasforma tutto in lettere minuscole
};

// Funzione "aiutante" per fare il processo inverso: dato uno slug dall'URL, trova a quale cartella corrisponde
const findFolderKeyBySlug = (imageData: ImageUrlsData, slug: string): string | undefined => {
  const normalizedSlug = slug.toLowerCase();
  // 'Object.keys' ottiene un array di tutte le chiavi (nomi delle cartelle). 'find' cerca la prima che corrisponde.
  return Object.keys(imageData).find(key => {
    if (!key.startsWith("Portfolio/")) return false;
    const keySlug = key.replace(/^Portfolio\//i, "").replace(/\/$/, "").toLowerCase();
    return keySlug === normalizedSlug;
  });
};

// generateStaticParams è una funzione SPECIALE di Next.js
// Dice a Next.js (durante il processo di build) quali pagine creare in anticipo basandosi sui dati.
// In questo modo, se hai 5 album, Next.js creerà e salverà le 5 pagine in modo che si carichino istantaneamente,
// invece di calcolarle ogni volta che un utente visita l'URL (Statical Site Generation).
export const generateStaticParams = async () => {
  const jsonFilePath = path.join(process.cwd(), 'src', 'data', 'image_urls.json');
  let imageData: ImageUrlsData = {};

  try {
    const fileContent = await fs.readFile(jsonFilePath, 'utf-8');
    imageData = JSON.parse(fileContent) as ImageUrlsData;
  } catch (error) {
    console.warn("Failed to read image_urls.json for generateStaticParams:", error);
    return []; // Ritorna un array vuoto se non ci sono dati, così non blocca il server
  }

  // Prende tutti i nomi delle cartelle e li trasforma in un array di oggetti { slug: 'nome-album' }
  // reduce() elabora l'array di chiavi in un unico passaggio, filtrando le cartelle di "Portfolio/" e generando lo slug in modo ottimizzato.
  const slugs = Object.keys(imageData).reduce((acc: { slug: string }[], folderKey) => {
    const slug = getSlugFromFolderKey(folderKey);
    if (slug !== null) {
      acc.push({ slug });
    }
    return acc;
  }, []);

  // Ritorna l'elenco degli url da pre-generare (es. [{slug: 'giappone'}, {slug: 'islanda'}])
  return slugs;
};

// Componente Pagina per il singolo Album del Portfolio
const PortfolioPage = async ({ params }: PortfolioPageProps) => {
  const { slug } = params; // Estrae lo slug dall'URL (es: "giappone")

  // Decodifica eventuali caratteri speciali (es. spazi codificati come %20 in URL)
  // SECURITY: Wrap decodeURIComponent in try-catch to prevent unhandled URIError on malformed slugs
  let decodedSlug: string;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch (error) {
    console.error(`Invalid slug encoding detected: ${slug}`, error);
    return <div className="text-center text-red-500 p-10">Invalid URL parameters provided.</div>;
  }

  const jsonFilePath = path.join(process.cwd(), 'src', 'data', 'image_urls.json');
  let imageData: ImageUrlsData = {};
  let currentAlbumImages: ImageDetail[] = []; // Qui metteremo solo le immagini relative all'album richiesto

  try {
    const fileContent = await fs.readFile(jsonFilePath, 'utf-8');
    imageData = JSON.parse(fileContent) as ImageUrlsData;
  } catch (error) {
    console.error(`Failed to read or parse image_urls.json for slug ${decodedSlug}:`, error);
    return <div className="text-center text-red-500 p-10">Error loading album images. Data file may be missing.</div>;
  }
  
  // Cerchiamo la chiave della cartella originale che corrisponde al nostro URL
  const targetFolderKey = findFolderKeyBySlug(imageData, decodedSlug);

  // Se la troviamo e contiene effettivamente dati, assegniamo quelle immagini a `currentAlbumImages`
  if (targetFolderKey && imageData[targetFolderKey]) {
    currentAlbumImages = imageData[targetFolderKey];
  } else {
    // Altrimenti, la pagina cercata non esiste
    console.warn(`No images found for slug "${decodedSlug}". Looked for folder key matching the slug.`);
    return <div className="text-center text-red-500 p-10">Album not found or no images in this album.</div>;
  }

  // Se l'album esiste ma è vuoto
  if (currentAlbumImages.length === 0) {
    return <div className="text-center p-10">This album currently contains no images.</div>;
  }

  return (
    <div className="p-4 md:p-8 lg:p-14">
      {/* Titolo in alto: formatta lo slug sostituendo i trattini con gli spazi e mettendolo in maiuscoletto */}
      <h1 className="text-3xl md:text-4xl text-center font-bold p-6 md:p-10 capitalize">
        {decodedSlug.replace(/-/g, " ")}
      </h1>

      {/* Passiamo le immagini del server al Client Component ImageGallery
          che si occuperà di mostrare la griglia e il carosello interattivo. */}
      <ImageGallery images={currentAlbumImages} slug={slug} />
    </div>
  );
};

export default PortfolioPage;
