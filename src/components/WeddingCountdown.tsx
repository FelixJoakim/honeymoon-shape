import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Heart, Calendar } from 'lucide-react'

interface WeddingCountdownProps {
  weddingDate?: string
}

export default function WeddingCountdown({ weddingDate }: WeddingCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Use provided wedding date or default to April 2026
      const targetDate = weddingDate ? new Date(weddingDate) : new Date('2026-04-01T00:00:00')
      const weddingDateTime = targetDate.getTime()
      const now = new Date().getTime()
      const difference = weddingDateTime - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [weddingDate])

  return (
    <Card className="bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0 shadow-xl rounded-xl overflow-hidden">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Heart className="w-8 h-8" />
          Honeymoon Countdown
        </CardTitle>
        <div className="flex items-center justify-center gap-2 text-amber-100">
          <Calendar className="w-4 h-4" />
          <span>{weddingDate ? new Date(weddingDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'April 2026'}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="bg-white/20 rounded-xl p-4">
            <div className="text-3xl font-bold">{timeLeft.days}</div>
            <div className="text-sm text-blue-100">Days</div>
          </div>
          <div className="bg-white/20 rounded-xl p-4">
            <div className="text-3xl font-bold">{timeLeft.hours}</div>
            <div className="text-sm text-blue-100">Hours</div>
          </div>
          <div className="bg-white/20 rounded-xl p-4">
            <div className="text-3xl font-bold">{timeLeft.minutes}</div>
            <div className="text-sm text-blue-100">Minutes</div>
          </div>
          <div className="bg-white/20 rounded-xl p-4">
            <div className="text-3xl font-bold">{timeLeft.seconds}</div>
            <div className="text-sm text-blue-100">Seconds</div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-lg font-medium text-amber-100">
            Every rep counts toward your honeymoon! 💪
          </p>
          <p className="text-sm text-amber-200 mt-2">
            Transform your bodies, strengthen your bond
          </p>
        </div>
      </CardContent>
    </Card>
  )
}