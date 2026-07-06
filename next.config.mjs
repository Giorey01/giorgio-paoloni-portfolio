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
      {
        protocol: "https",
        hostname: "via.placeholder.com",
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
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https:;",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
