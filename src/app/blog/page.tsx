import React from "react";
import getPostMetadata from "@/utils/getPostMetadata";
import PostCard from "../../components/postcard";

function Blog() {
  const postMetadata = getPostMetadata("posts");

  return (
    <div className="flex flex-col items-center mt-4">
      {postMetadata.map((post, postIndex) => {
        return <PostCard key={postIndex} post={post} />;
      })}
    </div>
  );
}

export default Blog;
