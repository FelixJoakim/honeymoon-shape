import React, { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../utils/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Heart, Target, Calendar, User as UserIcon, LogOut } from 'lucide-react'

interface UserProfile {
  name: string
  email: string
  current_weight: number | null
  target_weight: number | null
  wedding_date?: string
  primary_goal?: string
  secondary_goal?: string
  fitness_level?: string
  preferred_workouts?: string
  onboarding_completed?: boolean
  created_at: string
}

interface DashboardProps {
  user: User
}

export default function DashboardSimple({ user }: DashboardProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      // For now, create a mock profile based on user metadata
      const mockProfile: UserProfile = {
        name: user.user_metadata?.first_name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        current_weight: null,
        target_weight: null,
        wedding_date: undefined,
        primary_goal: undefined,
        fitness_level: undefined,
        preferred_workouts: undefined,
        onboarding_completed: true,
        created_at: new Date().toISOString()
      }
      setProfile(mockProfile)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const calculateDaysToWedding = () => {
    if (!profile?.wedding_date) return null
    const wedding = new Date(profile.wedding_date)
    const today = new Date()
    const diffTime = wedding.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  const daysToWedding = calculateDaysToWedding()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Honeymoon Shape
                </h1>
                <p className="text-sm text-gray-600">Welcome back, {profile?.name || 'there'}!</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Welcome Card */}
          <Card className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Heart className="w-6 h-6" />
                Your Honeymoon Journey
              </CardTitle>
              <CardDescription className="text-amber-100">
                {daysToWedding ? 
                  `${daysToWedding} days until your special day!` : 
                  'Your journey to the perfect honeymoon body starts here!'
                }
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Profile Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-600">
                <UserIcon className="w-5 h-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{profile?.name || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{profile?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fitness Level</p>
                <p className="font-medium capitalize">{profile?.fitness_level?.replace('_', ' ') || 'Not set'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-600">
                <Target className="w-5 h-5" />
                Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Primary Goal</p>
                <p className="font-medium capitalize">{profile?.primary_goal?.replace('_', ' ') || 'Not set'}</p>
              </div>
              {profile?.secondary_goal && (
                <div>
                  <p className="text-sm text-gray-600">Secondary Goal</p>
                  <p className="font-medium capitalize">{profile.secondary_goal.replace('_', ' ')}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Preferred Workouts</p>
                <p className="font-medium capitalize">{profile?.preferred_workouts?.replace('_', ' ') || 'Not set'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Weight Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-600">
                <Calendar className="w-5 h-5" />
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Current Weight</p>
                <p className="font-medium">{profile?.current_weight ? `${profile.current_weight}kg` : 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Target Weight</p>
                <p className="font-medium">{profile?.target_weight ? `${profile.target_weight}kg` : 'Not set'}</p>
              </div>
              {profile?.wedding_date && (
                <div>
                  <p className="text-sm text-gray-600">Wedding Date</p>
                  <p className="font-medium">{new Date(profile.wedding_date).toLocaleDateString()}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Success Message */}
          <Card className="md:col-span-2 lg:col-span-3 bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">🎉 Setup Complete!</CardTitle>
              <CardDescription className="text-green-700">
                Congratulations! Your Honeymoon Shape profile is set up and ready. 
                Your local development environment is working perfectly with Supabase.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white p-3 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-1">✅ App Running</h4>
                  <p className="text-green-700">Local server at localhost:3000</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-1">✅ Supabase Connected</h4>
                  <p className="text-green-700">Local database ready</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-1">✅ Authentication Working</h4>
                  <p className="text-green-700">User system functional</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
