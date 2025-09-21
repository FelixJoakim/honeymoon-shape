#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

// Your remote Supabase credentials
const supabaseUrl = 'https://rjppzjhkarsgzvemdkqf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqcHB6amhrYXJzZ3p2ZW1ka3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDQwNjUsImV4cCI6MjA3MzUyMDA2NX0.d-UPhywkZQsf9HZSyTP3W6eweeADi4IfVvcpFep--kM'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('🔧 Email Confirmation Fix Instructions')
console.log('=====================================')
console.log('')
console.log('🎯 QUICK FIX - Disable Email Confirmation (Recommended)')
console.log('1. Go to: https://supabase.com/dashboard/project/rjppzjhkarsgzvemdkqf/auth/settings')
console.log('2. Scroll down to "Email Confirmation"')
console.log('3. UNCHECK "Enable email confirmations"')
console.log('4. Click "Save"')
console.log('')
console.log('✅ This will immediately allow login with:')
console.log('   📧 fleminen@gmail.com / 🔑 Kuntoon2026')
console.log('   📧 nopanenanni7@gmail.com / 🔑 Kuntoon2026')
console.log('')
console.log('🔗 Alternative: Fix the confirmation link')
console.log('   Replace "localhost:3000" with "honeymoon-shape.vercel.app" in your link:')
console.log('   https://rjppzjhkarsgzvemdkqf.supabase.co/auth/v1/verify?token=8a504178f10d5a563582257034c05ef60aa4307a4a7c7b7491b7bcc5&type=signup&redirect_to=https://honeymoon-shape.vercel.app')
console.log('')

// Test if email confirmation is disabled
async function testLogin() {
  console.log('🧪 Testing if email confirmation is disabled...')
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'fleminen@gmail.com',
      password: 'Kuntoon2026'
    })
    
    if (error) {
      if (error.message.includes('Email not confirmed')) {
        console.log('⚠️  Email confirmation is still required.')
        console.log('    Please disable it in Supabase Dashboard (Option above)')
      } else {
        console.log('❌ Login error:', error.message)
      }
    } else {
      console.log('🎉 SUCCESS! Login works - email confirmation is disabled!')
      console.log('✅ You can now login at: https://honeymoon-shape.vercel.app')
      // Sign out after test
      await supabase.auth.signOut()
    }
  } catch (err) {
    console.log('❌ Test failed:', err.message)
  }
}

// Also try to resend confirmation with correct URL
async function resendConfirmation() {
  console.log('\n📧 Attempting to resend confirmation with correct URL...')
  
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: 'fleminen@gmail.com',
      options: {
        emailRedirectTo: 'https://honeymoon-shape.vercel.app'
      }
    })
    
    if (error) {
      console.log('⚠️  Could not resend confirmation:', error.message)
    } else {
      console.log('✅ Confirmation email resent with correct URL!')
    }
  } catch (err) {
    console.log('⚠️  Resend failed:', err.message)
  }
}

// Run tests
testLogin().then(() => {
  resendConfirmation()
})
