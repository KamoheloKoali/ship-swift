/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["jkzditenqjeeconzvnwv.supabase.co"],
  },
  experimental: {
    serverActions: {
        allowedOrigins: ["fantastic-palm-tree-wrrgxpwqrgwxh5g5x-3000.app.github.dev", "localhost:3000"],
    },
},
};

export default nextConfig;
