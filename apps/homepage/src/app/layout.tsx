import type { Metadata, Viewport } from 'next'
import { AppShell } from '../components/app-shell'
import './globals.css'

export const metadata: Metadata = {
  title: 'html-shutter — Pixel-accurate DOM element screenshots',
  description:
    'Capture any live HTML element as a pixel-accurate PNG screenshot. Clone DOM, inline computed styles, rasterize through SVG, and export data URLs, downloads, or clipboard copy.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
  },
  keywords: [
    'html-shutter',
    'screenshot',
    'dom to image',
    'html to png',
    'react-screenshot',
    'svg rasterize',
    'element capture',
  ],
  authors: [{ name: 'html-shutter contributors' }],
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#18181b' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark light" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  try {
    var saved = localStorage.getItem('html-shutter-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = saved === 'light' || saved === 'dark' ? saved : (prefersDark ? 'dark' : 'light');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    var meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.content = theme;
  } catch(e){}
})();`,
          }}
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
