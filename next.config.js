/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["imagedelivery.net", "videodelivery.net"],
  },
};

module.exports = nextConfig;
