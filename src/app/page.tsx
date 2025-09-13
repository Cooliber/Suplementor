import { Brain, Heart, Activity, Pill, TrendingUp, Calendar } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

/**
 *
 */
export default function NeuroRegulacjaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            Witaj w NeuroRegulacji
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Monitoruj swoją suplementację wspierającą zdrowie mózgu, śledź postępy w
            neuroregulacji i osiągaj optymalną wydajność mentalną.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-indigo-100 p-3">
                  <Brain className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-muted-foreground text-sm font-medium">Dzień cyklu</p>
                  <p className="text-2xl font-bold">15</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-green-100 p-3">
                  <Pill className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-muted-foreground text-sm font-medium">
                    Suplementy dzisiaj
                  </p>
                  <p className="text-2xl font-bold">4/6</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-purple-100 p-3">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-muted-foreground text-sm font-medium">
                    Poziom energii
                  </p>
                  <p className="text-2xl font-bold">8/10</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-red-100 p-3">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-muted-foreground text-sm font-medium">
                    Samopoczucie
                  </p>
                  <p className="text-2xl font-bold">9/10</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Today's Supplements */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Pill className="mr-2 h-5 w-5 text-indigo-600" />
                Dzisiejsza suplementacja
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/50 flex items-center justify-between rounded-lg p-4">
                  <div>
                    <h4 className="font-medium">Omega-3 (EPA/DHA)</h4>
                    <p className="text-muted-foreground text-sm">
                      1000mg - Wsparcie funkcji poznawczych
                    </p>
                  </div>
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800 hover:bg-green-100"
                  >
                    Zażyto
                  </Badge>
                </div>

                <div className="bg-muted/50 flex items-center justify-between rounded-lg p-4">
                  <div>
                    <h4 className="font-medium">Lion{"'s"} Mane</h4>
                    <p className="text-muted-foreground text-sm">
                      500mg - Neurogeneza i pamięć
                    </p>
                  </div>
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800 hover:bg-green-100"
                  >
                    Zażyto
                  </Badge>
                </div>

                <div className="bg-muted/50 flex items-center justify-between rounded-lg p-4">
                  <div>
                    <h4 className="font-medium">Bacopa Monnieri</h4>
                    <p className="text-muted-foreground text-sm">
                      300mg - Pamięć i koncentracja
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                  >
                    Oczekuje
                  </Badge>
                </div>

                <div className="bg-muted/50 flex items-center justify-between rounded-lg p-4">
                  <div>
                    <h4 className="font-medium">L-Theanine + Kofeina</h4>
                    <p className="text-muted-foreground text-sm">
                      200mg/100mg - Focus i energia
                    </p>
                  </div>
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800 hover:bg-green-100"
                  >
                    Zażyto
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Szybkie akcje</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full">Zaznacz suplementację</Button>
                  <Button variant="secondary" className="w-full">
                    Dodaj notatkę
                  </Button>
                  <Button variant="secondary" className="w-full">
                    Zaktualizuj samopoczucie
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-indigo-600" />
                  Postęp tygodnia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>Koncentracja</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>Pamięć</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>Energia</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Weekly Schedule */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-indigo-600" />
              Harmonogram tygodnia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'].map((day, index) => (
                <div key={day} className="text-center">
                  <div className="text-muted-foreground mb-2 text-sm font-medium">
                    {day}
                  </div>
                  <div
                    className={`rounded-lg p-2 ${index < 5 ? 'bg-green-100' : 'bg-blue-100'}`}
                  >
                    <div className="text-xs text-gray-700">
                      {index < 5 ? '6/6' : '4/6'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
