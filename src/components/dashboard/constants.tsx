import { Target, TrendingDown, Dumbbell, Camera, StickyNote } from 'lucide-react'

export const NAVIGATION_TABS = [
  { id: 'overview', label: 'Overview', icon: Target },
  { id: 'weight', label: 'Weight', icon: TrendingDown },
  { id: 'training', label: 'Training', icon: Dumbbell },
  { id: 'photos', label: 'Photos', icon: Camera },
  { id: 'notes', label: 'Notes', icon: StickyNote }
]

export const MOCK_ANNI_PROFILE = {
  name: 'Anni',
  current_weight: 65,
  target_weight: 58,
  weeklyGoal: 0.5,
  thisWeekProgress: 0.3
}

export const HONEYMOON_DATE = '2026-04-25'
export const START_DATE = '2024-01-01'