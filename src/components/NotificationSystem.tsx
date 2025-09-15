import React, { useState, useEffect } from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { CheckCircle, TrendingUp, TrendingDown, Target, X } from 'lucide-react'
import { User } from '@supabase/supabase-js'
import { projectId } from '../utils/supabase/info'
import { supabase } from '../utils/supabase/client'

interface NotificationSystemProps {
  user: User
}

interface Notification {
  id: string
  type: 'daily_goal_complete' | 'weekly_report' | 'milestone'
  title: string
  message: string
  timestamp: string
  read: boolean
  data?: any
}

export default function NotificationSystem({ user }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    fetchNotifications()
    checkForDailyGoalCompletion()
    checkForWeeklyReport()
  }, [])

  const fetchNotifications = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a2efb2d/notifications`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      const data = await response.json()
      if (data.notifications) {
        setNotifications(data.notifications)
        // Show notifications if there are unread ones
        const hasUnread = data.notifications.some((n: Notification) => !n.read)
        if (hasUnread) setShowNotifications(true)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const checkForDailyGoalCompletion = async () => {
    // Check if both users have completed their daily goals
    // This would be implemented with actual data checking
    const today = new Date().toISOString().split('T')[0]
    
    // Mock logic - in real implementation, check both users' daily logs
    const bothCompletedToday = false // Replace with actual check
    
    if (bothCompletedToday) {
      await createNotification({
        type: 'daily_goal_complete',
        title: 'Daily Goals Complete! 🎉',
        message: 'Both Felix and Anni have completed their fitness goals for today. Amazing teamwork!',
        data: { date: today }
      })
    }
  }

  const checkForWeeklyReport = () => {
    const today = new Date()
    const isMonday = today.getDay() === 1
    
    if (isMonday) {
      // Generate weekly progress report
      generateWeeklyReport()
    }
  }

  const generateWeeklyReport = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a2efb2d/weekly-report`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      if (data.report) {
        await createNotification({
          type: 'weekly_report',
          title: 'Weekly Progress Report 📊',
          message: data.report.summary,
          data: data.report
        })
      }
    } catch (error) {
      console.error('Error generating weekly report:', error)
    }
  }

  const createNotification = async (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const newNotification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a2efb2d/notifications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newNotification)
      })

      if (response.ok) {
        setNotifications(prev => [newNotification, ...prev])
        setShowNotifications(true)
      }
    } catch (error) {
      console.error('Error creating notification:', error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a2efb2d/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'daily_goal_complete':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'weekly_report':
        return <TrendingUp className="w-5 h-5 text-amber-600" />
      case 'milestone':
        return <Target className="w-5 h-5 text-purple-600" />
      default:
        return <CheckCircle className="w-5 h-5 text-gray-600" />
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (!showNotifications && unreadCount === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      {unreadCount > 0 && (
        <Badge 
          className="mb-2 bg-amber-600 text-white cursor-pointer hover:bg-amber-700"
          onClick={() => setShowNotifications(true)}
        >
          {unreadCount} new notification{unreadCount > 1 ? 's' : ''}
        </Badge>
      )}

      {showNotifications && (
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowNotifications(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-sm">No notifications yet</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      notification.read 
                        ? 'bg-gray-50 border-gray-200' 
                        : 'bg-amber-50 border-amber-200'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {notification.title}
                        </h4>
                        <p className="text-gray-600 text-xs mt-1">
                          {notification.message}
                        </p>
                        <p className="text-gray-400 text-xs mt-2">
                          {new Date(notification.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}