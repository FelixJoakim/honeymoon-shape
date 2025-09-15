#!/usr/bin/env node

/**
 * Script to check users in the local Supabase database
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUsers() {
  console.log('🔍 Checking users in local Supabase...\n');
  
  try {
    // Check auth.users table
    const { data: users, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.log('❌ Error fetching users:', error.message);
      return;
    }
    
    console.log(`📊 Found ${users.users.length} users:`);
    
    if (users.users.length === 0) {
      console.log('   No users found in the database.');
      console.log('   You can create users via:');
      console.log('   - Supabase Studio: http://127.0.0.1:54323');
      console.log('   - Your app registration flow');
      console.log('   - Auth API calls');
    } else {
      users.users.forEach((user, index) => {
        console.log(`\n👤 User ${index + 1}:`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Email: ${user.email || 'No email'}`);
        console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`);
        console.log(`   Last Sign In: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}`);
        console.log(`   Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
        
        if (user.user_metadata && Object.keys(user.user_metadata).length > 0) {
          console.log(`   Metadata:`, user.user_metadata);
        }
      });
    }
    
    // Check if there's a profiles table
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*');
      
    if (!profileError && profiles) {
      console.log(`\n📋 Found ${profiles.length} profiles in profiles table:`);
      profiles.forEach((profile, index) => {
        console.log(`   Profile ${index + 1}:`, profile);
      });
    } else {
      console.log('\n📋 No profiles table found or error accessing it:', profileError?.message || 'Table might not exist');
    }
    
  } catch (err) {
    console.log('❌ Unexpected error:', err.message);
  }
}

checkUsers();
