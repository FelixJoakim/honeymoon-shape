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
  const felixProgress = 0 // Reset progress - just getting started
  const anniProgress = 0 // Reset progress for Anni

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
          <CardDescription>Current: {profile?.current_weight || 0}kg → Target: {profile?.target_weight || 0}kg</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span className="font-medium text-amber-600">{felixProgress}%</span>
            </div>
            <Progress value={felixProgress} className="h-3" />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-amber-50 p-3 rounded-lg">
              <p className="text-gray-600">This Week</p>
              <p className="font-bold text-amber-700">Ready to start!</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-gray-600">Workouts</p>
              <p className="font-bold text-orange-700">0/3 done</p>
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
          <CardDescription>Ready to begin the journey together!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span className="font-medium text-amber-600">{anniProgress}%</span>
            </div>
            <Progress value={anniProgress} className="h-3" />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-amber-50 p-3 rounded-lg">
              <p className="text-gray-600">This Week</p>
              <p className="font-bold text-amber-700">Ready to start!</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-gray-600">Workouts</p>
              <p className="font-bold text-orange-700">0/3 done</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}