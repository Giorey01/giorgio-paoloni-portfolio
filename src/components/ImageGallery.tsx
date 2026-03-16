"use client"; // Questo comando indica a Next.js che questo è un "Client Component" (cioè viene eseguito nel browser)

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Masonry from "react-masonry-css";
// Importiamo le icone dalla libreria react-icons (si usano come normali componenti React)
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Definiamo il tipo di dati per le immagini che riceveremo dalla pagina genitore
interface ImageDetail {
  url: string;
  blurDataURL: string;
}

// Definiamo le Props (i parametri) che questo componente si aspetta di ricevere
interface ImageGalleryProps {
  images: ImageDetail[]; // L'array di immagini per questo specifico album
  slug: string;          // Lo slug dell'album per generare il testo alternativo delle immagini
}

// Questo componente gestisce sia la griglia di immagini sia il carosello a schermo intero
export default function ImageGallery({ images, slug }: ImageGalleryProps) {
  // useState è un "Hook" di React. Ci permette di salvare dati temporanei nella memoria del componente.
  // Qui salviamo l'indice dell'immagine attualmente ingrandita. Se è `null`, vuol dire che nessuna immagine è ingrandita.
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Variabile booleana calcolata per comodità: se selectedIndex non è null, il modale è aperto.
  const isModalOpen = selectedIndex !== null;

  // Questa funzione chiude il carosello
  const closeModal = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  // Questa funzione va all'immagine successiva
  const goToNext = useCallback(() => {
    setSelectedIndex((prevIndex) => {
      if (prevIndex === null) return null;
      // Se siamo all'ultima immagine, torniamo alla prima (loop)
      return prevIndex === images.length - 1 ? 0 : prevIndex + 1;
    });
  }, [images.length]);

  // Questa funzione va all'immagine precedente
  const goToPrev = useCallback(() => {
    setSelectedIndex((prevIndex) => {
      if (prevIndex === null) return null;
      // Se siamo alla prima immagine, andiamo all'ultima (loop)
      return prevIndex === 0 ? images.length - 1 : prevIndex - 1;
    });
  }, [images.length]);

  // useEffect è un altro Hook. Esegue codice "di lato" quando il componente viene caricato o quando cambiano alcune dipendenze.
  // Qui lo usiamo per due cose: gestire la tastiera e bloccare lo scorrimento della pagina dietro il modale.
  useEffect(() => {
    // 1. Gestione della tastiera (Escape per uscire, Frecce per scorrere)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return; // Se il modale è chiuso, non facciamo nulla

      if (e.key === "Escape") {
        closeModal();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrev();
      }
    };

    // Aggiungiamo l'ascoltatore di eventi alla finestra del browser
    window.addEventListener("keydown", handleKeyDown);

    // 2. Bloccare lo scroll della pagina sottostante (ottimo per dispositivi mobili)
    if (isModalOpen) {
      document.body.style.overflow = "hidden"; // Disabilita lo scroll
    } else {
      document.body.style.overflow = ""; // Ripristina lo scroll normale
    }

    // La funzione ritornata da useEffect si chiama "cleanup function".
    // Viene eseguita quando il componente viene distrutto o prima di rieseguire l'effetto,
    // in modo da "pulire" ciò che avevamo impostato (evitando memory leaks).
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isModalOpen, closeModal, goToNext, goToPrev]);

  return (
    <>
      {/*
        1. LA GRIGLIA DELLE IMMAGINI
        Mostra le immagini come miniature quadrate usando Tailwind CSS
      */}
      <Masonry
        breakpointCols={{ default: 4, 1024: 3, 768: 2, 640: 1 }}
        className="flex w-auto -ml-4 md:-ml-6"
        columnClassName="pl-4 md:pl-6 bg-clip-padding"
      >
        {images.map((imageDetail, index) => {
          const altText = imageDetail.url.substring(imageDetail.url.lastIndexOf('/') + 1) || `Image ${index + 1} for ${slug}`;
          return (
            <div
              key={imageDetail.url || index}
              // Quando l'utente clicca su una foto, cambiamo lo stato impostando l'indice cliccato.
              // Questo triggera un ri-rendering (refresh) e fa aprire il modale (isModalOpen diventa true).
              onClick={() => setSelectedIndex(index)}
              className="relative w-full overflow-hidden mb-4 md:mb-6 shadow-md cursor-pointer group"
            >
              <Image
                src={imageDetail.url}
                alt={altText}
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: '100%', height: 'auto' }}
                // group-hover applica un effetto di scale quando si passa col mouse sull'intero contenitore
                className="object-cover w-full h-auto transition-transform duration-300 group-hover:scale-105"
                placeholder="blur"
                blurDataURL={imageDetail.blurDataURL}
              />
              {/* Opzionale: un overlay scuro che appare in hover per indicare la cliccabilità, coperto da @media (hover: hover) per evitare problemi su touch */}
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10 hidden md:block" />
            </div>
          );
        })}
      </Masonry>

      {/*
        2. IL MODALE CAROSELLO A SCHERMO INTERO
        Viene mostrato solo se isModalOpen è true (cioè se abbiamo cliccato su un'immagine)
      */}
      {isModalOpen && selectedIndex !== null && (
        <div
          // Posiziona il modale sopra tutto il resto, a tutto schermo, bloccato (fixed).
          // Lo z-index (z-50) assicura che stia davanti all'header o ad altri elementi.
          // onClick qui permette di chiudere il modale cliccando sullo sfondo nero
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeModal}
        >
          {/* Bottone per chiudere */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 md:top-6 md:right-6 text-white/70 hover:text-white z-50 p-2 transition-colors"
            aria-label="Close gallery"
          >
            <FiX size={32} />
          </button>

          {/* Bottone Precedente */}
          <button
            onClick={(e) => { e.stopPropagation(); goToPrev(); }}
            className="absolute left-2 md:left-6 text-white/50 hover:text-white z-50 p-4 transition-colors"
            aria-label="Previous image"
          >
            <FiChevronLeft size={48} />
          </button>

          {/* L'immagine attualmente selezionata ingrandita */}
          <div
            className="relative w-full h-full max-w-5xl max-h-[85vh] mx-12 md:mx-24"
          >
            <Image
              src={images[selectedIndex].url}
              alt={`Enlarged image ${selectedIndex + 1}`}
              fill
              // Usiamo object-contain per mostrare l'immagine intera senza tagliarla, a differenza della griglia
              className="object-contain"
              sizes="100vw"
              placeholder="blur"
              blurDataURL={images[selectedIndex].blurDataURL}
              // Cliccando sull'immagine stessa, impediamo la chiusura del modale (stopPropagation blocca l'evento onClick del div genitore)
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Bottone Successivo */}
          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-2 md:right-6 text-white/50 hover:text-white z-50 p-4 transition-colors"
            aria-label="Next image"
          >
            <FiChevronRight size={48} />
          </button>

          {/* Contatore in basso al centro (es: 3 / 10) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 tracking-widest text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
