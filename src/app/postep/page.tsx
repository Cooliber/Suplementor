import { ArrowLeft, TrendingUp, Brain, Heart, Activity, Calendar, Target } from 'lucide-react'
import Link from 'next/link'

interface DailyEntry {
  date: string
  concentration: number
  memory: number
  energy: number
  mood: number
  sleep: number
  supplements: number
}

const mockData: DailyEntry[] = [
  { date: '2024-09-01', concentration: 7, memory: 6, energy: 8, mood: 9, sleep: 7, supplements: 6 },
  { date: '2024-09-02', concentration: 8, memory: 7, energy: 7, mood: 8, sleep: 8, supplements: 6 },
  { date: '2024-09-03', concentration: 9, memory: 8, energy: 9, mood: 9, sleep: 9, supplements: 5 },
  { date: '2024-09-04', concentration: 8, memory: 8, energy: 8, mood: 8, sleep: 7, supplements: 6 },
  { date: '2024-09-05', concentration: 9, memory: 9, energy: 9, mood: 10, sleep: 8, supplements: 6 },
  { date: '2024-09-06', concentration: 7, memory: 7, energy: 6, mood: 7, sleep: 6, supplements: 4 },
  { date: '2024-09-07', concentration: 8, memory: 8, energy: 8, mood: 8, sleep: 8, supplements: 6 },
]

const weeklyAverage = {
  concentration: 8.0,
  memory: 7.6,
  energy: 7.9,
  mood: 8.4,
  sleep: 7.6,
  supplements: 5.6
}

/**
 *
 */
export default function PostepPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Powrót do panelu
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Śledź swoje postępy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Monitoruj swoją codzienną wydajność mentalną, poziom energii, samopoczucie 
            i efektywność suplementacji. Analizuj trendy i optymalizuj swój plan.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <Brain className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Koncentracja</p>
            <p className="text-2xl font-bold text-gray-900">{weeklyAverage.concentration}/10</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <Brain className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Pamięć</p>
            <p className="text-2xl font-bold text-gray-900">{weeklyAverage.memory}/10</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Energia</p>
            <p className="text-2xl font-bold text-gray-900">{weeklyAverage.energy}/10</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Samopoczucie</p>
            <p className="text-2xl font-bold text-gray-900">{weeklyAverage.mood}/10</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Sen</p>
            <p className="text-2xl font-bold text-gray-900">{weeklyAverage.sleep}/10</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Suplementy</p>
            <p className="text-2xl font-bold text-gray-900">{weeklyAverage.supplements}/6</p>
          </div>
        </div>

        {/* Weekly Progress Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-indigo-600" />
            Postęp tygodniowy
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Koncentracja
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pamięć
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Energia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Samopoczucie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Suplementy
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockData.map((entry, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{width: `${entry.concentration * 10}%`}}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{entry.concentration}/10</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{width: `${entry.memory * 10}%`}}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{entry.memory}/10</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{width: `${entry.energy * 10}%`}}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{entry.energy}/10</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-red-600 h-2 rounded-full" 
                            style={{width: `${entry.mood * 10}%`}}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{entry.mood}/10</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{width: `${entry.sleep * 10}%`}}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{entry.sleep}/10</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-orange-600 h-2 rounded-full" 
                            style={{width: `${(entry.supplements / 6) * 100}%`}}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{entry.supplements}/6</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Wnioski z tygodnia</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-3">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Poprawa koncentracji</p>
                  <p className="text-xs text-gray-600">Zauważono 15% wzrost w dniach z pełną suplementacją</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <Activity className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Korelacja snu i energii</p>
                  <p className="text-xs text-gray-600">Dni z lepszym snem = wyższa energia następnego dnia</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 rounded-full p-2 mr-3">
                  <Brain className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Pamięć wzrasta stopniowo</p>
                  <p className="text-xs text-gray-600">Efekt kumulacyjny Bacopa Monnieri po 5 dniach</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Rekomendacje</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Optymalizacja dawkowania</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Rozważ podział dawki Lion{'\'s'} Mane na 2x500mg</li>
                  <li>• Bacopa najlepiej działa przy regularnym stosowaniu</li>
                  <li>• Omega-3 zwiększ do 1500mg przy intensywnym wysiłku mentalnym</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Poprawa snu</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Wprowadź L-Theanine 200mg 2h przed snem</li>
                  <li>• Unikaj kofeiny po 14:00</li>
                  <li>• Regularna rutyna snu o tej samej porze</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Log Form */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Dzisiejszy wpis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Koncentracja</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}/10</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pamięć</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}/10</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Energia</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}/10</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Samopoczucie</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}/10</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sen</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}/10</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Suplementy</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                {[0,1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}/6</option>)}
              </select>
            </div>
          </div>
          <button className="mt-4 bg-indigo-600 text-white rounded-md px-4 py-2 hover:bg-indigo-700 transition-colors">
            Zapisz wpis
          </button>
        </div>
      </main>
    </div>
  )
}