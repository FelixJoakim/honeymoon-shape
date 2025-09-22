#!/usr/bin/env node

// Script to create weight_entries table in Supabase
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// Your Supabase credentials
const supabaseUrl = 'https://rjppzjhkarsgzvemdkqf.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqcHB6amhrYXJzZ3p2ZW1ka3FmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk0NDA2NSwiZXhwIjoyMDczNTIwMDY1fQ.Qgfj2SorjepB-WxHMqUHK-ykVqoXhCfNKhf8wHZzejY'

console.log('🏋️ Setting up weight_entries table...')
console.log('========================================')
console.log('')

if (!supabaseServiceKey || supabaseServiceKey.includes('your_service_role_key')) {
  console.log('❌ Missing Supabase service role key!')
  console.log('')
  console.log('📋 Manual Setup Instructions:')
  console.log('1. Go to: https://supabase.com/dashboard/project/rjppzjhkarsgzvemdkqf/sql')
  console.log('2. Copy and paste the SQL from: create-weight-entries-table.sql')
  console.log('3. Click "Run" to create the table')
  console.log('')
  console.log('🔗 Or paste this SQL directly:')
  console.log('')
  
  // Read and display the SQL file content
  try {
    const sqlContent = fs.readFileSync('./create-weight-entries-table.sql', 'utf8')
    console.log(sqlContent)
  } catch (err) {
    console.log('Could not read SQL file:', err.message)
  }
  
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createWeightEntriesTable() {
  try {
    console.log('🔧 Creating weight_entries table...')
    
    // Read SQL file
    const sqlContent = fs.readFileSync('./create-weight-entries-table.sql', 'utf8')
    
    // Execute SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent })
    
    if (error) {
      console.error('❌ Error creating table:', error)
      console.log('')
      console.log('📋 Manual Setup Required:')
      console.log('1. Go to: https://supabase.com/dashboard/project/rjppzjhkarsgzvemdkqf/sql')
      console.log('2. Copy and paste the SQL from: create-weight-entries-table.sql')
      console.log('3. Click "Run" to create the table')
      return
    }
    
    console.log('✅ Weight entries table created successfully!')
    console.log('🎉 Weight tracking should now work in the app!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('')
    console.log('📋 Manual Setup Required:')
    console.log('1. Go to: https://supabase.com/dashboard/project/rjppzjhkarsgzvemdkqf/sql')
    console.log('2. Copy and paste the SQL from: create-weight-entries-table.sql')
    console.log('3. Click "Run" to create the table')
  }
}

createWeightEntriesTable()
