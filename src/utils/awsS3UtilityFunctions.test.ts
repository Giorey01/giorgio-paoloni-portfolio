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
import { getFirstImageFromFolder, getFoldersInFolder } from "./awsS3UtilityFunctions";

describe("getFoldersInFolder", () => {
  beforeEach(() => {
    mockSend.mockClear();
    mockSend.mockImplementation(async () => {
       return { Contents: [] };
    });
  });

  test("should filter objects to return only folders (Size === 0 and correct depth)", async () => {
    mockSend.mockImplementation(async () => {
      return {
        Contents: [
          { Key: "root/folder1/", Size: 0 }, // Depth is 3 (root/folder1/ ""), prefix "root/" depth is 2 (root/ "")
          { Key: "root/folder1/image.jpg", Size: 1024 }, // Size not 0
          { Key: "root/folder1/subfolder/", Size: 0 }, // Depth is 4, prefix "root/" depth is 2, incorrect depth
          { Key: "root/folder2/", Size: 0 }, // Depth is 3
        ]
      };
    });

    const result = await getFoldersInFolder("root/");
    expect(result).toHaveLength(2);
    expect(result?.[0].Key).toBe("root/folder1/");
    expect(result?.[1].Key).toBe("root/folder2/");
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  test("should handle an empty response or no matching folders", async () => {
    mockSend.mockImplementation(async () => {
      return {
        Contents: undefined // Test no Contents array
      };
    });

    let result = await getFoldersInFolder("root/");
    expect(result).toBeUndefined();

    mockSend.mockImplementation(async () => {
      return {
        Contents: [
          { Key: "root/folder1/image.jpg", Size: 1024 }
        ]
      };
    });

    result = await getFoldersInFolder("root/");
    expect(result).toEqual([]);
  });

  test("should log and throw errors when the S3 client fails", async () => {
    const error = new Error("S3 error");
    mockSend.mockImplementation(async () => {
      throw error;
    });

    const consoleSpy = spyOn(console, "error").mockImplementation(() => {});

    try {
      await expect(getFoldersInFolder("root/")).rejects.toThrow("S3 error");
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
