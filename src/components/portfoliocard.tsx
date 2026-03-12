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
      <div className="space-y-4 group">
        <div className="relative overflow-hidden bg-gray-100 image-hover-container">
          <Image
            src={coverImageUrl}
            alt={altText}
            width={500}
            height={500}
            placeholder="blur"
            className="w-full h-auto object-cover"
            blurDataURL={blurDataURL}
          />
          <div className="image-overlay absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-500 flex items-center justify-center">
            <span className="text-white text-sm tracking-widest uppercase font-light">View Collection</span>
          </div>
        </div>
        <div className="flex justify-between items-end px-2">
          <h3 className="font-serif italic text-xl text-gallery-dark">{altText}</h3>
          <span className="text-[10px] tracking-widest uppercase text-gray-400">Series</span>
        </div>
      </div>
    </Link>
  );
};

export default PortfolioCard;
