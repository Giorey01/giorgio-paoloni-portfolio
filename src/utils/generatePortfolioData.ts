import { S3Client, ListObjectsV2Command, ListObjectsV2CommandOutput } from "@aws-sdk/client-s3";
import * as fs from "fs";
import * as path from "path";

// Definisci le interfacce per i dati del portfolio
interface PortfolioFolder {
  folderName: string;
  slug: string;
  thumbnailUrl: string | null;
  images: string[];
}

const BUCKET_NAME = "giorgio-paoloni-gallery-storage";
// Assicurati che questo sia il tuo dominio CloudFront, se lo stai usando, altrimenti il dominio S3 diretto.
const CLOUDFRONT_DOMAIN = "https://d321io5nxf2wuu.cloudfront.net"; 

// Inizializza il client S3 con le credenziali e la regione dalle variabili d'ambiente.
// Assicurati che process.env.AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY siano definiti
// ad esempio nel tuo file .env.local per lo sviluppo locale.
const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * Recupera tutte le cartelle e le loro immagini da un bucket S3.
 * Genera un file JSON con i metadati del portfolio.
 */
async function generatePortfolioData(): Promise<void> {
  console.log("Generazione dei dati del portfolio da S3...");
  const portfolioPrefix = "Portfolio/";
  const folders: { key: string; name: string; slug: string }[] = [];
  const portfolioData: PortfolioFolder[] = [];

  // 1. Ottieni tutte le cartelle (album) nel prefisso "Portfolio/"
  const listFoldersParams = {
    Bucket: BUCKET_NAME,
    Prefix: portfolioPrefix,
    Delimiter: "/", // Importante per listare le "sottocartelle"
  };

  try {
    let isTruncated = true;
    let continuationToken: string | undefined;

    while (isTruncated) {
      const command = new ListObjectsV2Command({
        ...listFoldersParams,
        ContinuationToken: continuationToken,
      });
      const response: ListObjectsV2CommandOutput = await client.send(command);

      if (response.CommonPrefixes) {
        response.CommonPrefixes.forEach((commonPrefix) => {
          if (commonPrefix.Prefix && commonPrefix.Prefix !== portfolioPrefix) {
            const folderName = commonPrefix.Prefix.split("/").filter(Boolean).pop();
            if (folderName) {
              folders.push({
                key: commonPrefix.Prefix, // Es: "Portfolio/Paesaggi/"
                name: folderName,
                slug: folderName.toLowerCase(),
              });
            }
          }
        });
      }
      isTruncated = response.IsTruncated || false;
      continuationToken = response.NextContinuationToken;
    }

    // 2. Per ogni cartella, ottieni le immagini e la thumbnail
    for (const folder of folders) {
      const listImagesParams = {
        Bucket: BUCKET_NAME,
        Prefix: folder.key,
      };
      const imagesResponse: ListObjectsV2CommandOutput = await client.send(new ListObjectsV2Command(listImagesParams));
      
      const imageUrls = imagesResponse.Contents
        ?.filter(content => content.Key && content.Size !== 0) // Filtra solo i file, non le cartelle vuote
        .map(content => `${CLOUDFRONT_DOMAIN}/${content.Key}`)
        .sort(); // Ordina gli URL per coerenza (opzionale)

      // La thumbnail è la prima immagine trovata nella cartella
      const thumbnailUrl = imageUrls && imageUrls.length > 0 ? imageUrls[0] : null;

      portfolioData.push({
        folderName: folder.name,
        slug: folder.slug,
        thumbnailUrl: thumbnailUrl,
        images: imageUrls || [],
      });
    }

    // Salva i dati in un file JSON nella directory src/data
    const outputDir = path.join(process.cwd(), "src", "data");
    const outputPath = path.join(outputDir, "portfolio-data.json");

    // Assicurati che la directory esista
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(portfolioData, null, 2));
    console.log(`Dati del portfolio generati e salvati in: ${outputPath}`);

  } catch (error) {
    console.error("Errore durante la generazione dei dati del portfolio:", error);
    process.exit(1); // Esci con errore
  }
}

// Esegui la funzione quando lo script viene chiamato
generatePortfolioData();
