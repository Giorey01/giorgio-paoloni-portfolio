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
  const posts: PostMetadata[] = await getPostMetadata("posts");
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

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

function BlogPage({ params }: BlogPageProps) {
  const { slug } = params;
  const post = getPostContent(slug);

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <Link
        href="/blog"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-8 font-medium"
      >
        <FaArrowLeft className="mr-2" /> Torna al Blog
      </Link>

      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          {post.data.title.replace(/_/g, " ")}
        </h1>
        <div className="flex items-center text-gray-500 text-sm">
          <span>{post.data.date}</span>
          <span className="mx-2">•</span>
          <span>{Math.ceil(post.content.split(' ').length / 200)} min lettura</span>
        </div>
      </header>

      {post.data.thumbnail && (
        <div className="relative w-full aspect-video mb-12 rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={post.data.thumbnail}
            alt={post.data.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <article className="markdown-container prose prose-lg max-w-none">
        <Markdown
          options={{
            overrides: {
              img: {
                component: ({ src, alt }) => (
                  <div className="my-10 flex flex-col items-center">
                    <div className="relative w-full max-w-2xl aspect-auto">
                       <img
                        src={src}
                        alt={alt}
                        className="rounded-xl shadow-md w-full h-auto"
                      />
                    </div>
                    {alt && <p className="mt-3 text-sm text-gray-500 italic">{alt}</p>}
                  </div>
                ),
              },
              h1: { component: ({children}) => <h1 className="text-3xl font-bold mt-12 mb-6">{children}</h1> },
              h2: { component: ({children}) => <h2 className="text-2xl font-bold mt-10 mb-5">{children}</h2> },
              p: { component: ({children}) => <p className="text-gray-700 leading-relaxed mb-6">{children}</p> },
              ul: { component: ({children}) => <ul className="list-disc ml-6 mb-6 space-y-2">{children}</ul> },
              li: { component: ({children}) => <li className="text-gray-700">{children}</li> },
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
