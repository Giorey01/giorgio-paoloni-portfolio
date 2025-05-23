#!/usr/bin/env ts-node

import { S3Client, ListObjectsV2Command, _Object, ListObjectsV2CommandOutput } from "@aws-sdk/client-s3";
import * as fs from 'fs';
import * as path from 'path';

// Environment variables
const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const BUCKET_NAME = "giorgio-paoloni-gallery-storage";

// Initialize S3 Client - this might remain unused if creds are missing, which is fine.
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

const getImageUrlsByFolder = async (): Promise<Record<string, string[]>> => {
    if (!s3Client) { // Should not be called if s3Client is not initialized
        console.warn("S3 client not initialized due to missing credentials. Returning empty image list.");
        return {};
    }

    const imageUrlsByFolder: Record<string, string[]> = {};
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    let continuationToken: string | undefined = undefined;

    console.log(`Fetching image URLs from bucket: ${BUCKET_NAME}`);

    try {
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
                            const imageUrl = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${item.Key}`;
                            const lastSlashIndex = item.Key.lastIndexOf('/');
                            const folderKey = lastSlashIndex > -1 ? item.Key.substring(0, lastSlashIndex + 1) : "/";

                            if (!imageUrlsByFolder[folderKey]) {
                                imageUrlsByFolder[folderKey] = [];
                            }
                            imageUrlsByFolder[folderKey].push(imageUrl);
                            console.log(`Found image: ${imageUrl} in folder: ${folderKey}`);
                        }
                    }
                }
            }
            continuationToken = response.NextContinuationToken;
        } while (continuationToken);

        const folderCount = Object.keys(imageUrlsByFolder).length;
        if (folderCount > 0) {
            console.log(`Successfully fetched image URLs, grouped into ${folderCount} folders.`);
        } else {
            console.log("No images found matching the criteria (or S3 fetch was skipped).");
        }
        return imageUrlsByFolder;
    } catch (error) {
        console.error("Error fetching image URLs from S3:", error);
        // Don't re-throw if it's a credential issue, allow build to proceed with empty/mock data
        if ((error as Error).name === 'CredentialsProviderError' || (error as Error).message.includes('credentials')) {
            console.warn("Skipping S3 fetch due to credential error. Proceeding with empty image list.");
            return {};
        }
        throw error; // Re-throw for other errors
    }
};

const saveImageUrlsToFile = (urlsByFolder: Record<string, string[]>): void => {
    const dataDir = path.join(__dirname, '..', 'src', 'data');
    const filePath = path.join(dataDir, 'image_urls.json');

    console.log(`Attempting to save image URLs to: ${filePath}`);

    try {
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
            console.log(`Created directory: ${dataDir}`);
        }
        fs.writeFileSync(filePath, JSON.stringify(urlsByFolder, null, 2));
        console.log(`Successfully saved image URLs to ${filePath}`);
    } catch (error) {
        console.error(`Error saving image URLs to file at ${filePath}:`, error);
        process.exit(1); 
    }
};

const main = async () => {
    if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
        console.warn("Warning: AWS region and/or credentials not provided. Skipping S3 fetch and creating an empty image_urls.json.");
        saveImageUrlsToFile({}); // Save an empty object
        // process.exit(0); // Allow the build to continue - NO, the script should always exit naturally for `&& next build`
        return; // Exit main function, script will terminate successfully
    }

    // Credentials are provided, proceed with S3 fetch
    if (!s3Client) { // Should theoretically be initialized if creds are present, but as a safeguard:
        console.error("Error: S3 client failed to initialize despite credentials being set. Creating empty image_urls.json");
        saveImageUrlsToFile({});
        return;
    }

    try {
        const urlsByFolder = await getImageUrlsByFolder();
        // Check if urlsByFolder has any content, even if empty, saveImageUrlsToFile should run
        saveImageUrlsToFile(urlsByFolder);
    } catch (error) {
        console.error("Failed to complete the script due to an error during S3 operations:", error);
        // In case of error during getImageUrlsByFolder (other than creds), save empty and exit to allow build
        console.warn("Creating an empty image_urls.json due to error during S3 fetch.");
        saveImageUrlsToFile({});
        // process.exit(1); // Indicate failure if we intended to get data but couldn't for other reasons
                           // For CI, might be better to let build continue with empty JSON.
    }
};

main();
