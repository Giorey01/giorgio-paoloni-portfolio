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
    readdirSpy.mockResolvedValue([
      { isFile: () => true, name: "post1.md" },
      { isFile: () => true, name: "post2.md" },
      { isFile: () => true, name: "image.jpg" },
      { isFile: () => false, name: "document.pdf" }
    ] as any);

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

    expect(readdirSpy).toHaveBeenCalledWith("posts", { withFileTypes: true });
    expect(readFileSpy).toHaveBeenCalledTimes(2);
    expect(readFileSpy).toHaveBeenCalledWith("posts/post1.md", "utf-8");
    expect(readFileSpy).toHaveBeenCalledWith("posts/post2.md", "utf-8");
  });

  test("should handle an empty directory", async () => {
    readdirSpy.mockResolvedValue([] as any);

    const result = await getPostMetadata("posts");

    expect(result).toHaveLength(0);
    expect(readdirSpy).toHaveBeenCalledWith("posts", { withFileTypes: true });
    expect(readFileSpy).not.toHaveBeenCalled();
  });

  test("should not throw an error if the directory does not exist, but return empty array", async () => {
    const error = new Error("Directory not found");
    readdirSpy.mockRejectedValue(error);

    const result = await getPostMetadata("non-existent-folder");
    expect(result).toEqual([]);
    expect(readdirSpy).toHaveBeenCalledWith("non-existent-folder", { withFileTypes: true });
    expect(readFileSpy).not.toHaveBeenCalled();
  });

  test("should handle missing frontmatter fields gracefully by skipping", async () => {
    readdirSpy.mockResolvedValue([{ isFile: () => true, name: "incomplete.md" }] as any);

    readFileSpy.mockImplementation(async () => {
      return `---
title: "Incomplete Post"
---
Content`;
    });

    const result = await getPostMetadata("posts");

    expect(result).toHaveLength(0);
  });
});
