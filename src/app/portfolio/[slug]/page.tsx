import React from "react";
import { getImagesFromFolder } from "@/utils/awsS3UtilityFunctions";
import Image from "next/image";
import { getPlaiceholder } from "plaiceholder";

interface PortfolioPageProps {
  params: {
    slug: string;
  };
}

const PortfolioPage = async ({ params }: PortfolioPageProps) => {
  const { slug } = params;
  const decodedSlug = decodeURIComponent(slug);
  const images = await getImagesFromFolder(
    "Portfolio/" + decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1)
  );

  /* // Genera i placeholder per le immagini
  const imagesWithPlaceholder = await Promise.all(
    (images ?? []).map(async (image) => {
      const imageUrl = `https://d321io5nxf2wuu.cloudfront.net/${image.Key}`;

      // Recupera l'immagine come un buffer
      const response = await fetch(imageUrl);
      const buffer = await response.arrayBuffer();

      // Ottieni il placeholder utilizzando il buffer
      const { base64 } = await getPlaiceholder(Buffer.from(buffer));

      return {
        ...image,
        imgUrl: imageUrl,
        placeholder: base64,
      };
    })
  );
*/
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {images?.map((image, index) => (
        <div key={index} className="relative w-full overflow-hidden rounded-lg">
          <Image
            src={`https://d321io5nxf2wuu.cloudfront.net/${image.Key}`}
            alt={image.Key ?? ""}
            width={1000}
            height={1000}
            className="rounded-md object-cover w-full h-full"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCACUAJQDASIAAhEBAxEB/8QAGgABAAMBAQEAAAAAAAAAAAAAAAEDBAIFBv/EAB0QAQADAQEBAQEBAAAAAAAAAAABERICEwNRYQT/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A+rEWWCRFlgkQWCRACUuUgkQAkQAlAAAgEiAHNluLLB3Zbiywd2W4ssHdptxZYO7Lc2WDuy3Nlg6stFlgmxzZYOkIssEiLAUaNK9GgWaNK9GgW2Wq0nQLbLV6NAttNqrTYLLTau02Duy3Flg7stxZYO7LcWWDuxxYDHo0p0aBdpOlGk6BdpOlOk6BdpOlMdJjoF2k6Ux060C3SdKtJ0C2y1Wk6BZZavRoFllq9GgWWK9APN2nbPtOwX7Ttn2nYNGkx0z7THYNEdOo6Z46THQNEdJjpRHTqOgXx0nSiOk6Bfo0p0nQLtGlOk6Bbo0q0aBboVaAeRs2z7TsGjads207BpjtMds8dpjsGmO3Uds0duo7BpjtMds8dpjsGmOk6Z47TsGjSdM+07BfpOlGzYL9GlG07BdoU7AeJtO2badg07THbLtMdg1R26jtljtMdg1R26jtljt1HYNUduo7ZY7THYNUduo7ZY7THYNW07Ztmwadp2zbTsGjZtn2bBo2M+wHh+h6Me+jcg2+ifRi9JPToG6Po6j6MHrKfaQb4+jqPo8+Pu6j7g9CPo6j6PPj/RH66j7x+g3x9HUfRgj7x+uo+39Bu9E+jDH2/qfb+g3eh6MXr/U+v9Bs9E+jH6nqDZ6DH6gPKAAAAAAAAAATc/qAE6n9lO+v1yA79Ov09ev1wAs9ej26VgLPboVgAAAAAAAAAAAAAAAAAAAAP//Z"
          />
        </div>
      ))}
    </div>
  );
};

export default PortfolioPage;
