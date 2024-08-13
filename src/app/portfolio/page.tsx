import React from "react";
import {
  getFoldersInFolder,
  getFirstImageFromFolder,
} from "@/utils/awsS3UtilityFunctions";
import Image from "next/image";
import Link from "next/link";

const Portfolio = async () => {
  // Fetch data from S3
  const folders = await getFoldersInFolder("Portfolio/");

  return (
    <div>
      <h1>My Photography Portfolio</h1>
      <div className="flex flex-col gap-5 items-center p-5">
        {folders?.map((folder, index) => (
          <div key={index} className="relative w-full h-64 p-2 text-center">
            <Link href={"/" + folder.Key?.toLocaleLowerCase()}>
              <div className="absolute inset-0">
                <Image
                  src="https://images.pexels.com/photos/9956949/pexels-photo-9956949.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Descrizione dell'immagine"
                  fill
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <h2 className="absolute inset-0 flex items-center justify-center text-white font-bold z-10">
                {folder.Key?.split("/").filter(Boolean).pop()}
              </h2>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
//
export default Portfolio;
