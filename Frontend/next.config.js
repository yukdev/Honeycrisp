/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    COOKIE_NAME: process.env.COOKIE_NAME || 'honeycrisp_cookie',
    SECRET_KEY: process.env.SECRET_KEY || 'secret',
    BASE_URL: process.env.BASE_URL || 'http://localhost:3001',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your_nextauth_secret_here',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http:localhost:3000/',
  },
};

module.exports = nextConfig;
