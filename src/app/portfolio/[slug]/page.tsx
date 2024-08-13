import React from "react";
import { getImagesFromFolder } from "@/utils/awsS3UtilityFunctions";
import Image from "next/image";

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
  console.log(images);
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {images?.map((image, index) => (
        <div key={index} className="relative w-full overflow-hidden rounded-lg">
          <Image
            key={index}
            src={`https://giorgio-paoloni-gallery-storage.s3.eu-north-1.amazonaws.com/${image.Key}`}
            alt={image.Key ?? ""}
            width={800}
            height={800}
            className="rounded-md object-cover w-full h-full"
          ></Image>
        </div>
      ))}
    </div>
  );
};

export default PortfolioPage;
