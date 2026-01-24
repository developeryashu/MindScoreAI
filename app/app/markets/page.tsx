'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { TrendingUp, Clock, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'

interface Market {
  id: string
  question: string
  description: string
  status: 'open' | 'pending' | 'resolved'
  userPrediction?: 'yes' | 'no'
  userAmount?: number
  result?: boolean
  insight?: string
}

const markets: Market[] = [
  {
    id: '1',
    question: 'Will I feel more rested next week?',
    description: 'Based on your sleep patterns and current stress levels.',
    status: 'open',
  },
  {
    id: '2',
    question: 'Will my focus improve in 7 days?',
    description: 'Tracking your ability to concentrate on tasks.',
    status: 'open',
  },
  {
    id: '3',
    question: 'Will I exercise 3+ times next week?',
    description: 'Physical activity goal based on your wellness journey.',
    status: 'pending',
    userPrediction: 'yes',
    userAmount: 50,
  },
  {
    id: '4',
    question: 'Would I feel calmer by end of last month?',
    description: 'Your stress management prediction from 4 weeks ago.',
    status: 'resolved',
    userPrediction: 'yes',
    userAmount: 30,
    result: true,
    insight: 'Great prediction! Your check-ins showed a 15% improvement in calmness indicators.',
  },
]

function MarketCard({ market, onPredict }: { market: Market; onPredict: (id: string, prediction: 'yes' | 'no', amount: number) => void }) {
  const [selectedPrediction, setSelectedPrediction] = useState<'yes' | 'no' | null>(null)
  const [amount, setAmount] = useState([25])
  
  const handleCommit = () => {
    if (selectedPrediction) {
      onPredict(market.id, selectedPrediction, amount[0])
    }
  }
  
  if (market.status === 'resolved') {
    return (
      <Card className="p-6 rounded-3xl border-0 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className={`w-5 h-5 ${market.result ? 'text-green-500' : 'text-muted-foreground'}`} />
          <span className="text-sm font-medium text-muted-foreground">Resolved</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">{market.question}</h3>
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-4 ${
          market.result 
            ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
            : 'bg-muted text-muted-foreground'
        }`}>
          {market.result ? 'Prediction Correct!' : 'Keep Reflecting'}
        </div>
        {market.insight && (
          <p className="text-sm text-muted-foreground leading-relaxed bg-muted/50 rounded-2xl p-4">
            {market.insight}
          </p>
        )}
      </Card>
    )
  }
  
  if (market.status === 'pending') {
    return (
      <Card className="p-6 rounded-3xl border-0 shadow-lg opacity-80">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-amber-500" />
          <span className="text-sm font-medium text-muted-foreground">Awaiting Result</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">{market.question}</h3>
        <p className="text-sm text-muted-foreground mb-4">{market.description}</p>
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-muted/50">
          <span className="text-sm text-muted-foreground">Your prediction</span>
          <span className="font-medium capitalize">{market.userPrediction} - {market.userAmount} tokens</span>
        </div>
      </Card>
    )
  }
  
  return (
    <Card className="p-6 rounded-3xl border-0 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">Open Prediction</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">{market.question}</h3>
      <p className="text-sm text-muted-foreground mb-6">{market.description}</p>
      
      {/* Prediction buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => setSelectedPrediction('yes')}
          className={`p-4 rounded-2xl border-2 transition-all duration-[var(--motion-transition)] touch-manipulation ${
            selectedPrediction === 'yes'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-muted bg-muted/50 hover:border-primary/50'
          }`}
        >
          <span className="text-lg font-semibold">Yes</span>
          <p className="text-xs text-muted-foreground mt-1">I believe I will</p>
        </button>
        <button
          onClick={() => setSelectedPrediction('no')}
          className={`p-4 rounded-2xl border-2 transition-all duration-[var(--motion-transition)] touch-manipulation ${
            selectedPrediction === 'no'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-muted bg-muted/50 hover:border-primary/50'
          }`}
        >
          <span className="text-lg font-semibold">No</span>
          <p className="text-xs text-muted-foreground mt-1">Not this time</p>
        </button>
      </div>
      
      {selectedPrediction && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Amount slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Commit Amount</span>
              <span className="text-lg font-bold text-primary">{amount[0]} tokens</span>
            </div>
            <Slider
              value={amount}
              onValueChange={setAmount}
              min={10}
              max={100}
              step={5}
              className="touch-manipulation"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>10</span>
              <span>100</span>
            </div>
          </div>
          
          <Button 
            onClick={handleCommit}
            className="w-full h-14 rounded-2xl text-base font-medium shadow-lg shadow-primary/20"
          >
            Commit to Prediction
          </Button>
        </div>
      )}
    </Card>
  )
}

export default function MarketsPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [marketList, setMarketList] = useState(markets)
  
  const handlePredict = (id: string, prediction: 'yes' | 'no', amount: number) => {
    setMarketList(prev => prev.map(m => 
      m.id === id 
        ? { ...m, status: 'pending' as const, userPrediction: prediction, userAmount: amount }
        : m
    ))
    // Move to next market after short delay
    setTimeout(() => {
      if (currentIndex < marketList.length - 1) {
        setCurrentIndex(currentIndex + 1)
      }
    }, 500)
  }
  
  const openMarkets = marketList.filter(m => m.status === 'open')
  const pendingMarkets = marketList.filter(m => m.status === 'pending')
  const resolvedMarkets = marketList.filter(m => m.status === 'resolved')
  
  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Prediction Markets</h1>
        <p className="text-muted-foreground">
          Commit to your growth predictions and earn rewards
        </p>
      </div>
      
      {/* Market carousel for mobile */}
      {openMarkets.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Open Predictions</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="p-2 rounded-xl bg-muted disabled:opacity-50 touch-manipulation"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} / {openMarkets.length}
              </span>
              <button
                onClick={() => setCurrentIndex(Math.min(openMarkets.length - 1, currentIndex + 1))}
                disabled={currentIndex === openMarkets.length - 1}
                className="p-2 rounded-xl bg-muted disabled:opacity-50 touch-manipulation"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-[var(--motion-transition)]"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {openMarkets.map((market) => (
                <div key={market.id} className="w-full flex-shrink-0 pr-4">
                  <MarketCard market={market} onPredict={handlePredict} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Pending predictions */}
      {pendingMarkets.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Awaiting Results</h2>
          <div className="space-y-4">
            {pendingMarkets.map((market) => (
              <MarketCard key={market.id} market={market} onPredict={handlePredict} />
            ))}
          </div>
        </div>
      )}
      
      {/* Resolved predictions */}
      {resolvedMarkets.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Past Predictions</h2>
          <div className="space-y-4">
            {resolvedMarkets.map((market) => (
              <MarketCard key={market.id} market={market} onPredict={handlePredict} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
