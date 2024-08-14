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

  // Aggiunta dei security headers
  async headers() {
    return [
      {
        // Applica i security headers a tutte le route
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY", // Impedisce che la tua app venga caricata in un iframe
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff", // Previene l'interpretazione dei file come diversi dai loro mime types dichiarati
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()", // Limita le API dei permessi disponibili
          },
        ],
      },
    ];
  },
};

export default nextConfig;
