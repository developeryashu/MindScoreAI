'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MessageCircle, BarChart3, Trophy, ChevronRight, Wallet } from 'lucide-react'

const steps = [
  {
    icon: MessageCircle,
    title: 'Chat anonymously',
    description: 'Have a private conversation with our AI about how you\'re feeling. No judgment, no records.',
  },
  {
    icon: BarChart3,
    title: 'Understand how you feel',
    description: 'Receive insights and a personalized wellness score based on your check-in.',
  },
  {
    icon: Trophy,
    title: 'Predict improvement & earn rewards',
    description: 'Commit to your growth predictions and earn tokens as you improve over time.',
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showWalletConnect, setShowWalletConnect] = useState(false)
  const router = useRouter()

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowWalletConnect(true)
    }
  }

  const handleSkip = () => {
    router.push('/app/check-in')
  }

  const handleConnectWallet = () => {
    // In production, this would connect to a wallet
    router.push('/app/check-in')
  }

  if (showWalletConnect) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <Card className="w-full max-w-md p-8 rounded-3xl border-0 shadow-xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-8">
              Connect a wallet to earn and manage your reward tokens. This is optional.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={handleConnectWallet}
                className="w-full h-14 rounded-2xl text-base font-medium"
              >
                Connect Wallet
              </Button>
              <Button 
                variant="ghost"
                onClick={handleSkip}
                className="w-full h-14 rounded-2xl text-base font-medium text-muted-foreground"
              >
                Skip for now
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress indicators */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex gap-2 max-w-md mx-auto">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-all duration-[var(--motion-transition)] ${
                index <= currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div 
          className="w-full max-w-md text-center transition-all duration-[var(--motion-reveal)]"
          key={currentStep}
        >
          <div 
            className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-8"
          >
            {(() => {
              const Icon = steps[currentStep].icon
              return <Icon className="w-12 h-12 text-primary" />
            })()}
          </div>
          <h1 className="text-3xl font-bold mb-4 text-balance">
            {steps[currentStep].title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            {steps[currentStep].description}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-6 pb-12 pt-4">
        <div className="max-w-md mx-auto space-y-3">
          <Button 
            onClick={handleNext}
            className="w-full h-14 rounded-2xl text-base font-medium shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
            <ChevronRight className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost"
            onClick={handleSkip}
            className="w-full h-14 rounded-2xl text-base font-medium text-muted-foreground"
          >
            Skip
          </Button>
        </div>
      </div>
    </div>
  )
}
