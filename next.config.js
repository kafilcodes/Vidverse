/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Local images are served directly from public folder
      // Add other external image domains here if needed
    ],
  },
};

module.exports = nextConfig;
