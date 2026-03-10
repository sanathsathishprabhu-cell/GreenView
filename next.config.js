/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static generation for all pages — the app uses Firebase Auth
  // which requires a browser context and cannot run at build time.
  experimental: {
    // force every page to be rendered on-demand (SSR / edge)
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

module.exports = nextConfig;
