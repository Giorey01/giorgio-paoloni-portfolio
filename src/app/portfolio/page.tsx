import React from "react";
import PortfolioCard from "@/components/portfoliocard";
import fs from 'fs/promises';
import path from 'path';

interface ImageUrlsData {
  [folderKey: string]: string[];
}

const PortfolioPage = async () => {
  let imageData: ImageUrlsData = {};
  const jsonFilePath = path.join(process.cwd(), 'src', 'data', 'image_urls.json');

  try {
    const fileContent = await fs.readFile(jsonFilePath, 'utf-8');
    imageData = JSON.parse(fileContent) as ImageUrlsData;
  } catch (error) {
    console.error("Failed to read or parse image_urls.json:", error);
    // Optionally, return a message or an empty state
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
    .map(([folderKey, imageUrls]) => ({
      folderKey,
      coverImageUrl: imageUrls.length > 0 ? imageUrls[0] : undefined, // Handle empty imageUrls array
    }));

  return (
    <div>
      <h1 className="text-3xl text-center font-bold p-10 lg:p-16">
        Dive into my world
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center p-4 md:p-8 lg:p-14">
        {portfolioFolders.map(({ folderKey, coverImageUrl }, index) => {
          if (!coverImageUrl) {
            // Optionally skip rendering or show a placeholder if no cover image
            console.warn(`No cover image for folder: ${folderKey}`);
            return null; 
          }
          return <PortfolioCard key={index} folderKey={folderKey} coverImageUrl={coverImageUrl} />;
        })}
      </div>
    </div>
  );
};

export default PortfolioPage;
