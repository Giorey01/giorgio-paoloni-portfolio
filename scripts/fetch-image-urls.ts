#!/usr/bin/env ts-node

import { S3Client, ListObjectsV2Command, _Object, ListObjectsV2CommandOutput } from "@aws-sdk/client-s3";
import * as fs from 'fs';
import * as path from 'path';
// Removed static import: import { getPlaiceholder } from "plaiceholder";

// Define the structure for individual image details
interface ImageDetail {
    url: string;
    blurDataURL: string;
}

// Define the overall data structure
interface ImageUrlsByFolderData {
    [folderKey: string]: ImageDetail[];
}

// Environment variables
const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const BUCKET_NAME = "giorgio-paoloni-gallery-storage";

// Default blurDataURL in case of an error
const DEFAULT_BLUR_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="; // 1x1 transparent png

let s3Client: S3Client | undefined;
if (AWS_REGION && AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY) {
    s3Client = new S3Client({
        region: AWS_REGION,
        credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
        },
    });
}

const getImageUrlsByFolder = async (): Promise<ImageUrlsByFolderData> => {
    // Dynamically import getPlaiceholder
    const { getPlaiceholder } = await import("plaiceholder");

    if (!s3Client) {
        console.warn("S3 client not initialized due to missing credentials. Returning empty image list.");
        return {};
    }

    const imageUrlsByFolder: ImageUrlsByFolderData = {};
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    let continuationToken: string | undefined = undefined;

    console.log(`Fetching image list from bucket: ${BUCKET_NAME}`);

    try {
        // Step 1: Collect all image keys by folder
        const allImageItemsByFolder: Record<string, _Object[]> = {};

        do {
            const command: ListObjectsV2Command = new ListObjectsV2Command({
                Bucket: BUCKET_NAME,
                ContinuationToken: continuationToken,
            });
            const response: ListObjectsV2CommandOutput = await s3Client.send(command);

            if (response.Contents) {
                for (const item of response.Contents) {
                    if (item.Key) {
                        const fileExtension = path.extname(item.Key.toLowerCase());
                        if (imageExtensions.includes(fileExtension)) {
                            const lastSlashIndex = item.Key.lastIndexOf('/');
                            const folderKey = lastSlashIndex > -1 ? item.Key.substring(0, lastSlashIndex + 1) : "/";
                            if (!allImageItemsByFolder[folderKey]) {
                                allImageItemsByFolder[folderKey] = [];
                            }
                            allImageItemsByFolder[folderKey].push(item);
                        }
                    }
                }
            }
            continuationToken = response.NextContinuationToken;
        } while (continuationToken);
        
        console.log(`Found image items in ${Object.keys(allImageItemsByFolder).length} folders. Now processing for blurDataURLs.`);

        // Step 2: Process each image for blurDataURL
        for (const folderKey in allImageItemsByFolder) {
            imageUrlsByFolder[folderKey] = [];
            console.log(`Processing images in folder: ${folderKey}`);
            for (const item of allImageItemsByFolder[folderKey]) {
                if (!item.Key) continue;
                const imageUrl = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${item.Key}`;
                let blurDataURL = DEFAULT_BLUR_DATA_URL;

                try {
                    console.log(`Fetching image for blurDataURL: ${item.Key}`);
                    const fetchResponse = await fetch(imageUrl);
                    if (!fetchResponse.ok) {
                        throw new Error(`Failed to fetch image ${item.Key}: ${fetchResponse.statusText}`);
                    }
                    const arrayBuffer = await fetchResponse.arrayBuffer();
                    const imageBuffer = Buffer.from(arrayBuffer);
                    
                    console.log(`Generating Plaiceholder for: ${item.Key}`);
                    const { base64 } = await getPlaiceholder(imageBuffer, { size: 16 }); // Using small size for faster processing
                    blurDataURL = base64;
                    console.log(`Successfully generated blurDataURL for: ${item.Key}`);
                } catch (e) {
                    console.warn(`Error processing image ${item.Key} for blurDataURL: ${(e as Error).message}. Using default blurDataURL.`);
                }
                imageUrlsByFolder[folderKey].push({ url: imageUrl, blurDataURL });
            }
        }

        const folderCount = Object.keys(imageUrlsByFolder).length;
        if (folderCount > 0) {
            console.log(`Successfully processed images, grouped into ${folderCount} folders with blurDataURLs.`);
        } else {
            console.log("No images found or processed (or S3 fetch was skipped).");
        }
        return imageUrlsByFolder;
    } catch (error) {
        console.error("Error fetching image URLs from S3 or processing images:", error);
        if ((error as Error).name === 'CredentialsProviderError' || (error as Error).message.includes('credentials')) {
            console.warn("Skipping S3 fetch due to credential error. Proceeding with empty image list.");
            return {};
        }
        // For other errors, return empty to allow build to potentially continue with no image data
        return {};
    }
};

const saveImageUrlsToFile = (data: ImageUrlsByFolderData): void => {
    const dataDir = path.join(__dirname, '..', 'src', 'data');
    const filePath = path.join(dataDir, 'image_urls.json');

    console.log(`Attempting to save image data to: ${filePath}`);
    try {
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
            console.log(`Created directory: ${dataDir}`);
        }
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`Successfully saved image data to ${filePath}`);
    } catch (error) {
        console.error(`Error saving image data to file at ${filePath}:`, error);
        process.exit(1); 
    }
};

const main = async () => {
    if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
        console.warn("Warning: AWS region and/or credentials not provided. Skipping S3 fetch and creating an empty image_urls.json.");
        saveImageUrlsToFile({});
        return; 
    }

    if (!s3Client) {
        console.error("Error: S3 client failed to initialize despite credentials being set. Creating empty image_urls.json");
        saveImageUrlsToFile({});
        return;
    }

    try {
        const urlsByFolderWithBlur = await getImageUrlsByFolder();
        saveImageUrlsToFile(urlsByFolderWithBlur);
    } catch (error) { // This catch is mainly for unexpected errors not handled within getImageUrlsByFolder
        console.error("Failed to complete the script due to an unexpected error:", error);
        console.warn("Creating an empty image_urls.json due to the error.");
        saveImageUrlsToFile({});
    }
};

main();
