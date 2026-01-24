'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, Share2, Search, ChevronDown } from 'lucide-react'

const cities = [
  { name: 'San Francisco', index: 67, status: 'Moderate' as const },
  { name: 'New York', index: 58, status: 'Moderate' as const },
  { name: 'Los Angeles', index: 72, status: 'Calm' as const },
  { name: 'Chicago', index: 61, status: 'Moderate' as const },
  { name: 'Austin', index: 75, status: 'Calm' as const },
  { name: 'Seattle', index: 64, status: 'Moderate' as const },
  { name: 'Denver', index: 78, status: 'Calm' as const },
  { name: 'Boston', index: 55, status: 'Elevated' as const },
  { name: 'Miami', index: 70, status: 'Calm' as const },
  { name: 'Portland', index: 69, status: 'Calm' as const },
]

type Status = 'Calm' | 'Moderate' | 'Elevated'

function getStatusColor(status: Status) {
  switch (status) {
    case 'Calm':
      return 'bg-green-500/10 text-green-600 dark:text-green-400'
    case 'Moderate':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
    case 'Elevated':
      return 'bg-red-400/10 text-red-500 dark:text-red-400'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

function AnimatedRing({ value, size = 200 }: { value: number; size?: number }) {
  const [currentValue, setCurrentValue] = useState(0)
  
  useEffect(() => {
    const duration = 1500
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCurrentValue(Math.floor(easeOut * value))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [value])
  
  const circumference = 2 * Math.PI * 85
  const strokeDashoffset = circumference - (currentValue / 100) * circumference
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
        {/* Background ring */}
        <circle
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className="text-muted"
        />
        {/* Animated ring */}
        <circle
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-100"
        />
        {/* Glow effect */}
        <circle
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="blur-sm opacity-50"
        />
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7BC47F" />
            <stop offset="50%" stopColor="#7C6AE6" />
            <stop offset="100%" stopColor="#9F8CFF" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold">{currentValue}</span>
        <span className="text-muted-foreground">/100</span>
      </div>
    </div>
  )
}

export default function CityIndexPage() {
  const [selectedCity, setSelectedCity] = useState(cities[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    setIsLoaded(true)
  }, [])
  
  const filteredCities = cities.filter(city => 
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const handleShare = async () => {
    const shareData = {
      title: `${selectedCity.name} Stress Index`,
      text: `${selectedCity.name}'s current stress index is ${selectedCity.index}/100 (${selectedCity.status}). Check yours on MindScoreAI!`,
      url: window.location.href,
    }
    
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('[v0] Share cancelled or failed')
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
    }
  }
  
  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      {/* Hero Card */}
      <Card 
        className={`p-8 rounded-3xl border-0 shadow-xl overflow-hidden relative mb-6 transition-all duration-[var(--motion-reveal)] ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        
        <div className="relative z-10">
          {/* City Selector */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">City Stress Index</span>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors touch-manipulation"
              >
                <span className="text-2xl font-bold">{selectedCity.name}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-card rounded-2xl shadow-xl border border-border z-20 max-h-64 overflow-y-auto">
                  <div className="p-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search cities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    {filteredCities.map((city) => (
                      <button
                        key={city.name}
                        onClick={() => {
                          setSelectedCity(city)
                          setIsDropdownOpen(false)
                          setSearchQuery('')
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors touch-manipulation ${
                          selectedCity.name === city.name ? 'bg-muted' : ''
                        }`}
                      >
                        <span className="font-medium">{city.name}</span>
                        <span className="text-muted-foreground">{city.index}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Index Display */}
          <div className="flex flex-col items-center mb-8">
            <AnimatedRing value={selectedCity.index} size={220} />
            
            <div className={`mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(selectedCity.status)}`}>
              <span className="w-2 h-2 rounded-full bg-current" />
              <span className="font-medium">{selectedCity.status}</span>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-center text-muted-foreground mb-6">
            This index represents the aggregated, anonymous wellness data from {selectedCity.name} residents. 
            Higher scores indicate a calmer, more balanced community.
          </p>
          
          {/* Share Button */}
          <Button 
            onClick={handleShare}
            className="w-full h-14 rounded-2xl text-base font-medium shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Share This Index
          </Button>
        </div>
      </Card>
      
      {/* Info Card */}
      <Card className="p-6 rounded-3xl border-0 shadow-lg">
        <h3 className="font-semibold mb-3">About the City Stress Index</h3>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            The City Stress Index aggregates anonymous check-in data from all users in a geographic area 
            to provide insight into community wellness trends.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor('Calm')}`}>Calm (70-100)</span>
              <span>Community is generally at ease</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor('Moderate')}`}>Moderate (40-69)</span>
              <span>Normal stress levels</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor('Elevated')}`}>Elevated (0-39)</span>
              <span>Higher than usual stress</span>
            </div>
          </div>
          <p className="text-xs">
            All data is completely anonymous. We never collect or store personally identifiable information.
          </p>
        </div>
      </Card>
    </div>
  )
}
