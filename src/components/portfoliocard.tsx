import React from "react";
// Importa il componente Image di Next.js, fondamentale per ottimizzare le immagini (peso, formato, caricamento lento o 'lazy loading')
import Image from "next/image";
// Importa Link di Next.js per la navigazione rapida e pre-caricata (prefetching) tra le pagine interne
import Link from "next/link";

// Definisce le "Props" (Proprietà), ovvero i dati che questo componente si aspetta di ricevere da chi lo usa (es. dalla pagina Home)
interface PortfolioCardProps {
  folderKey: string;     // Il percorso originale della cartella (es. "Portfolio/Giappone")
  coverImageUrl: string; // L'indirizzo web dell'immagine di copertina
  blurDataURL: string;   // Dati in formato base64 per mostrare l'effetto sfocato mentre l'immagine si carica
}

// Questo è un Componente React che mostra la singola "Card" del portfolio
// Riceve come parametri 'folderKey', 'coverImageUrl' e 'blurDataURL'
const PortfolioCard = ({ folderKey, coverImageUrl, blurDataURL }: PortfolioCardProps) => {
  // Ricava il testo alternativo (alt text) estraendo il nome finale della cartella.
  // Es. da "Portfolio/MyAlbum/" diventa "MyAlbum". Se fallisce usa "Portfolio image"
  const altText = folderKey.split('/').filter(Boolean).pop() || "Portfolio image";

  // Costruisce l'URL della pagina a cui puntare (href) quando si clicca la card.
  // Es. da "Portfolio/MyAlbum/" crea "/portfolio/myalbum"
  const slug = folderKey
    .toLowerCase()
    .replace(/^portfolio\//, "") // Rimuove il prefisso "portfolio/"
    .replace(/\/$/, "");         // Rimuove lo slash finale se presente

  const href = `/portfolio/${slug}`;

  return (
    // Il componente Link crea un collegamento ad un'altra pagina all'interno dell'app
    <Link href={href}>
      <div className="space-y-4 group">
        <div className="relative overflow-hidden bg-gray-100 image-hover-container">
          {/* Il componente Image sostituisce il normale tag <img> ed applica ottimizzazioni automatiche */}
          <Image
            src={coverImageUrl} // L'immagine da caricare
            alt={altText} // Testo che viene letto dagli screen-reader o mostrato se l'immagine non carica (fondamentale per accessibilità)
            width={500} // Larghezza di riferimento
            height={500} // Altezza di riferimento
            placeholder="blur" // Dice a Next.js di mostrare un'immagine sfocata inizialmente
            className="w-full h-auto object-cover" // Classi Tailwind per rendere l'immagine responsiva e mantenere le proporzioni
            blurDataURL={blurDataURL} // L'immagine sfocata in miniatura da mostrare
          />
          {/* Questo div crea un velo scuro con testo che compare solo quando si passa il mouse (hover) sull'immagine */}
          <div className="image-overlay absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-500 flex items-center justify-center">
            <span className="text-white text-sm tracking-widest uppercase font-light">View Collection</span>
          </div>
        </div>
        <div className="flex justify-between items-end px-2">
          {/* Titolo e Categoria scritti sotto l'immagine */}
          <h3 className="font-serif italic text-xl text-gallery-dark">{altText}</h3>
          <span className="text-[10px] tracking-widest uppercase text-gray-400">Series</span>
        </div>
      </div>
    </Link>
  );
};

export default PortfolioCard;
