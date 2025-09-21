#!/bin/bash

# Script to configure Vercel environment variables for Supabase
# Usage: ./configure-vercel-env.sh <SUPABASE_URL> <SUPABASE_ANON_KEY>

if [ $# -ne 2 ]; then
    echo "Usage: $0 <SUPABASE_URL> <SUPABASE_ANON_KEY>"
    echo "Example: $0 https://abc123xyz.supabase.co eyJhbGciOiJIUzI1NiIs..."
    exit 1
fi

SUPABASE_URL=$1
SUPABASE_ANON_KEY=$2

echo "🔧 Configuring Vercel environment variables..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Add environment variables
echo "📝 Adding VITE_SUPABASE_URL..."
vercel env add VITE_SUPABASE_URL production <<< "$SUPABASE_URL"

echo "📝 Adding VITE_SUPABASE_ANON_KEY..."
vercel env add VITE_SUPABASE_ANON_KEY production <<< "$SUPABASE_ANON_KEY"

echo "🚀 Triggering redeploy..."
vercel --prod

echo "✅ Done! Your app should now work on mobile devices."
echo "🔗 Test your deployment at: https://your-project.vercel.app"

