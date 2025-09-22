#!/usr/bin/env node

// Debug script to check weight_entries table status
import { createClient } from '@supabase/supabase-js'

// Use the same credentials as the app
const supabaseUrl = 'https://rjppzjhkarsgzvemdkqf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqcHB6amhrYXJzZ3p2ZW1ka3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDQwNjUsImV4cCI6MjA3MzUyMDA2NX0.d-UPhywkZQsf9HZSyTP3W6eweeADi4IfVvcpFep--kM'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('🔍 Debug: Weight Entries Table')
console.log('===============================')
console.log('')

async function debugWeightTable() {
  try {
    // First, test login to get a valid session
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
    
    // Test if weight_entries table exists and is accessible
    console.log('2. Testing weight_entries table access...')
    const { data, error } = await supabase
      .from('weight_entries')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('❌ Error accessing weight_entries table:', error)
      console.log('   Error code:', error.code)
      console.log('   Error message:', error.message)
      
      if (error.code === '42P01') {
        console.log('   ⚠️  Table does not exist!')
      } else if (error.code === '42501') {
        console.log('   ⚠️  Permission denied - RLS policy issue!')
      }
    } else {
      console.log('✅ Weight entries table accessible')
      console.log('   Current entries:', data.length)
    }
    
    // Test inserting a weight entry
    console.log('3. Testing weight entry insertion...')
    const { data: insertData, error: insertError } = await supabase
      .from('weight_entries')
      .insert([{
        user_id: loginData.user.id,
        weight: 95.0,
        date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString()
      }])
      .select()
    
    if (insertError) {
      console.log('❌ Error inserting weight entry:', insertError)
      console.log('   Error code:', insertError.code)
      console.log('   Error message:', insertError.message)
    } else {
      console.log('✅ Successfully inserted test weight entry')
      console.log('   Inserted data:', insertData)
    }
    
    // Sign out after test
    await supabase.auth.signOut()
    
  } catch (error) {
    console.log('❌ Unexpected error:', error.message)
  }
}

async function checkTableExists() {
  console.log('')
  console.log('📋 Manual Verification Steps:')
  console.log('1. Go to: https://supabase.com/dashboard/project/rjppzjhkarsgzvemdkqf/database/tables')
  console.log('2. Look for "weight_entries" table in the list')
  console.log('3. If missing, run the SQL from create-weight-entries-table.sql')
  console.log('4. If present, check the RLS policies by clicking on the table')
  console.log('')
}

debugWeightTable().then(() => {
  checkTableExists()
})
