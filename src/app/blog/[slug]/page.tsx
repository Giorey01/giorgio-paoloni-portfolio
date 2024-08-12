import React from "react";
import Markdown from "markdown-to-jsx";
import getPostMetadata from "@/app/utils/getPostMetadata";
import fs from "fs";
import matter from "gray-matter";
import getTitleAndDescMetadata from "@/app/utils/getTitleAndDescMetadata";
import "./markdownpage.css";

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
  const folder = "posts/";
  const file = folder + `${slug}.md`;
  const content = fs.readFileSync(file, "utf-8");

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
  console.log(post);

  return (
    <main>
      <article className="markdown-container">
        <Markdown>{post.content}</Markdown>
      </article>
    </main>
  );
}

export default BlogPage;
