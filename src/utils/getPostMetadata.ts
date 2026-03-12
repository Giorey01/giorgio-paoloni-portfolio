import fs from "fs";
import matter from "gray-matter";

// Definisci un'interfaccia per il tipo di metadati dei post
interface PostMetadata {
  title: string;
  date: string;
  desc: string;
  thumbnail: string;
  slug: string;
}

// Tipizza la funzione
export default async function getPostMetadata(basePath: string): Promise<PostMetadata[]> {
  const folder = basePath + "/";
  const files = await fs.promises.readdir(folder);
  const markdownPosts = files.filter((file) => file.endsWith(".md"));

  const posts: PostMetadata[] = await Promise.all(
    markdownPosts.map(async (filename) => {
      const fileContents = await fs.promises.readFile(`${basePath}/${filename}`, "utf-8");
      const matterResult = matter(fileContents);

      return {
        title: matterResult.data.title as string,
        date: matterResult.data.date as string,
        desc: matterResult.data.desc as string,
        thumbnail: matterResult.data.thumbnail as string,
        slug: filename.replace(".md", ""),
      };
    })
  );

  return posts;
}
