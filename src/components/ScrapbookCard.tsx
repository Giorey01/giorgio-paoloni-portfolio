// Importa i componenti decorativi per lo stile "Scrapbook" (diario fotografico/collage)
import { TapePiece, ApprovalStamp, ScribbleCircle } from "@/components/ScrapbookDecorations";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// Definisce le Props (dati) per la singola card in stile scrapbook
interface ScrapbookCardProps {
  folderKey?: string;
  coverImageUrl: string;
  blurDataURL: string;
  rotation: string;      // Gradi di rotazione (es. "-rotate-2", "rotate-3")
  zIndex: number;        // Ordine di sovrapposizione (quale immagine sta sopra)
  tapePosition: "top" | "bottom" | "corners"; // Dove mettere lo scotch
  stampType?: "postage" | "approval" | "scribble" | "none"; // Che timbro aggiungere
  marginTop?: string;    // Margine superiore per "sfalsare" le immagini
  title?: string;
  href?: string;
}

const ScrapbookCard = ({
  folderKey,
  coverImageUrl,
  blurDataURL,
  rotation,
  zIndex,
  tapePosition,
  stampType = "none",
  marginTop = "mt-0",
  title,
  href: customHref
}: ScrapbookCardProps) => {
  const altText = title || (folderKey ? folderKey.split('/').filter(Boolean).pop() : "Portfolio image") || "Portfolio image";
  const slug = folderKey
    ? folderKey
        .toLowerCase()
        .replace(/^portfolio\//, "")
        .replace(/\/$/, "")
    : "";

  const href = customHref || `/portfolio/${slug}`;

  return (
    <Link href={href} className="block group w-full outline-none">
      {/*
        Il contenitore principale usa la rotazione e il margine per rompere la griglia.
        L'hover state aggiunge un'ombra più marcata e alza l'immagine (z-index)
      */}
      <div
        className={`relative transition-all duration-500 ease-out hover:scale-[1.02] hover:z-50 ${rotation} ${marginTop}`}
        style={{ zIndex }}
      >
        {/* Bordo bianco stile Polaroid/Stampa Fotografica e ombra per profondità */}
        <div className="bg-[#fdfdfd] p-3 md:p-4 pb-12 md:pb-16 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200 relative group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.2)]">

          {/* Pezzi di scotch (Tape) */}
          {tapePosition === "top" && <TapePiece className="-top-4 left-1/2 -translate-x-1/2 rotate-[-2deg]" />}
          {tapePosition === "bottom" && <TapePiece className="-bottom-4 left-1/2 -translate-x-1/2 rotate-[-3deg]" />}
          {tapePosition === "corners" && (
            <>
              <TapePiece className="-top-4 -left-4 rotate-[-45deg] w-24" />
              <TapePiece className="-bottom-4 -right-4 rotate-[135deg] w-24" />
            </>
          )}

          {/* Timbri decorativi */}
          {stampType === "approval" && <ApprovalStamp text="SELECTED" color="#1a1a1a" className="top-1/4 -left-6" />}
          {stampType === "scribble" && <ScribbleCircle className="-bottom-10 -right-6 scale-75" />}

          {/* Immagine */}
          <div className="relative overflow-hidden w-full aspect-[4/5] bg-gray-100">
            <Image
              src={coverImageUrl}
              alt={altText}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              placeholder={blurDataURL ? "blur" : "empty"}
              className="object-cover grayscale-[0.2] contrast-125 group-hover:grayscale-0 transition-all duration-700"
              blurDataURL={blurDataURL || undefined}
            />
          </div>

          {/* Testo stile annotazione o etichetta */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center opacity-80 group-hover:opacity-100 transition-opacity">
            <span className="font-serif italic text-xl md:text-2xl text-gallery-dark tracking-wide">{altText}</span>
            <span className="font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase text-gray-500 font-bold border-b border-gray-300 pb-1">Series</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ScrapbookCard;