/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Отключаем ESLint во время production build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Игнорируем TypeScript ошибки во время билда
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
