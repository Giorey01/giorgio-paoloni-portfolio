import { expect, test, describe, mock, spyOn, beforeEach } from "bun:test";

// Mock Next.js unstable_cache before importing
mock.module("next/cache", () => {
  return {
    unstable_cache: (cb: any) => cb,
  };
});

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

  test("should return undefined when no non-zero size objects exist", async () => {
    mockSend.mockImplementation(async () => {
      return {
        Contents: [
          { Key: "folder/", Size: 0 },
          { Key: "folder/subfolder/", Size: 0 },
        ]
      };
    });

    const result = await getFirstImageFromFolder("folder/");
    expect(result).toBeUndefined();
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  test("should return undefined when folder is empty (no Contents)", async () => {
    mockSend.mockImplementation(async () => {
      return {};
    });

    const result = await getFirstImageFromFolder("folder/");
    expect(result).toBeUndefined();
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

describe("getFoldersInFolder", () => {
  beforeEach(() => {
    mockSend.mockClear();
    mockSend.mockImplementation(async () => {
      return { Contents: [] };
    });
  });

  test("should return folders only (size 0 and correct nesting)", async () => {
    mockSend.mockImplementation(async () => {
      return {
        Contents: [
          { Key: "galleries/nature/", Size: 0 }, // Should match: nesting 3, size 0
          { Key: "galleries/nature/image.jpg", Size: 1024 }, // Should not match: size > 0
          { Key: "galleries/nature/subfolder/", Size: 0 }, // Should match: nesting 4, but function looks for prefix length + 1
          { Key: "galleries/", Size: 0 }, // Should not match: wrong nesting
        ],
      };
    });

    const result = await getFoldersInFolder("galleries/");
    expect(result).toHaveLength(1);
    expect(result![0].Key).toBe("galleries/nature/");
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  test("should throw and log error when S3 client fails", async () => {
    const error = new Error("S3 error");
    mockSend.mockImplementation(async () => {
      throw error;
    });

    const consoleSpy = spyOn(console, "error").mockImplementation(() => {});

    try {
      await expect(getFoldersInFolder("galleries/")).rejects.toThrow("S3 error");
      expect(consoleSpy).toHaveBeenCalledWith("Error fetching objects:", error);
    } finally {
      consoleSpy.mockRestore();
    }
  });
});

describe("getImagesFromFolder", () => {
  beforeEach(() => {
    mockSend.mockClear();
    mockSend.mockImplementation(async () => {
      return { Contents: [] };
    });
  });

  test("should return images only (size > 0 and correct nesting)", async () => {
    mockSend.mockImplementation(async () => {
      return {
        Contents: [
          { Key: "galleries/nature/", Size: 0 }, // Should not match: size 0
          { Key: "galleries/nature/image1.jpg", Size: 1024 }, // Should match (split is 3) - Note: getImagesFromFolder has prefix.split('/').length + 1 logic
          { Key: "galleries/nature/image2.jpg", Size: 2048 }, // Should match
          { Key: "galleries/nature/subfolder/image3.jpg", Size: 1024 }, // Should not match: wrong nesting
        ],
      };
    });

    const result = await getImagesFromFolder("galleries/");
    expect(result).toHaveLength(2);
    expect(result![0].Key).toBe("galleries/nature/image1.jpg");
    expect(result![1].Key).toBe("galleries/nature/image2.jpg");
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  test("should throw and log error when S3 client fails", async () => {
    const error = new Error("S3 error");
    mockSend.mockImplementation(async () => {
      throw error;
    });

    const consoleSpy = spyOn(console, "error").mockImplementation(() => {});

    try {
      await expect(getImagesFromFolder("galleries/nature/")).rejects.toThrow("S3 error");
      expect(consoleSpy).toHaveBeenCalledWith("Error fetching objects:", error);
    } finally {
      consoleSpy.mockRestore();
    }
  });
});
