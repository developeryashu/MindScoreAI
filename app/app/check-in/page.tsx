'use client'

import ConnectWalletButton from "@/components/ConnectWalletButton";
import { useState, useRef, useEffect, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Send, Sparkles } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

// ✅ Backend URL (from env)
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL

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
    {
      id: '1',
      role: 'assistant',
      content: "Hi there! I'm here to check in with you. How are you feeling today?"
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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

    if (!BACKEND_URL) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: '❌ Backend URL not configured'
        }
      ])
      setIsTyping(false)
      return
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content })
      })

      if (!response.ok) throw new Error('Backend error')

      const data = await response.json()

      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.reply || '✅ Backend connected successfully'
        }
      ])
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: '❌ Unable to reach backend'
        }
      ])
    }

    setIsTyping(false)
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-3xl px-5 py-3.5 max-w-[75%] ${
              message.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card'
            }`}>
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs text-primary">MindScore AI</span>
                </div>
              )}
              {message.content}
            </div>
          </div>
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 flex gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-3 rounded-lg"
          disabled={isTyping}
        />
        <Button type="submit" disabled={isTyping || !input.trim()}>
          <Send />
        </Button>
      </form>
    </div>
  )
}
