#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Set environment variables
process.env.VITE_SUPABASE_URL = 'https://rjppzjhkarsgzvemdkqf.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqcHB6amhrYXJzZ3p2ZW1ka3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDQwNjUsImV4cCI6MjA3MzUyMDA2NX0.d-UPhywkZQsf9HZSyTP3W6eweeADi4IfVvcpFep--kM';

console.log('🚀 Starting honeymoon.fit development server...');
console.log('📡 Connected to remote Supabase');

// Start vite
const vitePath = path.join(__dirname, 'node_modules', '.bin', 'vite');
const vite = spawn(vitePath, ['--port', '3000', '--host'], {
  stdio: 'inherit',
  cwd: __dirname
});

vite.on('close', (code) => {
  console.log(`Vite process exited with code ${code}`);
});

vite.on('error', (err) => {
  console.error('Failed to start vite:', err);
});
