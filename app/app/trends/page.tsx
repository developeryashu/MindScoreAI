'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Users, TrendingUp, TrendingDown, Share2, Building2 } from 'lucide-react'

// Simulated chart data
const weeklyData = [
  { day: 'Mon', score: 65 },
  { day: 'Tue', score: 72 },
  { day: 'Wed', score: 68 },
  { day: 'Thu', score: 75 },
  { day: 'Fri', score: 70 },
  { day: 'Sat', score: 78 },
  { day: 'Sun', score: 74 },
]

const cityData = [
  { city: 'San Francisco', index: 67, status: 'Moderate', trend: 'up' },
  { city: 'New York', index: 58, status: 'Moderate', trend: 'down' },
  { city: 'Los Angeles', index: 72, status: 'Calm', trend: 'up' },
  { city: 'Chicago', index: 61, status: 'Moderate', trend: 'stable' },
  { city: 'Austin', index: 75, status: 'Calm', trend: 'up' },
]

const campusData = [
  { name: 'Stanford', index: 68, participants: 1240 },
  { name: 'Berkeley', index: 62, participants: 980 },
  { name: 'MIT', index: 59, participants: 1450 },
  { name: 'UCLA', index: 71, participants: 1120 },
]

function MiniLineChart({ data }: { data: { day: string; score: number }[] }) {
  const maxScore = Math.max(...data.map(d => d.score))
  const minScore = Math.min(...data.map(d => d.score))
  const range = maxScore - minScore || 1
  
  const [isAnimated, setIsAnimated] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - ((d.score - minScore) / range) * 80 - 10
    return `${x},${y}`
  }).join(' ')
  
  return (
    <div className="h-32 w-full relative">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Area fill */}
        <polygon
          points={`0,100 ${points} 100,100`}
          fill="url(#chartGradient)"
          className={`transition-opacity duration-[var(--motion-reveal)] ${isAnimated ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-all duration-[var(--motion-reveal)] ${isAnimated ? 'opacity-100' : 'opacity-0'}`}
          style={{
            strokeDasharray: isAnimated ? 'none' : '200',
            strokeDashoffset: isAnimated ? '0' : '200',
          }}
        />
        {/* Points */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 100
          const y = 100 - ((d.score - minScore) / range) * 80 - 10
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill="var(--color-primary)"
              className={`transition-opacity duration-[var(--motion-reveal)] ${isAnimated ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: `${i * 50}ms` }}
            />
          )
        })}
      </svg>
      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
        {data.map((d) => (
          <span key={d.day} className="text-xs text-muted-foreground">{d.day}</span>
        ))}
      </div>
    </div>
  )
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />
  if (trend === 'down') return <TrendingDown className="w-4 h-4 text-amber-500" />
  return <div className="w-4 h-4 flex items-center justify-center"><div className="w-2 h-0.5 bg-muted-foreground rounded" /></div>
}

export default function TrendsPage() {
  const [selectedTab, setSelectedTab] = useState<'personal' | 'city' | 'campus'>('personal')
  
  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Trends</h1>
        <p className="text-muted-foreground">
          Track patterns and see how your community is doing
        </p>
      </div>
      
      {/* Tab navigation */}
      <div className="flex gap-2 mb-6 p-1 bg-muted rounded-2xl">
        {[
          { id: 'personal', label: 'Personal', icon: TrendingUp },
          { id: 'city', label: 'City Index', icon: MapPin },
          { id: 'campus', label: 'Campus', icon: Building2 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as 'personal' | 'city' | 'campus')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-[var(--motion-transition)] touch-manipulation ${
              selectedTab === tab.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-sm">{tab.label}</span>
          </button>
        ))}
      </div>
      
      {selectedTab === 'personal' && (
        <div className="space-y-6">
          <Card className="p-6 rounded-3xl border-0 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Weekly Wellness Score</h3>
              <span className="text-sm text-muted-foreground">Last 7 days</span>
            </div>
            <MiniLineChart data={weeklyData} />
            <div className="mt-4 flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold">72</span>
                <span className="text-muted-foreground ml-1">avg</span>
              </div>
              <div className="flex items-center gap-1 text-green-500">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+5% from last week</span>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 rounded-3xl border-0 shadow-lg">
            <h3 className="font-semibold mb-4">Insights</h3>
            <div className="space-y-3">
              {[
                'Your scores tend to be higher on weekends',
                'Morning check-ins show more positive patterns',
                'Your sleep quality correlates with higher scores',
              ].map((insight, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-muted/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <p className="text-sm text-muted-foreground">{insight}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
      
      {selectedTab === 'city' && (
        <div className="space-y-6">
          <Link href="/app/city-index">
            <Card className="p-6 rounded-3xl border-0 shadow-xl bg-gradient-to-br from-primary/5 to-transparent cursor-pointer hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Featured</span>
              </div>
              <h3 className="text-xl font-bold mb-1">City Stress Index</h3>
              <p className="text-sm text-muted-foreground mb-4">
                See how your city compares to others
              </p>
              <Button className="rounded-2xl">
                Explore Index
              </Button>
            </Card>
          </Link>
          
          <Card className="p-6 rounded-3xl border-0 shadow-lg">
            <h3 className="font-semibold mb-4">City Rankings</h3>
            <div className="space-y-3">
              {cityData.map((city, index) => (
                <div 
                  key={city.city}
                  className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{city.city}</p>
                      <p className="text-xs text-muted-foreground">{city.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendIcon trend={city.trend} />
                    <span className="text-lg font-bold">{city.index}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
      
      {selectedTab === 'campus' && (
        <div className="space-y-6">
          <Card className="p-6 rounded-3xl border-0 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Campus Focus Index</h3>
            </div>
            <div className="space-y-3">
              {campusData.map((campus, index) => (
                <div 
                  key={campus.name}
                  className="flex items-center justify-between p-4 rounded-2xl bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{campus.name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="w-3 h-3" />
                        <span>{campus.participants.toLocaleString()} participants</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">{campus.index}</span>
                    <p className="text-xs text-muted-foreground">Focus Score</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          <Card className="p-6 rounded-3xl border-0 shadow-lg text-center">
            <h3 className="font-semibold mb-2">Share Your Campus</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Invite classmates to participate and unlock campus insights
            </p>
            <Button variant="outline" className="rounded-2xl gap-2 bg-transparent">
              <Share2 className="w-4 h-4" />
              Share Invite Link
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}
