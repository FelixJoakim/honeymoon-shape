import { HONEYMOON_DATE, START_DATE } from './constants'

export const getProgressToHoneymoon = () => {
  const honeymoonDate = new Date(HONEYMOON_DATE)
  const today = new Date()
  const totalTime = honeymoonDate.getTime() - new Date(START_DATE).getTime()
  const timeLeft = honeymoonDate.getTime() - today.getTime()
  const progress = Math.max(0, Math.min(100, ((totalTime - timeLeft) / totalTime) * 100))
  return progress
}

export const getWeightProgress = (profile: { current_weight: number | null; target_weight: number | null } | null) => {
  if (!profile?.current_weight || !profile?.target_weight) return 0
  const startWeight = 85 // Felix's starting weight
  const currentWeight = 82 // Mock current weight
  const targetWeight = profile.target_weight
  const totalLoss = startWeight - targetWeight
  const currentLoss = startWeight - currentWeight
  return Math.round((currentLoss / totalLoss) * 100)
}

export const getDaysToHoneymoon = () => {
  return Math.ceil((new Date(HONEYMOON_DATE).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
}