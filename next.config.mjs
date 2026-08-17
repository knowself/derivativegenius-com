import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(process.cwd(), 'src'),
    };
    return config;
  },
  // Keep an explicit (empty) turbopack config to avoid errors when Turbopack
  // is the default bundler in Next.js environments like Vercel.
  turbopack: {},
};

// Allow next/image to load YouTube thumbnails used by `LazyYouTube`
nextConfig.images = nextConfig.images || {};
nextConfig.images.domains = Array.from(new Set([...(nextConfig.images.domains || []), "i.ytimg.com"]));

export default nextConfig;
