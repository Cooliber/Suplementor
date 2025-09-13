'use client'

import { CheckCircle, XCircle, RefreshCw, Trophy } from 'lucide-react'
import { useState } from 'react'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface QuizEngineProps {
  questions: QuizQuestion[]
  title: string
  onComplete?: (score: number, total: number) => void
  onAnswer?: (answer: string, correct: boolean) => void
}

/**
 *
 */
export default function QuizEngine({
  questions,
  title,
  onComplete,
  onAnswer
}: QuizEngineProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
    setShowExplanation(true)

    const currentQ = questions[currentQuestion]
    if (currentQ && currentQ.options[answerIndex]) {
      const selectedOption = currentQ.options[answerIndex]
      const isCorrect = answerIndex === currentQ.correctAnswer
      onAnswer?.(selectedOption, isCorrect)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowExplanation(false)
    } else {
      setShowResults(true)
      const score = selectedAnswers.filter(
        (answer, index) => answer === questions[index]?.correctAnswer
      ).length
      onComplete?.(score, questions.length)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers([])
    setShowResults(false)
    setShowExplanation(false)
  }

  const currentQ = questions[currentQuestion]

  if (!currentQ) return null

  const isAnswered = selectedAnswers[currentQuestion] !== undefined
  const isCorrect =
    isAnswered && selectedAnswers[currentQuestion] === currentQ.correctAnswer

  if (showResults) {
    const score = selectedAnswers.filter(
      (answer, index) => answer === questions[index]?.correctAnswer
    ).length
    const percentage = Math.round((score / questions.length) * 100)

    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="text-center">
          <Trophy className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
          <h3 className="mb-2 text-2xl font-bold text-gray-900">Quiz zakończony!</h3>
          <p className="mb-4 text-lg text-gray-600">
            Twój wynik: {score}/{questions.length} ({percentage}%)
          </p>
          <button
            onClick={restartQuiz}
            className="mx-auto flex items-center rounded-lg bg-indigo-600 px-6 py-2 text-white transition-colors hover:bg-indigo-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Spróbuj ponownie
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-indigo-600 transition-all"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Pytanie {currentQuestion + 1} z {questions.length}
        </p>
      </div>

      <div className="mb-6">
        <h4 className="mb-4 text-lg font-medium text-gray-900">{currentQ.question}</h4>
        <div className="space-y-2">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !isAnswered && handleAnswerSelect(index)}
              className={`w-full rounded-lg border p-3 text-left transition-colors ${
                !isAnswered
                  ? 'border-gray-300 hover:bg-gray-50'
                  : selectedAnswers[currentQuestion] === index
                    ? isCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : index === currentQ.correctAnswer
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300'
              }`}
              disabled={isAnswered}
            >
              <div className="flex items-center">
                <span className="font-medium text-gray-700">{option}</span>
                {isAnswered && index === currentQ.correctAnswer && (
                  <CheckCircle className="ml-auto h-5 w-5 text-green-600" />
                )}
                {isAnswered &&
                  selectedAnswers[currentQuestion] === index &&
                  !isCorrect && <XCircle className="ml-auto h-5 w-5 text-red-600" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {showExplanation && (
        <div className="mb-6 rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-blue-800">{currentQ.explanation}</p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={nextQuestion}
          disabled={!isAnswered}
          className="rounded-lg bg-indigo-600 px-6 py-2 text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {currentQuestion < questions.length - 1 ? 'Następne pytanie' : 'Zakończ quiz'}
        </button>
      </div>
    </div>
  )
}
