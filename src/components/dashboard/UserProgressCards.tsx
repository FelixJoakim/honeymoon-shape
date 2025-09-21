import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Progress } from '../ui/progress'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Camera, MessageSquare, Heart, Eye, Mail, Send } from 'lucide-react'
import { MOCK_ANNI_PROFILE } from './constants'
import { getWeightProgress } from './helpers'

interface UserProfile {
  name: string
  email: string
  current_weight: number | null
  target_weight: number | null
  created_at: string
}

interface UserProgressCardsProps {
  profile: UserProfile | null
}

export default function UserProgressCards({ profile }: UserProgressCardsProps) {
  const [showPartnerProgress, setShowPartnerProgress] = useState(false)
  const [showEncouragementForm, setShowEncouragementForm] = useState(false)
  const [encouragementMessage, setEncouragementMessage] = useState('')
  const [emailSending, setEmailSending] = useState(false)
  
  // Determine if current user is Felix or Anni
  const isFelix = profile?.email === 'fleminen@gmail.com' || profile?.name?.toLowerCase().includes('felix')

  // Mock data for latest photos and thoughts
  const latestPhoto = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face"
  const latestThought = "Feeling stronger every day! 💪"
  const partnerPhoto = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
  const partnerThought = "Ready to reach our goals together! ❤️"

  // Calculate progress based on weight goal (gain 5kg in 10 weeks = 0.5kg per week)
  const calculateWeightProgress = () => {
    if (!profile?.current_weight || !profile?.target_weight) return 0
    const currentWeight = profile.current_weight
    const targetWeight = profile.target_weight
    const startWeight = currentWeight // Assuming current weight is starting weight for now
    
    // For weight gain: progress = (current - start) / (target - start) * 100
    if (targetWeight > startWeight) {
      const progress = ((currentWeight - startWeight) / (targetWeight - startWeight)) * 100
      return Math.max(0, Math.min(100, progress))
    }
    // For weight loss: progress = (start - current) / (start - target) * 100  
    else {
      const progress = ((startWeight - currentWeight) / (startWeight - targetWeight)) * 100
      return Math.max(0, Math.min(100, progress))
    }
  }

  const calculateWeeklyGoal = () => {
    if (!profile?.current_weight || !profile?.target_weight) return 0
    const totalWeightChange = Math.abs(profile.target_weight - profile.current_weight)
    const weeks = 10 // 10 week program
    return totalWeightChange / weeks
  }

  const felixProgress = calculateWeightProgress()
  const weeklyGoal = calculateWeeklyGoal()
  const isGaining = profile?.target_weight && profile?.current_weight && profile.target_weight > profile.current_weight

  const currentUserName = isFelix ? 'Felix' : 'Anni'
  const partnerName = isFelix ? 'Anni' : 'Felix'
  const partnerEmail = isFelix ? 'nopanenanni7@gmail.com' : 'fleminen@gmail.com'
  const currentUserInitial = isFelix ? 'F' : 'A'
  const partnerInitial = isFelix ? 'A' : 'F'
  const currentUserColor = isFelix ? 'amber' : 'rose'
  const partnerColor = isFelix ? 'rose' : 'amber'

  const sendEncouragementEmail = async () => {
    if (!encouragementMessage.trim()) return
    
    setEmailSending(true)
    try {
      // For demo purposes, we'll simulate email sending
      // In production, this would integrate with Supabase Edge Functions + email service
      console.log(`Sending encouragement email to ${partnerEmail}:`, encouragementMessage)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      alert(`Encouragement sent to ${partnerName}! 💪❤️`)
      setEncouragementMessage('')
      setShowEncouragementForm(false)
    } catch (error) {
      console.error('Error sending encouragement:', error)
      alert('Failed to send encouragement. Please try again.')
    } finally {
      setEmailSending(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Current User's Progress */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className={`w-8 h-8 bg-${currentUserColor}-100 rounded-full flex items-center justify-center`}>
              <span className={`text-sm font-bold text-${currentUserColor}-700`}>{currentUserInitial}</span>
            </div>
            {currentUserName}'s Progress
          </CardTitle>
          <CardDescription>{felixProgress.toFixed(1)}% towards goal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span className="font-medium text-amber-600">{felixProgress.toFixed(1)}%</span>
            </div>
            <Progress value={felixProgress} className="h-3" />
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-amber-50 p-3 rounded-lg">
                <p className="text-gray-600">Weekly Goal</p>
                <p className="font-bold text-amber-700">
                  {isGaining ? '+' : '-'}{weeklyGoal.toFixed(1)}kg
                </p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-gray-600">Target Weight</p>
                <p className="font-bold text-orange-700">{profile?.target_weight || 0}kg</p>
              </div>
            </div>
            
            {/* Latest Photo and Thought */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src={latestPhoto} 
                    alt="Latest progress"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Camera className="w-3 h-3 text-amber-600" />
                    <span className="text-xs text-amber-600 font-medium">Latest Update</span>
                  </div>
                  <p className="text-sm text-gray-700 italic">"{latestThought}"</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partner's Progress */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className={`w-8 h-8 bg-${partnerColor}-100 rounded-full flex items-center justify-center`}>
              <span className={`text-sm font-bold text-${partnerColor}-700`}>{partnerInitial}</span>
            </div>
            {partnerName}'s Progress
          </CardTitle>
          <CardDescription>0.0% towards goal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span className="font-medium text-amber-600">0%</span>
            </div>
            <Progress value={0} className="h-3" />
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-amber-50 p-3 rounded-lg">
                <p className="text-gray-600">Weekly Goal</p>
                <p className="font-bold text-amber-700">
                  {isGaining ? '+' : '-'}{weeklyGoal.toFixed(1)}kg
                </p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-gray-600">Target Weight</p>
                <p className="font-bold text-orange-700">{profile?.target_weight || 0}kg</p>
              </div>
            </div>
            
            {/* Latest Photo and Thought for Anni */}
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-4 rounded-lg border border-rose-200">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src={partnerPhoto} 
                    alt="Latest progress"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Camera className="w-3 h-3 text-rose-600" />
                    <span className="text-xs text-rose-600 font-medium">Latest Update</span>
                  </div>
                  <p className="text-sm text-gray-700 italic">"{partnerThought}"</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-rose-200 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPartnerProgress(!showPartnerProgress)}
                  className="w-full text-xs"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  {showPartnerProgress ? 'Hide' : 'View'} {partnerName}'s Gallery & Workouts
                </Button>
                
                {!showEncouragementForm ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEncouragementForm(true)}
                    className="w-full text-xs bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100"
                  >
                    <Mail className="w-3 h-3 mr-1" />
                    Send Encouragement to {partnerName}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Textarea
                      placeholder={`Write something encouraging for ${partnerName}...`}
                      value={encouragementMessage}
                      onChange={(e) => setEncouragementMessage(e.target.value)}
                      className="text-xs resize-none"
                      rows={3}
                    />
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={sendEncouragementEmail}
                        disabled={emailSending || !encouragementMessage.trim()}
                        className="flex-1 text-xs bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                      >
                        <Send className="w-3 h-3 mr-1" />
                        {emailSending ? 'Sending...' : 'Send'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setShowEncouragementForm(false)
                          setEncouragementMessage('')
                        }}
                        className="text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}