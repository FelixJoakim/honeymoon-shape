import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Progress } from '../ui/progress'
import { MOCK_ANNI_PROFILE } from './constants'
import { getWeightProgress } from './helpers'

interface UserProfile {
  name: string
  email: string
  current_weight: number | null
  target_weight: number | null
  created_at: string
}

interface UserProgressCardsProps {
  profile: UserProfile | null
}

export default function UserProgressCards({ profile }: UserProgressCardsProps) {
  // Calculate progress based on weight goal (gain 5kg in 10 weeks = 0.5kg per week)
  const calculateWeightProgress = () => {
    if (!profile?.current_weight || !profile?.target_weight) return 0
    const currentWeight = profile.current_weight
    const targetWeight = profile.target_weight
    const startWeight = currentWeight // Assuming current weight is starting weight for now
    
    // For weight gain: progress = (current - start) / (target - start) * 100
    if (targetWeight > startWeight) {
      const progress = ((currentWeight - startWeight) / (targetWeight - startWeight)) * 100
      return Math.max(0, Math.min(100, progress))
    }
    // For weight loss: progress = (start - current) / (start - target) * 100  
    else {
      const progress = ((startWeight - currentWeight) / (startWeight - targetWeight)) * 100
      return Math.max(0, Math.min(100, progress))
    }
  }

  const calculateWeeklyGoal = () => {
    if (!profile?.current_weight || !profile?.target_weight) return 0
    const totalWeightChange = Math.abs(profile.target_weight - profile.current_weight)
    const weeks = 10 // 10 week program
    return totalWeightChange / weeks
  }

  const felixProgress = calculateWeightProgress()
  const weeklyGoal = calculateWeeklyGoal()
  const isGaining = profile?.target_weight && profile?.current_weight && profile.target_weight > profile.current_weight

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Felix's Progress */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-amber-700">F</span>
            </div>
            Felix's Progress
          </CardTitle>
          <CardDescription>{felixProgress.toFixed(1)}% towards goal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span className="font-medium text-amber-600">{felixProgress.toFixed(1)}%</span>
            </div>
            <Progress value={felixProgress} className="h-3" />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-amber-50 p-3 rounded-lg">
              <p className="text-gray-600">Weekly Goal</p>
              <p className="font-bold text-amber-700">
                {isGaining ? '+' : '-'}{weeklyGoal.toFixed(1)}kg
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-gray-600">Target Weight</p>
              <p className="font-bold text-orange-700">{profile?.target_weight || 0}kg</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Anni's Progress */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-rose-700">A</span>
            </div>
            Anni's Progress
          </CardTitle>
          <CardDescription>0.0% towards goal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span className="font-medium text-amber-600">0%</span>
            </div>
            <Progress value={0} className="h-3" />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-amber-50 p-3 rounded-lg">
              <p className="text-gray-600">Weekly Goal</p>
              <p className="font-bold text-amber-700">
                {isGaining ? '+' : '-'}{weeklyGoal.toFixed(1)}kg
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-gray-600">Target Weight</p>
              <p className="font-bold text-orange-700">{profile?.target_weight || 0}kg</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}