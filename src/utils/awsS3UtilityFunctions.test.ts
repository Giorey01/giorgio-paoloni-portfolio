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
import { getFirstImageFromFolder } from "./awsS3UtilityFunctions";

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
