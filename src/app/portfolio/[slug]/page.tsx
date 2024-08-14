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
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCACUAN4DASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAAECAwQF/8QAFxABAQEBAAAAAAAAAAAAAAAAAAERAv/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ANiAVkEAIRGQEABAAYBUKHBVRUTFQFRcRFwVUVERUBUMoYGZAFAgBghoGCCDzyAUAIAAAIQw8PALBh4eAWKkGHgCKhSKFOHChxBUVEGKvT1GnoL0ajT0FaNTo0RWjU6NUVo1OjQcALRqKoEBDMHAB4JDxQsPDw8AsPDw8AsMYaKRgAY0hoqtGo0aC9Go0aIvRqNLQaaNRpaqNNGs9Gg5NGp09RVRURFQFw4UVAOKkKLkVCw8OQ8AsPDwYilgMgIHU0UFoqaB6NTaWgrRqNLQXo1GlojTRrPRqo00az0aI59OVGnKy20lXGcXFFxpGcaQRUXExcA4YhqDAYQSSioqamqqaCam06mopWlaLU2gNLS0tEVpanRqorRqdGqitPUaeiMNOVGnKy21i+WcXyqNY05ZcteQXFxEXBFRRQ1ADJFKlVVNBNRV1FFTUVVRUE1NVUUAk6SgBGIAAqGABHMcScRpry05ZctOQa8tOWXLXkGkXEcrioqKTFAZAAVKnU1BNTVVFFTUVdRQRU1VKgkjAEDw8AsPDwYqFgxWDBHCqIVEaactOWXLXkRry05ZcteQaRcRFxRcNMUIYIAKmnSoqaiqqaCairqKCamqpAkYoAWHgPEBgw8PALDw8PFHlqiTgNOWnLPlpyDXlpyz5aciNIuI5XAXDTFAYIAKmmVBNTVVNBNRV1NBNIyAjAAKhKgow8ENAYMMA8k4Ao0jTkARpy15ABpyuAAqKAAAACKgAmpoAJqaACSAAGABnABTigEAYAP/2Q=="
          />
        </div>
      ))}
    </div>
  );
};

export default PortfolioPage;
