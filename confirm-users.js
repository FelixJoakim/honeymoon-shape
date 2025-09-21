#!/usr/bin/env node

// This script shows you how to manually confirm users in Supabase dashboard
console.log('🔧 Manual Email Confirmation Instructions')
console.log('========================================')
console.log('')
console.log('Since the users were created but need email confirmation, you have two options:')
console.log('')
console.log('🎯 OPTION 1: Disable Email Confirmation (Recommended)')
console.log('1. Go to: https://supabase.com/dashboard/project/rjppzjhkarsgzvemdkqf/auth/settings')
console.log('2. Scroll down to "Email Confirmation"')
console.log('3. UNCHECK "Enable email confirmations"')
console.log('4. Click "Save"')
console.log('')
console.log('🎯 OPTION 2: Manual Confirmation')
console.log('1. Go to: https://supabase.com/dashboard/project/rjppzjhkarsgzvemdkqf/auth/users')
console.log('2. Find users: fleminen@gmail.com and nopanenanni7@gmail.com')
console.log('3. Click the three dots (⋯) next to each user')
console.log('4. Select "Confirm User"')
console.log('')
console.log('✅ Current User Credentials:')
console.log('   📧 fleminen@gmail.com')
console.log('   🔑 Kuntoon2026')
console.log('')
console.log('   📧 nopanenanni7@gmail.com') 
console.log('   🔑 Kuntoon2026')
console.log('')
console.log('🚀 Once confirmed/email confirmation disabled, you can login immediately!')

// Try to get more info about auth settings
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rjppzjhkarsgzvemdkqf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqcHB6amhrYXJzZ3p2ZW1ka3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDQwNjUsImV4cCI6MjA3MzUyMDA2NX0.d-UPhywkZQsf9HZSyTP3W6eweeADi4IfVvcpFep--kM'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkAuthSettings() {
  console.log('\n🔍 Testing login with created credentials...')
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'fleminen@gmail.com',
      password: 'Kuntoon2026'
    })
    
    if (error) {
      if (error.message.includes('Email not confirmed')) {
        console.log('⚠️  Email confirmation is required. Follow Option 1 or 2 above.')
      } else {
        console.log('❌ Login error:', error.message)
      }
    } else {
      console.log('✅ Login successful! Users can access the app now.')
    }
  } catch (err) {
    console.log('❌ Test login failed:', err.message)
  }
}

checkAuthSettings()
