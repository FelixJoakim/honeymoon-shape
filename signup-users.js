#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

// Your remote Supabase credentials
const supabaseUrl = 'https://rjppzjhkarsgzvemdkqf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqcHB6amhrYXJzZ3p2ZW1ka3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDQwNjUsImV4cCI6MjA3MzUyMDA2NX0.d-UPhywkZQsf9HZSyTP3W6eweeADi4IfVvcpFep--kM'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const users = [
  {
    email: 'fleminen@gmail.com',
    password: 'Kuntoon2026',
    name: 'Felix'
  },
  {
    email: 'nopanenanni7@gmail.com', 
    password: 'Kuntoon2026',
    name: 'Anni'
  }
]

async function signupUsers() {
  console.log('🔐 Signing up users in Supabase...')
  
  for (const user of users) {
    try {
      console.log(`\n👤 Signing up user: ${user.email}`)
      
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            name: user.name
          }
        }
      })

      if (error) {
        if (error.message.includes('already registered')) {
          console.log(`ℹ️  User ${user.email} already exists`)
        } else {
          console.error(`❌ Error signing up ${user.email}:`, error.message)
        }
      } else {
        console.log(`✅ Successfully signed up ${user.email}`)
        if (data.user) {
          console.log(`   User ID: ${data.user.id}`)
          console.log(`   Email confirmed: ${data.user.email_confirmed_at ? 'Yes' : 'No'}`)
        }
      }
      
      // Sign out after each signup
      await supabase.auth.signOut()
      
    } catch (err) {
      console.error(`❌ Failed to sign up ${user.email}:`, err.message)
    }
  }
  
  console.log('\n🎉 User signup process completed!')
  console.log('\n📱 You can now login with:')
  console.log('   - fleminen@gmail.com / Kuntoon2026')
  console.log('   - nopanenanni7@gmail.com / Kuntoon2026')
  console.log('\n💡 Note: Users may need to confirm their email if confirmation is enabled.')
}

signupUsers().catch(console.error)
