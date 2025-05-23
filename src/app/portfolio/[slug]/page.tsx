import React from "react";
import fs from 'fs/promises';
import path from 'path';
import Image from "next/image";

interface PortfolioPageProps {
  params: {
    slug: string;
  };
}

// Define the new ImageDetail interface
interface ImageDetail {
  url: string;
  blurDataURL: string;
}

// Update ImageUrlsData to use ImageDetail[]
interface ImageUrlsData {
  [folderKey: string]: ImageDetail[];
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
  let imageData: ImageUrlsData = {}; // Use updated ImageUrlsData type

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
  let imageData: ImageUrlsData = {}; // Use updated ImageUrlsData type
  let currentAlbumImages: ImageDetail[] = []; // Changed type to ImageDetail[]

  try {
    const fileContent = await fs.readFile(jsonFilePath, 'utf-8');
    imageData = JSON.parse(fileContent) as ImageUrlsData;
  } catch (error) {
    console.error(`Failed to read or parse image_urls.json for slug ${slug}:`, error);
    return <div className="text-center text-red-500 p-10">Error loading album images. Data file may be missing.</div>;
  }
  
  const targetFolderKey = findFolderKeyBySlug(imageData, slug);

  if (targetFolderKey && imageData[targetFolderKey]) {
    currentAlbumImages = imageData[targetFolderKey]; // Assign the array of ImageDetail objects
    console.log(`Found ${currentAlbumImages.length} images for slug "${slug}" in folder "${targetFolderKey}"`);
  } else {
    console.warn(`No images found for slug "${slug}". Looked for folder key matching the slug.`);
    return <div className="text-center text-red-500 p-10">Album not found or no images in this album.</div>;
  }

  if (currentAlbumImages.length === 0) {
    return <div className="text-center p-10">This album currently contains no images.</div>;
  }

  return (
    <div className="p-4 md:p-8 lg:p-14">
      <h1 className="text-3xl text-center font-bold p-6 lg:p-10 capitalize">
        {decodeURIComponent(slug).replace(/-/g, " ")}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentAlbumImages.map((imageDetail, index) => { // Renamed to imageDetail
          // Derive altText from imageDetail.url
          const altText = imageDetail.url.substring(imageDetail.url.lastIndexOf('/') + 1) || `Image ${index + 1} for ${slug}`;
          return (
            <div key={imageDetail.url || index} className="relative w-full aspect-[4/3] overflow-hidden rounded-lg shadow-md">
              <Image
                src={imageDetail.url} // Use imageDetail.url
                alt={altText}
                fill 
                className="object-cover w-full h-full rounded-md hover:scale-105 transition-transform duration-300"
                placeholder="blur"
                blurDataURL={imageDetail.blurDataURL} // Use imageDetail.blurDataURL
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PortfolioPage;
