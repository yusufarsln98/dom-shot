'use client'

import { ThemeProvider } from './theme-provider'
import { Navbar } from './navbar'
import { Footer } from './footer'
import { CaptureToastContainer } from './capture-toast'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-bg-app text-text-primary transition-colors duration-150">
        <Navbar />
        <main className="flex-1 w-full flex flex-col">{children}</main>
        <Footer />
        <CaptureToastContainer />
      </div>
    </ThemeProvider>
  )
}
