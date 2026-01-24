'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Moon, Sun, MessageCircle, BarChart3, TrendingUp, Shield, Users, MapPin } from 'lucide-react'

interface AnimatedCounterProps {
  target: number
  duration?: number
}

const AnimatedCounter = ({ target, duration = 2000 }: AnimatedCounterProps): JSX.Element => {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('counter-section')
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [isVisible, target, duration])

  return <span>{count.toLocaleString()}</span>
}

const ThemeToggle = (): JSX.Element | null => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-3 rounded-2xl bg-card hover:bg-muted transition-all duration-[var(--motion-transition)] touch-manipulation"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">M</span>
            </div>
            <span className="font-semibold text-lg">MindScoreAI</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/onboarding">
              <Button className="rounded-2xl px-6 h-11 font-medium">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4 sm:px-6">
        <div 
          className={`max-w-3xl mx-auto text-center transition-all duration-[var(--motion-reveal)] ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance mb-6">
            Track How You Feel.{' '}
            <span className="text-primary">Predict How You'll Improve.</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Anonymous emotional check-ins turned into insight and rewards. 
            Understand yourself better, one conversation at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding">
              <Button 
                size="lg" 
                className="w-full sm:w-auto rounded-2xl px-8 h-14 text-lg font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-[var(--motion-transition)]"
              >
                Check In Anonymously
              </Button>
            </Link>
            <Link href="/demo">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto rounded-2xl px-8 h-14 text-lg font-medium bg-transparent"
              >
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-balance">
            How MindScoreAI Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: MessageCircle,
                title: 'Chat',
                description: 'Have a quick, anonymous conversation with our empathetic AI about how you\'re feeling.',
              },
              {
                icon: BarChart3,
                title: 'Score',
                description: 'Receive a personalized emotional wellness score based on your check-in.',
              },
              {
                icon: TrendingUp,
                title: 'Predict',
                description: 'Commit to your improvement predictions and earn rewards as you grow.',
              },
            ].map((item, index) => (
              <Card 
                key={item.title}
                className={`p-8 rounded-3xl border-0 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-[var(--motion-transition)] ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* City Stress Index Preview */}
      <section id="counter-section" className="py-16 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 sm:p-12 rounded-3xl border-0 shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">City Stress Index</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold mb-2">San Francisco</h3>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-6xl sm:text-7xl font-bold text-primary">
                  <AnimatedCounter target={67} />
                </span>
                <span className="text-xl text-muted-foreground">/100</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <span className="w-2 h-2 rounded-full bg-current" />
                <span className="font-medium">Moderate</span>
              </div>
              <p className="mt-6 text-muted-foreground">
                See how your city compares. All data is completely anonymous and aggregated.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Safety & Ethics */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-balance">
                Your Emotional Safety Comes First
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                MindScoreAI is designed to support reflection, not replace professional care. 
                We never store personally identifiable information, and our AI is trained to 
                recognize when you might need additional support.
              </p>
              <ul className="space-y-3">
                {[
                  'Completely anonymous check-ins',
                  'No personal data collection',
                  'Gentle escalation to resources when needed',
                  'Non-clinical, supportive language',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                  <Shield className="w-12 h-12 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Growing Community</span>
          </div>
          <div className="grid grid-cols-3 gap-8">
            {[
              { value: 50000, label: 'Check-ins' },
              { value: 12000, label: 'Active Users' },
              { value: 45, label: 'Cities' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                  <AnimatedCounter target={stat.value} />
                  {stat.value >= 1000 ? '+' : ''}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance">
            Ready to Understand Yourself Better?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start your first anonymous check-in today. It takes less than 5 minutes.
          </p>
          <Link href="/onboarding">
            <Button 
              size="lg" 
              className="rounded-2xl px-10 h-14 text-lg font-medium shadow-lg shadow-primary/20"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">M</span>
            </div>
            <span className="text-sm text-muted-foreground">MindScoreAI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Supporting emotional wellness, one check-in at a time.
          </p>
        </div>
      </footer>
    </div>
  )
}
