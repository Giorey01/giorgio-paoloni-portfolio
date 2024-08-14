/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "giorgio-paoloni-gallery-storage.s3.eu-north-1.amazonaws.com",
        pathname: "**", // Matches any path within the bucket
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "d321io5nxf2wuu.cloudfront.net",
      },
    ],
  },
};
export default nextConfig;
