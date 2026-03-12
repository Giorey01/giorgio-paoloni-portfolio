import {
  S3Client,
  ListObjectsV2CommandInput,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { unstable_cache } from "next/cache";

const BUCKET_NAME = "giorgio-paoloni-gallery-storage";

let client: S3Client;

export const getClient = () => {
  if (!client) {
    client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }
  return client;
};

// Funzione per ottenere tutti gli oggetti in una cartella specifica
export const getFoldersInFolder = unstable_cache(
  async (prefix: string) => {
    const params: ListObjectsV2CommandInput = {
      Bucket: BUCKET_NAME,
      Prefix: prefix,
    };

    const command = new ListObjectsV2Command(params);

  try {
    const response = await getClient().send(command);
    return response.Contents?.filter(
      (content) =>
        content.Key?.split("/").length === prefix.split("/").length + 1 &&
        content.Size === 0
    );
  } catch (error) {
    console.error("Error fetching objects:", error);
    throw error;
  }
});

export const getFirstImageFromFolder = unstable_cache(
  async (prefix: string) => {
    const params: ListObjectsV2CommandInput = {
      Bucket: BUCKET_NAME,
      Prefix: prefix,
      MaxKeys: 2,
    };
    const command = new ListObjectsV2Command(params);

  try {
    const response = await getClient().send(command);
    return response.Contents?.find((content) => content.Size !== 0);
  } catch (error) {
    console.error("Error fetching objects:", error);
    throw error;
  }
});

export const getImagesFromFolder = unstable_cache(
  async (prefix: string) => {
    const params: ListObjectsV2CommandInput = {
      Bucket: BUCKET_NAME,
      Prefix: prefix,
    };

  const command = new ListObjectsV2Command(params);
  try {
    const response = await getClient().send(command);
    return response.Contents?.filter(
      (content) =>
        content.Key?.split("/").length === prefix.split("/").length + 1 &&
        content.Size != 0
    );
  } catch (error) {
    console.error("Error fetching objects:", error);
    throw error;
  }
});
