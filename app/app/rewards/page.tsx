'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wallet, ChevronDown, ChevronUp, CheckCircle, Clock, TrendingUp } from 'lucide-react'

interface PredictionHistory {
  id: string
  question: string
  prediction: 'yes' | 'no'
  amount: number
  status: 'won' | 'lost' | 'pending'
  payout?: number
  date: string
}

const predictionHistory: PredictionHistory[] = [
  {
    id: '1',
    question: 'Will I feel more rested next week?',
    prediction: 'yes',
    amount: 50,
    status: 'won',
    payout: 75,
    date: '2 days ago',
  },
  {
    id: '2',
    question: 'Will my focus improve in 7 days?',
    prediction: 'yes',
    amount: 30,
    status: 'lost',
    date: '1 week ago',
  },
  {
    id: '3',
    question: 'Will I exercise 3+ times this week?',
    prediction: 'yes',
    amount: 40,
    status: 'pending',
    date: '3 days ago',
  },
  {
    id: '4',
    question: 'Would I feel calmer by end of month?',
    prediction: 'no',
    amount: 25,
    status: 'won',
    payout: 35,
    date: '2 weeks ago',
  },
]

function AnimatedBalance({ balance }: { balance: number }) {
  const [displayBalance, setDisplayBalance] = useState(0)
  
  useEffect(() => {
    const duration = 1500
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setDisplayBalance(Math.floor(easeOut * balance))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [balance])
  
  return <span>{displayBalance.toLocaleString()}</span>
}

function PredictionRow({ prediction }: { prediction: PredictionHistory }) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'won':
        return { icon: CheckCircle, color: 'text-green-500', label: 'Correct Prediction' }
      case 'lost':
        return { icon: TrendingUp, color: 'text-muted-foreground', label: 'Learning Opportunity' }
      case 'pending':
        return { icon: Clock, color: 'text-amber-500', label: 'Awaiting Result' }
      default:
        return { icon: Clock, color: 'text-muted-foreground', label: 'Unknown' }
    }
  }
  
  const statusInfo = getStatusInfo(prediction.status)
  const StatusIcon = statusInfo.icon
  
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors touch-manipulation"
      >
        <div className="flex items-center gap-3">
          <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
          <div className="text-left">
            <p className="font-medium text-sm line-clamp-1">{prediction.question}</p>
            <p className="text-xs text-muted-foreground">{prediction.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            {prediction.status === 'won' && prediction.payout && (
              <span className="text-green-500 font-medium">+{prediction.payout}</span>
            )}
            {prediction.status === 'lost' && (
              <span className="text-muted-foreground font-medium">-{prediction.amount}</span>
            )}
            {prediction.status === 'pending' && (
              <span className="text-amber-500 font-medium">{prediction.amount}</span>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 rounded-2xl bg-muted/30 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Your prediction</span>
              <span className="font-medium capitalize">{prediction.prediction}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Committed</span>
              <span className="font-medium">{prediction.amount} tokens</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className={`font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
            </div>
            {prediction.status === 'won' && prediction.payout && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Reward</span>
                <span className="font-medium text-green-500">+{prediction.payout} tokens</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function RewardsPage() {
  const totalBalance = 485
  const totalWon = 110
  const totalPredictions = predictionHistory.length
  const winRate = Math.round((predictionHistory.filter(p => p.status === 'won').length / predictionHistory.filter(p => p.status !== 'pending').length) * 100)
  
  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Rewards</h1>
        <p className="text-muted-foreground">
          Track your tokens and prediction history
        </p>
      </div>
      
      {/* Balance Card */}
      <Card className="p-6 rounded-3xl border-0 shadow-xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Balance</p>
            <p className="text-3xl font-bold">
              <AnimatedBalance balance={totalBalance} /> <span className="text-lg text-muted-foreground">tokens</span>
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 rounded-2xl bg-card/50">
            <p className="text-xs text-muted-foreground mb-1">Won</p>
            <p className="text-lg font-semibold text-green-500">+{totalWon}</p>
          </div>
          <div className="p-3 rounded-2xl bg-card/50">
            <p className="text-xs text-muted-foreground mb-1">Predictions</p>
            <p className="text-lg font-semibold">{totalPredictions}</p>
          </div>
          <div className="p-3 rounded-2xl bg-card/50">
            <p className="text-xs text-muted-foreground mb-1">Win Rate</p>
            <p className="text-lg font-semibold">{winRate}%</p>
          </div>
        </div>
      </Card>
      
      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Button variant="outline" className="h-14 rounded-2xl font-medium bg-transparent">
          Add Tokens
        </Button>
        <Button variant="outline" className="h-14 rounded-2xl font-medium bg-transparent">
          Withdraw
        </Button>
      </div>
      
      {/* Prediction History */}
      <Card className="rounded-3xl border-0 shadow-lg overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">Prediction History</h3>
        </div>
        <div>
          {predictionHistory.map((prediction) => (
            <PredictionRow key={prediction.id} prediction={prediction} />
          ))}
        </div>
      </Card>
      
      {/* Reflection Note */}
      <p className="text-center text-sm text-muted-foreground mt-6 px-4">
        Predictions are a tool for self-reflection, not gambling. 
        Every outcome is an opportunity to learn about yourself.
      </p>
    </div>
  )
}
