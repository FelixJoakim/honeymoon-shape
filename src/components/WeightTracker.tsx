import React, { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../utils/supabase/client'
import { projectId, publicAnonKey } from '../utils/supabase/info'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Target, TrendingDown, Plus, Scale } from 'lucide-react'

interface WeightEntry {
  user_id: string
  weight: number
  date: string
  created_at: string
}

interface UserProfile {
  name: string
  email: string
  current_weight: number | null
  target_weight: number | null
  created_at: string
}

interface WeightTrackerProps {
  user: User
  profile: UserProfile | null
  onProfileUpdate: (profile: UserProfile) => void
}

export default function WeightTracker({ user, profile, onProfileUpdate }: WeightTrackerProps) {
  const [currentWeight, setCurrentWeight] = useState('')
  const [targetWeight, setTargetWeight] = useState('')
  const [newWeight, setNewWeight] = useState('')
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [showGoalForm, setShowGoalForm] = useState(false)

  useEffect(() => {
    if (profile?.current_weight) setCurrentWeight(profile.current_weight.toString())
    if (profile?.target_weight) setTargetWeight(profile.target_weight.toString())
    fetchWeightEntries()
  }, [profile])

  const fetchWeightEntries = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a2efb2d/weight`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      const data = await response.json()
      if (data.entries) {
        setWeightEntries(data.entries.sort((a: WeightEntry, b: WeightEntry) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        ))
      }
    } catch (error) {
      console.error('Error fetching weight entries:', error)
    }
  }

  const handleSetGoals = async () => {
    if (!currentWeight || !targetWeight) return

    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a2efb2d/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          current_weight: parseFloat(currentWeight),
          target_weight: parseFloat(targetWeight)
        })
      })

      const data = await response.json()
      if (data.profile) {
        onProfileUpdate(data.profile)
        setShowGoalForm(false)
      }
    } catch (error) {
      console.error('Error setting goals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddWeight = async () => {
    if (!newWeight) return

    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a2efb2d/weight`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          weight: parseFloat(newWeight),
          date: new Date().toISOString().split('T')[0]
        })
      })

      if (response.ok) {
        setNewWeight('')
        fetchWeightEntries()
      }
    } catch (error) {
      console.error('Error adding weight entry:', error)
    } finally {
      setLoading(false)
    }
  }

  const getWeightProgress = () => {
    if (!profile?.current_weight || !profile?.target_weight || weightEntries.length === 0) return 0
    
    const latestWeight = weightEntries[weightEntries.length - 1]?.weight || profile.current_weight
    const totalGoal = Math.abs(profile.current_weight - profile.target_weight)
    const currentProgress = Math.abs(profile.current_weight - latestWeight)
    
    return Math.min(100, (currentProgress / totalGoal) * 100)
  }

  const getChartData = () => {
    return weightEntries.map((entry, index) => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: entry.weight,
      target: profile?.target_weight || 0
    }))
  }

  const getDaysToHoneymoon = () => {
    const honeymoon = new Date('2026-04-25')
    const today = new Date()
    return Math.ceil((honeymoon.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getWeeklyGoal = () => {
    if (!profile?.current_weight || !profile?.target_weight) return 0
    
    const latestWeight = weightEntries.length > 0 
      ? weightEntries[weightEntries.length - 1].weight 
      : profile.current_weight
    
    const daysToHoneymoon = getDaysToHoneymoon()
    const weeksToHoneymoon = daysToHoneymoon / 7
    const totalWeightGoal = latestWeight - profile.target_weight
    
    return Math.abs(totalWeightGoal / weeksToHoneymoon)
  }

  if (!profile?.current_weight || !profile?.target_weight || showGoalForm) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Set Your Weight Goals
            </CardTitle>
            <CardDescription>
              Define your starting point and honeymoon target
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="current-weight">Current Weight (kg)</Label>
                <Input
                  id="current-weight"
                  type="number"
                  step="0.1"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  placeholder="70.0"
                />
              </div>
              <div>
                <Label htmlFor="target-weight">Target Weight (kg)</Label>
                <Input
                  id="target-weight"
                  type="number"
                  step="0.1"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  placeholder="65.0"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleSetGoals}
                disabled={loading || !currentWeight || !targetWeight}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {loading ? 'Setting Goals...' : 'Set Goals'}
              </Button>
              {(profile?.current_weight || profile?.target_weight) && (
                <Button
                  variant="outline"
                  onClick={() => setShowGoalForm(false)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Weight Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Current Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {Math.round(getWeightProgress())}%
            </div>
            <Progress value={getWeightProgress()} className="mb-2" />
            <p className="text-xs text-gray-500">
              {weightEntries.length > 0 
                ? `${weightEntries[weightEntries.length - 1].weight}kg` 
                : `${profile.current_weight}kg`} → {profile.target_weight}kg
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Weekly Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600 mb-2">
              -{getWeeklyGoal().toFixed(1)}kg
            </div>
            <Badge variant="outline" className="text-xs">
              Per week
            </Badge>
            <p className="text-xs text-gray-500 mt-2">
              {getDaysToHoneymoon()} days to honeymoon
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Add Today's Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                type="number"
                step="0.1"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="Weight (kg)"
                className="flex-1"
              />
              <Button
                onClick={handleAddWeight}
                disabled={loading || !newWeight}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weight Chart */}
      {weightEntries.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-blue-600" />
              Weight Progress Chart
            </CardTitle>
            <CardDescription>Your weight journey toward the honeymoon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                    name="Weight (kg)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#1e3a8a" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Target (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goal Management */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-600" />
            Weight Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Current: {profile.current_weight}kg</p>
              <p className="font-medium">Target: {profile.target_weight}kg</p>
              <p className="text-sm text-gray-600">
                Total goal: {Math.abs(profile.current_weight - profile.target_weight)}kg
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowGoalForm(true)}
            >
              Update Goals
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}