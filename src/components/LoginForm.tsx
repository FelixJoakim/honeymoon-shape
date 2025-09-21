import React, { useState } from 'react'
import { supabase } from '../utils/supabase/client'
import { projectId, publicAnonKey } from '../utils/supabase/info'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'
import { Heart, Users } from 'lucide-react'

const ALLOWED_EMAILS = ['fleminen@gmail.com', 'nopanenanni7@gmail.com']

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [isPasswordReset, setIsPasswordReset] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    // Check if email is allowed
    if (!ALLOWED_EMAILS.includes(email.toLowerCase())) {
      setError('This app is currently only available for specific users. Please contact the administrator.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a2efb2d/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email, password, name })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Sign up failed')
      }

      // After signup, sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) throw signInError

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    // Check if email is allowed
    if (!ALLOWED_EMAILS.includes(email.toLowerCase())) {
      setError('This app is currently only available for specific users. Please contact the administrator.')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    // Check if email is allowed
    if (!ALLOWED_EMAILS.includes(email.toLowerCase())) {
      setError('Password reset is only available for authorized users.')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password'
      })

      if (error) throw error

      setMessage('Password reset email sent! Check your inbox.')
      setIsPasswordReset(false)
      setIsLogin(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full p-3">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-blue-700">
            honeymoon.fit
          </h1>
          <p className="text-gray-600 mt-2">Your journey to the perfect honeymoon body</p>
          <div className="mt-4 p-3 bg-white/60 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              🏝️ <strong>April 2026</strong> - Honeymoon
            </p>
          </div>
        </div>

        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              {isPasswordReset ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Join the Journey')}
            </CardTitle>
            <CardDescription>
              {isPasswordReset 
                ? 'Enter your email to receive a password reset link' 
                : (isLogin ? 'Sign in to continue your fitness journey' : 'Start your transformation together')
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={isPasswordReset ? handlePasswordReset : (isLogin ? handleSignIn : handleSignUp)} className="space-y-4">
              {!isLogin && !isPasswordReset && (
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Felix or Anni"
                    required
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              {!isPasswordReset && (
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              )}

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {message && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">
                    {message}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={loading}
              >
                {loading ? 'Loading...' : (isPasswordReset ? 'Send Reset Link' : (isLogin ? 'Sign In' : 'Create Account'))}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              {!isPasswordReset && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium block w-full"
                  >
                    {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                  </button>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setIsPasswordReset(true)}
                      className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                    >
                      Forgot your password?
                    </button>
                  )}
                </>
              )}
              
              {isPasswordReset && (
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordReset(false)
                    setIsLogin(true)
                    setError('')
                    setMessage('')
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Back to sign in
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}