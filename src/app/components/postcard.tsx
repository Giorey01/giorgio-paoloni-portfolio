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
    <div className="h-64 w-64 flex flex-col text-center items-center p-2">
      <h4 className="text-xl font-bold">{post.title}</h4>
      <p>{post.date}</p>
      <Image src={post.thumbnail} alt="peppa" width={150} height={150} />
    </div>
  );
}

export default PostCard;
