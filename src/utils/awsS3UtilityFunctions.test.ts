import { expect, test, describe, mock, spyOn, beforeEach } from "bun:test";

const mockSend = mock();

mock.module("@aws-sdk/client-s3", () => {
  return {
    S3Client: class {
      send = mockSend;
    },
    ListObjectsV2Command: class {
      constructor(public params: any) {}
    },
  };
});

// Re-import to ensure it uses the mock
import { getFirstImageFromFolder, getImagesFromFolder } from "./awsS3UtilityFunctions";

describe("getImagesFromFolder", () => {
  beforeEach(() => {
    mockSend.mockClear();
    mockSend.mockImplementation(async () => {
       return { Contents: [] };
    });
  });

  test("should filter and return only direct child objects with non-zero size", async () => {
    mockSend.mockImplementation(async () => {
      return {
        Contents: [
          { Key: "folder/", Size: 0 },
          { Key: "folder/subfolder", Size: 0 },
          { Key: "folder/image1.jpg", Size: 1024 },
          { Key: "folder/image2.png", Size: 2048 },
          { Key: "folder/subfolder/image3.jpg", Size: 4096 },
        ]
      };
    });

    // For prefix "folder", length is 1
    // prefix "folder".split("/") -> ["folder"] (length 1)
    // content "folder/image1.jpg".split("/") -> ["folder", "image1.jpg"] (length 2)
    // 2 === 1 + 1 (true)
    const result = await getImagesFromFolder("folder");

    expect(result).toBeDefined();
    expect(result?.length).toBe(2);
    expect(result?.[0].Key).toBe("folder/image1.jpg");
    expect(result?.[1].Key).toBe("folder/image2.png");
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  test("should throw and log error when S3 client fails", async () => {
    const error = new Error("S3 error");
    mockSend.mockImplementation(async () => {
      throw error;
    });

    const consoleSpy = spyOn(console, "error").mockImplementation(() => {});

    try {
      await expect(getImagesFromFolder("folder/")).rejects.toThrow("S3 error");
      expect(consoleSpy).toHaveBeenCalledWith("Error fetching objects:", error);
    } finally {
      consoleSpy.mockRestore();
    }
  });
});

describe("getFirstImageFromFolder", () => {
  beforeEach(() => {
    mockSend.mockClear();
    mockSend.mockImplementation(async () => {
       return { Contents: [] };
    });
  });

  test("should return the first non-zero size object", async () => {
    mockSend.mockImplementation(async () => {
      return {
        Contents: [
          { Key: "folder/", Size: 0 },
          { Key: "folder/image.jpg", Size: 1024 },
        ]
      };
    });

    const result = await getFirstImageFromFolder("folder/");
    expect(result?.Key).toBe("folder/image.jpg");
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  test("should throw and log error when S3 client fails", async () => {
    const error = new Error("S3 error");
    mockSend.mockImplementation(async () => {
      throw error;
    });

    const consoleSpy = spyOn(console, "error").mockImplementation(() => {});

    try {
      await expect(getFirstImageFromFolder("folder/")).rejects.toThrow("S3 error");
      expect(consoleSpy).toHaveBeenCalledWith("Error fetching objects:", error);
    } finally {
      consoleSpy.mockRestore();
    }
  });
});
