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

  // Genera i placeholder per le immagini
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

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {imagesWithPlaceholder?.map((image, index) => (
        <div key={index} className="relative w-full overflow-hidden rounded-lg">
          <Image
            src={image.imgUrl}
            alt={image.Key ?? ""}
            width={800}
            height={400}
            className="rounded-md object-cover w-full h-full"
            placeholder="blur"
            blurDataURL={image.placeholder}
          />
        </div>
      ))}
    </div>
  );
};

export default PortfolioPage;
