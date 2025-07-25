/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.29.119'],
  
  // Turbopack configuration for .glb and .png files
  experimental: {
    turbo: {
      loaders: {
        '.glb': ['file-loader'],
        '.gltf': ['file-loader'],
        '.png': ['file-loader']
      }
    },
    esmExternals: false
  },
  
  // Regular webpack configuration as fallback
  webpack: (config, { isServer, dev }) => {
    // Handle .glb and .gltf files
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/assets/[name].[hash][ext]'
      }
    });
    
    // Handle .png files
    config.module.rules.push({
      test: /\.png$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/images/[name].[hash][ext]'
      }
    });

    return config;
  }
};

export default nextConfig;
