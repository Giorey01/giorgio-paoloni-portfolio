import React from "react";
import {
  getFoldersInFolder,
  getFirstImageFromFolder,
} from "@/utils/awsS3UtilityFunctions";
import PortfolioCard from "@/components/portfoliocard";

const Portfolio = async () => {
  // Fetch data from S3
  const folders = await getFoldersInFolder("Portfolio/");

  return (
    <div>
      <h1>My Photography Portfolio</h1>
      <div className="flex flex-col gap-5 items-center p-5">
        {folders?.map((folder, index) => {
          return <PortfolioCard key={index} folder={folder} />;
        })}
      </div>
    </div>
  );
};
//
export default Portfolio;
