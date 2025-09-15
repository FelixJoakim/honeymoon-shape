import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js'
import * as kv from './kv_store.tsx'

const app = new Hono()

app.use('*', cors())
app.use('*', logger(console.log))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Sign up endpoint
app.post('/make-server-6a2efb2d/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json()

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true
    })

    if (error) {
      console.log('Signup error:', error)
      return c.json({ error: error.message }, 400)
    }

    // Initialize user profile in KV store
    await kv.set(`user_profile_${data.user.id}`, {
      name,
      email,
      current_weight: null,
      target_weight: null,
      created_at: new Date().toISOString()
    })

    return c.json({ success: true, user: data.user })
  } catch (error) {
    console.log('Signup error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Get user profile
app.get('/make-server-6a2efb2d/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const profile = await kv.get(`user_profile_${user.id}`)
    return c.json({ profile })
  } catch (error) {
    console.log('Profile fetch error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Update user profile
app.put('/make-server-6a2efb2d/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const updates = await c.req.json()
    const currentProfile = await kv.get(`user_profile_${user.id}`) || {}
    
    const updatedProfile = {
      ...currentProfile,
      ...updates,
      updated_at: new Date().toISOString()
    }

    await kv.set(`user_profile_${user.id}`, updatedProfile)
    return c.json({ profile: updatedProfile })
  } catch (error) {
    console.log('Profile update error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Add weight entry
app.post('/make-server-6a2efb2d/weight', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { weight, date } = await c.req.json()
    const entryId = `weight_${user.id}_${date}`
    
    await kv.set(entryId, {
      user_id: user.id,
      weight,
      date,
      created_at: new Date().toISOString()
    })

    return c.json({ success: true })
  } catch (error) {
    console.log('Weight entry error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Get weight entries
app.get('/make-server-6a2efb2d/weight', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const entries = await kv.getByPrefix(`weight_${user.id}_`)
    return c.json({ entries })
  } catch (error) {
    console.log('Weight fetch error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Add training log
app.post('/make-server-6a2efb2d/training', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { name, duration, keyLifts, date, notes } = await c.req.json()
    const entryId = `training_${user.id}_${Date.now()}`
    
    await kv.set(entryId, {
      user_id: user.id,
      name,
      duration,
      keyLifts,
      date,
      notes,
      created_at: new Date().toISOString()
    })

    return c.json({ success: true })
  } catch (error) {
    console.log('Training log error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Get training logs
app.get('/make-server-6a2efb2d/training', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const entries = await kv.getByPrefix(`training_${user.id}_`)
    return c.json({ entries })
  } catch (error) {
    console.log('Training fetch error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Add note
app.post('/make-server-6a2efb2d/notes', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { content, date } = await c.req.json()
    const noteId = `note_${user.id}_${Date.now()}`
    
    await kv.set(noteId, {
      user_id: user.id,
      content,
      date,
      created_at: new Date().toISOString()
    })

    return c.json({ success: true })
  } catch (error) {
    console.log('Note creation error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Get notes
app.get('/make-server-6a2efb2d/notes', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const notes = await kv.getByPrefix(`note_${user.id}_`)
    return c.json({ notes })
  } catch (error) {
    console.log('Notes fetch error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Update note
app.put('/make-server-6a2efb2d/notes/:noteId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const noteId = c.req.param('noteId')
    const { content } = await c.req.json()
    
    const existingNote = await kv.get(noteId)
    if (!existingNote || existingNote.user_id !== user.id) {
      return c.json({ error: 'Note not found' }, 404)
    }

    const updatedNote = {
      ...existingNote,
      content,
      updated_at: new Date().toISOString()
    }

    await kv.set(noteId, updatedNote)
    return c.json({ success: true })
  } catch (error) {
    console.log('Note update error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Delete note
app.delete('/make-server-6a2efb2d/notes/:noteId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const noteId = c.req.param('noteId')
    const existingNote = await kv.get(noteId)
    
    if (!existingNote || existingNote.user_id !== user.id) {
      return c.json({ error: 'Note not found' }, 404)
    }

    await kv.del(noteId)
    return c.json({ success: true })
  } catch (error) {
    console.log('Note delete error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Upload photo
app.post('/make-server-6a2efb2d/photos', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const formData = await c.req.formData()
    const file = formData.get('file') as File
    const weekNumber = formData.get('week_number') as string
    const uploadDate = formData.get('upload_date') as string

    if (!file) {
      return c.json({ error: 'No file provided' }, 400)
    }

    // Create bucket if it doesn't exist
    const bucketName = 'make-6a2efb2d-photos'
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName)
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, { public: false })
    }

    // Upload file
    const fileName = `${user.id}/${Date.now()}-${file.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file)

    if (uploadError) {
      console.log('Upload error:', uploadError)
      return c.json({ error: 'Upload failed' }, 500)
    }

    // Get signed URL
    const { data: urlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 60 * 60 * 24 * 365) // 1 year

    // Store photo metadata in KV
    const photoId = `photo_${user.id}_${Date.now()}`
    await kv.set(photoId, {
      id: photoId,
      user_id: user.id,
      file_name: fileName,
      file_url: urlData?.signedUrl || '',
      upload_date: uploadDate,
      week_number: parseInt(weekNumber),
      created_at: new Date().toISOString()
    })

    return c.json({ success: true })
  } catch (error) {
    console.log('Photo upload error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Get photos
app.get('/make-server-6a2efb2d/photos', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const photos = await kv.getByPrefix(`photo_${user.id}_`)
    return c.json({ photos })
  } catch (error) {
    console.log('Photos fetch error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Delete photo
app.delete('/make-server-6a2efb2d/photos/:photoId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const photoId = c.req.param('photoId')
    const photo = await kv.get(photoId)

    if (!photo || photo.user_id !== user.id) {
      return c.json({ error: 'Photo not found' }, 404)
    }

    // Delete from storage
    const bucketName = 'make-6a2efb2d-photos'
    await supabase.storage.from(bucketName).remove([photo.file_name])

    // Delete from KV
    await kv.del(photoId)

    return c.json({ success: true })
  } catch (error) {
    console.log('Photo delete error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Get notifications
app.get('/make-server-6a2efb2d/notifications', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const notifications = await kv.getByPrefix(`notification_${user.id}_`)
    
    // Sort by timestamp, newest first
    const sortedNotifications = notifications.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    return c.json({ notifications: sortedNotifications })
  } catch (error) {
    console.log('Notifications fetch error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Create notification
app.post('/make-server-6a2efb2d/notifications', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const notification = await c.req.json()
    const notificationId = `notification_${user.id}_${Date.now()}`
    
    await kv.set(notificationId, {
      ...notification,
      id: notificationId,
      user_id: user.id,
      created_at: new Date().toISOString()
    })

    return c.json({ success: true })
  } catch (error) {
    console.log('Notification creation error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Mark notification as read
app.put('/make-server-6a2efb2d/notifications/:notificationId/read', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const notificationId = c.req.param('notificationId')
    const notification = await kv.get(notificationId)

    if (!notification || notification.user_id !== user.id) {
      return c.json({ error: 'Notification not found' }, 404)
    }

    await kv.set(notificationId, {
      ...notification,
      read: true,
      read_at: new Date().toISOString()
    })

    return c.json({ success: true })
  } catch (error) {
    console.log('Notification update error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Add HIT workout
app.post('/make-server-6a2efb2d/hit-workouts', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { workout_name, date, exercises, notes } = await c.req.json()
    const workoutId = `hit_workout_${user.id}_${Date.now()}`
    
    // Get user profile for name
    const profile = await kv.get(`user_profile_${user.id}`)
    
    await kv.set(workoutId, {
      id: workoutId,
      user_id: user.id,
      user_name: profile?.name || 'Unknown',
      workout_name,
      date,
      exercises,
      notes: notes || '',
      endorsements: [],
      created_at: new Date().toISOString()
    })

    return c.json({ success: true })
  } catch (error) {
    console.log('HIT workout log error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Get HIT workouts
app.get('/make-server-6a2efb2d/hit-workouts', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const workouts = await kv.getByPrefix(`hit_workout_${user.id}_`)
    return c.json({ workouts })
  } catch (error) {
    console.log('HIT workouts fetch error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Get partner workouts (workouts from other users)
app.get('/make-server-6a2efb2d/partner-workouts', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    // Get all HIT workouts that are not from current user
    const allWorkouts = await kv.getByPrefix('hit_workout_')
    const partnerWorkouts = allWorkouts.filter(workout => workout.user_id !== user.id)
    
    return c.json({ workouts: partnerWorkouts })
  } catch (error) {
    console.log('Partner workouts fetch error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Endorse workout
app.post('/make-server-6a2efb2d/endorse-workout', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { workoutId } = await c.req.json()
    const workout = await kv.get(workoutId)
    
    if (!workout) {
      return c.json({ error: 'Workout not found' }, 404)
    }

    // Add endorsement if not already endorsed
    if (!workout.endorsements.includes(user.id)) {
      workout.endorsements.push(user.id)
      await kv.set(workoutId, workout)
      
      // Create notification for workout owner
      const profile = await kv.get(`user_profile_${user.id}`)
      const notificationId = `notification_${workout.user_id}_${Date.now()}`
      
      await kv.set(notificationId, {
        id: notificationId,
        user_id: workout.user_id,
        type: 'endorsement',
        title: 'Workout Endorsed!',
        message: `${profile?.name || 'Your partner'} endorsed your ${workout.workout_name} workout`,
        read: false,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString()
      })
    }

    return c.json({ success: true })
  } catch (error) {
    console.log('Endorse workout error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Generate weekly report
app.post('/make-server-6a2efb2d/weekly-report', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    // Get last week's data
    const today = new Date()
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    // Get weight entries from last week
    const weightEntries = await kv.getByPrefix(`weight_${user.id}_`)
    const recentWeights = weightEntries.filter(entry => 
      new Date(entry.date) >= oneWeekAgo
    )

    // Get training logs from last week
    const trainingEntries = await kv.getByPrefix(`training_${user.id}_`)
    const recentTraining = trainingEntries.filter(entry => 
      new Date(entry.date) >= oneWeekAgo
    )

    // Get user profile for goals
    const profile = await kv.get(`user_profile_${user.id}`)

    // Generate report summary
    let summary = 'Weekly Progress Report:\n'
    
    if (recentWeights.length > 0) {
      summary += `✅ Logged weight ${recentWeights.length} time(s) this week\n`
    } else {
      summary += `⚠️ No weight entries this week - stay consistent!\n`
    }

    if (recentTraining.length > 0) {
      summary += `💪 Completed ${recentTraining.length} workout(s) this week\n`
    } else {
      summary += `⚠️ No workouts logged - time to get moving!\n`
    }

    // Check if on track with goals
    if (profile?.primary_goal === 'build_muscle' && recentTraining.length >= 3) {
      summary += `🎯 You're on track with your muscle building goal!`
    } else if (profile?.primary_goal === 'lose_weight' && recentWeights.length >= 5) {
      summary += `🎯 Great consistency with weight tracking!`
    } else {
      summary += `⚡ Let's push harder next week to stay on track!`
    }

    const report = {
      week_start: oneWeekAgo.toISOString(),
      week_end: today.toISOString(),
      weight_entries: recentWeights.length,
      training_sessions: recentTraining.length,
      summary,
      on_track: recentWeights.length >= 4 && recentTraining.length >= 2
    }

    return c.json({ report })
  } catch (error) {
    console.log('Weekly report error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

Deno.serve(app.fetch)