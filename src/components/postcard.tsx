import React from "react";
import Link from "next/link";
import Image from "next/image";
interface PostCardProps {
  post: {
    title: string;
    date: string;
    desc: string;
    thumbnail: string;
    slug: string;
  };
}

function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="w-full p-4">
      <div className="border-l-2 border-opacity-65 rounded-r-xl border-[#2F3645] w-100 h-40 flex justify-evenly text-center items-center p-2 gap-1 bg-[#e8e6e3]">
        <div className="flex flex-col text-center">
          <h4 className="text-xl font-bold">{post.title}</h4>
          <p>{post.date}</p>
          <p>{post.desc}</p>
        </div>
        <Image
          src={post.thumbnail}
          className="rounded-sm"
          alt="peppa"
          width={110}
          height={110}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,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"
        />
      </div>
    </Link>
  );
}

export default PostCard;
