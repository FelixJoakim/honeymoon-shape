#!/usr/bin/env node

/**
 * Script to create sample users for the Honeymoon Shape app
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupSampleUsers() {
  console.log('🚀 Setting up sample users for Honeymoon Shape...\n');
  
  try {
    // Create first user (Felix)
    console.log('👤 Creating user 1: Felix...');
    const { data: user1, error: error1 } = await supabase.auth.admin.createUser({
      email: 'felix@honeymoon.app',
      password: 'password123',
      email_confirm: true,
      user_metadata: {
        first_name: 'Felix',
        role: 'groom'
      }
    });
    
    if (error1) {
      console.log('❌ Error creating user 1:', error1.message);
    } else {
      console.log('✅ Created Felix:', user1.user.email);
    }
    
    // Create second user (Partner)
    console.log('👤 Creating user 2: Partner...');
    const { data: user2, error: error2 } = await supabase.auth.admin.createUser({
      email: 'partner@honeymoon.app',
      password: 'password123',
      email_confirm: true,
      user_metadata: {
        first_name: 'Partner',
        role: 'bride'
      }
    });
    
    if (error2) {
      console.log('❌ Error creating user 2:', error2.message);
    } else {
      console.log('✅ Created Partner:', user2.user.email);
    }
    
    // Try to create profiles table if it doesn't exist
    console.log('\n📋 Setting up profiles table...');
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID REFERENCES auth.users(id) PRIMARY KEY,
        first_name TEXT,
        last_name TEXT,
        role TEXT CHECK (role IN ('bride', 'groom', 'partner')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Enable RLS
      ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
      
      -- Create policy for users to see their own profile
      CREATE POLICY IF NOT EXISTS "Users can view own profile" ON public.profiles
        FOR SELECT USING (auth.uid() = id);
      
      -- Create policy for users to update their own profile  
      CREATE POLICY IF NOT EXISTS "Users can update own profile" ON public.profiles
        FOR UPDATE USING (auth.uid() = id);
    `;
    
    // We'll need to run this via a function or direct SQL
    console.log('📝 Profiles table schema ready (run manually in Studio if needed)');
    
    // List all users
    console.log('\n📊 Current users:');
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.log('❌ Error listing users:', listError.message);
    } else {
      users.users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email} (${user.user_metadata?.first_name || 'No name'})`);
      });
    }
    
    console.log('\n🎉 Setup complete!');
    console.log('📝 Next steps:');
    console.log('   1. Open Supabase Studio: http://127.0.0.1:54323');
    console.log('   2. Go to SQL Editor and run the profiles table creation script');
    console.log('   3. Test login with: felix@honeymoon.app / password123');
    console.log('   4. Or: partner@honeymoon.app / password123');
    
  } catch (err) {
    console.log('❌ Unexpected error:', err.message);
  }
}

setupSampleUsers();
