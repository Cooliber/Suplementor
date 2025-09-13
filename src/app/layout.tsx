import { Brain } from 'lucide-react'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Link from 'next/link'

import './globals.css'
import { env } from '@/env/server.mjs'
import ErrorBoundary from '@/components/error/ErrorBoundary'
import DebugDashboard from '@/components/debug/DebugDashboard'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: `NeuroRegulacja - Suplementacja Mózgu ${env.APP_VERSION}`,
  description: 'Aplikacja do monitorowania neuroregulacji i suplementacji wspierającej zdrowie mózgu'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ErrorBoundary>
          {/* Navigation Header */}
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center">
                  <Link href="/" className="flex items-center">
                    <Brain className="h-8 w-8 text-indigo-600 mr-3" />
                    <h1 className="text-2xl font-bold text-gray-900">NeuroRegulacja</h1>
                  </Link>
                </div>
                <nav className="hidden md:flex space-x-6">
                  <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium">
                    Panel Główny
                  </Link>
                  <Link href="/suplementy" className="text-gray-700 hover:text-indigo-600 font-medium">
                    Suplementy
                  </Link>
                  <Link href="/stos" className="text-gray-700 hover:text-indigo-600 font-medium">
                    Stosy
                  </Link>
                  <Link href="/protokoly" className="text-gray-700 hover:text-indigo-600 font-medium">
                    Protokoły
                  </Link>
                  <Link href="/wiedza" className="text-gray-700 hover:text-indigo-600 font-medium">
                    Wiedza
                  </Link>
                  <Link href="/badania" className="text-gray-700 hover:text-indigo-600 font-medium">
                    Badania
                  </Link>
                  <Link href="/enhanced-dashboard" className="text-gray-700 hover:text-indigo-600 font-medium">
                    Dashboard Pro
                  </Link>
                  <Link href="/knowledge" className="text-gray-700 hover:text-indigo-600 font-medium">
                    Baza Wiedzy
                  </Link>
                  <Link href="/tracker" className="text-gray-700 hover:text-indigo-600 font-medium">
                    Tracker Pro
                  </Link>
                  <Link href="/narzedzia" className="text-gray-700 hover:text-indigo-600 font-medium">
                    Narzędzia
                  </Link>
                  <Link href="/spolecznosc" className="text-gray-700 hover:text-indigo-600 font-medium">
                    Społeczność
                  </Link>
                  <Link href="/uklad-resistance" className="text-gray-700 hover:text-indigo-600 font-medium">
                    Układ Immunologiczny
                  </Link>
                </nav>
              </div>
            </div>
          </header>
          {children}
          <DebugDashboard />
        </ErrorBoundary>
      </body>
    </html>
  )
}
