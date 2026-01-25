"use client";

export default function CheckInPage() {
  return (
    <div>
      <h1>Check In</h1>

      {/* TEMP BACKEND TEST BUTTON */}
      <button
        onClick={async () => {
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/test`
            );
            const data = await res.json();
            alert(data.message);
          } catch (e) {
            alert("FAILED to reach backend");
            console.error(e);
          }
        }}
        style={{
          padding: "10px",
          background: "black",
          color: "white",
          marginTop: "20px"
        }}
      >
        TEST BACKEND
      </button>

    </div>
  );
}


import { useState, useRef, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Send, Sparkles } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const aiQuestions = [
  "Hi there! I'm here to check in with you. How are you feeling today?",
  "Thank you for sharing. Can you tell me more about what's been on your mind lately?",
  "I understand. On a scale of 1-10, how would you rate your overall mood right now?",
  "That helps me understand. What's one thing that's been bringing you joy recently?",
  "Great insight. How have you been sleeping lately?",
  "Sleep is so important. What's one small thing you could do today to take care of yourself?",
  "That sounds like a wonderful idea. Is there anything else you'd like to share before we wrap up?",
]

function TypingIndicator() {
  return (
    <div className="flex gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-primary/60 animate-pulse"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  )
}

export default function CheckInPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: aiQuestions[0] }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(1)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

    if (questionIndex < aiQuestions.length) {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiQuestions[questionIndex]
      }
      setMessages(prev => [...prev, aiMessage])
      setQuestionIndex(prev => prev + 1)
    } else {
      // Check-in complete
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Thank you for this meaningful conversation. I've calculated your wellness score based on our chat. Let me show you your results."
      }
      setMessages(prev => [...prev, aiMessage])
      
      // Navigate to score page after a short delay
      setTimeout(() => {
        router.push('/app/score')
      }, 2000)
    }

    setIsTyping(false)
    inputRef.current?.focus()
  }

  const progress = Math.min(((questionIndex) / aiQuestions.length) * 100, 100)

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] lg:h-screen">
      {/* Progress Bar */}
      <div className="px-4 py-3 border-b border-border bg-card/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Check-in Progress
          </span>
          <span className="text-sm font-medium text-primary">
            {Math.min(questionIndex, aiQuestions.length)} of {aiQuestions.length}
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-[var(--motion-transition)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-3xl px-5 py-3.5 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-lg'
                  : 'bg-card shadow-md shadow-primary/5 rounded-bl-lg'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary">MindScore AI</span>
                </div>
              )}
              <p className="leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-card shadow-md shadow-primary/5 rounded-3xl rounded-bl-lg">
              <TypingIndicator />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-border bg-card/80 backdrop-blur-lg">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    // Create a synthetic form event
                    const form = inputRef.current?.closest('form') as HTMLFormElement
                    if (form) {
                      handleSubmit({ preventDefault: () => {} } as FormEvent<HTMLFormElement>)
                    }
                  }
                }}
                placeholder="Share how you're feeling..."
                className="w-full px-5 py-4 rounded-2xl bg-muted border-0 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[56px] max-h-32 text-base"
                rows={1}
                disabled={isTyping}
              />
            </div>
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isTyping}
              className="h-14 w-14 rounded-2xl shrink-0 shadow-lg shadow-primary/20"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
