import { S3Client, ListObjectsV2Command, ListObjectsV2CommandOutput } from "@aws-sdk/client-s3";
import * as fs from "fs/promises";
import * as path from "path";
import { getPlaiceholder } from "plaiceholder";

// Utilizziamo un'interfaccia per definire la struttura che si aspetta la nostra applicazione Next.js in `src/app/portfolio/page.tsx`
interface ImageDetail {
  url: string;
  blurDataURL: string;
}

interface ImageUrlsData {
  [folderKey: string]: ImageDetail[];
}

const BUCKET_NAME = "giorgio-paoloni-gallery-storage";
// URL base del tuo bucket S3 per generare i link pubblici delle immagini
const S3_BASE_URL = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'eu-north-1'}.amazonaws.com`;

// Inizializza il client AWS S3.
// Le credenziali devono essere presenti nelle variabili d'ambiente (es. in Vercel o localmente in .env.local)
const client = new S3Client({
  region: process.env.AWS_REGION || "eu-north-1", // Imposta la regione di default a eu-north-1 come richiesto
  credentials: {
    // Usiamo fallback temporanei per poter passare la build su Vercel se le chiavi mancano (es. durante i test locali senza .env)
    // Ovviamente in produzione queste chiavi DOVRANNO essere impostate!
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "MOCK_ACCESS_KEY",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "MOCK_SECRET_KEY",
  },
});

/**
 * Funzione di utilità per scaricare un'immagine da un URL come Buffer.
 * Serve a 'plaiceholder' per generare il base64 sfocato.
 */
async function fetchImageBuffer(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Impossibile scaricare l'immagine da ${url}: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Funzione principale che viene eseguita prima della build di Next.js.
 * Si connette a S3, scarica la lista delle cartelle "Portfolio/*" e genera i placeholder.
 */
async function fetchImageUrlsAndGeneratePlaceholders(): Promise<void> {
  console.log("Inizio il processo di recupero immagini da S3 e generazione dei placeholder...");

  // Se non abbiamo le chiavi AWS vere, creiamo un file JSON finto per non rompere la build
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
     console.warn("⚠️ ATTENZIONE: Variabili AWS mancanti. Generazione di un file image_urls.json di mock...");
     const mockData: ImageUrlsData = {
       "Portfolio/MockFolder": [
         {
           url: "https://via.placeholder.com/800x600.png?text=Mock+Image",
           blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
         }
       ]
     };
     const outputDir = path.join(process.cwd(), "src", "data");
     const outputPath = path.join(outputDir, "image_urls.json");
     await fs.mkdir(outputDir, { recursive: true });
     await fs.writeFile(outputPath, JSON.stringify(mockData, null, 2), 'utf-8');
     console.log(`✅ Successo! Dati MOCK salvati in: ${outputPath}`);
     return;
  }

  const portfolioPrefix = "Portfolio/";
  const finalData: ImageUrlsData = {};
  const folders: string[] = [];

  // 1. Ottieni la lista delle cartelle (sottocartelle di "Portfolio/")
  const listFoldersParams = {
    Bucket: BUCKET_NAME,
    Prefix: portfolioPrefix,
    Delimiter: "/", // Questo parametro fa in modo che S3 raggruppi gli oggetti in "cartelle" (CommonPrefixes)
  };

  try {
    let isTruncated = true;
    let continuationToken: string | undefined;

    // Ciclo while per gestire la paginazione di AWS S3 (se ci sono tante cartelle)
    while (isTruncated) {
      const command = new ListObjectsV2Command({
        ...listFoldersParams,
        ContinuationToken: continuationToken,
      });
      const response: ListObjectsV2CommandOutput = await client.send(command);

      // Aggiungi i nomi delle cartelle all'array `folders`
      if (response.CommonPrefixes) {
        response.CommonPrefixes.forEach((commonPrefix: any) => {
          if (commonPrefix.Prefix && commonPrefix.Prefix !== portfolioPrefix) {
            // Rimuoviamo la barra finale (trailing slash) per avere un nome pulito, es: "Portfolio/Ritratti"
            const folderKey = commonPrefix.Prefix.replace(/\/$/, "");
            folders.push(folderKey);
          }
        });
      }
      isTruncated = response.IsTruncated || false;
      continuationToken = response.NextContinuationToken;
    }

    console.log(`Trovate ${folders.length} cartelle in S3.`);

    // 2. Per ogni cartella, ottieni la lista delle immagini e genera i blurDataURL
    for (const folderKey of folders) {
      console.log(`\nElaborazione della cartella: ${folderKey}...`);
      finalData[folderKey] = []; // Inizializza l'array vuoto per questa cartella

      const listImagesParams = {
        Bucket: BUCKET_NAME,
        Prefix: folderKey + "/", // Aggiungiamo la barra per cercare DENTRO la cartella
      };

      let isImagesTruncated = true;
      let imagesContinuationToken: string | undefined;
      const imageObjects: any[] = [];

      while (isImagesTruncated) {
         const imagesResponse: ListObjectsV2CommandOutput = await client.send(new ListObjectsV2Command({
           ...listImagesParams,
           ContinuationToken: imagesContinuationToken
         }));

         const newObjects = imagesResponse.Contents?.filter((content: any) => content.Key && content.Size !== 0) || [];
         imageObjects.push(...newObjects);

         isImagesTruncated = imagesResponse.IsTruncated || false;
         imagesContinuationToken = imagesResponse.NextContinuationToken;
      }

      console.log(`Trovate ${imageObjects.length} immagini in ${folderKey}. Generazione dei placeholder in corso...`);

      // 3. Elabora ogni immagine della cartella
      // Usiamo Promise.all per elaborare le immagini in parallelo e velocizzare la build!
      const imagePromises = imageObjects.map(async (imgObj: any) => {
        const imageUrl = `${S3_BASE_URL}/${imgObj.Key}`;
        try {
          // Scarichiamo temporaneamente l'immagine in RAM
          const imageBuffer = await fetchImageBuffer(imageUrl);

          // Generiamo il placeholder base64 ultra-leggero con plaiceholder
          const { base64 } = await getPlaiceholder(imageBuffer, { size: 10 }); // size 10 per renderlo molto leggero

          return {
            url: imageUrl,
            blurDataURL: base64
          };
        } catch (err) {
          console.error(`Errore nell'elaborazione dell'immagine ${imageUrl}:`, err);
          // Fallback: se la generazione del placeholder fallisce, salviamo almeno l'URL dell'immagine senza sfocatura
          return {
            url: imageUrl,
            blurDataURL: ""
          };
        }
      });

      // Aspetta che tutte le immagini della cartella corrente siano state elaborate
      const processedImages = await Promise.all(imagePromises);

      // Salva l'array di risultati nel nostro oggetto finale
      finalData[folderKey] = processedImages;
    }

    // 4. Salva il file JSON
    // Costruiamo il percorso sicuro usando `path.join` (compatibile con Windows e Mac/Linux)
    const outputDir = path.join(process.cwd(), "src", "data");
    const outputPath = path.join(outputDir, "image_urls.json");

    // Assicuriamoci che la cartella 'src/data' esista, altrimenti la creiamo
    await fs.mkdir(outputDir, { recursive: true });

    // Scriviamo il file su disco (convertendo l'oggetto JavaScript in una stringa JSON formattata con 2 spazi)
    await fs.writeFile(outputPath, JSON.stringify(finalData, null, 2), 'utf-8');

    console.log(`\n✅ Successo! Dati delle immagini e placeholder salvati in: ${outputPath}`);

  } catch (error) {
    console.error("❌ Si è verificato un errore fatale durante lo script:", error);
    process.exit(1); // Blocca la build se lo script fallisce! Next.js si accorgerà dell'errore.
  }
}

// Avviamo lo script
fetchImageUrlsAndGeneratePlaceholders();
