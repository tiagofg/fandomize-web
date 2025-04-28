/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // ajuste para o valor necessário
    },
  },
};

module.exports = nextConfig;
