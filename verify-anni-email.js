#!/usr/bin/env node

// Script to manually verify Anni's email address
console.log('🔧 Manual Email Verification for Anni')
console.log('=====================================')
console.log('')
console.log('📧 Target User: nopanenanni7@gmail.com')
console.log('')
console.log('👤 Option 1: Manual Verification in Supabase Dashboard')
console.log('1. Go to: https://supabase.com/dashboard/project/rjppzjhkarsgzvemdkqf/auth/users')
console.log('2. Find the user: nopanenanni7@gmail.com')
console.log('3. Click the three dots (⋯) next to the user')
console.log('4. Select "Confirm User"')
console.log('')
console.log('🔧 Option 2: Disable Email Confirmation (Affects All Users)')
console.log('1. Go to: https://supabase.com/dashboard/project/rjppzjhkarsgzvemdkqf/auth/settings')
console.log('2. Scroll down to "Email Confirmation"')
console.log('3. UNCHECK "Enable email confirmations"')
console.log('4. Click "Save"')
console.log('')
console.log('🔍 Option 3: Check User Status')
console.log('1. Go to: https://supabase.com/dashboard/project/rjppzjhkarsgzvemdkqf/auth/users')
console.log('2. Look for nopanenanni7@gmail.com')
console.log('3. Check if "Email Confirmed" column shows ✅ or ❌')
console.log('')
console.log('🎯 Quick Test:')
console.log('After verification, try logging in with:')
console.log('   📧 nopanenanni7@gmail.com')
console.log('   🔑 Kuntoon2026')
console.log('')
console.log('🌐 App URL: https://honeymoon-shape.vercel.app')
console.log('')

// Test current auth status
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rjppzjhkarsgzvemdkqf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqcHB6amhrYXJzZ3p2ZW1ka3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDQwNjUsImV4cCI6MjA3MzUyMDA2NX0.d-UPhywkZQsf9HZSyTP3W6eweeADi4IfVvcpFep--kM'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAnniLogin() {
  console.log('🧪 Testing Anni\'s login...')
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'nopanenanni7@gmail.com',
      password: 'Kuntoon2026'
    })
    
    if (error) {
      if (error.message.includes('Email not confirmed')) {
        console.log('❌ Email confirmation required for Anni')
        console.log('   👆 Use Option 1 or 2 above to fix this')
      } else if (error.message.includes('Invalid login credentials')) {
        console.log('❌ Invalid credentials - password might be wrong')
      } else {
        console.log('❌ Login error:', error.message)
      }
    } else {
      console.log('✅ Success! Anni can login properly')
      console.log('   User ID:', data.user?.id)
      console.log('   Email confirmed:', data.user?.email_confirmed_at ? '✅' : '❌')
      // Sign out after test
      await supabase.auth.signOut()
    }
  } catch (err) {
    console.log('❌ Test failed:', err.message)
  }
}

testAnniLogin()
