/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // appDir is no longer experimental in Next.js 13.4+
  // Using pages directory (default)
  // Enable static optimization for better performance
  trailingSlash: false,
  // Configure headers for API routes
  async headers() {
    return [
      {
        source: '/api/prompts',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300, stale-while-revalidate=60',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
