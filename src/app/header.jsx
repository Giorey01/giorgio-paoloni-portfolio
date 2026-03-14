// "use client" dice a Next.js che questo componente deve essere eseguito nel browser (lato client).
// Questo è necessario quando si usano "Hook" di React (come useState o useEffect) o eventi utente (come onClick).
"use client";

// Importa le icone dai pacchetti react-icons
import { FaInstagram } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";

// Importa React e gli Hook useState ed useEffect.
import React, { useState, useEffect } from "react";
// Importa il componente Link di Next.js per navigare tra le pagine senza ricaricare il sito web.
import Link from "next/link";

function Header() {
  // useState crea una "variabile di stato" per ricordare se il menu per dispositivi mobili è aperto o chiuso.
  // 'isNavOpen' è il valore attuale (inizialmente false, cioè chiuso).
  // 'setIsNavOpen' è la funzione che usiamo per aggiornare questo valore.
  const [isNavOpen, setIsNavOpen] = useState(false);

  // useEffect esegue un pezzo di codice ogni volta che le variabili nel suo array di dipendenze (qui `[isNavOpen]`) cambiano.
  useEffect(() => {
    // Se il menu di navigazione è aperto, blocchiamo lo scorrimento (scroll) della pagina principale
    if (isNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      // Altrimenti, permettiamo di nuovo lo scorrimento
      document.body.style.overflow = "auto";
    }

    // Questa funzione di "pulizia" (cleanup) viene chiamata se il componente viene distrutto.
    // Assicura che, in ogni caso, lo scroll torni normale per evitare bug.
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isNavOpen]);

  return (
    <>
    <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="text-2xl font-serif tracking-tighter">
          <Link href="/" className="hover:opacity-70 transition-opacity">
            Giorgio Paoloni
          </Link>
        </div>

        {/* Navigation Links (Desktop) */}
        {/* Mostrato solo su schermi medi (md) in su. Nascosto su smartphone. */}
        <div className="hidden md:flex items-center space-x-8 text-sm uppercase tracking-widest font-light">
          <Link href="/" className="hover:text-gray-500 transition-colors">Home</Link>
          <Link href="/about" className="hover:text-gray-500 transition-colors">About</Link>
          <Link href="/blog" className="hover:text-gray-500 transition-colors">Blog</Link>
        </div>

        {/* Social Icon & Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          <Link
            href="https://www.instagram.com/_jojifilm_/"
            rel="noopener noreferrer"
            target="_blank" // Apre il link in una nuova scheda
            className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
          >
            <FaInstagram className="w-5 h-5 text-gallery-dark" />
          </Link>

          {/* Bottone per aprire/chiudere il menu sui dispositivi mobili.
              Nascosto su schermi desktop (md:hidden). */}
          <button
            aria-expanded={isNavOpen}
            className="md:hidden p-2 text-gallery-dark cursor-pointer hover:opacity-70 transition-all"
            // onClick: Quando si clicca, inverte il valore corrente di isNavOpen (da vero a falso e viceversa)
            onClick={() => setIsNavOpen((prev) => !prev)}
          >
            <RxHamburgerMenu className="w-6 h-6" />
          </button>
        </div>
      </nav>
    </header>

      {/* Mobile Menu Drawer */}
      {/* Questo div contiene il menu "a cassetto" che si sovrappone su tutto lo schermo nei cellulari */}
      <div
        className={`fixed inset-0 bg-gallery-white flex flex-col justify-center items-center z-50 transform transition-transform duration-300 md:hidden ${
          // Usiamo una classe condizionale basata sullo stato 'isNavOpen'.
          // Se è aperto, lo posiziona sullo schermo (translate-x-0).
          // Se è chiuso, lo sposta fuori dallo schermo a destra (translate-x-full).
          isNavOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          className="absolute top-0 w-full h-20 flex items-center justify-between px-6 border-b border-gray-100"
        >
          <div className="text-2xl font-serif tracking-tighter">
            <Link href="/" onClick={() => setIsNavOpen(false)} className="hover:opacity-70 transition-opacity">
              Giorgio Paoloni
            </Link>
          </div>
          <button
            className="p-2 text-gallery-dark cursor-pointer hover:opacity-70 transition-all"
            // Chiude il menu quando viene cliccata la "X"
            onClick={() => setIsNavOpen(false)}
          >
            <RxCross2 className="w-6 h-6" />
          </button>
        </div>
        <ul className="flex flex-col items-center justify-center space-y-4 text-xl uppercase tracking-widest font-light">
          <li>
            <Link href="/" onClick={() => setIsNavOpen(false)} className="block py-4 px-8 hover:text-gray-500 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" onClick={() => setIsNavOpen(false)} className="block py-4 px-8 hover:text-gray-500 transition-colors">
              About
            </Link>
          </li>
          <li>
            <Link href="/blog" onClick={() => setIsNavOpen(false)} className="block py-4 px-8 hover:text-gray-500 transition-colors">
              Blog
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}

// Esporta il componente Header in modo che possa essere utilizzato altrove (es. nel layout.tsx)
export default Header;
