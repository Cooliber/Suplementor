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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Witaj w NeuroRegulacji
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Monitoruj swoją suplementację wspierającą zdrowie mózgu, śledź postępy 
            w neuroregulacji i osiągaj optymalną wydajność mentalną.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-indigo-100 rounded-full p-3">
                  <Brain className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Dzień cyklu</p>
                  <p className="text-2xl font-bold">15</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-3">
                  <Pill className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Suplementy dzisiaj</p>
                  <p className="text-2xl font-bold">4/6</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-full p-3">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Poziom energii</p>
                  <p className="text-2xl font-bold">8/10</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-red-100 rounded-full p-3">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Samopoczucie</p>
                  <p className="text-2xl font-bold">9/10</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Supplements */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Pill className="h-5 w-5 mr-2 text-indigo-600" />
                Dzisiejsza suplementacja
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Omega-3 (EPA/DHA)</h4>
                    <p className="text-sm text-muted-foreground">1000mg - Wsparcie funkcji poznawczych</p>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                    Zażyto
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Lion{'\'s'} Mane</h4>
                    <p className="text-sm text-muted-foreground">500mg - Neurogeneza i pamięć</p>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                    Zażyto
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Bacopa Monnieri</h4>
                    <p className="text-sm text-muted-foreground">300mg - Pamięć i koncentracja</p>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    Oczekuje
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">L-Theanine + Kofeina</h4>
                    <p className="text-sm text-muted-foreground">200mg/100mg - Focus i energia</p>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
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
                  <Button className="w-full">
                    Zaznacz suplementację
                  </Button>
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
                  <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
                  Postęp tygodnia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Koncentracja</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Pamięć</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
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
              <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
              Harmonogram tygodnia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'].map((day, index) => (
                <div key={day} className="text-center">
                  <div className="text-sm font-medium text-muted-foreground mb-2">{day}</div>
                  <div className={`p-2 rounded-lg ${index < 5 ? 'bg-green-100' : 'bg-blue-100'}`}>
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
