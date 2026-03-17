/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    domains: ['localhost', 'amnafi.net', 'api.amnafi.net'],
  },
}

module.exports = nextConfig