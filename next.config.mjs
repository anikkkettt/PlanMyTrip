// next.config.mjs
const nextConfig = {
  reactStrictMode: true,
  // Your other configurations...
  
  // Add images configuration to allow all domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  
  // Add webpack configuration to fix memory issues
  webpack: (config, { dev, isServer }) => {
    // Disable persistent caching
    config.cache = false;
    
    // Increase memory limit
    config.performance = {
      ...config.performance,
      maxAssetSize: 1000000,
      maxEntrypointSize: 1000000,
    };
    
    return config;
  },
};

export default nextConfig;