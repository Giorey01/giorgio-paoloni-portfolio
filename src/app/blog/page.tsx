import React from "react";
import getPostMetadata from "@/utils/getPostMetadata";
import PostCard from "../../components/postcard";

async function Blog() {
  const postMetadata = await getPostMetadata("posts");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {postMetadata.map((post, postIndex) => {
          return <PostCard key={postIndex} post={post} />;
        })}
      </div>
    </div>
  );
}

export default Blog;
