/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance and Production Optimizations
  poweredByHeader: false,
  generateEtags: true,
  compress: true,
  
  // Image optimization for Vercel deployment
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Production bundle optimization
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'lucide-react', '@firebase/app', '@firebase/database'],
    turbo: {
      loaders: {
        '.glb': ['file-loader'],
        '.gltf': ['file-loader'],
        '.png': ['file-loader']
      }
    },
    esmExternals: false,
  },
  
  // Security headers for production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  },
  
  // Webpack optimizations for production
  webpack: (config, { isServer, dev }) => {
    // Production optimizations
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        sideEffects: false,
        usedExports: true,
      };
    }
    
    // Handle .glb and .gltf files
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/assets/[name].[hash][ext]'
      }
    });
    
    // Handle .png files with optimization
    config.module.rules.push({
      test: /\.png$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/images/[name].[hash][ext]'
      }
    });

    // Optimize bundle splitting
    if (!isServer && !dev) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          animations: {
            name: 'animations',
            test: /[\\/]node_modules[\\/](framer-motion|@lottiefiles)[\\/]/,
            chunks: 'all',
            priority: 10,
          },
          firebase: {
            name: 'firebase',
            test: /[\\/]node_modules[\\/](@firebase|firebase)[\\/]/,
            chunks: 'all',
            priority: 10,
          },
        },
      };
    }

    return config;
  }
};

export default nextConfig;
