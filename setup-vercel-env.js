#!/usr/bin/env node

// Script to configure Vercel environment variables
// Usage: node setup-vercel-env.js <SUPABASE_URL> <SUPABASE_ANON_KEY>

const { execSync } = require('child_process');

if (process.argv.length !== 4) {
    console.log('❌ Usage: node setup-vercel-env.js <SUPABASE_URL> <SUPABASE_ANON_KEY>');
    console.log('📝 Example: node setup-vercel-env.js https://abc123xyz.supabase.co eyJhbGciOiJIUzI1NiIs...');
    process.exit(1);
}

const supabaseUrl = process.argv[2];
const supabaseAnonKey = process.argv[3];

console.log('🔧 Configuring Vercel environment variables...');

try {
    // Check if Vercel CLI is installed
    try {
        execSync('vercel --version', { stdio: 'ignore' });
        console.log('✅ Vercel CLI found');
    } catch (error) {
        console.log('📦 Installing Vercel CLI...');
        execSync('npm install -g vercel', { stdio: 'inherit' });
    }

    // Login to Vercel (if not already logged in)
    console.log('🔑 Checking Vercel authentication...');
    try {
        execSync('vercel whoami', { stdio: 'ignore' });
        console.log('✅ Already logged in to Vercel');
    } catch (error) {
        console.log('🔑 Please login to Vercel when prompted...');
        execSync('vercel login', { stdio: 'inherit' });
    }

    // Link project if not already linked
    console.log('🔗 Linking Vercel project...');
    try {
        execSync('vercel link --yes', { stdio: 'inherit' });
    } catch (error) {
        console.log('ℹ️  Project may already be linked');
    }

    // Add environment variables
    console.log('📝 Adding VITE_SUPABASE_URL...');
    execSync(`echo "${supabaseUrl}" | vercel env add VITE_SUPABASE_URL production`, { stdio: 'inherit' });

    console.log('📝 Adding VITE_SUPABASE_ANON_KEY...');
    execSync(`echo "${supabaseAnonKey}" | vercel env add VITE_SUPABASE_ANON_KEY production`, { stdio: 'inherit' });

    console.log('🚀 Triggering production deployment...');
    execSync('vercel --prod', { stdio: 'inherit' });

    console.log('✅ Done! Your app should now work on mobile devices.');
    console.log('🔗 Check your deployment at your Vercel URL');

} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}

