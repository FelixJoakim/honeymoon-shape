import React from 'react'
import { User } from '@supabase/supabase-js'
import UnifiedTrainingLog from './UnifiedTrainingLog'

interface TrainingLogProps {
  user: User
}

export default function TrainingLog({ user }: TrainingLogProps) {
  return <UnifiedTrainingLog user={user} />
}