#!/usr/bin/env node

// Check current security status of all tables
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rjppzjhkarsgzvemdkqf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqcHB6amhrYXJzZ3p2ZW1ka3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDQwNjUsImV4cCI6MjA3MzUyMDA2NX0.d-UPhywkZQsf9HZSyTP3W6eweeADi4IfVvcpFep--kM'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('🔒 Security Status Check')
console.log('=======================')
console.log('')

async function checkSecurityStatus() {
  try {
    // Test 1: Try to access data without authentication
    console.log('1. Testing unauthenticated access...')
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
      
      if (error) {
        console.log('✅ Profiles table is protected:', error.message)
      } else {
        console.log('❌ Profiles table is NOT protected - data accessible!')
        console.log('   Data:', data)
      }
    } catch (err) {
      console.log('✅ Profiles table is protected:', err.message)
    }
    
    try {
      const { data, error } = await supabase
        .from('weight_entries')
        .select('*')
        .limit(1)
      
      if (error) {
        console.log('✅ Weight entries table is protected:', error.message)
      } else {
        console.log('❌ Weight entries table is NOT protected - data accessible!')
        console.log('   Data:', data)
      }
    } catch (err) {
      console.log('✅ Weight entries table is protected:', err.message)
    }
    
    try {
      const { data, error } = await supabase
        .from('hit_workouts')
        .select('*')
        .limit(1)
      
      if (error) {
        console.log('✅ Hit workouts table is protected:', error.message)
      } else {
        console.log('❌ Hit workouts table is NOT protected - data accessible!')
        console.log('   Data:', data)
      }
    } catch (err) {
      console.log('✅ Hit workouts table is protected:', err.message)
    }
    
    // Test 2: Check if we can access with wrong credentials
    console.log('')
    console.log('2. Testing with invalid credentials...')
    
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'fake@email.com',
      password: 'wrongpassword'
    })
    
    if (loginError) {
      console.log('✅ Invalid login is rejected:', loginError.message)
    } else {
      console.log('❌ Invalid login was accepted - security issue!')
    }
    
    // Test 3: Check with valid credentials
    console.log('')
    console.log('3. Testing with valid credentials...')
    
    const { data: validLogin, error: validError } = await supabase.auth.signInWithPassword({
      email: 'fleminen@gmail.com',
      password: 'Kuntoon2026'
    })
    
    if (validError) {
      console.log('❌ Valid login failed:', validError.message)
    } else {
      console.log('✅ Valid login works')
      
      // Test accessing own data
      const { data: ownProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', validLogin.user.id)
        .single()
      
      if (profileError) {
        console.log('❌ Cannot access own profile:', profileError.message)
      } else {
        console.log('✅ Can access own profile (this is correct)')
      }
    }
    
  } catch (error) {
    console.log('❌ Unexpected error:', error.message)
  }
}

checkSecurityStatus()
