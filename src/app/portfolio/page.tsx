import React from "react";
import dynamic from "next/dynamic";
import PortfolioCard from "@/components/portfoliocard";
import fs from 'fs/promises';
import path from 'path';

interface ImageDetail {
  url: string;
  blurDataURL: string;
}

interface ImageUrlsData {
  [folderKey: string]: ImageDetail[];
}

const DynamicResponsiveMasonry = dynamic(
  () => import("react-responsive-masonry").then((mod) => mod.ResponsiveMasonry),
  { ssr: false }
);

const DynamicMasonry = dynamic(
  () => import("react-responsive-masonry").then((mod) => mod.Masonry),
  { ssr: false }
);

const PortfolioPage = async () => {
  let imageData: ImageUrlsData = {};
  const jsonFilePath = path.join(process.cwd(), 'src', 'data', 'image_urls.json');

  try {
    const fileContent = await fs.readFile(jsonFilePath, 'utf-8');
    imageData = JSON.parse(fileContent) as ImageUrlsData;
  } catch (error) {
    console.error("Failed to read or parse image_urls.json:", error);
    return (
      <div>
        <h1 className="text-3xl text-center font-bold p-10 lg:p-16">
          Dive into my world
        </h1>
        <p className="text-center text-red-500">Could not load portfolio items. Please try again later.</p>
      </div>
    );
  }

  const portfolioFolders = Object.entries(imageData)
    .filter(([folderKey]) => folderKey.startsWith("Portfolio/"))
    .map(([folderKey, imageObjects]) => {
      if (imageObjects && imageObjects.length > 0 && imageObjects[0] && imageObjects[0].url) {
        return {
          folderKey,
          coverImageUrl: imageObjects[0].url,
          blurDataURL: imageObjects[0].blurDataURL || "", // Provide a fallback for blurDataURL if it's missing
        };
      }
      // Return null or an object with undefined properties if no valid cover image found
      // This will be filtered out later or handled by PortfolioCard
      return { folderKey, coverImageUrl: undefined, blurDataURL: undefined }; 
    })
    .filter(item => item.coverImageUrl !== undefined); // Ensure only items with a cover image proceed

  return (
    <div>
      <h1 className="text-3xl text-center font-bold p-10 lg:p-16">
        Dive into my world
      </h1>
      <DynamicResponsiveMasonry
        className="p-4 md:p-8 lg:p-14"
        columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
      >
        <DynamicMasonry gutter="1rem">
          {portfolioFolders.map(({ folderKey, coverImageUrl, blurDataURL }, index) => {
            // The filter above ensures coverImageUrl is defined
            if (!coverImageUrl) { // This check is now redundant due to the filter but kept for safety
              console.warn(`Skipping folder ${folderKey} due to missing cover image URL.`);
              return null;
            }
            return (
              <PortfolioCard
                key={folderKey || index} // Use folderKey as key if available and unique
                folderKey={folderKey}
                coverImageUrl={coverImageUrl}
                blurDataURL={blurDataURL || ""} // Pass blurDataURL, ensure fallback
              />
            );
          })}
        </DynamicMasonry>
      </DynamicResponsiveMasonry>
    </div>
  );
};

export default PortfolioPage;
