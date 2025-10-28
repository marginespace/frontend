/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Отключаем ESLint во время production build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Также игнорируем TypeScript ошибки во время билда (опционально)
    // ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
