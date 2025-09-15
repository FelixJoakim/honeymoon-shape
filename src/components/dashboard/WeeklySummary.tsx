import React from 'react'
import { Card, CardContent } from '../ui/card'

export default function WeeklySummary() {
  return (
    <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 rounded-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-amber-800 mb-2">Ready to Begin</h3>
            <p className="text-amber-700">Your honeymoon fitness journey starts now! 💪</p>
            <p className="text-sm text-amber-600 mt-1">Track your daily progress and celebrate every achievement together.</p>
          </div>
          <div className="text-4xl">🚀</div>
        </div>
      </CardContent>
    </Card>
  )
}