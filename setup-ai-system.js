#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🚀 Setting up AI Supplement Assistant System...\n')

// Check if required files exist
const requiredFiles = [
  'src/lib/ai-knowledge-engine.ts',
  'src/components/AI/AISupplementAssistant.tsx',
  'src/app/api/ai/chat/route.ts',
  'src/app/api/ai/analyze-supplement/route.ts',
  '.env.local.example'
]

console.log('📂 Checking system files...')
let allFilesExist = true

for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - Found`)
  } else {
    console.log(`❌ ${file} - Missing`)
    allFilesExist = false
  }
}

if (!allFilesExist) {
  console.log(
    '\n⚠️  Some required files are missing. Please ensure all AI system files are properly created.'
  )
  process.exit(1)
}

// Check if .env.local exists
if (!fs.existsSync('.env.local')) {
  console.log('\n📝 Creating .env.local from example...')
  try {
    fs.copyFileSync('.env.local.example', '.env.local')
    console.log('✅ .env.local created successfully')
    console.log('⚠️  Please edit .env.local and add your GOOGLE_GENERATIVE_AI_API_KEY')
  } catch (error) {
    console.log('❌ Failed to create .env.local:', error.message)
  }
} else {
  console.log('✅ .env.local already exists')
}

console.log('\n🔧 Installation checklist:')
console.log('1. ✅ Install dependencies: npm install ai @ai-sdk/google zod')
console.log('2. 📝 Get Google AI API key from: https://makersuite.google.com/app/apikey')
console.log('3. 🔑 Add your API key to .env.local')
console.log('4. 🎯 Visit /ai-demo to try the system')
console.log('5. 📖 Read AI_SYSTEM_README.md for full documentation')

console.log('\n💡 Quick start commands:')
console.log('   npm run dev           # Start development server')
console.log('   npm run build         # Build for production')

console.log('\n🎉 AI Supplement Assistant setup complete!')
console.log(
  '🌟 Ready to revolutionize supplement guidance with AI SDK 5 and Gemini Flash'
)

// Display feature summary
console.log('\n🚀 Key Features Available:')
console.log('   🤖 Interactive AI Chat with streaming responses')
console.log('   📊 Comprehensive supplement analysis (safety & efficacy ratings)')
console.log('   🧠 Advanced knowledge base with research integration')
console.log('   🎯 Personalized health goal management')
console.log('   ⚡ Real-time AI processing with Gemini Flash')
console.log('   🛡️ Evidence-based safety assessments')
console.log('   📱 Responsive, modern UI with advanced components')

console.log('\n📚 Documentation:')
console.log('   📄 Full system guide: AI_SYSTEM_README.md')
console.log('   🌐 Demo page: http://localhost:3000/ai-demo')
console.log('   💻 Component: src/components/AI/AISupplementAssistant.tsx')

console.log('\n⚠️  Important Notes:')
console.log('   • This system is for educational purposes only')
console.log('   • Always consult healthcare professionals for medical advice')
console.log('   • Google Gemini Flash offers a generous free tier')
console.log('   • Rate limits apply to API usage')

console.log('\n🎯 Ready to experience the future of AI-powered supplement guidance!')
