import React from "react";
import { getFoldersInFolder } from "@/utils/awsS3UtilityFunctions";
import PortfolioCard from "@/components/portfoliocard";

const Portfolio = async () => {
  // Fetch data from S3
  const folders = await getFoldersInFolder("Portfolio/");

  return (
    <div>
      <h1 className="text-3xl text-center font-bold p-10">
        Dive into my world
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center p-5">
        {folders?.map((folder, index) => {
          return <PortfolioCard key={index} folder={folder} />;
        })}
      </div>
    </div>
  );
};
//
export default Portfolio;
