/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  experimental: {
    ExternalPackages: ["mongoose"],
  },
};

export default nextConfig;
