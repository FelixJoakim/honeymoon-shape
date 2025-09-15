import React, { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../utils/supabase/client'
import { projectId, publicAnonKey } from '../utils/supabase/info'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Plus, Dumbbell, Award, Users, Target, TrendingUp, Heart } from 'lucide-react'
import { toast } from 'sonner@2.0.3'

interface HITWorkout {
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

interface HITTrainingLogProps {
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

export default function HITTrainingLog({ user }: HITTrainingLogProps) {
  const [workouts, setWorkouts] = useState<HITWorkout[]>([])
  const [partnerWorkouts, setPartnerWorkouts] = useState<HITWorkout[]>([])
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(undefined)
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0])
  const [workoutExercises, setWorkoutExercises] = useState<Exercise[]>([])

  useEffect(() => {
    fetchWorkouts()
    fetchPartnerWorkouts()
  }, [])

  const fetchWorkouts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a2efb2d/hit-workouts`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      const data = await response.json()
      if (data.workouts) {
        setWorkouts(data.workouts.sort((a: HITWorkout, b: HITWorkout) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ))
      }
    } catch (error) {
      console.error('Error fetching HIT workouts:', error)
    }
  }

  const fetchPartnerWorkouts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a2efb2d/partner-workouts`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
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

  const saveWorkout = async () => {
    if (!selectedPreset || workoutExercises.length === 0) {
      toast.error('Please select a workout type and add exercises')
      return
    }

    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a2efb2d/hit-workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          workout_name: `HIT ${selectedPreset}`,
          date: customDate,
          exercises: workoutExercises.filter(ex => 
            ex.sets.some(set => set.reps !== '' || set.weight !== '')
          )
        })
      })

      if (response.ok) {
        toast.success('Workout logged successfully!')
        setIsDialogOpen(false)
        setSelectedPreset('')
        setWorkoutExercises([])
        setCustomDate(new Date().toISOString().split('T')[0])
        fetchWorkouts()
      }
    } catch (error) {
      console.error('Error saving workout:', error)
      toast.error('Failed to save workout')
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

  const renderWorkoutTable = (workout: HITWorkout, showEndorse = false) => (
    <Card key={workout.id} className="bg-card/90 backdrop-blur-sm border border-primary/20 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-primary" />
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
              {workout.exercises.map((exercise, idx) => (
                <tr key={idx} className="border-b border-border/50">
                  <td className="py-2 px-2 font-medium text-sm">
                    {exercise.name}
                  </td>
                  {exercise.sets.slice(0, 2).map((set, setIdx) => (
                    <React.Fragment key={setIdx}>
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
                    </React.Fragment>
                  ))}
                  {exercise.sets.length < 2 && (
                    <>
                      <td className="py-2 px-2 text-center"></td>
                      <td className="py-2 px-2 text-center"></td>
                    </>
                  )}
                </tr>
              ))}
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

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">HIT Training</h2>
          <p className="text-muted-foreground">High-Intensity Training Progress</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Log HIT Workout
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
                              <React.Fragment key={setIdx}>
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
                              </React.Fragment>
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
                  onClick={saveWorkout}
                  disabled={loading || !selectedPreset}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {loading ? 'Saving...' : 'Save Workout'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Training Progress Tabs */}
      <Tabs defaultValue="my-workouts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-workouts" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            My Progress
          </TabsTrigger>
          <TabsTrigger value="partner-workouts" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Partner Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-workouts" className="space-y-4">
          {workouts.length === 0 ? (
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="text-center py-12">
                <Dumbbell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No HIT workouts logged yet</h3>
                <p className="text-muted-foreground mb-4">Start your high-intensity training journey!</p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  Log Your First HIT Workout
                </Button>
              </CardContent>
            </Card>
          ) : (
            workouts.map(workout => renderWorkoutTable(workout))
          )}
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
            partnerWorkouts.map(workout => renderWorkoutTable(workout, true))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}