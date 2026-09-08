import type { Metadata, Viewport } from 'next';
import { Archivo, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import { siteConfig } from '@/data/siteConfig';
import { withBasePath } from '@/lib/utils';
import GrainOverlay from '@/components/GrainOverlay';
import CustomCursor from '@/components/CustomCursor';
import './globals.css';

const grotesk = Archivo({
  subsets: ['latin'],
  variable: '--font-grotesk',
  display: 'swap',
});

const editorial = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-editorial',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.role}`,
  description: siteConfig.description,
  icons: {
    icon: withBasePath('/favicon.svg'),
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${editorial.variable} ${mono.variable}`}>
      <body className="bg-canvas text-ink font-sans antialiased selection:bg-accent selection:text-canvas">
        <GrainOverlay />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
