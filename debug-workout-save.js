#!/usr/bin/env node

// Debug script to test workout saving functionality
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rjppzjhkarsgzvemdkqf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqcHB6amhrYXJzZ3p2ZW1ka3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDQwNjUsImV4cCI6MjA3MzUyMDA2NX0.d-UPhywkZQsf9HZSyTP3W6eweeADi4IfVvcpFep--kM'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('🔍 Debug: Workout Save Functionality')
console.log('====================================')
console.log('')

async function debugWorkoutSave() {
  try {
    // Test login
    console.log('1. Testing login...')
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'fleminen@gmail.com',
      password: 'Kuntoon2026'
    })
    
    if (loginError) {
      console.log('❌ Login failed:', loginError.message)
      return
    }
    
    console.log('✅ Login successful, user ID:', loginData.user.id)
    
    // Test workout data structure
    const testWorkoutData = {
      user_id: loginData.user.id,
      user_name: 'Test User',
      workout_name: 'HIT A (Upper Body)',
      date: new Date().toISOString().split('T')[0],
      exercises: [
        {
          name: 'Leveä leuka',
          sets: [
            { reps: '11', weight: '0' },
            { reps: '10', weight: '0' }
          ]
        }
      ],
      notes: 'Test workout',
      endorsements: [],
      created_at: new Date().toISOString()
    }
    
    console.log('2. Testing workout data structure...')
    console.log('   Workout data:', JSON.stringify(testWorkoutData, null, 2))
    
    // Test insert into hit_workouts table
    console.log('3. Testing workout insert...')
    const { data, error } = await supabase
      .from('hit_workouts')
      .insert([testWorkoutData])
      .select()
    
    if (error) {
      console.log('❌ Error inserting workout:', error)
      console.log('   Error code:', error.code)
      console.log('   Error message:', error.message)
      console.log('   Error details:', error.details)
      console.log('   Error hint:', error.hint)
    } else {
      console.log('✅ Successfully inserted test workout!')
      console.log('   Inserted data:', data)
    }
    
    // Test fetching workouts
    console.log('4. Testing workout fetch...')
    const { data: fetchData, error: fetchError } = await supabase
      .from('hit_workouts')
      .select('*')
      .eq('user_id', loginData.user.id)
      .order('date', { ascending: false })
    
    if (fetchError) {
      console.log('❌ Error fetching workouts:', fetchError)
    } else {
      console.log('✅ Successfully fetched workouts')
      console.log('   Workout count:', fetchData.length)
      console.log('   Workouts:', fetchData)
    }
    
    // Sign out after test
    await supabase.auth.signOut()
    
  } catch (error) {
    console.log('❌ Unexpected error:', error.message)
  }
}

debugWorkoutSave()
