'use client'

import {
  MessageCircle,
  Users,
  Calendar,
  Star,
  ThumbsUp,
  MessageSquare,
  Award,
  Shield,
  Plus,
  Search,
  Eye,
  User
} from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

interface Post {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar: string
    level: string
    reputation: number
  }
  category: string
  tags: string[]
  likes: number
  comments: number
  views: number
  createdAt: string
  isLiked: boolean
  isPinned: boolean
}

interface Experience {
  id: string
  title: string
  author: {
    name: string
    avatar: string
    experience: string
  }
  supplement: string
  duration: string
  dosage: string
  effects: string[]
  rating: number
  content: string
  helpful: number
  createdAt: string
}

interface Expert {
  id: string
  name: string
  avatar: string
  title: string
  specialization: string
  reputation: number
  posts: number
  followers: number
  verified: boolean
}

const posts: Post[] = [
  {
    id: 'post-1',
    title: "Moje doświadczenia z Lion's Mane - 3 miesiące suplementacji",
    content:
      "Po 3 miesiącach regularnego przyjmowania Lion's Mane (1000mg dziennie) mogę podzielić się swoimi obserwacjami. Największą poprawę zauważyłem w koncentracji podczas pracy...",
    author: {
      name: 'Anna Kowalska',
      avatar: '/avatars/anna.jpg',
      level: 'Zaawansowany',
      reputation: 1250
    },
    category: 'Doświadczenia',
    tags: ["Lion's Mane", 'Koncentracja', 'Długoterminowe'],
    likes: 47,
    comments: 23,
    views: 312,
    createdAt: '2024-01-15',
    isLiked: false,
    isPinned: true
  },
  {
    id: 'post-2',
    title: 'Pytanie o interakcje Bacopa + Ashwagandha',
    content:
      'Czy ktoś ma doświadczenie z jednoczesnym przyjmowaniem Bacopa Monnieri i Ashwagandha? Czytałem sprzeczne informacje o możliwych interakcjach...',
    author: {
      name: 'Marcin Nowak',
      avatar: '/avatars/marcin.jpg',
      level: 'Początkujący',
      reputation: 180
    },
    category: 'Pytania',
    tags: ['Bacopa', 'Ashwagandha', 'Interakcje'],
    likes: 12,
    comments: 8,
    views: 156,
    createdAt: '2024-01-14',
    isLiked: true,
    isPinned: false
  },
  {
    id: 'post-3',
    title: 'Badanie: Omega-3 a funkcje poznawcze - nowe wyniki',
    content:
      'Właśnie ukazało się nowe badanie w Journal of Neuroscience pokazujące wpływ wysokich dawek EPA na neuroplastyczność. Oto kluczowe wnioski...',
    author: {
      name: 'Dr. Katarzyna Wiśniewska',
      avatar: '/avatars/katarzyna.jpg',
      level: 'Ekspert',
      reputation: 3420
    },
    category: 'Badania',
    tags: ['Omega-3', 'EPA', 'Neuroplastyczność', 'Badania'],
    likes: 89,
    comments: 34,
    views: 567,
    createdAt: '2024-01-13',
    isLiked: false,
    isPinned: true
  },
  {
    id: 'post-4',
    title: 'Protokół na egzaminy - co sprawdziło się u mnie',
    content:
      'Przed sesją egzaminacyjną opracowałem protokół nootropowy, który znacznie pomógł mi w nauce. Dzielę się szczegółami dawkowania i timing...',
    author: {
      name: 'Jakub Student',
      avatar: '/avatars/jakub.jpg',
      level: 'Średniozaawansowany',
      reputation: 680
    },
    category: 'Protokoły',
    tags: ['Nauka', 'Egzaminy', 'Protokół', 'Studenci'],
    likes: 156,
    comments: 67,
    views: 892,
    createdAt: '2024-01-12',
    isLiked: true,
    isPinned: false
  }
]

