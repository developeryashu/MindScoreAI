'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MessageCircle, BarChart3, Trophy, TrendingUp, MapPin, Shield, ChevronRight, Sparkles, Send } from 'lucide-react'

type DemoStep = 'onboarding' | 'checkin' | 'score' | 'market' | 'city' | 'safety'

const onboardingSteps = [
  { icon: MessageCircle, title: 'Chat anonymously', description: 'Have a private conversation with our AI.' },
  { icon: BarChart3, title: 'Understand how you feel', description: 'Receive insights and a personalized score.' },
  { icon: Trophy, title: 'Predict & earn rewards', description: 'Commit to growth and track progress.' },
]

const demoMessages = [
  { role: 'assistant' as const, content: "Hi! I'm here to check in with you. How are you feeling today?" },
  { role: 'user' as const, content: "I've been feeling a bit stressed lately with work deadlines." },
  { role: 'assistant' as const, content: "I understand. Work stress can be overwhelming. On a scale of 1-10, how would you rate your stress level?" },
  { role: 'user' as const, content: "Probably around a 7. It's been hard to relax." },
  { role: 'assistant' as const, content: "Thank you for sharing. What's one thing that usually helps you unwind?" },
]

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState<DemoStep>('onboarding')
  const [onboardingIndex, setOnboardingIndex] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [score, setScore] = useState(0)
  
  // Auto-advance functionality without goToNextStep callback
  
  // Auto-advance onboarding
  useEffect(() => {
    if (currentStep === 'onboarding') {
      const timer = setInterval(() => {
        setOnboardingIndex(prev => {
          if (prev < onboardingSteps.length - 1) return prev + 1
          clearInterval(timer)
          setTimeout(() => setCurrentStep('checkin'), 1500)
          return prev
        })
      }, 2000)
      return () => clearInterval(timer)
    }
  }, [currentStep])
  
  // Auto-advance chat messages
  useEffect(() => {
    if (currentStep === 'checkin' && messageIndex < demoMessages.length) {
      const delay = demoMessages[messageIndex].role === 'assistant' ? 1500 : 1000
      setIsTyping(demoMessages[messageIndex].role === 'assistant')
      
      const timer = setTimeout(() => {
        setIsTyping(false)
        setMessageIndex(prev => prev + 1)
      }, delay)
      
      return () => clearTimeout(timer)
    } else if (currentStep === 'checkin' && messageIndex >= demoMessages.length) {
      setTimeout(() => setCurrentStep('score'), 1500)
    }
  }, [currentStep, messageIndex])
  
  // Animate score
  useEffect(() => {
    if (currentStep === 'score') {
      const targetScore = 68
      const duration = 2000
      const startTime = Date.now()
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeOut = 1 - Math.pow(1 - progress, 3)
        setScore(Math.floor(easeOut * targetScore))
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      requestAnimationFrame(animate)
    }
  }, [currentStep])
  
  // Auto-advance from score
  useEffect(() => {
    if (currentStep === 'score') {
      const timer = setTimeout(() => setCurrentStep('market'), 4000)
      return () => clearTimeout(timer)
    }
  }, [currentStep])
  
  // Auto-advance from market
  useEffect(() => {
    if (currentStep === 'market') {
      const timer = setTimeout(() => setCurrentStep('city'), 4000)
      return () => clearTimeout(timer)
    }
  }, [currentStep])
  
  // Auto-advance from city to safety
  useEffect(() => {
    if (currentStep === 'city') {
      const timer = setTimeout(() => {
        setCurrentStep('safety')
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [currentStep])
  
  const circumference = 2 * Math.PI * 90
  const strokeDashoffset = circumference - (score / 100) * circumference
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">M</span>
            </div>
            <span className="font-semibold">Demo Mode</span>
          </div>
          <span className="text-xs text-muted-foreground px-3 py-1 rounded-full bg-muted">
            Investor Preview
          </span>
        </div>
      </header>
      
      <div className="pt-16 min-h-screen flex items-center justify-center px-4 py-8">
        {/* Onboarding */}
        {currentStep === 'onboarding' && (
          <div className="w-full max-w-md text-center">
            <div 
              key={onboardingIndex}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
                {(() => {
                  const Icon = onboardingSteps[onboardingIndex].icon
                  return <Icon className="w-12 h-12 text-primary" />
                })()}
              </div>
              <h1 className="text-3xl font-bold mb-4">
                {onboardingSteps[onboardingIndex].title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {onboardingSteps[onboardingIndex].description}
              </p>
            </div>
            <div className="flex gap-2 justify-center mt-8">
              {onboardingSteps.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-colors ${i <= onboardingIndex ? 'bg-primary' : 'bg-muted'}`}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Check-in */}
        {currentStep === 'checkin' && (
          <div className="w-full max-w-md">
            <Card className="rounded-3xl border-0 shadow-xl overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="font-medium">AI Check-in</span>
                </div>
              </div>
              <div className="p-4 space-y-4 min-h-[300px]">
                {demoMessages.slice(0, messageIndex).map((msg, i) => (
                  <div 
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                  >
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-br-md' 
                        : 'bg-muted rounded-bl-md'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-border">
                <div className="flex gap-3">
                  <div className="flex-1 px-4 py-3 rounded-xl bg-muted text-muted-foreground">
                    Share how you're feeling...
                  </div>
                  <Button size="icon" className="h-12 w-12 rounded-xl">
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
        
        {/* Score */}
        {currentStep === 'score' && (
          <Card className="w-full max-w-md p-8 rounded-3xl border-0 shadow-xl text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Your Wellness Score</span>
            </div>
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="12" className="text-muted" />
                <circle 
                  cx="100" cy="100" r="90" fill="none" stroke="url(#demoGradient)" strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                />
                <defs>
                  <linearGradient id="demoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7BC47F" />
                    <stop offset="100%" stopColor="#7C6AE6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold">{score}</span>
                <span className="text-muted-foreground">/100</span>
              </div>
            </div>
            <div className="mt-6 text-xl font-semibold text-primary">Balanced</div>
            <p className="mt-4 text-muted-foreground">You're managing well. Keep checking in!</p>
          </Card>
        )}
        
        {/* Market */}
        {currentStep === 'market' && (
          <Card className="w-full max-w-md p-6 rounded-3xl border-0 shadow-xl animate-in fade-in slide-in-from-right duration-500">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Prediction Market</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Will I feel more rested next week?</h3>
            <p className="text-sm text-muted-foreground mb-6">Based on your current patterns.</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-4 rounded-2xl border-2 border-primary bg-primary/10 text-center">
                <span className="text-lg font-semibold text-primary">Yes</span>
                <p className="text-xs text-muted-foreground mt-1">I believe I will</p>
              </div>
              <div className="p-4 rounded-2xl border-2 border-muted bg-muted/50 text-center">
                <span className="text-lg font-semibold">No</span>
                <p className="text-xs text-muted-foreground mt-1">Not this time</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-muted/50 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm">Commit Amount</span>
                <span className="font-bold text-primary">50 tokens</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-primary rounded-full" />
              </div>
            </div>
            <Button className="w-full h-14 rounded-2xl text-base font-medium">
              Commit to Prediction
            </Button>
          </Card>
        )}
        
        {/* City Index */}
        {currentStep === 'city' && (
          <Card className="w-full max-w-md p-8 rounded-3xl border-0 shadow-xl text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">City Stress Index</span>
            </div>
            <h3 className="text-2xl font-bold mb-6">San Francisco</h3>
            <div className="text-6xl font-bold text-primary mb-2">67</div>
            <div className="text-muted-foreground mb-4">/100</div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <span className="w-2 h-2 rounded-full bg-current" />
              <span className="font-medium">Moderate</span>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Aggregated, anonymous wellness data from your city.
            </p>
          </Card>
        )}
        
        {/* Safety Modal */}
        {currentStep === 'safety' && (
          <div className="w-full max-w-md">
            <Card className="p-8 rounded-3xl border-0 shadow-xl text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Safety Escalation</h2>
              <p className="text-muted-foreground mb-6">
                When our AI detects signs that someone might need additional support, 
                we gently offer resources without being intrusive.
              </p>
              <Card className="p-6 rounded-2xl bg-muted/30 text-left mb-6">
                <p className="text-lg font-medium mb-2">
                  "You don't have to go through this alone."
                </p>
                <p className="text-sm text-muted-foreground">
                  If you'd like to talk to someone, here are some resources that might help.
                </p>
                <Button variant="outline" className="mt-4 rounded-xl bg-transparent">
                  View Support Resources
                </Button>
              </Card>
              <p className="text-xs text-muted-foreground">
                This modal appears only on high-confidence detection and is never blocking or repeated.
              </p>
            </Card>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-4">End of Demo</p>
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="rounded-2xl gap-2"
              >
                Back to Homepage
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
