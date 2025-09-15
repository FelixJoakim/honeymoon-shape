import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Lightbulb, Target, Award, Moon, Zap, RefreshCw } from 'lucide-react'

interface DailyTip {
  category: 'challenge' | 'celebrate' | 'rest'
  title: string
  message: string
  icon: React.ReactNode
  color: string
}

const mentalTips: DailyTip[] = [
  // Challenge Tips - Mike Mentzer Style
  {
    category: 'challenge',
    title: 'Train Beyond Failure',
    message: 'Progress demands discomfort. Step outside your limits today. When your muscles scream "stop," that\'s precisely when growth begins.',
    icon: <Zap className="w-5 h-5" />,
    color: 'from-red-500 to-orange-600'
  },
  {
    category: 'challenge',
    title: 'Intensity Is Everything',
    message: 'One set taken to absolute muscular failure is worth more than twenty half-hearted attempts. Make every rep count like your wedding depends on it.',
    icon: <Target className="w-5 h-5" />,
    color: 'from-purple-500 to-red-600'
  },
  {
    category: 'challenge',
    title: 'Mental Warfare',
    message: 'Your mind will quit 1000 times before your body gives out. The battle is won in your head. Fight through the discomfort.',
    icon: <Zap className="w-5 h-5" />,
    color: 'from-orange-500 to-red-500'
  },
  {
    category: 'challenge',
    title: 'Progressive Overload',
    message: 'If you\'re not adding weight, reps, or intensity, you\'re not progressing. Your body adapts fast - stay ahead of it.',
    icon: <Target className="w-5 h-5" />,
    color: 'from-blue-500 to-purple-600'
  },
  {
    category: 'challenge',
    title: 'No Compromise',
    message: 'Mediocrity is the enemy of excellence. Every workout is a choice: will you settle or will you dominate?',
    icon: <Zap className="w-5 h-5" />,
    color: 'from-gray-600 to-red-600'
  },

  // Celebrate Tips
  {
    category: 'celebrate',
    title: 'Victory Earned',
    message: 'You\'ve moved another step closer to your wedding goal. That weight you lost, that rep you completed - you earned it through intensity.',
    icon: <Award className="w-5 h-5" />,
    color: 'from-green-500 to-emerald-600'
  },
  {
    category: 'celebrate',
    title: 'Strength Builds Character',
    message: 'Every time you push through discomfort, you\'re not just building muscle - you\'re building the person you\'ll be on your wedding day.',
    icon: <Award className="w-5 h-5" />,
    color: 'from-blue-500 to-green-600'
  },
  {
    category: 'celebrate',
    title: 'Consistency is King',
    message: 'You showed up today. That\'s not luck - that\'s discipline. Keep this relentless consistency and nothing can stop you.',
    icon: <Award className="w-5 h-5" />,
    color: 'from-purple-500 to-blue-600'
  },

  // Rest Tips - Mentzer emphasized recovery
  {
    category: 'rest',
    title: 'Rest is Not Weakness',
    message: 'Rest is where strength is built. Your muscles grow during recovery, not during training. Take pride in resting when needed.',
    icon: <Moon className="w-5 h-5" />,
    color: 'from-indigo-500 to-blue-600'
  },
  {
    category: 'rest',
    title: 'Recovery Builds Champions',
    message: 'The strongest athletes know when to rest. Your body repairs and strengthens during sleep - make it count.',
    icon: <Moon className="w-5 h-5" />,
    color: 'from-teal-500 to-indigo-600'
  },
  {
    category: 'rest',
    title: 'Overtraining is Regression',
    message: 'More is not always better. Your nervous system needs time to recover. Sometimes the hardest thing is doing nothing.',
    icon: <Moon className="w-5 h-5" />,
    color: 'from-slate-500 to-teal-600'
  },
  {
    category: 'rest',
    title: 'Sleep Like a Champion',
    message: 'Champions are made while they sleep. 7-9 hours isn\'t a luxury - it\'s a requirement for the transformation you demand.',
    icon: <Moon className="w-5 h-5" />,
    color: 'from-blue-600 to-purple-600'
  }
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState<DailyTip>(mentalTips[0])

  useEffect(() => {
    // Get a consistent tip for today based on the date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const tipIndex = dayOfYear % mentalTips.length
    setCurrentTip(mentalTips[tipIndex])
  }, [])

  const getNewTip = () => {
    // Get a random tip different from the current one
    const availableTips = mentalTips.filter(tip => tip !== currentTip)
    const randomIndex = Math.floor(Math.random() * availableTips.length)
    setCurrentTip(availableTips[randomIndex])
  }

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'challenge':
        return { label: 'Push Beyond Limits', bgColor: 'bg-red-100', textColor: 'text-red-800' }
      case 'celebrate':
        return { label: 'Strength Earned', bgColor: 'bg-green-100', textColor: 'text-green-800' }
      case 'rest':
        return { label: 'Recovery Essential', bgColor: 'bg-blue-100', textColor: 'text-blue-800' }
      default:
        return { label: 'Mentzer Mindset', bgColor: 'bg-gray-100', textColor: 'text-gray-800' }
    }
  }

  const categoryInfo = getCategoryInfo(currentTip.category)

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            Fitness Tips
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={`${categoryInfo.bgColor} ${categoryInfo.textColor} border-0`}>
              {categoryInfo.label}
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={getNewTip}
              className="border-amber-200 hover:bg-amber-50"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={`bg-gradient-to-r ${currentTip.color} p-6 rounded-xl text-white shadow-lg`}>
          <div className="flex items-start gap-4">
            <div className="bg-white/20 rounded-full p-2 flex-shrink-0">
              {currentTip.icon}
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">{currentTip.title}</h3>
              <p className="text-white/95 leading-relaxed font-medium">{currentTip.message}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            ⚡ High-intensity training mindset • Mike Mentzer principles
          </p>
        </div>
      </CardContent>
    </Card>
  )
}