const experiences: Experience[] = [
  {
    id: 'exp-1',
    title: 'Rhodiola na stres w pracy',
    author: {
      name: 'Tomasz K.',
      avatar: '/avatars/tomasz.jpg',
      experience: '2 lata'
    },
    supplement: 'Rhodiola Rosea',
    duration: '6 miesięcy',
    dosage: '300mg rano',
    effects: ['Mniejszy stres', 'Lepsza energia', 'Spokojniejszy sen'],
    rating: 4.5,
    content:
      'Rhodiola znacznie pomogła mi radzić sobie ze stresem w wymagającej pracy. Efekty zauważyłem już po tygodniu.',
    helpful: 23,
    createdAt: '2024-01-10'
  },
  {
    id: 'exp-2',
    title: 'Bacopa na pamięć - długoterminowe efekty',
    author: {
      name: 'Maria S.',
      avatar: '/avatars/maria.jpg',
      experience: '3 lata'
    },
    supplement: 'Bacopa Monnieri',
    duration: '8 miesięcy',
    dosage: '300mg dziennie',
    effects: ['Lepsza pamięć', 'Szybsze uczenie', 'Mniej zapominania'],
    rating: 5.0,
    content:
      'Po 8 miesiącach mogę powiedzieć, że Bacopa to jeden z najlepszych suplementów na pamięć. Efekty przyszły stopniowo ale są trwałe.',
    helpful: 45,
    createdAt: '2024-01-08'
  },
  {
    id: 'exp-3',
    title: 'Kreatyna na funkcje poznawcze',
    author: {
      name: 'Paweł M.',
      avatar: '/avatars/pawel.jpg',
      experience: '1 rok'
    },
    supplement: 'Kreatyna',
    duration: '3 miesiące',
    dosage: '5g dziennie',
    effects: ['Szybsze myślenie', 'Lepsza koncentracja', 'Więcej energii'],
    rating: 4.0,
    content:
      'Kreatyna nie tylko na siłownię! Zauważyłem wyraźną poprawę w szybkości myślenia, szczególnie przy zadaniach matematycznych.',
    helpful: 18,
    createdAt: '2024-01-05'
  }
]

const experts: Expert[] = [
  {
    id: 'expert-1',
    name: 'Dr. Katarzyna Wiśniewska',
    avatar: '/avatars/katarzyna.jpg',
    title: 'Neurobiolog',
    specialization: 'Neuroplastyczność i nootropiki',
    reputation: 3420,
    posts: 127,
    followers: 892,
    verified: true
  },
  {
    id: 'expert-2',
    name: 'Mgr Piotr Zieliński',
    avatar: '/avatars/piotr.jpg',
    title: 'Farmaceuta kliniczny',
    specialization: 'Interakcje leków i suplementów',
    reputation: 2150,
    posts: 89,
    followers: 567,
    verified: true
  },
  {
    id: 'expert-3',
    name: 'Dr hab. Anna Kowalczyk',
    avatar: '/avatars/anna-dr.jpg',
    title: 'Psycholog kognitywny',
    specialization: 'Funkcje poznawcze i pamięć',
    reputation: 2890,
    posts: 156,
    followers: 734,
    verified: true
  }
]

const categories = [
  'Wszystkie',
  'Doświadczenia',
  'Pytania',
  'Badania',
  'Protokoły',
  'Bezpieczeństwo'
]

/**
 *
 */
