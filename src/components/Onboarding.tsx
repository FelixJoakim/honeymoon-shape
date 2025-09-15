import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Calendar, Target, Heart, User } from 'lucide-react'
import { User as SupabaseUser } from '@supabase/supabase-js'

interface OnboardingProps {
  user: SupabaseUser
  onComplete: (profile: any) => void
}

export default function Onboarding({ user, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: user.user_metadata?.name || '',
    currentWeight: '',
    targetWeight: '',
    weddingDate: '',
    primaryGoal: undefined as string | undefined,
    secondaryGoal: undefined as string | undefined,
    fitnessLevel: undefined as string | undefined,
    preferredWorkouts: undefined as string | undefined
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
        return formData.weddingDate !== '' && formData.primaryGoal !== undefined && formData.primaryGoal !== ''
      case 3:
        return formData.fitnessLevel !== undefined && formData.fitnessLevel !== ''
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-amber-700">Welcome to Honeymoon Shape!</CardTitle>
          <CardDescription>
            Let's set up your fitness journey for the perfect honeymoon body
          </CardDescription>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i <= step ? 'bg-amber-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
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
                <Select value={formData.primaryGoal} onValueChange={(value) => handleInputChange('primaryGoal', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="What's your main focus first?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="build_muscle">Build Muscle</SelectItem>
                    <SelectItem value="lose_weight">Lose Weight</SelectItem>
                    <SelectItem value="tone_up">Tone Up</SelectItem>
                    <SelectItem value="get_fit">General Fitness</SelectItem>
                    <SelectItem value="feel_confident">Feel Confident</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryGoal">Secondary Goal (Then transition to)</Label>
                <Select value={formData.secondaryGoal} onValueChange={(value) => handleInputChange('secondaryGoal', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="What comes next? (Optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="lose_weight">Lose Weight</SelectItem>
                    <SelectItem value="build_muscle">Build Muscle</SelectItem>
                    <SelectItem value="tone_up">Tone Up</SelectItem>
                    <SelectItem value="maintain_fitness">Maintain Fitness</SelectItem>
                    <SelectItem value="feel_confident">Feel Confident</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-gray-900">Fitness Preferences</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fitnessLevel">Current Fitness Level</Label>
                <Select value={formData.fitnessLevel} onValueChange={(value) => handleInputChange('fitnessLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your fitness level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredWorkouts">Preferred Workout Types</Label>
                <Select value={formData.preferredWorkouts} onValueChange={(value) => handleInputChange('preferredWorkouts', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="What do you enjoy?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strength_training">Strength Training</SelectItem>
                    <SelectItem value="hit">HIT (High-Intensity Training)</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="yoga_pilates">Yoga & Pilates</SelectItem>
                    <SelectItem value="hiit">High-Intensity Interval Training</SelectItem>
                    <SelectItem value="mixed">Mixed Workouts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-medium text-amber-800 mb-2">Your Journey Summary</h4>
                <div className="text-sm text-amber-700 space-y-1">
                  <p>• Start: {formData.currentWeight}kg → Goal: {formData.targetWeight}kg</p>
                  <p>• Wedding Date: {formData.weddingDate ? new Date(formData.weddingDate).toLocaleDateString() : 'Not set'}</p>
                  <p>• Primary Goal: {formData.primaryGoal.replace('_', ' ')}</p>
                  {formData.secondaryGoal && <p>• Secondary Goal: {formData.secondaryGoal.replace('_', ' ')}</p>}
                  <p>• Fitness Level: {formData.fitnessLevel}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
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
              className="flex-1 bg-amber-600 hover:bg-amber-700"
            >
              {step === 3 ? 'Complete Setup' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}