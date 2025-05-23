import React from "react";
import Link from "next/link";
import Image from "next/image";

interface PostCardProps {
  post: {
    title: string;
    date: string;
    desc: string;
    thumbnail: string;
    slug: string;
  };
}

function PostCard({ post }: PostCardProps) {
  return (
    // Il Link avvolge l'intera card per renderla cliccabile.
    // Ho aumentato il padding e aggiunto un max-w per un migliore controllo delle dimensioni.
    <Link href={`/blog/${post.slug}`} className="w-full p-4 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
      {/* Contenitore principale della card:
          - Sfondo chiaro per contrastare con il testo scuro.
          - Angoli arrotondati e un bordo sottile per un aspetto più definito.
          - Ombra per profondità e un effetto hover per interattività.
          - Layout flessibile per disporre immagine e testo. */}
      <div className="bg-[#e8e6e3] rounded-xl border border-[#ddd] shadow-md overflow-hidden
                  flex flex-col sm:flex-row items-center sm:items-start p-4 gap-4
                  hover:shadow-lg hover:scale-[1.01] transition-all duration-300 ease-in-out">
        
        {/* Contenitore dell'immagine:
            - Ho aumentato le dimensioni della thumbnail per darle più risalto.
            - Utilizza 'relative' e 'fill' per un'immagine responsiva che copre il suo contenitore. */}
        <div className="relative w-full h-40 sm:w-40 sm:h-40 flex-shrink-0 rounded-md overflow-hidden">
          <Image
            src={post.thumbnail}
            alt={`Thumbnail per l'articolo: ${post.title}`} // Testo alt più descrittivo per SEO e accessibilità
            fill // L'immagine riempirà il div genitore
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw" // Ottimizzazione per diverse dimensioni dello schermo
            className="object-cover rounded-md" // Assicura che l'immagine copra l'area senza distorsioni
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4jHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCACUAJQDASIAAhEBAxEB/8QAGgABAAMBAQEAAAAAAAAAAAAAAAEDBAIFBv/EAB0QAQADAQEBAQEBAAAAAAAAAAABERICEwNRYQT/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A+rEWWCRFlgkQWCRACUuUgkQAkQAlAAAgEiAHNluLLB3Zbiywd2W4ssHdptxZYO7Lc2WDuy3Nlg6stFlgmxzZYOkIssEiLAUaNK9GgWaNK9GgW2Wq0nQLbLV6NAttNqrTYLLTau02Duy3Flg7stxZYO7LcWWDuxxYDHo0p0aBdpOlGk6BdpOlOk6BdpOlMdJjoF2k6Ux060C3SdKtJ0C2y1Wk6BZZavRoFllq9GgWWK9APN2nbPtOwX7Ttn2nYNGkx0z7THYNEdOo6Z46THQNEdJjpRHTqOgXx0nSiOk6Bfo0p0nQLtGlOk6Bbo0q0aBboVaAeRs2z7TsGjads207BpjtMds8dpjsGmO3Uds0duo7BpjtMds8dpjsGmOk6Z47TsGjSdM+07BfpOlGzYL9GlG07BdoU7AeJtO2badg07THbLtMdg1R26jtljtMdg1R26jtljt1HYNUduo7ZY7THYNUduo7ZY7THYNW07Ztmwadp2zbTsGjZtn2bBo2M+wHh+h6Me+jcg2+ifRi9JPToG6Po6j6MHrKfaQb4+jqPo8+Pu6j7g9CPo6j6PPj/RH66j7x+g3x9HUfRgj7x+uo+39Bu9E+jDH2/qfb+g3eh6MXr/U+v9Bs9E+jH6nqDZ6DH6gPKAAAAAAAAAATc/qAE6n9lO+v1yA79Ov09ev1wAs9ej26VgLPboVgAAAAAAAAAAAAAAAAAAAAP//Z"
          />
        </div>

        {/* Contenitore del testo:
            - Flex-grow per occupare lo spazio disponibile.
            - Padding e spaziatura tra gli elementi di testo. */}
        <div className="flex flex-col flex-grow text-left sm:text-left">
          {/* Titolo dell'articolo: più grande e audace. */}
          <h4 className="text-xl sm:text-2xl font-bold text-[#2F3645] mb-1">
            {post.title.replace(/_/g, " ")} {/* Rimuove gli underscore dal titolo */}
          </h4>
          {/* Data dell'articolo: più piccola e di colore grigio. */}
          <p className="text-sm text-gray-600 mb-2">{post.date}</p>
          {/* Descrizione dell'articolo: testo più chiaro e troncato con ellissi. */}
          <p className="text-base text-[#333] line-clamp-3"> {/* Limita il testo a 3 righe */}
            {post.desc}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
