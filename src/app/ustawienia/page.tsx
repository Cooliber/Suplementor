'use client'

import { User, Bell, Shield, Palette, Database } from 'lucide-react'
import { useState, useEffect } from 'react';

/**
 *
 */
export default function UstawieniaPage() {
  const [language, setLanguage] = useState('pl');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
  }, [language]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header is already in layout */}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ustawienia aplikacji
          </h1>
          <p className="text-xl text-gray-600">
            Konfiguruj swoją aplikację NeuroRegulacja zgodnie z preferencjami
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* User Profile Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-indigo-600" />
              Profil użytkownika
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imię</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Wpisz swoje imię"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Wiek</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Wpisz swój wiek"
                />
              </div>
            </div>
            <button className="mt-4 bg-indigo-600 text-white rounded-md px-4 py-2 hover:bg-indigo-700 transition-colors">
              Zapisz profil
            </button>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-indigo-600" />
              Powiadomienia
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Przypomnienia o suplementach</p>
                  <p className="text-sm text-gray-600">Otrzymuj powiadomienia o czasie suplementacji</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Aktualizacje postępu</p>
                  <p className="text-sm text-gray-600">Cotygodniowe podsumowania postęp</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-indigo-600" />
              Prywatność i bezpieczeństwo
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Udostępnianie danych</p>
                  <p className="text-sm text-gray-600">Anonimowe udostępnianie danych do badań</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Palette className="h-5 w-5 mr-2 text-indigo-600" />
              Wygląd aplikacji
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-2">Język</label>
                <select
                  id="language-select"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Database className="h-5 w-5 mr-2 text-indigo-600" />
              Zarządzanie danymi
            </h3>
            <div className="space-y-4">
              <button className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition-colors">
                Eksportuj dane
              </button>
              <button className="bg-yellow-600 text-white rounded-md px-4 py-2 hover:bg-yellow-700 transition-colors ml-2">
                Resetuj postępy
              </button>
              <button className="bg-red-600 text-white rounded-md px-4 py-2 hover:bg-red-700 transition-colors ml-2">
                Usuń wszystkie dane
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}