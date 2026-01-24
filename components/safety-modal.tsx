'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Shield, X } from 'lucide-react'

interface SafetyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SafetyModal({ isOpen, onClose }: SafetyModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    if (isOpen) {
      // Small delay for animation
      const timer = setTimeout(() => setIsVisible(true), 50)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className={`absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto bg-card rounded-t-3xl shadow-2xl transition-transform duration-500 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
        </div>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors touch-manipulation"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
        
        {/* Content */}
        <div className="px-6 pb-8 pt-4">
          <div className="max-w-md mx-auto">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            
            {/* Message */}
            <h2 className="text-2xl font-bold text-center mb-4">
              You don't have to go through this alone.
            </h2>
            
            <p className="text-center text-muted-foreground mb-8">
              Based on your recent check-ins, we wanted to share some resources that might be helpful. 
              There's no pressure—take your time.
            </p>
            
            {/* Resources */}
            <div className="space-y-3 mb-8">
              <a href="https://www.crisistextline.org" target="_blank" rel="noopener noreferrer" className="block p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors">
                <h3 className="font-semibold text-sm mb-1">Crisis Text Line</h3>
                <p className="text-xs text-muted-foreground mb-2">Text HOME to 741741</p>
              </a>
              <a href="tel:988" className="block p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors">
                <h3 className="font-semibold text-sm mb-1">988 Suicide & Crisis Lifeline</h3>
                <p className="text-xs text-muted-foreground mb-2">Call or text 988</p>
              </a>
              <a href="https://www.psychologytoday.com/us/therapists" target="_blank" rel="noopener noreferrer" className="block p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors">
                <h3 className="font-semibold text-sm mb-1">Find a Therapist</h3>
                <p className="text-xs text-muted-foreground mb-2">Psychology Today Directory</p>
              </a>
            </div>
            
            {/* Action */}
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full h-14 rounded-2xl text-base font-medium bg-transparent"
            >
              Continue with Check-in
            </Button>
            
            {/* Note */}
            <p className="text-xs text-center text-muted-foreground mt-6">
              MindScoreAI is not a substitute for professional mental health care. 
              If you're in immediate danger, please call emergency services.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
