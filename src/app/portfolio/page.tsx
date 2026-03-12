import React from "react";
import { getFoldersWithThumbnails } from "@/utils/awsS3UtilityFunctions";
import PortfolioCard from "@/components/portfoliocard";

const Portfolio = async () => {
  // Fetch data from S3 using optimized function
  const foldersWithThumbnails = await getFoldersWithThumbnails("Portfolio/");

  return (
    <div>
      <h1 className="text-3xl text-center font-bold p-10 lg:p-16">
        Dive into my world
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center p-4 md:p-8 lg:p-14">
        {foldersWithThumbnails?.map(({ folder, firstImage }, index) => {
          return <PortfolioCard key={index} folder={folder} imageObject={firstImage} />;
        })}
      </div>
    </div>
  );
};
//
export default Portfolio;
