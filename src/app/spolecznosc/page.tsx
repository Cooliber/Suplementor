'use client';

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
} from 'lucide-react';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    level: string;
    reputation: number;
  };
  category: string;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
  isLiked: boolean;
  isPinned: boolean;
}

interface Experience {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
    experience: string;
  };
  supplement: string;
  duration: string;
  dosage: string;
  effects: string[];
  rating: number;
  content: string;
  helpful: number;
  createdAt: string;
}

interface Expert {
  id: string;
  name: string;
  avatar: string;
  title: string;
  specialization: string;
  reputation: number;
  posts: number;
  followers: number;
  verified: boolean;
}

const posts: Post[] = [
  {
    id: 'post-1',
    title: 'Moje doświadczenia z Lion\'s Mane - 3 miesiące suplementacji',
    content: 'Po 3 miesiącach regularnego przyjmowania Lion\'s Mane (1000mg dziennie) mogę podzielić się swoimi obserwacjami. Największą poprawę zauważyłem w koncentracji podczas pracy...',
    author: {
      name: 'Anna Kowalska',
      avatar: '/avatars/anna.jpg',
      level: 'Zaawansowany',
      reputation: 1250
    },
    category: 'Doświadczenia',
    tags: ['Lion\'s Mane', 'Koncentracja', 'Długoterminowe'],
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
    content: 'Czy ktoś ma doświadczenie z jednoczesnym przyjmowaniem Bacopa Monnieri i Ashwagandha? Czytałem sprzeczne informacje o możliwych interakcjach...',
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
    content: 'Właśnie ukazało się nowe badanie w Journal of Neuroscience pokazujące wpływ wysokich dawek EPA na neuroplastyczność. Oto kluczowe wnioski...',
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
    content: 'Przed sesją egzaminacyjną opracowałem protokół nootropowy, który znacznie pomógł mi w nauce. Dzielę się szczegółami dawkowania i timing...',
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
];

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
    content: 'Rhodiola znacznie pomogła mi radzić sobie ze stresem w wymagającej pracy. Efekty zauważyłem już po tygodniu.',
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
    content: 'Po 8 miesiącach mogę powiedzieć, że Bacopa to jeden z najlepszych suplementów na pamięć. Efekty przyszły stopniowo ale są trwałe.',
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
    content: 'Kreatyna nie tylko na siłownię! Zauważyłem wyraźną poprawę w szybkości myślenia, szczególnie przy zadaniach matematycznych.',
    helpful: 18,
    createdAt: '2024-01-05'
  }
];

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
];

const categories = ['Wszystkie', 'Doświadczenia', 'Pytania', 'Badania', 'Protokoły', 'Bezpieczeństwo'];

/**
 *
 */
export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState('Wszystkie');
  const [activeTab, setActiveTab] = useState('forum');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const filteredPosts = posts.filter(post => {
    const categoryMatch = selectedCategory === 'Wszystkie' || post.category === selectedCategory;
    const searchMatch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return categoryMatch && searchMatch;
  });

  const renderStars = (rating: number) => Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Społeczność Nootropowa</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dziel się doświadczeniami, zadawaj pytania i ucz się od innych entuzjastów nootropików
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <div className="flex space-x-1">
              {[
                { id: 'forum', label: 'Forum', icon: MessageCircle },
                { id: 'experiences', label: 'Doświadczenia', icon: Star },
                { id: 'experts', label: 'Eksperci', icon: Award }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Forum Tab */}
        {activeTab === 'forum' && (
          <div>
            {/* Search and Filters */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Szukaj postów, tagów..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Nowy post
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
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
              {filteredPosts.map(post => (
                <Card key={post.id} className={`cursor-pointer hover:shadow-md transition-shadow ${post.isPinned ? 'ring-2 ring-blue-200' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                            <Badge variant="outline" className="text-xs">{post.author.level}</Badge>
                            <span className="text-xs text-gray-500">{post.author.reputation} rep</span>
                            {post.isPinned && <Badge className="bg-blue-100 text-blue-700">Przypięty</Badge>}
                          </div>
                          <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                          <CardDescription className="line-clamp-2">{post.content}</CardDescription>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {post.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
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
                          <ThumbsUp className={`h-4 w-4 ${post.isLiked ? 'text-blue-500' : ''}`} />
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
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Doświadczenia użytkowników</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Dodaj doświadczenie
                </Button>
              </div>
              <p className="text-gray-600 mt-2">Prawdziwe historie i efekty suplementacji od naszej społeczności</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {experiences.map(experience => (
                <Card key={experience.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={experience.author.avatar} />
                          <AvatarFallback>{experience.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">{experience.author.name}</h3>
                          <p className="text-sm text-gray-500">Doświadczenie: {experience.author.experience}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {renderStars(experience.rating)}
                        <span className="text-sm text-gray-600 ml-1">{experience.rating}</span>
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
                        <div className="flex flex-wrap gap-1 mt-1">
                          {experience.effects.map(effect => (
                            <Badge key={effect} variant="secondary" className="text-xs">{effect}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm leading-relaxed">{experience.content}</p>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Eksperci i specjaliści</h2>
              <p className="text-gray-600">Zweryfikowani eksperci dzielący się wiedzą naukową</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experts.map(expert => (
                <Card key={expert.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="text-center">
                    <div className="relative mx-auto mb-4">
                      <Avatar className="h-20 w-20 mx-auto">
                        <AvatarImage src={expert.avatar} />
                        <AvatarFallback className="text-lg">{expert.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      {expert.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                          <Award className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-lg">{expert.name}</CardTitle>
                    <CardDescription>{expert.title}</CardDescription>
                    <p className="text-sm text-gray-600 mt-1">{expert.specialization}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-lg font-semibold text-gray-900">{expert.reputation}</p>
                          <p className="text-xs text-gray-500">Reputacja</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">{expert.posts}</p>
                          <p className="text-xs text-gray-500">Posty</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">{expert.followers}</p>
                          <p className="text-xs text-gray-500">Obserwujący</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <User className="h-4 w-4 mr-1" />
                          Profil
                        </Button>
                        <Button size="sm" className="flex-1">
                          <MessageCircle className="h-4 w-4 mr-1" />
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
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">2,847</p>
              <p className="text-sm text-gray-600">Aktywnych członków</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">1,234</p>
              <p className="text-sm text-gray-600">Postów w tym miesiącu</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">567</p>
              <p className="text-sm text-gray-600">Doświadczeń</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">23</p>
              <p className="text-sm text-gray-600">Zweryfikowanych ekspertów</p>
            </CardContent>
          </Card>
        </div>

        {/* Community Guidelines */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-500" />
              Zasady społeczności
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Bezpieczeństwo przede wszystkim</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Nie udzielaj porad medycznych</li>
                  <li>• Zawsze zalecaj konsultację z lekarzem</li>
                  <li>• Dziel się tylko własnymi doświadczeniami</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Jakość dyskusji</h4>
                <ul className="text-sm text-gray-600 space-y-1">
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
  );
}