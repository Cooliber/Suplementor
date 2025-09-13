# AI Supplement Assistant System

A comprehensive AI-powered supplement knowledge and recommendation system built with **AI SDK 5**, **Google Gemini Flash**, and **Next.js**.

## 🚀 Features

### 1. Interactive AI Chat

- Real-time conversational AI interface
- Context-aware responses based on user health goals
- Streaming responses for better user experience
- Memory of conversation history
- Built-in tools for supplement interaction analysis and research search

### 2. AI-Powered Supplement Analysis

- Comprehensive safety and efficacy ratings (0-100 scale)
- Evidence-based recommendations
- Personalized analysis based on user profile
- Dosage optimization
- Risk assessment and contraindications
- Real-time analysis of 6+ popular supplements

### 3. Advanced Knowledge Base

- Complex query handling with research integration
- Evidence-level classification (strong, moderate, weak, theoretical)
- Practical application suggestions
- Related supplement recommendations
- Important warnings and considerations

### 4. Personalized Health Goals

- User-customizable health goals
- Goal-based supplement recommendations
- Progress tracking capabilities
- Personalized risk assessments

## 🛠 Technology Stack

- **AI SDK 5** - Latest AI SDK with advanced features
- **Google Gemini Flash** - Fast, powerful AI model (FREE tier available)
- **Next.js 14** - App Router with server and client components
- **TypeScript** - Full type safety throughout
- **Zod** - Schema validation for AI responses
- **Tailwind CSS** - Modern, responsive UI design
- **Shadcn/ui** - Premium UI components

## 📁 Project Structure

```
src/
├── app/api/ai/           # AI API routes
│   ├── analyze-supplement/route.ts
│   ├── optimize-stack/route.ts
│   ├── knowledge-query/route.ts
│   └── chat/route.ts
├── components/AI/        # AI components
│   └── AISupplementAssistant.tsx
├── lib/                  # Core logic
│   ├── ai-knowledge-engine.ts
│   ├── advanced-debugging.ts
│   └── enhanced-supplement-types.ts
└── types/               # TypeScript definitions
    └── enhanced-supplement.ts
```

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install ai @ai-sdk/google zod
```

### 2. Environment Configuration

Create `.env.local` with:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

Get your free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### 3. Add Component to Your App

```tsx
import AISupplementAssistant from '@/components/AI/AISupplementAssistant'

export default function HomePage() {
  return (
    <div className="container mx-auto">
      <AISupplementAssistant />
    </div>
  )
}
```

## 🎯 Core Components

### AI Knowledge Engine (`ai-knowledge-engine.ts`)

The heart of the system featuring:

- **Singleton Pattern** - Efficient resource management
- **Structured Output** - Consistent, validated responses
- **Multiple Analysis Types** - Supplement analysis, stack optimization, knowledge queries
- **Advanced Prompting** - Context-aware prompt engineering
- **Tool Integration** - Built-in tools for enhanced capabilities

### API Routes

- `/api/ai/analyze-supplement` - Individual supplement analysis
- `/api/ai/optimize-stack` - Complete supplement stack optimization
- `/api/ai/knowledge-query` - Complex knowledge queries with research
- `/api/ai/chat` - Interactive streaming chat interface

### UI Component (`AISupplementAssistant.tsx`)

- **3 Main Tabs**: Chat, Analysis, Knowledge Base
- **Responsive Design** - Works on all devices
- **Real-time Updates** - Streaming and live data
- **User Goal Management** - Dynamic health goal system
- **Advanced Styling** - Progress bars, badges, alerts

## 📊 AI Response Schemas

### Supplement Analysis

```typescript
interface SupplementAnalysis {
  supplementName: string
  safetyRating: number // 0-100
  efficacyRating: number // 0-100
  keyBenefits: string[]
  potentialRisks: string[]
  recommendedDosage: {
    min: number
    max: number
    unit: string
    timing: string
  }
  evidenceQuality: 'strong' | 'moderate' | 'weak' | 'insufficient'
  reasoning: string
}
```

### Knowledge Query Response

```typescript
interface KnowledgeQueryResult {
  answer: string
  keyPoints: string[]
  relatedSupplements: string[]
  mechanismsInvolved: string[]
  evidenceLevel: 'strong' | 'moderate' | 'weak' | 'theoretical'
  practicalApplications: string[]
  warnings: string[]
}
```

## 🔍 Advanced Features

### Smart Supplement Database

Built-in knowledge of popular supplements:

- Vitamin D3, Omega-3, Magnesium
- Lion's Mane, Ashwagandha, Creatine
- Dynamic analysis based on user context

### Evidence-Based Recommendations

- Scientific research integration
- PubMed-style evidence classification
- Safety-first approach
- Personalized risk assessment

### Interactive Tools

- Quick question suggestions
- Popular supplement shortcuts
- Goal-based recommendations
- Real-time analysis updates

## 🎨 UI/UX Features

### Design Elements

- **Gradient Headers** - Eye-catching visual hierarchy
- **Progress Indicators** - Visual rating displays
- **Evidence Badges** - Clear evidence level indicators
- **Interactive Cards** - Hover effects and animations
- **Responsive Grid** - Optimal layout on all screens

### User Experience

- **Streaming Responses** - No waiting for long AI responses
- **Error Handling** - Graceful error recovery
- **Loading States** - Clear feedback during processing
- **Context Awareness** - Remembers user preferences

## 🚦 Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Set up environment variables** (see `.env.local.example`)
4. **Get Google AI API key** (free tier available)
5. **Run development server**: `npm run dev`
6. **Navigate to the AI Assistant** in your app

## 🔮 Future Enhancements

### Research Integration

- PubMed API integration
- Real-time research updates
- Citation tracking
- Evidence strength scoring

### Advanced Personalization

- Health condition profiles
- Medication interaction checking
- Biomarker tracking
- Progress monitoring

### Enhanced Analytics

- Usage pattern analysis
- Recommendation effectiveness
- User satisfaction tracking
- A/B testing capabilities

## 🛡 Safety & Compliance

- **Evidence-based recommendations only**
- **Clear risk warnings**
- **Professional consultation reminders**
- **No medical diagnosis or treatment advice**
- **Transparent AI limitations**

## 💡 Tips for Best Results

1. **Set specific health goals** for personalized recommendations
2. **Provide detailed context** in chat for better responses
3. **Ask follow-up questions** to dive deeper into topics
4. **Use the analysis feature** before starting new supplements
5. **Review warnings and contraindications** carefully

---

**Built with ❤️ using AI SDK 5 and Google Gemini Flash**

_This system is for educational and informational purposes only. Always consult with healthcare professionals before making supplement decisions._
