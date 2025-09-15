import React from 'react'
import WeddingCountdown from '../WeddingCountdown'
import UserProgressCards from './UserProgressCards'
import WeeklySummary from './WeeklySummary'
import DailyTip from '../DailyTip'

interface UserProfile {
  name: string
  email: string
  current_weight: number | null
  target_weight: number | null
  created_at: string
}

interface OverviewContentProps {
  profile: UserProfile | null
}

export default function OverviewContent({ profile }: OverviewContentProps) {
  return (
    <div className="space-y-8">
      {/* Wedding Countdown */}
      <WeddingCountdown />

      {/* Both Users Progress Side by Side */}
      <UserProgressCards profile={profile} />

      {/* Weekly Summary & Celebration */}
      <WeeklySummary />

      {/* Daily Tip */}
      <DailyTip />
    </div>
  )
}