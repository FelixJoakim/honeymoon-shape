#!/usr/bin/env node

// Script to programmatically confirm Anni's email using Supabase Admin API
import { createClient } from '@supabase/supabase-js'

console.log('🔧 Confirming Anni\'s Email Account')
console.log('===================================')
console.log('')

// Your Supabase credentials - we need the SERVICE ROLE key for admin operations
const supabaseUrl = 'https://rjppzjhkarsgzvemdkqf.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY_HERE'

if (!supabaseServiceKey || supabaseServiceKey === 'YOUR_SERVICE_ROLE_KEY_HERE') {
  console.log('❌ Missing Supabase Service Role Key!')
  console.log('')
  console.log('📋 Manual Steps (Recommended):')
  console.log('1. In the Users table you\'re currently viewing')
  console.log('2. Click on Anni\'s row (nopanenanni7@gmail.com)')
  console.log('3. Look for three dots (⋯) menu or "Actions" button')
  console.log('4. Click "Confirm User" or "Verify Email"')
  console.log('')
  console.log('🔑 Or to use this script, set your service role key:')
  console.log('   Get it from: https://supabase.com/dashboard/project/rjppzjhkarsgzvemdkqf/settings/api')
  console.log('   Look for "service_role" key (starts with eyJ...)')
  console.log('   Then run: SUPABASE_SERVICE_ROLE_KEY=your_key node confirm-anni-email.js')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function confirmAnniEmail() {
  try {
    console.log('🔍 Finding Anni\'s user account...')
    
    // Get user by email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.log('❌ Error listing users:', listError.message)
      return
    }
    
    const anniUser = users.users.find(user => user.email === 'nopanenanni7@gmail.com')
    
    if (!anniUser) {
      console.log('❌ Could not find user: nopanenanni7@gmail.com')
      return
    }
    
    console.log('✅ Found Anni\'s account')
    console.log('   User ID:', anniUser.id)
    console.log('   Email confirmed:', anniUser.email_confirmed_at ? '✅' : '❌')
    
    if (anniUser.email_confirmed_at) {
      console.log('🎉 Anni\'s email is already confirmed!')
      return
    }
    
    console.log('🔧 Confirming email...')
    
    // Update user to confirm email
    const { data, error } = await supabase.auth.admin.updateUserById(
      anniUser.id,
      { 
        email_confirm: true,
        email_confirmed_at: new Date().toISOString()
      }
    )
    
    if (error) {
      console.log('❌ Error confirming email:', error.message)
      return
    }
    
    console.log('🎉 SUCCESS! Anni\'s email has been confirmed!')
    console.log('✅ She can now login with: nopanenanni7@gmail.com / Kuntoon2026')
    console.log('🌐 App URL: https://honeymoon-shape.vercel.app')
    
  } catch (error) {
    console.log('❌ Unexpected error:', error.message)
  }
}

confirmAnniEmail()
