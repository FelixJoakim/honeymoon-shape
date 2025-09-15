import React from 'react'
import { NAVIGATION_TABS } from './constants'

interface NavigationTabsProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

export default function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  return (
    <div className="flex space-x-1 mb-8 bg-white/70 rounded-xl p-1 shadow-sm">
      {NAVIGATION_TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === tab.id
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
              : 'text-gray-600 hover:text-gray-800 hover:bg-white/90'
          }`}
        >
          <tab.icon className="w-4 h-4" />
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}