import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

// Interfaccia immutata
interface PostMetadata {
  title: string;
  date: string;
  desc: string;
  thumbnail: string;
  slug: string;
}

export default async function getPostMetadata(basePath: string): Promise<PostMetadata[]> {
  try {
    // 1. Leggiamo la cartella con 'withFileTypes' per sapere subito se sono file o directory
    // senza fare ulteriori chiamate a fs.stat
    const dirents = await fs.readdir(basePath, { withFileTypes: true });

    // 2. Filtro robusto per i file Markdown
    const markdownFiles = dirents.filter((dirent) => {
      return (
        dirent.isFile() && // Deve essere un file, non una cartella (es. cartella "drafts.md")
        dirent.name.toLowerCase().endsWith(".md") && // Case-insensitive
        !dirent.name.startsWith(".") // Esclude i file nascosti del SO (es. ._post.md)
      );
    });

    const postsPromises = markdownFiles.map(async (dirent) => {
      const filePath = path.join(basePath, dirent.name);

      try {
        const fileContents = await fs.readFile(filePath, "utf-8");
        
        // 3. Verifica veloce che ci sia il frontmatter prima di parsare
        if (!fileContents.trimStart().startsWith("---")) {
          console.warn(`[Skip] Il file ${dirent.name} non ha un Frontmatter valido.`);
          return null;
        }

        const matterResult = matter(fileContents);
        const data = matterResult.data;

        // 4. Validazione dei campi essenziali
        if (!data.title || !data.date) {
          console.warn(`[Skip] Metadati essenziali (title/date) mancanti in ${dirent.name}.`);
          return null;
        }

        return {
          title: String(data.title),
          date: String(data.date),
          desc: String(data.desc || ""), // Fallback a stringa vuota se manca
          thumbnail: String(data.thumbnail || ""),
          // Regex per rimuovere l'estensione in modo case-insensitive
          slug: dirent.name.replace(/\.md$/i, ""), 
        };
        
      } catch (readError) {
        console.error(`[Error] Impossibile processare il file ${dirent.name}:`, readError);
        return null;
      }
    });

    // Aspettiamo che tutti i file vengano processati
    const rawPosts = await Promise.all(postsPromises);

    // 5. Filtriamo i risultati nulli (file ignorati o falliti)
    // Il Type Guard "post is PostMetadata" serve a TypeScript per capire 
    // che l'array finale non conterrà 'null'
    const posts = rawPosts.filter((post): post is PostMetadata => post !== null);

    return posts;

  } catch (dirError) {
    // Se la cartella basePath non esiste, catturiamo l'errore ed evitiamo il crash
    console.error(`[Error] Impossibile leggere la cartella ${basePath}:`, dirError);
    return []; 
  }
}