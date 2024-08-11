/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "giorgio-paoloni-gallery-storage.s3.eu-north-1.amazonaws.com",
        pathname: "**", // Matches any path within the bucket
      },
    ],
  },
};
export default nextConfig;
