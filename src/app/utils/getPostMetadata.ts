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
export default function getPostMetadata(basePath: string): PostMetadata[] {
  const folder = basePath + "/";
  const files = fs.readdirSync(folder);
  const markdownPosts = files.filter((file) => file.endsWith(".md"));

  const posts: PostMetadata[] = markdownPosts.map((filename) => {
    const fileContents = fs.readFileSync(`${basePath}/${filename}`, "utf-8");
    const matterResult = matter(fileContents);

    return {
      title: matterResult.data.title as string,
      date: matterResult.data.date as string,
      desc: matterResult.data.desc as string,
      thumbnail: matterResult.data.thumbnail as string,
      slug: filename.replace(".md", ""),
    };
  });

  return posts;
}
