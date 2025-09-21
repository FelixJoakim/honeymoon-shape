import React, { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../utils/supabase/client'
import { projectId, publicAnonKey } from '../utils/supabase/info'
import HoneymoonProgressBar from './dashboard/WeddingProgressBar'
import DashboardHeader from './dashboard/DashboardHeader'
import NavigationTabs from './dashboard/NavigationTabs'
import OverviewContent from './dashboard/OverviewContent'
import WeightTracker from './WeightTracker'
import TrainingLog from './TrainingLog'
import PhotoUpload from './PhotoUpload'
import QuickNotes from './QuickNotes'

interface UserProfile {
  name: string
  email: string
  current_weight: number | null
  target_weight: number | null
  target_date?: string
  primary_goal?: string
  fitness_level?: string
  preferred_workouts?: string
  onboarding_completed?: boolean
  created_at: string
}

interface DashboardProps {
  user: User
  profile: UserProfile | null
}

export default function Dashboard({ user, profile: initialProfile }: DashboardProps) {
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile)
    } else {
      fetchProfile()
    }
  }, [initialProfile])

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a2efb2d/profile`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      const data = await response.json()
      if (data.profile) {
        setProfile(data.profile)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <HoneymoonProgressBar />
      <DashboardHeader 
        userName={profile?.name || 'there'} 
        onSignOut={handleSignOut} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NavigationTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {activeTab === 'overview' && (
          <OverviewContent profile={profile} />
        )}

        {activeTab === 'weight' && (
          <WeightTracker user={user} profile={profile} onProfileUpdate={setProfile} />
        )}

        {activeTab === 'training' && (
          <TrainingLog user={user} />
        )}

        {activeTab === 'photos' && (
          <PhotoUpload user={user} />
        )}

        {activeTab === 'notes' && (
          <QuickNotes user={user} />
        )}
      </div>
    </div>
  )
}