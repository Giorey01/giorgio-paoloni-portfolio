import {
  S3Client,
  ListObjectsV2CommandInput,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { unstable_cache } from "next/cache";

const BUCKET_NAME = "giorgio-paoloni-gallery-storage";

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Funzione per ottenere tutti gli oggetti in una cartella specifica
export const getFoldersInFolder = unstable_cache(
  async (prefix: string) => {
    const params: ListObjectsV2CommandInput = {
      Bucket: BUCKET_NAME,
      Prefix: prefix,
    };

    const command = new ListObjectsV2Command(params);

    try {
      const response = await client.send(command);
      return response.Contents?.filter(
        (content) =>
          content.Key?.split("/").length === prefix.split("/").length + 1 &&
          content.Size === 0
      );
    } catch (error) {
      console.error("Error fetching objects:", error);
      throw error;
    }
  },
  ["s3-folders"],
  {
    revalidate: 3600, // Cache for 1 hour by default or adjust as needed
    tags: ["s3-folders"],
  }
);

export const getFirstImageFromFolder = unstable_cache(
  async (prefix: string) => {
    const params: ListObjectsV2CommandInput = {
      Bucket: BUCKET_NAME,
      Prefix: prefix,
      MaxKeys: 2,
    };
    const command = new ListObjectsV2Command(params);

    try {
      const response = await client.send(command);
      return response.Contents?.find((content) => content.Size !== 0);
    } catch (error) {
      console.error("Error fetching objects:", error);
      throw error;
    }
  },
  ["s3-first-image"],
  {
    revalidate: 3600,
    tags: ["s3-images"],
  }
);

export const getImagesFromFolder = unstable_cache(
  async (prefix: string) => {
    const params: ListObjectsV2CommandInput = {
      Bucket: BUCKET_NAME,
      Prefix: prefix,
    };

    const command = new ListObjectsV2Command(params);
    try {
      const response = await client.send(command);
      return response.Contents?.filter(
        (content) =>
          content.Key?.split("/").length === prefix.split("/").length + 1 &&
          content.Size != 0
      );
    } catch (error) {
      console.error("Error fetching objects:", error);
      throw error;
    }
  },
  ["s3-images"],
  {
    revalidate: 3600,
    tags: ["s3-images"],
  }
);
