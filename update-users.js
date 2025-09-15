#!/usr/bin/env node

/**
 * Script to update existing users with new credentials
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateUsers() {
  console.log('🔄 Updating user credentials...\n');
  
  try {
    // Update Felix (User 1)
    console.log('👤 Updating Felix...');
    const { data: felix, error: felixError } = await supabase.auth.admin.updateUserById(
      '1a302495-993d-4c95-b24d-6823fd513ba2',
      {
        email: 'fleminen@gmail.com',
        password: 'Kuntoon2026',
        user_metadata: {
          first_name: 'Felix',
          role: 'groom',
          email_verified: true
        }
      }
    );
    
    if (felixError) {
      console.log('❌ Error updating Felix:', felixError.message);
    } else {
      console.log('✅ Updated Felix: fleminen@gmail.com');
    }
    
    // Update Partner (User 2)  
    console.log('👤 Updating Partner...');
    const { data: partner, error: partnerError } = await supabase.auth.admin.updateUserById(
      'efb6725f-9611-4400-8a40-a2a95ece3aca',
      {
        email: 'nopanenanni7@gmail.com',
        password: 'Kuntoon2026',
        user_metadata: {
          first_name: 'Partner',
          role: 'bride',
          email_verified: true
        }
      }
    );
    
    if (partnerError) {
      console.log('❌ Error updating Partner:', partnerError.message);
    } else {
      console.log('✅ Updated Partner: nopanenanni7@gmail.com');
    }
    
    // List updated users
    console.log('\n📊 Updated users:');
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.log('❌ Error listing users:', listError.message);
    } else {
      users.users.forEach((user, index) => {
        console.log(`\n👤 User ${index + 1}:`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Name: ${user.user_metadata?.first_name || 'No name'}`);
        console.log(`   Role: ${user.user_metadata?.role || 'No role'}`);
        console.log(`   Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
      });
    }
    
    console.log('\n🎉 User update complete!');
    console.log('🔑 New login credentials:');
    console.log('   Felix: fleminen@gmail.com / Kuntoon2026');
    console.log('   Partner: nopanenanni7@gmail.com / Kuntoon2026');
    console.log('\n🌐 Test at: http://localhost:3000/');
    
  } catch (err) {
    console.log('❌ Unexpected error:', err.message);
  }
}

updateUsers();
