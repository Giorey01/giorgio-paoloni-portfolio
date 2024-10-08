import React from "react";
import { getFirstImageFromFolder } from "@/utils/awsS3UtilityFunctions";
import Image from "next/image";
import Link from "next/link";

interface PortfolioCardProps {
  folder: {
    Key?: string;
    Size?: number;
  };
}

const PortfolioCard = async ({ folder }: PortfolioCardProps) => {
  const imageObject = await getFirstImageFromFolder(folder.Key ?? "");
  const alt = imageObject?.Key?.split("/").pop();
  return (
    <Link href={"/" + folder.Key?.toLowerCase()}>
    <div className="relative flex flex-col w-full text-center border-b-2 border-[#2F3645]">
          <Image
            src={`https://giorgio-paoloni-gallery-storage.s3.eu-north-1.amazonaws.com/${imageObject?.Key}`}
            alt={alt ?? ""}
            width={400}
            height={400}
            placeholder="blur"
            className="rounded-t-lg object-cover aspect-square hover:opacity-100 opacity-75 transition-all duration-300"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCACUAJQDASIAAhEBAxEB/8QAGgABAAMBAQEAAAAAAAAAAAAAAAEDBAIFBv/EAB0QAQADAQEBAQEBAAAAAAAAAAABERICEwNRYQT/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A+rEWWCRFlgkQWCRACUuUgkQAkQAlAAAgEiAHNluLLB3Zbiywd2W4ssHdptxZYO7Lc2WDuy3Nlg6stFlgmxzZYOkIssEiLAUaNK9GgWaNK9GgW2Wq0nQLbLV6NAttNqrTYLLTau02Duy3Flg7stxZYO7LcWWDuxxYDHo0p0aBdpOlGk6BdpOlOk6BdpOlMdJjoF2k6Ux060C3SdKtJ0C2y1Wk6BZZavRoFllq9GgWWK9APN2nbPtOwX7Ttn2nYNGkx0z7THYNEdOo6Z46THQNEdJjpRHTqOgXx0nSiOk6Bfo0p0nQLtGlOk6Bbo0q0aBboVaAeRs2z7TsGjads207BpjtMds8dpjsGmO3Uds0duo7BpjtMds8dpjsGmOk6Z47TsGjSdM+07BfpOlGzYL9GlG07BdoU7AeJtO2badg07THbLtMdg1R26jtljtMdg1R26jtljt1HYNUduo7ZY7THYNUduo7ZY7THYNW07Ztmwadp2zbTsGjZtn2bBo2M+wHh+h6Me+jcg2+ifRi9JPToG6Po6j6MHrKfaQb4+jqPo8+Pu6j7g9CPo6j6PPj/RH66j7x+g3x9HUfRgj7x+uo+39Bu9E+jDH2/qfb+g3eh6MXr/U+v9Bs9E+jH6nqDZ6DH6gPKAAAAAAAAAATc/qAE6n9lO+v1yA79Ov09ev1wAs9ej26VgLPboVgAAAAAAAAAAAAAAAAAAAAP//Z"
          />
        <div className="absolute bottom-0 w-full h-24 bg-[#e8e6e3] flex justify-center items-center">
            <h2 className="text-2xl md:text-3xl font-bold z-10">
              {folder.Key?.split("/").filter(Boolean).pop()}
            </h2>
        </div>
    </div>
    </Link>
  );
};

export default PortfolioCard;
