/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // ajuste para o valor necessário
    },
  },
};

module.exports = nextConfig;
