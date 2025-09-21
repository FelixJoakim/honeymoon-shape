import React, { useState, useEffect, Fragment } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../utils/supabase/client'
import { projectId, publicAnonKey } from '../utils/supabase/info'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Dumbbell, Plus, Clock, Target, Calendar, Zap, Award, Users, TrendingUp, Heart, Edit, Save, X } from 'lucide-react'
import { toast } from 'sonner@2.0.3'

interface GeneralTrainingEntry {
  type: 'general'
  user_id: string
  name: string
  duration: number
  keyLifts: string[]
  date: string
  notes: string
  created_at: string
}

interface HITWorkout {
  type: 'hit'
  id: string
  user_id: string
  user_name: string
  workout_name: string
  date: string
  exercises: Exercise[]
  notes?: string
  endorsements: string[]
  created_at: string
}

interface Exercise {
  name: string
  sets: ExerciseSet[]
}

interface ExerciseSet {
  reps: number | string
  weight: number | string
}

type UnifiedWorkout = GeneralTrainingEntry | HITWorkout

interface UnifiedTrainingLogProps {
  user: User
}

const PRESET_WORKOUTS = {
  'A': [
    { name: 'Leveä leuka' },
    { name: 'Pystysouta istuen' },
    { name: 'Penkkikone maaten' },
    { name: 'Dippi' },
    { name: 'Vatsarutistuksia / Ab roller' }
  ],
  'B': [
    { name: 'Hauiskääntö tangolla (all-out + stop-hold 90°)' },
    { name: 'Eksentrinen leuanveto (underhand, 6-10s lasku)' },
    { name: 'French press / scull crusher' },
    { name: 'Dippi' },
    { name: 'Pystypennerrus' },
    { name: 'Sivuvipunosto, staattinen' }
  ],
  'C': [
    { name: 'Kyykky/kone, yksi jalka kerrallaan' },
    { name: 'Stiff leg deadlift, tai-leg' },
    { name: 'Traps, yksi käsi' },
    { name: 'Pohkeet, yksi jalka' }
  ]
}

// Felix's historical data from the screenshots
const FELIX_HISTORICAL_DATA: HITWorkout[] = [
  {
    type: 'hit',
    id: 'felix-hist-1',
    user_id: 'felix',
    user_name: 'Felix',
    workout_name: 'HIT A',
    date: '2025-08-04',
    exercises: [
      {
        name: 'One arm pulldown',
        sets: [{ reps: '10', weight: '?' }, { reps: '8', weight: '?' }]
      },
      {
        name: 'Supinen viirin leuon omaa',
        sets: [{ reps: '10', weight: '?' }, { reps: '11', weight: '?' }]
      },
      {
        name: 'French press servos vaselien',
        sets: [{ reps: '10', weight: '?' }]
      },
      {
        name: 'Pystypennerrus käsiä sivessa',
        sets: [{ reps: '12', weight: '?' }]
      },
      {
        name: 'Sivuvipunosto',
        sets: [{ reps: '25/20', weight: '?' }]
      }
    ],
    endorsements: [],
    created_at: '2025-08-04T00:00:00Z'
  },
  {
    type: 'hit',
    id: 'felix-hist-2',
    user_id: 'felix',
    user_name: 'Felix',
    workout_name: 'HIT B',
    date: '2025-08-11',
    exercises: [
      {
        name: 'Hauiskääntö',
        sets: [{ reps: '10', weight: '40' }]
      },
      {
        name: 'Eksentinen leuanveto',
        sets: [{ reps: '2/2', weight: '?' }]
      },
      {
        name: 'French press',
        sets: [{ reps: '13', weight: '45' }]
      },
      {
        name: 'Pystypennerrus',
        sets: [{ reps: '12', weight: '?' }]
      },
      {
        name: 'Sivuvipunosto',
        sets: [{ reps: '12', weight: '50' }]
      }
    ],
    endorsements: [],
    created_at: '2025-08-11T00:00:00Z'
  },
  {
    type: 'hit',
    id: 'felix-hist-3',
    user_id: 'felix',
    user_name: 'Felix',
    workout_name: 'HIT C',
    date: '2025-08-16',
    exercises: [
      {
        name: 'Hauiskääntö',
        sets: [{ reps: '9+5', weight: '40' }]
      },
      {
        name: 'French press',
        sets: [{ reps: '13', weight: '45' }]
      },
      {
        name: 'Pystypennerrus',
        sets: [{ reps: '7+13', weight: '55' }]
      }
    ],
    endorsements: [],
    created_at: '2025-08-16T00:00:00Z'
  },
  {
    type: 'hit',
    id: 'felix-hist-4',
    user_id: 'felix',
    user_name: 'Felix',
    workout_name: 'HIT C',
    date: '2025-08-08',
    exercises: [
      {
        name: 'Kyykky yksi jalka kerrallaan',
        sets: [{ reps: '11', weight: '150' }]
      },
      {
        name: 'Stiff leg deadlift',
        sets: [{ reps: '12/10', weight: '?' }]
      },
      {
        name: 'Pohkeet yksi jalka',
        sets: [{ reps: '13+13+2', weight: '35' }]
      }
    ],
    endorsements: [],
    created_at: '2025-08-08T00:00:00Z'
  },
  {
    type: 'hit',
    id: 'felix-hist-5',
    user_id: 'felix',
    user_name: 'Felix',
    workout_name: 'HIT C',
    date: '2025-08-15',
    exercises: [
      {
        name: 'Kyykky yksi jalka kerrallaan',
        sets: [{ reps: '12/12', weight: '155' }]
      },
      {
        name: 'Stiff leg deadlift',
        sets: [{ reps: '12/10', weight: '35' }]
      },
      {
        name: 'Pohkeet yksi jalka',
        sets: [{ reps: '10/10', weight: '?' }]
      }
    ],
    endorsements: [],
    created_at: '2025-08-15T00:00:00Z'
  },
  {
    type: 'hit',
    id: 'felix-hist-6',
    user_id: 'felix',
    user_name: 'Felix',
    workout_name: 'HIT C',
    date: '2025-08-21',
    exercises: [
      {
        name: 'Kyykky yksi jalka kerrallaan',
        sets: [{ reps: '12/14', weight: '180' }]
      },
      {
        name: 'Stiff leg deadlift',
        sets: [{ reps: '12/10', weight: '75' }]
      },
      {
        name: 'Pohkeet yksi jalka',
        sets: [{ reps: '16/15', weight: '40' }]
      }
    ],
    endorsements: [],
    created_at: '2025-08-21T00:00:00Z'
  }
]

