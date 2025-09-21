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
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error fetching profile:', error)
      }

      if (data) {
        setProfile({
          name: data.full_name || '',
          email: data.email || '',
          current_weight: data.current_weight,
          target_weight: data.goal_weight,
          wedding_date: data.wedding_date,
          primary_goal: data.primary_goal,
          secondary_goal: data.secondary_goal,
          fitness_level: data.fitness_level,
          preferred_workouts: data.preferred_workouts,
          onboarding_completed: true,
          created_at: data.created_at
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOnboardingComplete = async (profileData: UserProfile) => {
    if (!user) return

    try {
      // Save to Supabase profiles table
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: profileData.name,
          current_weight: profileData.current_weight,
          goal_weight: profileData.target_weight,
          wedding_date: profileData.wedding_date,
          primary_goal: profileData.primary_goal,
          secondary_goal: profileData.secondary_goal,
          fitness_level: profileData.fitness_level,
          preferred_workouts: profileData.preferred_workouts,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      // Update local state
      setProfile(profileData)
      console.log('Profile saved successfully:', profileData)
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

  return <Dashboard user={user} profile={profile} />
}