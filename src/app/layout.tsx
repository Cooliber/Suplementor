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
  description:
    'Aplikacja do monitorowania neuroregulacji i suplementacji wspierającej zdrowie mózgu'
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
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center">
                  <Link href="/" className="flex items-center">
                    <Brain className="mr-3 h-8 w-8 text-indigo-600" />
                    <h1 className="text-2xl font-bold text-gray-900">NeuroRegulacja</h1>
                  </Link>
                </div>
                <nav className="hidden space-x-6 md:flex">
                  <Link
                    href="/"
                    className="font-medium text-gray-700 hover:text-indigo-600"
                  >
                    Panel Główny
                  </Link>
                  <Link
                    href="/suplementy"
                    className="font-medium text-gray-700 hover:text-indigo-600"
                  >
                    Suplementy
                  </Link>
                  <Link
                    href="/stos"
                    className="font-medium text-gray-700 hover:text-indigo-600"
                  >
                    Stosy
                  </Link>
                  <Link
                    href="/protokoly"
                    className="font-medium text-gray-700 hover:text-indigo-600"
                  >
                    Protokoły
                  </Link>
                  <Link
                    href="/wiedza"
                    className="font-medium text-gray-700 hover:text-indigo-600"
                  >
                    Wiedza
                  </Link>
                  <Link
                    href="/badania"
                    className="font-medium text-gray-700 hover:text-indigo-600"
                  >
                    Badania
                  </Link>
                  <Link
                    href="/enhanced-dashboard"
                    className="font-medium text-gray-700 hover:text-indigo-600"
                  >
                    Dashboard Pro
                  </Link>
                  <Link
                    href="/knowledge"
                    className="font-medium text-gray-700 hover:text-indigo-600"
                  >
                    Baza Wiedzy
                  </Link>
                  <Link
                    href="/tracker"
                    className="font-medium text-gray-700 hover:text-indigo-600"
                  >
                    Tracker Pro
                  </Link>
                  <Link
                    href="/narzedzia"
                    className="font-medium text-gray-700 hover:text-indigo-600"
                  >
                    Narzędzia
                  </Link>
                  <Link
                    href="/spolecznosc"
                    className="font-medium text-gray-700 hover:text-indigo-600"
                  >
                    Społeczność
                  </Link>
                  <Link
                    href="/uklad-resistance"
                    className="font-medium text-gray-700 hover:text-indigo-600"
                  >
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
