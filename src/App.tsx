import React, { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from './utils/supabase/client'
import { projectId, publicAnonKey } from './utils/supabase/info'
import Dashboard from './components/Dashboard'
import OnboardingSimple from './components/OnboardingSimple'
import LoginForm from './components/LoginForm'

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

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleOnboardingComplete = async (profileData: UserProfile) => {
    try {
      // In a real app, you would save this to Supabase
      // For now, just set it in local state
      setProfile(profileData)
      console.log('Profile completed:', profileData)
    } catch (error) {
      console.error('Error saving profile:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  const needsOnboarding = !profile

  if (needsOnboarding) {
    return <OnboardingSimple user={user} onComplete={handleOnboardingComplete} />
  }

  return <Dashboard user={user} />
}