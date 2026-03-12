import React from "react";
import Markdown from "markdown-to-jsx";
import getPostMetadata from "@/utils/getPostMetadata";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import getTitleAndDescMetadata from "@/utils/getTitleAndDescMetadata";
import "./markdownpage.css";
import Image from "next/image";

// Definisce l'interfaccia per i metadati del post
interface PostMetadata {
  title: string;
  date: string;
  desc: string;
  thumbnail: string;
  slug: string;
}

// Funzione per ottenere il contenuto del post usando lo slug
function getPostContent(slug: string) {
  // Sanitize the slug: only allow alphanumeric characters, hyphens, and underscores
  if (!/^[a-zA-Z0-9-_]+$/.test(slug)) {
    throw new Error("Invalid slug: restricted characters detected.");
  }

  const postsDirectory = path.resolve(process.cwd(), "posts");
  const filePath = path.resolve(postsDirectory, `${slug}.md`);

  // Double check that the resolved path is within the posts directory
  if (!filePath.startsWith(postsDirectory + path.sep)) {
    throw new Error("Invalid slug: path traversal detected.");
  }

  const content = fs.readFileSync(filePath, "utf-8");

  const matterResult = matter(content);
  return matterResult;
}

// Genera i parametri statici per il pre-rendering delle pagine
export const generateStaticParams = async () => {
  const posts: PostMetadata[] = getPostMetadata("posts");
  return posts.map((post) => ({ slug: post.slug }));
};

// Genera i metadati per ogni pagina dinamica
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const id = params?.slug ? ` · ${params.slug.replaceAll("_", " ")}` : "";
  return {
    title: `${getTitleAndDescMetadata().title + id}`,
  };
}

// Definisce l'interfaccia per i props del componente BlogPage
interface BlogPageProps {
  params: {
    slug: string;
  };
}

function BlogPage({ params }: BlogPageProps) {
  const { slug } = params;
  const post = getPostContent(slug);

  return (
    <main>
      <article className="markdown-container">
        <Markdown
          options={{
            overrides: {
              img: {
                component: ({ src, alt }) => (
                  <div className="image-wrapper">
                    <Image
                      src={src}
                      alt={alt}
                      width={400} // Definisci una larghezza fissa per le immagini
                      height={400} // Definisci un'altezza fissa per le immagini
                      className="custom-image"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCACUAN4DASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAECBf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A7igAAAoAAoAAAAAACKAgAIKgCKgAACKAgANAAAoAACgACgAAIoCCoAigIigIACCoAAAACigAACgAqKAAAKAgoCAAgqAgqAIqAIoCAAAA0AACgAAoACgAAAAAioAigIACAAgACKgAANAAKgCgAoAKIoAAAACAACAAgAIAAAgAAA0IAoAKIoCoAoigKgAAAIAAgAIAAAgAAgKIA0IoAAKIAqoAogCiAKIAqCAogAIAAgKgAAgKIA0AAACiAKIAoAAAAgCiAAICoAAgAAACAogDQAAAKIAoAAAAAAgAAACAAAAgAAAAAANAAAAAAKAAACAAAAACAAAAgAAAAACAD//Z"
                    />
                  </div>
                ),
              },
            },
          }}
        >
          {post.content}
        </Markdown>
      </article>
    </main>
  );
}

export default BlogPage;
