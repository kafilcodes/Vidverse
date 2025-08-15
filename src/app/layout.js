import "./globals.css";
import ParticleBackground from "@/components/ParticleBackground";
import FirefliesBackground from "@/components/FirefliesBackground";
import AppInitializer from '@/components/AppInitializer';

export const metadata = {
  title: 'VidVerse | Organic Content Engine for Entrepreneurs & VCs',
  description: 'VidVerse offers a powerful organic content engine for entrepreneurs and VCs, designed to scale your brand with high-quality video content and strategic distribution.',
  keywords: ['video content', 'organic marketing', 'content engine', 'SaaS for entrepreneurs', 'VC portfolio support', 'content creation', 'brand scaling'],
  icons: {
    icon: [
      { url: '/logo/vidverse.svg', sizes: '32x32', type: 'image/png' },
      { url: '/logo/vidverse.svg', sizes: '16x16', type: 'image/png' }
    ],
    shortcut: '/logo/vidverse.svg',
    apple: '/logo/vidverse.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="font-grift bg-background text-foreground">
        <ParticleBackground />
        <AppInitializer>
          <div className="relative z-10">
            {children}
          </div>
        </AppInitializer>
      </body>
    </html>
  );
}
