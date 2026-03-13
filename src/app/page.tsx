import PortfolioCard from "@/components/portfoliocard";
import fs from 'fs/promises';
import path from 'path';
import MasonryWrapper from '@/components/MasonryWrapper';

interface ImageDetail {
  url: string;
  blurDataURL: string;
}

interface ImageUrlsData {
  [folderKey: string]: ImageDetail[];
}

export default async function Home() {
  let imageData: ImageUrlsData = {};
  const jsonFilePath = path.join(process.cwd(), 'src', 'data', 'image_urls.json');

  try {
    const fileContent = await fs.readFile(jsonFilePath, 'utf-8');
    imageData = JSON.parse(fileContent) as ImageUrlsData;
  } catch (error) {
    console.error("Failed to read or parse image_urls.json:", error);
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
      return { folderKey, coverImageUrl: undefined, blurDataURL: undefined };
    })
    .filter(item => item.coverImageUrl !== undefined); // Ensure only items with a cover image proceed

  const breakpointColumnsObj = {
    default: 3,
    900: 2,
    750: 1
  };

  return (
    <div>
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif mb-6 md:mb-8 italic">Dive into my world</h2>
          <p className="text-gray-500 leading-relaxed font-light text-sm md:text-base">
            A curated selection of moments frozen in time, where the raw power of nature meets the delicate silence of the wilderness. From deep mossy forests to sun-drenched canyon rivers.
          </p>
        </div>
      </section>

      <section className="pb-16 md:pb-24 px-4 md:px-12 max-w-[1600px] mx-auto" id="portfolio">
        {portfolioFolders.length > 0 ? (
          <MasonryWrapper
            breakpointCols={breakpointColumnsObj}
            className="flex w-auto gap-4 md:gap-8"
            columnClassName="bg-clip-padding flex flex-col gap-4 md:gap-8"
          >
            {portfolioFolders.map(({ folderKey, coverImageUrl, blurDataURL }, index) => {
              if (!coverImageUrl) return null;
              return (
                <div key={folderKey || index}>
                  <PortfolioCard
                    folderKey={folderKey}
                    coverImageUrl={coverImageUrl}
                    blurDataURL={blurDataURL || ""}
                  />
                </div>
              );
            })}
          </MasonryWrapper>
        ) : (
          <p className="text-center text-red-500">Could not load portfolio items. Please try again later.</p>
        )}
      </section>
    </div>
  );
}