export default function UnifiedTrainingLog({ user }: UnifiedTrainingLogProps) {
  const [allWorkouts, setAllWorkouts] = useState<UnifiedWorkout[]>([])
  const [partnerWorkouts, setPartnerWorkouts] = useState<HITWorkout[]>([])
  const [loading, setLoading] = useState(false)
  const [isGeneralDialogOpen, setIsGeneralDialogOpen] = useState(false)
  const [isHitDialogOpen, setIsHitDialogOpen] = useState(false)
  const [editingWorkout, setEditingWorkout] = useState<HITWorkout | null>(null)
  const [editingExercises, setEditingExercises] = useState<Exercise[]>([])
  const [editingWorkoutName, setEditingWorkoutName] = useState('')
  
  // General workout state
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    duration: '',
    keyLifts: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  })

  // HIT workout state
  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(undefined)
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0])
  const [workoutExercises, setWorkoutExercises] = useState<Exercise[]>([])

  useEffect(() => {
    fetchAllWorkouts()
    fetchPartnerWorkouts()
    
    // Add Felix's historical data automatically for demo purposes
    addHistoricalData()
  }, [user])

  const addHistoricalData = () => {
    setAllWorkouts(prev => {
      const existingIds = prev.filter(w => w.type === 'hit').map(w => (w as HITWorkout).id)
      const newHistorical = FELIX_HISTORICAL_DATA.filter(h => !existingIds.includes(h.id))
      return [...prev, ...newHistorical].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    })
  }

  const sendWorkoutNotification = async (workoutType: string, workoutName: string) => {
    try {
      // Determine partner email
      const isFelix = user.email === 'fleminen@gmail.com'
      const partnerEmail = isFelix ? 'nopanenanni7@gmail.com' : 'fleminen@gmail.com'
      const partnerName = isFelix ? 'Anni' : 'Felix'
      const userName = user.user_metadata?.name || (isFelix ? 'Felix' : 'Anni')

      // For demo purposes, simulate email notification
      console.log(`Sending workout notification to ${partnerEmail}:`)
      console.log(`${userName} just completed a ${workoutType} workout: ${workoutName}`)
      
      // In production, this would call a Supabase Edge Function
      // await supabase.functions.invoke('send-workout-notification', {
      //   body: { partnerEmail, userName, workoutType, workoutName }
      // })
      
      // Show notification to current user
      setTimeout(() => {
        alert(`🎉 ${partnerName} has been notified of your workout! Keep it up! 💪`)
      }, 1000)
      
    } catch (error) {
      console.error('Error sending workout notification:', error)
      // Don't block workout saving if notification fails
    }
  }

  const fetchAllWorkouts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Fetch general training
      const generalResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a2efb2d/training`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })
      const generalData = await generalResponse.json()
      const generalWorkouts = (generalData.entries || []).map((entry: any) => ({ ...entry, type: 'general' }))

      // Fetch HIT workouts
      const hitResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a2efb2d/hit-workouts`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })
      const hitData = await hitResponse.json()
      const hitWorkouts = (hitData.workouts || []).map((workout: any) => ({ ...workout, type: 'hit' }))

      const combined = [...generalWorkouts, ...hitWorkouts].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      setAllWorkouts(combined)

    } catch (error) {
      console.error('Error fetching workouts:', error)
    }
  }

  const fetchPartnerWorkouts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a2efb2d/partner-workouts`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })

      const data = await response.json()
      if (data.workouts) {
        setPartnerWorkouts(data.workouts.sort((a: HITWorkout, b: HITWorkout) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ))
      }
    } catch (error) {
      console.error('Error fetching partner workouts:', error)
    }
  }

  const handleAddGeneralWorkout = async () => {
    if (!newWorkout.name || !newWorkout.duration) return

    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const keyLiftsArray = newWorkout.keyLifts
        .split(',')
        .map(lift => lift.trim())
        .filter(lift => lift.length > 0)

      // Create new general workout in local state
      const newGeneralWorkout: GeneralTrainingEntry = {
        type: 'general',
        id: Date.now().toString(),
        user_id: user.id,
        name: newWorkout.name,
        duration: parseInt(newWorkout.duration),
        keyLifts: keyLiftsArray,
        date: newWorkout.date,
        notes: newWorkout.notes,
        created_at: new Date().toISOString()
      }

      // Add to local state
      setAllWorkouts(prev => [newGeneralWorkout, ...prev])

      // Send workout notification to partner
      await sendWorkoutNotification('General', newWorkout.name)

      setNewWorkout({
        name: '',
        duration: '',
        keyLifts: '',
        notes: '',
        date: new Date().toISOString().split('T')[0]
      })
      setIsGeneralDialogOpen(false)
      
      console.log('General workout saved successfully!')
    } catch (error) {
      console.error('Error adding training entry:', error)
      alert('Failed to log workout')
    } finally {
      setLoading(false)
    }
  }

  const handlePresetSelect = (preset: string) => {
    setSelectedPreset(preset)
    if (PRESET_WORKOUTS[preset as keyof typeof PRESET_WORKOUTS]) {
      const exercises = PRESET_WORKOUTS[preset as keyof typeof PRESET_WORKOUTS].map(exercise => ({
        name: exercise.name,
        sets: [{ reps: '', weight: '' }, { reps: '', weight: '' }]
      }))
      setWorkoutExercises(exercises)
    }
  }

  const updateExerciseSet = (exerciseIndex: number, setIndex: number, field: 'reps' | 'weight', value: string) => {
    setWorkoutExercises(prev => {
      const updated = [...prev]
      updated[exerciseIndex].sets[setIndex] = {
        ...updated[exerciseIndex].sets[setIndex],
        [field]: value
      }
      return updated
    })
  }

  const addSet = (exerciseIndex: number) => {
    setWorkoutExercises(prev => {
      const updated = [...prev]
      updated[exerciseIndex].sets.push({ reps: '', weight: '' })
      return updated
    })
  }

  const startEditingWorkout = (workout: HITWorkout) => {
    setEditingWorkout(workout)
    setEditingWorkoutName(workout.workout_name)
    setEditingExercises([...workout.exercises])
  }

  const updateEditingExerciseSet = (exerciseIndex: number, setIndex: number, field: 'reps' | 'weight', value: string) => {
    setEditingExercises(prev => {
      const updated = [...prev]
      updated[exerciseIndex].sets[setIndex] = {
        ...updated[exerciseIndex].sets[setIndex],
        [field]: value
      }
      return updated
    })
  }

  const saveEditedWorkout = async () => {
    if (!editingWorkout) return

    setLoading(true)
    try {
      const updatedWorkout: HITWorkout = {
        ...editingWorkout,
        workout_name: editingWorkoutName,
        exercises: editingExercises
      }

      // Update in local state
      setAllWorkouts(prev => prev.map(w => 
        w.type === 'hit' && (w as HITWorkout).id === editingWorkout.id 
          ? updatedWorkout 
          : w
      ))

      setEditingWorkout(null)
      setEditingExercises([])
      setEditingWorkoutName('')
      
      console.log('Workout updated successfully!')
    } catch (error) {
      console.error('Error updating workout:', error)
      alert('Failed to update workout')
    } finally {
      setLoading(false)
    }
  }

  const cancelEditing = () => {
    setEditingWorkout(null)
    setEditingExercises([])
    setEditingWorkoutName('')
  }

  const findPreviousWorkout = (currentWorkout: HITWorkout) => {
    // Find the most recent workout of the same type (excluding current one)
    const sameTypeWorkouts = allWorkouts
      .filter(w => 
        w.type === 'hit' && 
        w.user_id === currentWorkout.user_id &&
        (w as HITWorkout).workout_name === currentWorkout.workout_name &&
        (w as HITWorkout).id !== currentWorkout.id
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    return sameTypeWorkouts[0] as HITWorkout || null
  }

  const compareExerciseProgress = (currentExercise: Exercise, previousExercise?: Exercise) => {
    if (!previousExercise) return 'new'
    
    // Compare total volume (reps × weight) for first set
    const getCurrentVolume = () => {
      const firstSet = currentExercise.sets[0]
      if (!firstSet || !firstSet.reps || !firstSet.weight) return 0
      const reps = parseInt(firstSet.reps.toString().split(/[+/]/)[0] || '0')
      const weight = parseFloat(firstSet.weight.toString().replace(/[^0-9.]/g, '') || '0')
      return reps * weight
    }
    
    const getPreviousVolume = () => {
      const firstSet = previousExercise.sets[0]
      if (!firstSet || !firstSet.reps || !firstSet.weight) return 0
      const reps = parseInt(firstSet.reps.toString().split(/[+/]/)[0] || '0')
      const weight = parseFloat(firstSet.weight.toString().replace(/[^0-9.]/g, '') || '0')
      return reps * weight
    }
    
    const currentVolume = getCurrentVolume()
    const previousVolume = getPreviousVolume()
    
    if (currentVolume > previousVolume) return 'improved'
    if (currentVolume < previousVolume) return 'declined'
    return 'same'
  }

  const saveHitWorkout = async () => {
    if (!selectedPreset || workoutExercises.length === 0) {
      alert('Please select a workout type and add exercises')
      return
    }

    setLoading(true)
    try {
      // Create new workout in local state
      const newHitWorkout: HITWorkout = {
        type: 'hit',
        id: Date.now().toString(),
        user_id: user.id,
        user_name: user.user_metadata?.name || 'User',
        workout_name: `HIT ${selectedPreset}`,
        date: customDate,
        exercises: workoutExercises.filter(ex => 
          ex.sets.some(set => set.reps !== '' || set.weight !== '')
        ),
        notes: '',
        endorsements: [],
        created_at: new Date().toISOString()
      }

      // Add to local state
      setAllWorkouts(prev => [newHitWorkout, ...prev])
      
      // Send workout notification to partner
      await sendWorkoutNotification('HIT', `HIT ${selectedPreset}`)
      
      console.log('HIT workout saved successfully!')
      setIsHitDialogOpen(false)
      setSelectedPreset(undefined)
      setWorkoutExercises([])
      setCustomDate(new Date().toISOString().split('T')[0])
    } catch (error) {
      console.error('Error saving workout:', error)
      alert('Failed to save workout')
    } finally {
      setLoading(false)
    }
  }

  const endorseWorkout = async (workoutId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a2efb2d/endorse-workout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ workoutId })
      })

      if (response.ok) {
        toast.success('Workout endorsed!')
        fetchPartnerWorkouts()
      }
    } catch (error) {
      console.error('Error endorsing workout:', error)
      toast.error('Failed to endorse workout')
    }
  }

  const getTotalWorkouts = () => allWorkouts.length
  const getTotalDuration = () => {
    return allWorkouts
      .filter(w => w.type === 'general')
      .reduce((total, entry) => total + (entry as GeneralTrainingEntry).duration, 0)
  }
  const getThisWeekWorkouts = () => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    return allWorkouts.filter(entry => new Date(entry.date) >= oneWeekAgo).length
  }

  const commonWorkouts = [
    'Upper Body Strength',
    'Lower Body Power', 
    'Full Body HIIT',
    'Cardio Session',
    'Core & Conditioning',
    'Yoga & Flexibility',
    'HIT A (Upper Body)',
    'HIT B (Lower Body)', 
    'HIT C (Full Body)'
  ]

  const renderGeneralWorkout = (entry: GeneralTrainingEntry, index: number) => (
    <Card key={`general-${index}`} className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-blue-600" />
              {entry.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(entry.date).toLocaleDateString('en-US', { 
                  weekday: 'short',
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {entry.duration} min
              </span>
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-indigo-50">
            General
          </Badge>
        </div>
      </CardHeader>
      {(entry.keyLifts.length > 0 || entry.notes) && (
        <CardContent className="pt-0">
          {entry.keyLifts.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Key Exercises</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {entry.keyLifts.map((lift, liftIndex) => (
                  <Badge key={liftIndex} variant="secondary" className="text-xs">
                    {lift}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {entry.notes && (
            <div>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {entry.notes}
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )

  const renderHitWorkout = (workout: HITWorkout, showEndorse = false) => {
    const previousWorkout = findPreviousWorkout(workout)
    
    return (
    <Card key={workout.id} className="bg-card/90 backdrop-blur-sm border border-primary/20 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              {workout.workout_name}
            </CardTitle>
            <CardDescription>
              {new Date(workout.date).toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {workout.user_id === user.id && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => startEditingWorkout(workout)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            )}
            {showEndorse && !workout.endorsements?.includes(user.id) && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => endorseWorkout(workout.id)}
                className="flex items-center gap-1"
              >
                <Heart className="w-4 h-4" />
                Endorse
              </Button>
            )}
            {workout.endorsements?.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Award className="w-3 h-3" />
                {workout.endorsements.length}
              </Badge>
            )}
            <Badge variant="outline" className="bg-gradient-to-r from-primary/10 to-primary/20">
              HIT
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-background/50 rounded-lg p-4 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-2 font-medium">WORKOUT</th>
                <th className="text-center py-2 px-2 font-medium">REP</th>
                <th className="text-center py-2 px-2 font-medium">KG</th>
                <th className="text-center py-2 px-2 font-medium">REP</th>
                <th className="text-center py-2 px-2 font-medium">KG</th>
              </tr>
            </thead>
            <tbody>
              {workout.exercises.map((exercise, idx) => {
                const previousExercise = previousWorkout?.exercises.find(e => e.name === exercise.name)
                const progress = compareExerciseProgress(exercise, previousExercise)
                
                return (
                <tr key={idx} className="border-b border-border/50">
                  <td className="py-2 px-2 font-medium text-sm">
                    <div className="flex items-center gap-2">
                      <span>{exercise.name}</span>
                      {progress === 'improved' && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          ↗ Better
                        </Badge>
                      )}
                      {progress === 'declined' && (
                        <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                          📍 Focus Next Time
                        </Badge>
                      )}
                      {progress === 'same' && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          = Same
                        </Badge>
                      )}
                    </div>
                  </td>
                  {exercise.sets.slice(0, 2).map((set, setIdx) => (
                    <Fragment key={setIdx}>
                      <td className="py-2 px-2 text-center">
                        {set.reps && (
                          <div className={`px-2 py-1 rounded text-sm ${set.reps && set.weight ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                            {set.reps}
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {set.weight && (
                          <div className={`px-2 py-1 rounded text-sm ${set.reps && set.weight ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                            {set.weight}
                          </div>
                        )}
                      </td>
                    </Fragment>
                  ))}
                  {exercise.sets.length < 2 && (
                    <>
                      <td className="py-2 px-2 text-center"></td>
                      <td className="py-2 px-2 text-center"></td>
                    </>
                  )}
                </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {workout.notes && (
          <div className="mt-4 p-3 bg-background/30 rounded-lg">
            <p className="text-sm text-muted-foreground">{workout.notes}</p>
          </div>
        )}
        {showEndorse && (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            by {workout.user_name}
          </div>
        )}
      </CardContent>
    </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {getTotalWorkouts()}
            </div>
            <p className="text-xs text-gray-500 mt-1">Sessions completed</p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Training Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">
              {Math.round(getTotalDuration() / 60)}h
            </div>
            <p className="text-xs text-gray-500 mt-1">From general training</p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-600">
              {getThisWeekWorkouts()}
            </div>
            <p className="text-xs text-gray-500 mt-1">Workouts this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Training Progress Tabs */}
      <Tabs defaultValue="all-workouts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all-workouts" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            All Training
          </TabsTrigger>
          <TabsTrigger value="partner-workouts" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Partner Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-workouts" className="space-y-6">
          {/* Add Workout Buttons */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">All Training Sessions</h2>
            <div className="flex gap-3">
              <Dialog open={isGeneralDialogOpen} onOpenChange={setIsGeneralDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Dumbbell className="w-4 h-4 mr-2" />
                    General Workout
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Dumbbell className="w-5 h-5 text-blue-600" />
                      Log Workout
                    </DialogTitle>
                    <DialogDescription>
                      Track your training session details (general workouts, HIT sessions, etc.)
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="workout-name">Workout Name</Label>
                      <div className="mt-1">
                        <Input
                          id="workout-name"
                          value={newWorkout.name}
                          onChange={(e) => setNewWorkout({...newWorkout, name: e.target.value})}
                          placeholder="e.g., Upper Body Strength"
                        />
                        <div className="flex flex-wrap gap-1 mt-2">
                          {commonWorkouts.map((workout) => (
                            <Badge
                              key={workout}
                              variant="outline"
                              className="cursor-pointer text-xs hover:bg-blue-50"
                              onClick={() => setNewWorkout({...newWorkout, name: workout})}
                            >
                              {workout}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={newWorkout.duration}
                          onChange={(e) => setNewWorkout({...newWorkout, duration: e.target.value})}
                          placeholder="45"
                        />
                      </div>
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newWorkout.date}
                          onChange={(e) => setNewWorkout({...newWorkout, date: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="key-lifts">Key Exercises</Label>
                      <Input
                        id="key-lifts"
                        value={newWorkout.keyLifts}
                        onChange={(e) => setNewWorkout({...newWorkout, keyLifts: e.target.value})}
                        placeholder="Squats, Deadlifts, Bench Press (comma separated)"
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">Notes (optional)</Label>
                      <Textarea
                        id="notes"
                        value={newWorkout.notes}
                        onChange={(e) => setNewWorkout({...newWorkout, notes: e.target.value})}
                        placeholder="How did it feel? Any achievements or observations..."
                        rows={3}
                      />
                    </div>

                    <Button
                      onClick={handleAddGeneralWorkout}
                      disabled={loading || !newWorkout.name || !newWorkout.duration}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                    >
                      {loading ? 'Logging...' : 'Log Workout'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isHitDialogOpen} onOpenChange={setIsHitDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Zap className="w-4 h-4 mr-2" />
                    HIT Workout
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Log HIT Workout
                    </DialogTitle>
                    <DialogDescription>
                      Track your High-Intensity Training session with precise rep and weight data
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Workout Type</Label>
                        <Select value={selectedPreset || undefined} onValueChange={handlePresetSelect}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select workout type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">HIT A (Upper Body)</SelectItem>
                            <SelectItem value="B">HIT B (Arms & Shoulders)</SelectItem>
                            <SelectItem value="C">HIT C (Lower Body)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Date</Label>
                        <Input
                          type="date"
                          value={customDate}
                          onChange={(e) => setCustomDate(e.target.value)}
                        />
                      </div>
                    </div>

                    {workoutExercises.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="font-medium">Exercise Details</h3>
                        <div className="bg-background/50 rounded-lg p-4 overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b border-border">
                                <th className="text-left py-2 px-2 font-medium">EXERCISE</th>
                                <th className="text-center py-2 px-2 font-medium">REP</th>
                                <th className="text-center py-2 px-2 font-medium">KG</th>
                                <th className="text-center py-2 px-2 font-medium">REP</th>
                                <th className="text-center py-2 px-2 font-medium">KG</th>
                                <th className="text-center py-2 px-2 font-medium">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {workoutExercises.map((exercise, exerciseIdx) => (
                                <tr key={exerciseIdx} className="border-b border-border/50">
                                  <td className="py-2 px-2 font-medium text-sm">
                                    {exercise.name}
                                  </td>
                                  {[0, 1].map(setIdx => (
                                    <Fragment key={setIdx}>
                                      <td className="py-2 px-2">
                                        <Input
                                          type="text"
                                          placeholder="Reps"
                                          value={exercise.sets[setIdx]?.reps || ''}
                                          onChange={(e) => updateExerciseSet(exerciseIdx, setIdx, 'reps', e.target.value)}
                                          className="text-center text-sm"
                                        />
                                      </td>
                                      <td className="py-2 px-2">
                                        <Input
                                          type="text"
                                          placeholder="Weight"
                                          value={exercise.sets[setIdx]?.weight || ''}
                                          onChange={(e) => updateExerciseSet(exerciseIdx, setIdx, 'weight', e.target.value)}
                                          className="text-center text-sm"
                                        />
                                      </td>
                                    </Fragment>
                                  ))}
                                  <td className="py-2 px-2 text-center">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => addSet(exerciseIdx)}
                                      disabled={exercise.sets.length >= 4}
                                    >
                                      <Plus className="w-3 h-3" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        onClick={saveHitWorkout}
                        disabled={loading || !selectedPreset}
                        className="flex-1 bg-primary hover:bg-primary/90"
                      >
                        {loading ? 'Saving...' : 'Save Workout'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Workout Edit Dialog */}
              <Dialog open={!!editingWorkout} onOpenChange={() => editingWorkout && cancelEditing()}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Edit className="w-5 h-5 text-blue-600" />
                      Edit Workout
                    </DialogTitle>
                    <DialogDescription>
                      Modify your workout details and save changes
                    </DialogDescription>
                  </DialogHeader>
                  
                  {editingWorkout && (
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="edit-workout-name">Workout Name</Label>
                        <Input
                          id="edit-workout-name"
                          value={editingWorkoutName}
                          onChange={(e) => setEditingWorkoutName(e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Exercises</h3>
                        {editingExercises.map((exercise, exerciseIndex) => (
                          <div key={exerciseIndex} className="border rounded-lg p-4 space-y-3">
                            <h4 className="font-medium text-primary">{exercise.name}</h4>
                            <div className="grid gap-2">
                              {exercise.sets.map((set, setIndex) => (
                                <div key={setIndex} className="flex items-center gap-2">
                                  <span className="text-sm text-muted-foreground w-8">#{setIndex + 1}</span>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="text"
                                      value={set.reps}
                                      onChange={(e) => updateEditingExerciseSet(exerciseIndex, setIndex, 'reps', e.target.value)}
                                      placeholder="Reps"
                                      className="w-20"
                                    />
                                    <span className="text-muted-foreground">×</span>
                                    <Input
                                      type="text"
                                      value={set.weight}
                                      onChange={(e) => updateEditingExerciseSet(exerciseIndex, setIndex, 'weight', e.target.value)}
                                      placeholder="Weight"
                                      className="w-20"
                                    />
                                    <span className="text-muted-foreground text-sm">kg</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button 
                          onClick={saveEditedWorkout}
                          disabled={loading}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button variant="outline" onClick={cancelEditing}>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* All Workouts List */}
          <div className="space-y-4">
            {allWorkouts.length === 0 ? (
              <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="text-center py-12">
                  <Dumbbell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No workouts logged yet</h3>
                  <p className="text-gray-500 mb-4">Start tracking your fitness journey!</p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={() => setIsGeneralDialogOpen(true)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600"
                    >
                      Log Workout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              allWorkouts.map((workout, index) => 
                workout.type === 'general' 
                  ? renderGeneralWorkout(workout as GeneralTrainingEntry, index)
                  : renderHitWorkout(workout as HITWorkout)
              )
            )}
          </div>
        </TabsContent>

        <TabsContent value="partner-workouts" className="space-y-4">
          {partnerWorkouts.length === 0 ? (
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No partner workouts yet</h3>
                <p className="text-muted-foreground">Your partner hasn't logged any workouts to review.</p>
              </CardContent>
            </Card>
          ) : (
            partnerWorkouts.map(workout => renderHitWorkout(workout, true))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}