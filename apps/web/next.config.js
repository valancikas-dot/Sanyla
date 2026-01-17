/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@marketing-autopilot/shared'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs', 'net', 'tls', 'dns', 'pg' on the client-side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        pg: false,
        'pg-native': false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
