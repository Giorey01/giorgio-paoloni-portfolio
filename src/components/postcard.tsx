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
      <div className="border-l-2 rounded-r-xl border-[#2F3645] w-full h-40 flex justify-center text-balance items-center p-4 bg-[#e8e6e3]">
        <div className="flex flex-col items-centerh-full">
          <h4 className="text-lg font-bold">{post.title}</h4>
          <p>{post.date}</p>
          <p>{post.desc}</p>
        </div>
        <Image
          src={post.thumbnail}
          className="rounded-md "
          alt="super"
          width={45}
          height={45}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
        />
      </div>
    </Link>
  );
}

export default PostCard;
