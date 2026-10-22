import type { Metadata, Viewport } from 'next'
import { AppShell } from '../components/app-shell'
import './globals.css'

export const metadata: Metadata = {
  title: 'html-shutter — Pixel-accurate DOM element screenshots',
  description:
    'Capture any live HTML element as a pixel-accurate PNG screenshot. Clone DOM, inline computed styles, rasterize through SVG, and export data URLs, downloads, or clipboard copy.',
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
    { media: '(prefers-color-scheme: light)', color: '#f5f7fb' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1020' },
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
    var isDark = saved === 'dark' || (!saved && prefersDark) || (!saved && !prefersDark ? false : isDark);
    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
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
