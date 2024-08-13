import {
  S3Client,
  ListObjectsV2CommandInput,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

const BUCKET_NAME = "giorgio-paoloni-gallery-storage";

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Funzione per ottenere tutti gli oggetti in una cartella specifica
export const getFoldersInFolder = async (prefix: string) => {
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
};

export const getFirstImageInFolder = async (prefix: string) => {
  const params: ListObjectsV2CommandInput = {
    Bucket: BUCKET_NAME,
    Prefix: prefix,
    MaxKeys: 1,
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
};
