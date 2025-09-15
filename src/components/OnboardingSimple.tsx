import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Calendar, Target, Heart, User } from 'lucide-react'
import { User as SupabaseUser } from '@supabase/supabase-js'

interface OnboardingProps {
  user: SupabaseUser
  onComplete: (profile: any) => void
}

export default function OnboardingSimple({ user, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: user.user_metadata?.name || '',
    currentWeight: '',
    targetWeight: '',
    weddingDate: '',
    primaryGoal: '',
    secondaryGoal: '',
    fitnessLevel: '',
    preferredWorkouts: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Complete onboarding
      const profile = {
        name: formData.name,
        email: user.email,
        current_weight: parseFloat(formData.currentWeight),
        target_weight: parseFloat(formData.targetWeight),
        wedding_date: formData.weddingDate,
        primary_goal: formData.primaryGoal,
        secondary_goal: formData.secondaryGoal,
        fitness_level: formData.fitnessLevel,
        preferred_workouts: formData.preferredWorkouts,
        created_at: new Date().toISOString(),
        onboarding_completed: true
      }
      onComplete(profile)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name.trim() !== '' && formData.currentWeight !== '' && formData.targetWeight !== ''
      case 2:
        return formData.weddingDate !== '' && formData.primaryGoal !== ''
      case 3:
        return formData.fitnessLevel !== ''
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Welcome to honeymoon.fit!
          </CardTitle>
          <CardDescription className="text-gray-600">
            Let's set up your fitness journey for the perfect honeymoon body
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i === step
                    ? 'bg-amber-500'
                    : i < step
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-gray-900">Basic Information</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentWeight">Current Weight (kg)</Label>
                <Input
                  id="currentWeight"
                  type="number"
                  value={formData.currentWeight}
                  onChange={(e) => handleInputChange('currentWeight', e.target.value)}
                  placeholder="Enter your current weight"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetWeight">Target Weight (kg)</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  value={formData.targetWeight}
                  onChange={(e) => handleInputChange('targetWeight', e.target.value)}
                  placeholder="Enter your target weight"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-gray-900">Goals & Timeline</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weddingDate">Wedding Date</Label>
                <Input
                  id="weddingDate"
                  type="date"
                  value={formData.weddingDate}
                  onChange={(e) => handleInputChange('weddingDate', e.target.value)}
                  placeholder="When is your special day?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryGoal">Primary Goal (Start with this)</Label>
                <select 
                  value={formData.primaryGoal} 
                  onChange={(e) => handleInputChange('primaryGoal', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select your main focus</option>
                  <option value="build_muscle">Build Muscle</option>
                  <option value="lose_weight">Lose Weight</option>
                  <option value="tone_up">Tone Up</option>
                  <option value="get_fit">General Fitness</option>
                  <option value="feel_confident">Feel Confident</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryGoal">Secondary Goal (Optional)</Label>
                <select 
                  value={formData.secondaryGoal} 
                  onChange={(e) => handleInputChange('secondaryGoal', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">None</option>
                  <option value="lose_weight">Lose Weight</option>
                  <option value="build_muscle">Build Muscle</option>
                  <option value="tone_up">Tone Up</option>
                  <option value="maintain_fitness">Maintain Fitness</option>
                  <option value="feel_confident">Feel Confident</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-gray-900">Fitness Preferences</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fitnessLevel">Current Fitness Level</Label>
                <select 
                  value={formData.fitnessLevel} 
                  onChange={(e) => handleInputChange('fitnessLevel', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select your fitness level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredWorkouts">Preferred Workout Types</Label>
                <select 
                  value={formData.preferredWorkouts} 
                  onChange={(e) => handleInputChange('preferredWorkouts', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">What do you enjoy?</option>
                  <option value="strength_training">Strength Training</option>
                  <option value="hit">HIT (High-Intensity Training)</option>
                  <option value="cardio">Cardio</option>
                  <option value="yoga_pilates">Yoga & Pilates</option>
                  <option value="hiit">High-Intensity Interval Training</option>
                  <option value="mixed">Mixed Workouts</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              {step === 3 ? 'Complete Setup' : 'Continue'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
