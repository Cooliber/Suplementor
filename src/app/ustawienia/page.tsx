'use client'

import { User, Bell, Shield, Palette, Database } from 'lucide-react'
import { useState, useEffect } from 'react'

/**
 *
 */
export default function UstawieniaPage() {
  const [language, setLanguage] = useState('pl')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage')
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('appLanguage', language)
  }, [language])

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header is already in layout */}

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Ustawienia aplikacji</h1>
          <p className="text-xl text-gray-600">
            Konfiguruj swoją aplikację NeuroRegulacja zgodnie z preferencjami
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* User Profile Settings */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
              <User className="mr-2 h-5 w-5 text-indigo-600" />
              Profil użytkownika
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Imię
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Wpisz swoje imię"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Wiek
                </label>
                <input
                  type="number"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Wpisz swój wiek"
                />
              </div>
            </div>
            <button className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700">
              Zapisz profil
            </button>
          </div>

          {/* Notification Settings */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
              <Bell className="mr-2 h-5 w-5 text-indigo-600" />
              Powiadomienia
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    Przypomnienia o suplementach
                  </p>
                  <p className="text-sm text-gray-600">
                    Otrzymuj powiadomienia o czasie suplementacji
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="peer sr-only" defaultChecked />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-indigo-600 peer-focus:ring-4 peer-focus:ring-indigo-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Aktualizacje postępu</p>
                  <p className="text-sm text-gray-600">
                    Cotygodniowe podsumowania postęp
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="peer sr-only" defaultChecked />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-indigo-600 peer-focus:ring-4 peer-focus:ring-indigo-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
              <Shield className="mr-2 h-5 w-5 text-indigo-600" />
              Prywatność i bezpieczeństwo
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Udostępnianie danych</p>
                  <p className="text-sm text-gray-600">
                    Anonimowe udostępnianie danych do badań
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-indigo-600 peer-focus:ring-4 peer-focus:ring-indigo-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
              <Palette className="mr-2 h-5 w-5 text-indigo-600" />
              Wygląd aplikacji
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="language-select"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Język
                </label>
                <select
                  id="language-select"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={language}
                  onChange={handleLanguageChange}
                  aria-label="Wybierz język aplikacji"
                >
                  <option value="pl">Polski</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
              <Database className="mr-2 h-5 w-5 text-indigo-600" />
              Zarządzanie danymi
            </h3>
            <div className="space-y-4">
              <button className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                Eksportuj dane
              </button>
              <button className="ml-2 rounded-md bg-yellow-600 px-4 py-2 text-white transition-colors hover:bg-yellow-700">
                Resetuj postępy
              </button>
              <button className="ml-2 rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700">
                Usuń wszystkie dane
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
