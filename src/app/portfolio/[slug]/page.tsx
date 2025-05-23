import React from "react";
import fs from 'fs/promises';
import path from 'path';
import Image from "next/image";

interface PortfolioPageProps {
  params: {
    slug: string;
  };
}

interface ImageUrlsData {
  [folderKey: string]: string[];
}

// Helper function to derive slug from folderKey
const getSlugFromFolderKey = (folderKey: string): string | null => {
  if (!folderKey.startsWith("Portfolio/")) return null;
  return folderKey
    .replace(/^Portfolio\//i, "") // Remove "Portfolio/" prefix, case-insensitive
    .replace(/\/$/, "") // Remove trailing slash
    .toLowerCase(); // Convert to lowercase
};

// Helper function to find folder key from slug
const findFolderKeyBySlug = (imageData: ImageUrlsData, slug: string): string | undefined => {
  const normalizedSlug = slug.toLowerCase();
  return Object.keys(imageData).find(key => {
    if (!key.startsWith("Portfolio/")) return false;
    const keySlug = key.replace(/^Portfolio\//i, "").replace(/\/$/, "").toLowerCase();
    return keySlug === normalizedSlug;
  });
};


export const generateStaticParams = async () => {
  const jsonFilePath = path.join(process.cwd(), 'src', 'data', 'image_urls.json');
  let imageData: ImageUrlsData = {};

  try {
    const fileContent = await fs.readFile(jsonFilePath, 'utf-8');
    imageData = JSON.parse(fileContent) as ImageUrlsData;
  } catch (error) {
    console.warn("Failed to read image_urls.json for generateStaticParams:", error);
    return []; // Return empty array if data can't be read
  }

  const slugs = Object.keys(imageData)
    .map(folderKey => getSlugFromFolderKey(folderKey))
    .filter((slug): slug is string => slug !== null);
  
  console.log("Generated slugs for static params:", slugs);

  return slugs.map((slug) => ({
    slug,
  }));
};

const PortfolioPage = async ({ params }: PortfolioPageProps) => {
  const { slug } = params;
  const jsonFilePath = path.join(process.cwd(), 'src', 'data', 'image_urls.json');
  let imageData: ImageUrlsData = {};
  let imageUrls: string[] = [];

  try {
    const fileContent = await fs.readFile(jsonFilePath, 'utf-8');
    imageData = JSON.parse(fileContent) as ImageUrlsData;
  } catch (error) {
    console.error(`Failed to read or parse image_urls.json for slug ${slug}:`, error);
    // Optionally, return a 404 or error component
    return <div className="text-center text-red-500 p-10">Error loading album images. Data file may be missing.</div>;
  }
  
  const targetFolderKey = findFolderKeyBySlug(imageData, slug);

  if (targetFolderKey && imageData[targetFolderKey]) {
    imageUrls = imageData[targetFolderKey];
    console.log(`Found ${imageUrls.length} images for slug "${slug}" in folder "${targetFolderKey}"`);
  } else {
    console.warn(`No images found for slug "${slug}". Looked for folder key matching the slug.`);
    // Optionally, return a 404 or error component
    return <div className="text-center text-red-500 p-10">Album not found or no images in this album.</div>;
  }

  if (imageUrls.length === 0) {
    return <div className="text-center p-10">This album currently contains no images.</div>;
  }

  return (
    <div className="p-4 md:p-8 lg:p-14">
      <h1 className="text-3xl text-center font-bold p-6 lg:p-10 capitalize">
        {decodeURIComponent(slug).replace(/-/g, " ")}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {imageUrls.map((imageUrl, index) => {
          const altText = imageUrl.substring(imageUrl.lastIndexOf('/') + 1) || `Image ${index + 1} for ${slug}`;
          return (
            <div key={index} className="relative w-full aspect-[4/3] overflow-hidden rounded-lg shadow-md"> {/* Adjusted aspect ratio & added shadow */}
              <Image
                src={imageUrl}
                alt={altText}
                fill // Use fill to cover the container, requires parent to be relative and have dimensions
                className="object-cover w-full h-full rounded-md hover:scale-105 transition-transform duration-300" // Added hover effect
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCACUAJQDASIAAhEBAxEB/8QAGgABAAMBAQEAAAAAAAAAAAAAAAEDBAIFBv/EAB0QAQADAQEBAQEBAAAAAAAAAAABERICEwNRYQT/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A+rEWWCRFlgkQWCRACUuUgkQAkQAlAAAgEiAHNluLLB3Zbiywd2W4ssHdptxZYO7Lc2WDuy3Nlg6stFlgmxzZYOkIssEiLAUaNK9GgWaNK9GgW2Wq0nQLbLV6NAttNqrTYLLTau02Duy3Flg7stxZYO7LcWWDuxxYDHo0p0aBdpOlGk6BdpOlOk6BdpOlMdJjoF2k6Ux060C3SdKtJ0C2y1Wk6BZZavRoFllq9GgWWK9APN2nbPtOwX7Ttn2nYNGkx0z7THYNEdOo6Z46THQNEdJjpRHTqOgXx0nSiOk6Bfo0p0nQLtGlOk6Bbo0q0aBboVaAeRs2z7TsGjads207BpjtMds8dpjsGmO3Uds0duo7BpjtMds8dpjsGmOk6Z47TsGjSdM+07BfpOlGzYL9GlG07BdoU7AeJtO2badg07THbLtMdg1R26jtljtMdg1R26jtljt1HYNUduo7ZY7THYNUduo7ZY7THYNW07Ztmwadp2zbTsGjZtn2bBo2M+wHh+h6Me+jcg2+ifRi9JPToG6Po6j6MHrKfaQb4+jqPo8+Pu6j7g9CPo6j6PPj/RH66j7x+g3x9HUfRgj7x+uo+39Bu9E+jDH2/qfb+g3eh6MXr/U+v9Bs9E+jH6nqDZ6DH6gPKAAAAAAAAAATc/qAE6n9lO+v1yA79Ov09ev1wAs9ej26VgLPboVgAAAAAAAAAAAAAAAAAAAAP//Z" // Placeholder can be improved
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PortfolioPage;
