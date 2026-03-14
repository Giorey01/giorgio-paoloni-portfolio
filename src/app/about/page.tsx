// "use client" dice a Next.js di eseguire questo componente nel browser.
// Questo è obbligatorio quando si usano moduli interattivi o "stati" come useState.
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaArrowDownLong } from "react-icons/fa6";
import { isValidEmail } from "@/utils/validation"; // Funzione creata per controllare se l'email è scritta bene
import { PaperTexture, TapePiece } from "@/components/ScrapbookDecorations";

function About() {
  // `useState` è un Hook di React che permette al componente di "ricordare" dei dati che cambiano nel tempo.
  // Struttura: const [valore, funzionePerModificareIlValore] = useState(valoreIniziale)

  // Memorizza ciò che l'utente scrive nel campo "Email"
  const [email, setEmail] = useState("");
  // Memorizza ciò che l'utente scrive nel campo "Messaggio"
  const [message, setMessage] = useState("");
  // Memorizza lo stato del form: 'idle' (fermo), 'loading' (caricamento), 'success' o 'error'.
  // Questo ci serve per disabilitare il bottone mentre si invia il messaggio e mostrare il caricamento.
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  // Memorizza il messaggio di errore o di successo da mostrare all'utente dopo l'invio.
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Funzione che viene chiamata quando l'utente clicca "Invia" o preme Invio nel form.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // PREVIENE IL COMPORTAMENTO PREDEFINITO DEL BROWSER.
    // Di default, HTML farebbe ricaricare l'intera pagina ricaricandola. Noi non lo vogliamo nelle app React.
    event.preventDefault();

    // Cambiamo lo stato per mostrare che stiamo elaborando la richiesta e svuotiamo vecchi messaggi
    setStatus("loading");
    setFeedbackMessage("");

    // Validazione base lato client (prima di mandare al server)
    // .trim() rimuove gli spazi bianchi all'inizio e alla fine.
    if (!email.trim() || !message.trim()) {
      setFeedbackMessage("Email and message fields cannot be empty.");
      setStatus("error");
      return; // Interrompe l'esecuzione della funzione
    }

    // Usa la funzione di validazione importata per controllare il formato (es. manca la @)
    if (!isValidEmail(email)) {
        setFeedbackMessage("Invalid email format.");
        setStatus("error");
        return;
    }

    try {
      // Effettuiamo una chiamata (fetch) all'API backend del nostro sito (il file api/contact/route.ts)
      const response = await fetch("/api/contact", {
        method: "POST", // Tipo di richiesta (Stiamo "inviando" dati)
        headers: {
          "Content-Type": "application/json", // Diciamo al server che i dati sono in formato JSON
        },
        // body: trasforma i nostri dati (email e message) in una stringa testuale formato JSON.
        body: JSON.stringify({ email, message }),
      });

      // Aspettiamo e convertiamo la risposta del server da JSON a un oggetto JavaScript
      const result = await response.json();

      // response.ok è true se il server risponde con un codice di successo (tipo 200 o 201)
      if (response.ok) {
        setFeedbackMessage(result.message || "Message sent successfully!");
        setStatus("success");
        // Svuotiamo i campi del form per permettere di inviare un nuovo messaggio
        setEmail("");
        setMessage("");
      } else {
        // Se il server risponde con un errore (es. 400 o 500), mostriamo l'errore del server o un testo standard
        setFeedbackMessage(result.error || "An error occurred.");
        setStatus("error");
      }
    } catch (error) {
      // Se il fetch fallisce del tutto (es. niente internet o server giù), cade qui nel "catch".
      setFeedbackMessage("Failed to send message. Please try again later.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#fcfbf8]">
      <PaperTexture className="fixed inset-0 pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-center gap-12 md:gap-24 min-h-full max-w-6xl mx-auto px-6 py-12 md:py-24">
        {/* Left side: Photo and Bio */}
        <div className="flex flex-col items-center md:items-start max-w-md w-full">

          <div className="mb-8 relative transition-all duration-500 ease-out hover:scale-[1.02] rotate-[-2deg]">
            <div className="bg-[#fdfdfd] p-3 md:p-4 pb-12 md:pb-16 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200 relative group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.2)]">
              <TapePiece className="-top-4 left-1/2 -translate-x-1/2 rotate-[-2deg]" />

              <div className="relative w-64 h-64 md:w-80 md:h-80 bg-gray-100 overflow-hidden">
                <Image
                  src={
                    "https://d321io5nxf2wuu.cloudfront.net/Assets/Foto_Profilo-removebg-preview.webp"
                  }
                  fill
                  className="object-cover grayscale-[0.2] contrast-125"
                  alt="Giorgio Paoloni"
                />
              </div>
            </div>
          </div>

          <h1 className="font-serif italic text-6xl md:text-[90px] leading-[0.8] tracking-tighter text-[#1a1a1a] uppercase select-none mb-8 text-center md:text-left">
            Giorgio<br/>Paoloni
          </h1>
          <div className="space-y-4 text-neutral-600 leading-relaxed text-sm md:text-base text-center md:text-left mix-blend-multiply">
            <p>
              In my free time I like to document the places I visit through photography.
            </p>
            <p>
              Every shot is a way to share the experiences and beauties I encounter along my path, blending digital precision with an analog soul.
            </p>
          </div>
        </div>

        {/* Right side: Contact Form */}
        <div className="flex flex-col w-full max-w-md mt-8 md:mt-0">
          <h2 className="font-serif italic text-4xl mb-8 text-[#1a1a1a] border-b border-gray-300 pb-4 text-center md:text-left mix-blend-multiply">
            Contact
          </h2>
        {/* Il form chiama la funzione handleSubmit quando viene inviato (onSubmit) */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 md:gap-8 w-full"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-xs uppercase tracking-widest text-neutral-500">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="your@email.com"
              className="border-b border-neutral-400 bg-transparent py-2 px-0 focus:outline-none focus:border-neutral-800 transition-colors duration-300 rounded-none placeholder-neutral-300"
              // Colleghiamo l'input allo stato di React. (Two-way data binding)
              // Il suo valore è `email`. Quando l'utente digita (onChange), chiamiamo `setEmail` per aggiornarlo.
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // L'input viene disabilitato in modo che l'utente non possa scrivere mentre sta caricando
              disabled={status === "loading"}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="text-xs uppercase tracking-widest text-neutral-500">
              Message
            </label>
            <textarea
              name="message"
              id="message"
              placeholder="Tell me about your project or say hi..."
              className="border-b border-neutral-400 bg-transparent py-2 px-0 h-28 focus:outline-none focus:border-neutral-800 transition-colors duration-300 resize-none rounded-none placeholder-neutral-300"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={status === "loading"}
            />
          </div>
          <div className="mt-4">
            {/* Bottone di submit. Modifica il testo in "Sending..." in base allo stato. */}
            <button
              type="submit"
              className="w-full bg-neutral-800 text-neutral-100 uppercase tracking-widest text-sm py-4 hover:bg-black transition-colors disabled:opacity-50"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Sending..." : "Send Message"}
            </button>
          </div>
            {/* Se c'è un messaggio di feedback, mostra un blocco in basso con stili diversi a seconda che sia di successo o di errore */}
            {feedbackMessage && (
              <div
                className={`mt-4 text-center p-3 text-sm tracking-wide ${
                  status === "success" ? "text-neutral-600 border border-neutral-300" : ""
                } ${status === "error" ? "text-red-600 border border-red-200" : ""}`}
              >
                {feedbackMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default About;
