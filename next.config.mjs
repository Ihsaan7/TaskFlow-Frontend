/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },
  allowedDevOrigins: [
    '*.replit.dev',
    '*.pike.replit.dev',
    '*.repl.co',
  ],
};

export default nextConfig;
