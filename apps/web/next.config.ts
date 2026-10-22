import type { NextConfig } from 'next'

const bffUrl = process.env.BFF_URL ?? 'http://127.0.0.1:3001'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${bffUrl}/api/:path*`,
      },
    ]
  },
  async headers() {
    const noStore = [
      { key: 'Cache-Control', value: 'private, no-store, max-age=0, must-revalidate' },
    ]
    return [
      { source: '/cart', headers: noStore },
      { source: '/checkout', headers: noStore },
    ]
  },
}

export default nextConfig
