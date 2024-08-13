import React from "react";
import {
  getFoldersInFolder,
  getFirstImageInFolder,
} from "@/utils/awsS3UtilityFunctions";
import Image from "next/image";
interface S3Object {
  Key: string;
  LastModified: Date;
  ETag: string;
  Size: number;
  StorageClass: string;
}

const Portfolio = async () => {
  // Fetch data from S3
  const folders = await getFoldersInFolder("Portfolio/");

  return (
    <div>
      <h1>My Photography Portfolio</h1>
      <div className="flex flex-col gap-5 items-center border-2 p-5">
        {folders?.map((folder, index) => (
          <div
            key={index}
            className="relative w-full h-64 p-2 border-2 border-black text-center rounded-lg"
          >
            <div className="absolute inset-0">
              <Image
                src="https://images.pexels.com/photos/9956949/pexels-photo-9956949.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Descrizione dell'immagine"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <h2>{folder.Key?.split("/").filter(Boolean).pop()}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};
//
export default Portfolio;
