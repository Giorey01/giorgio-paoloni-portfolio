import { expect, test, describe, spyOn, beforeEach, afterEach } from "bun:test";
import fs from "fs";
import getPostMetadata from "./getPostMetadata";

describe("getPostMetadata", () => {
  let readdirSpy: ReturnType<typeof spyOn>;
  let readFileSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    readdirSpy = spyOn(fs.promises, "readdir" as any);
    readFileSpy = spyOn(fs.promises, "readFile" as any);
  });

  afterEach(() => {
    readdirSpy.mockRestore();
    readFileSpy.mockRestore();
  });

  test("should return post metadata for markdown files and ignore other files", async () => {
    readdirSpy.mockResolvedValue(["post1.md", "post2.md", "image.jpg", "document.pdf"] as any);

    readFileSpy.mockImplementation(async (path: any) => {
      if (path === "posts/post1.md") {
        return `---
title: "Post 1"
date: "2023-01-01"
desc: "Description 1"
thumbnail: "thumb1.jpg"
---
Content 1`;
      }
      if (path === "posts/post2.md") {
        return `---
title: "Post 2"
date: "2023-01-02"
desc: "Description 2"
thumbnail: "thumb2.jpg"
---
Content 2`;
      }
      return "";
    });

    const result = await getPostMetadata("posts");

    expect(result).toHaveLength(2);

    expect(result[0]).toEqual({
      title: "Post 1",
      date: "2023-01-01",
      desc: "Description 1",
      thumbnail: "thumb1.jpg",
      slug: "post1",
    });

    expect(result[1]).toEqual({
      title: "Post 2",
      date: "2023-01-02",
      desc: "Description 2",
      thumbnail: "thumb2.jpg",
      slug: "post2",
    });

    expect(readdirSpy).toHaveBeenCalledWith("posts/");
    expect(readFileSpy).toHaveBeenCalledTimes(2);
    expect(readFileSpy).toHaveBeenCalledWith("posts/post1.md", "utf-8");
    expect(readFileSpy).toHaveBeenCalledWith("posts/post2.md", "utf-8");
  });

  test("should handle an empty directory", async () => {
    readdirSpy.mockResolvedValue([] as any);

    const result = await getPostMetadata("posts");

    expect(result).toHaveLength(0);
    expect(readdirSpy).toHaveBeenCalledWith("posts/");
    expect(readFileSpy).not.toHaveBeenCalled();
  });

  test("should throw an error if the directory does not exist", async () => {
    const error = new Error("Directory not found");
    readdirSpy.mockRejectedValue(error);

    await expect(getPostMetadata("non-existent-folder")).rejects.toThrow("Directory not found");
    expect(readdirSpy).toHaveBeenCalledWith("non-existent-folder/");
    expect(readFileSpy).not.toHaveBeenCalled();
  });

  test("should handle missing frontmatter fields gracefully", async () => {
    readdirSpy.mockResolvedValue(["incomplete.md"] as any);

    readFileSpy.mockImplementation(async () => {
      return `---
title: "Incomplete Post"
---
Content`;
    });

    const result = await getPostMetadata("posts");

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      title: "Incomplete Post",
      date: undefined,
      desc: undefined,
      thumbnail: undefined,
      slug: "incomplete",
    });
  });
});
