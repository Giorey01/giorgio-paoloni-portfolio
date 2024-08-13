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
  return (
    <div className="relative w-full h-64 p-2 text-center">
      <Link href={"/" + folder.Key?.toLocaleLowerCase()}>
        <div className="absolute inset-0">
          <Image
            src={`https://giorgio-paoloni-gallery-storage.s3.eu-north-1.amazonaws.com/${imageObject?.Key}`}
            alt="Descrizione dell'immagine"
            fill
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <h2 className="absolute inset-0 flex items-center justify-center text-white font-bold z-10">
          {folder.Key?.split("/").filter(Boolean).pop()}
        </h2>
      </Link>
    </div>
  );
};

export default PortfolioCard;