export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState('Wszystkie')
  const [activeTab, setActiveTab] = useState('forum')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  const filteredPosts = posts.filter((post) => {
    const categoryMatch =
      selectedCategory === 'Wszystkie' || post.category === selectedCategory
    const searchMatch =
      searchTerm === '' ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    return categoryMatch && searchMatch
  })

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-current text-yellow-400' : 'text-gray-300'}`}
      />
    ))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Społeczność Nootropowa
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Dziel się doświadczeniami, zadawaj pytania i ucz się od innych entuzjastów
            nootropików
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-lg bg-white p-1 shadow-sm">
            <div className="flex space-x-1">
              {[
                { id: 'forum', label: 'Forum', icon: MessageCircle },
                { id: 'experiences', label: 'Doświadczenia', icon: Star },
                { id: 'experts', label: 'Eksperci', icon: Award }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Forum Tab */}
        {activeTab === 'forum' && (
          <div>
            {/* Search and Filters */}
            <div className="mb-6">
              <div className="mb-4 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <input
                    type="text"
                    placeholder="Szukaj postów, tagów..."
                    className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Nowy post
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className={`cursor-pointer transition-shadow hover:shadow-md ${post.isPinned ? 'ring-2 ring-blue-200' : ''}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex flex-1 items-start space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>
                            {post.author.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="mb-1 flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">
                              {post.author.name}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {post.author.level}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {post.author.reputation} rep
                            </span>
                            {post.isPinned && (
                              <Badge className="bg-blue-100 text-blue-700">
                                Przypięty
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="mb-2 text-lg">{post.title}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {post.content}
                          </CardDescription>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {post.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <ThumbsUp
                            className={`h-4 w-4 ${post.isLiked ? 'text-blue-500' : ''}`}
                          />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{post.views}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{post.createdAt}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Experiences Tab */}
        {activeTab === 'experiences' && (
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Doświadczenia użytkowników
                </h2>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Dodaj doświadczenie
                </Button>
              </div>
              <p className="mt-2 text-gray-600">
                Prawdziwe historie i efekty suplementacji od naszej społeczności
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {experiences.map((experience) => (
                <Card key={experience.id} className="transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={experience.author.avatar} />
                          <AvatarFallback>
                            {experience.author.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {experience.author.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Doświadczenie: {experience.author.experience}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {renderStars(experience.rating)}
                        <span className="ml-1 text-sm text-gray-600">
                          {experience.rating}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{experience.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Suplement:</span>
                          <p className="text-gray-600">{experience.supplement}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Czas trwania:</span>
                          <p className="text-gray-600">{experience.duration}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Dawka:</span>
                          <p className="text-gray-600">{experience.dosage}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Data:</span>
                          <p className="text-gray-600">{experience.createdAt}</p>
                        </div>
                      </div>

                      <div>
                        <span className="font-medium text-gray-700">Efekty:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {experience.effects.map((effect) => (
                            <Badge key={effect} variant="secondary" className="text-xs">
                              {effect}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <p className="text-sm leading-relaxed text-gray-700">
                        {experience.content}
                      </p>

                      <div className="flex items-center justify-between border-t pt-2">
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{experience.helpful} osób uznało za pomocne</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Pomocne
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Experts Tab */}
        {activeTab === 'experts' && (
          <div>
            <div className="mb-6">
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                Eksperci i specjaliści
              </h2>
              <p className="text-gray-600">
                Zweryfikowani eksperci dzielący się wiedzą naukową
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {experts.map((expert) => (
                <Card key={expert.id} className="transition-shadow hover:shadow-md">
                  <CardHeader className="text-center">
                    <div className="relative mx-auto mb-4">
                      <Avatar className="mx-auto h-20 w-20">
                        <AvatarImage src={expert.avatar} />
                        <AvatarFallback className="text-lg">
                          {expert.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      {expert.verified && (
                        <div className="absolute -right-1 -bottom-1 rounded-full bg-blue-500 p-1">
                          <Award className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-lg">{expert.name}</CardTitle>
                    <CardDescription>{expert.title}</CardDescription>
                    <p className="mt-1 text-sm text-gray-600">{expert.specialization}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            {expert.reputation}
                          </p>
                          <p className="text-xs text-gray-500">Reputacja</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            {expert.posts}
                          </p>
                          <p className="text-xs text-gray-500">Posty</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            {expert.followers}
                          </p>
                          <p className="text-xs text-gray-500">Obserwujący</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <User className="mr-1 h-4 w-4" />
                          Profil
                        </Button>
                        <Button size="sm" className="flex-1">
                          <MessageCircle className="mr-1 h-4 w-4" />
                          Napisz
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Community Stats */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="mx-auto mb-2 h-8 w-8 text-blue-500" />
              <p className="text-2xl font-bold text-gray-900">2,847</p>
              <p className="text-sm text-gray-600">Aktywnych członków</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="mx-auto mb-2 h-8 w-8 text-green-500" />
              <p className="text-2xl font-bold text-gray-900">1,234</p>
              <p className="text-sm text-gray-600">Postów w tym miesiącu</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="mx-auto mb-2 h-8 w-8 text-yellow-500" />
              <p className="text-2xl font-bold text-gray-900">567</p>
              <p className="text-sm text-gray-600">Doświadczeń</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="mx-auto mb-2 h-8 w-8 text-purple-500" />
              <p className="text-2xl font-bold text-gray-900">23</p>
              <p className="text-sm text-gray-600">Zweryfikowanych ekspertów</p>
            </CardContent>
          </Card>
        </div>

        {/* Community Guidelines */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-blue-500" />
              Zasady społeczności
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-medium text-gray-900">
                  Bezpieczeństwo przede wszystkim
                </h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Nie udzielaj porad medycznych</li>
                  <li>• Zawsze zalecaj konsultację z lekarzem</li>
                  <li>• Dziel się tylko własnymi doświadczeniami</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-medium text-gray-900">Jakość dyskusji</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Podawaj źródła naukowe</li>
                  <li>• Bądź konstruktywny w krytyce</li>
                  <li>• Szanuj różne punkty widzenia</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
