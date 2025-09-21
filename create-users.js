#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

// Your remote Supabase credentials
const supabaseUrl = 'https://rjppzjhkarsgzvemdkqf.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqcHB6amhrYXJzZ3p2ZW1ka3FmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk0NDA2NSwiZXhwIjoyMDczNTIwMDY1fQ.QBCLhMNL2P8_8HbnQYwjrEzPqzWQFNUOz9qPYUJSmg4' // We'll need the service role key

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

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

async function createUsers() {
  console.log('🔐 Creating users in Supabase...')
  
  for (const user of users) {
    try {
      console.log(`\n👤 Creating user: ${user.email}`)
      
      // Use admin API to create user
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          name: user.name
        }
      })

      if (error) {
        console.error(`❌ Error creating ${user.email}:`, error.message)
      } else {
        console.log(`✅ Successfully created ${user.email}`)
        console.log(`   User ID: ${data.user.id}`)
      }
    } catch (err) {
      console.error(`❌ Failed to create ${user.email}:`, err.message)
    }
  }
  
  console.log('\n🎉 User creation process completed!')
  console.log('\n📱 You can now login with:')
  console.log('   - fleminen@gmail.com / Kuntoon2026')
  console.log('   - nopanenanni7@gmail.com / Kuntoon2026')
}

createUsers().catch(console.error)
