import React from 'react'
import { Button } from '../ui/button'
import { LogOut } from 'lucide-react'

interface DashboardHeaderProps {
  userName: string
  onSignOut: () => void
}

export default function DashboardHeader({ userName, onSignOut }: DashboardHeaderProps) {
  return (
    <div className="bg-white/90 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-blue-700">
                Honeymoon Shape
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {userName}!
              </p>
            </div>
          </div>
          <Button
            onClick={onSignOut}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-800"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}