import React from "react";
import Image from "next/image";
import Link from "next/link";

interface PortfolioCardProps {
  folderKey: string;
  coverImageUrl: string;
  blurDataURL: string; // Added blurDataURL prop
}

const PortfolioCard = ({ folderKey, coverImageUrl, blurDataURL }: PortfolioCardProps) => {
  // Derive alt text from folderKey, e.g., "MyAlbum" from "Portfolio/MyAlbum/"
  const altText = folderKey.split('/').filter(Boolean).pop() || "Portfolio image";

  // Construct href, e.g., "/portfolio/myalbum" from "Portfolio/MyAlbum/"
  const slug = folderKey
    .toLowerCase()
    .replace(/^portfolio\//, "") // Remove "portfolio/" prefix
    .replace(/\/$/, ""); // Remove trailing slash

  const href = `/portfolio/${slug}`;

  return (
    <Link href={href}>
      <div className="relative flex flex-col w-full text-center border-b-2 border-[#2F3645]">
        <Image
          src={coverImageUrl}
          alt={altText}
          width={400}
          height={400}
          placeholder="blur" // Ensure placeholder is still "blur"
          className="rounded-t-lg object-cover aspect-square hover:opacity-100 opacity-75 transition-all duration-300"
          blurDataURL={blurDataURL} // Use the passed blurDataURL prop
        />
        <div className="absolute bottom-0 w-full h-24 bg-[#e8e6e3] flex justify-center items-center">
          <h2 className="text-2xl md:text-3xl font-bold z-10">
            {altText}
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default PortfolioCard;
