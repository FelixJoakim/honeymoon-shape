import React from 'react'
import { Progress } from '../ui/progress'
import { Heart } from 'lucide-react'
import { getProgressToHoneymoon, getDaysToHoneymoon } from './helpers'

export default function HoneymoonProgressBar() {
  const progress = getProgressToHoneymoon()
  const daysToGo = getDaysToHoneymoon()

  return (
    <div className="bg-white border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full p-2">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-medium text-gray-900">Honeymoon Journey</h2>
              <p className="text-sm text-gray-600">Felix & Anni → April 25, 2026</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{Math.round(progress)}% Complete</p>
            <p className="text-xs text-gray-600">{daysToGo} days to go</p>
          </div>
        </div>
        <Progress value={progress} className="h-3" />
      </div>
    </div>
  )
}