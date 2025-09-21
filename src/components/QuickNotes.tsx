import React, { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../utils/supabase/client'
import { projectId, publicAnonKey } from '../utils/supabase/info'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { StickyNote, Plus, Calendar, Trash2, Edit } from 'lucide-react'

interface Note {
  user_id: string
  content: string
  date: string
  created_at: string
  id?: string
}

interface QuickNotesProps {
  user: User
}

export default function QuickNotes({ user }: QuickNotesProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      // For now, notes are stored in local state
      // In production, this would fetch from Supabase notes table
      const storedNotes = localStorage.getItem(`notes_${user.id}`)
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes)
        setNotes(parsedNotes.sort((a: Note, b: Note) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ))
      }
    } catch (error) {
      console.error('Error fetching notes:', error)
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return

    setLoading(true)
    try {
      const newNoteObj: Note = {
        id: Date.now().toString(),
        user_id: user.id,
        content: newNote.trim(),
        date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString()
      }

      const updatedNotes = [newNoteObj, ...notes]
      setNotes(updatedNotes)
      
      // Save to localStorage
      localStorage.setItem(`notes_${user.id}`, JSON.stringify(updatedNotes))
      
      setNewNote('')
      console.log('Note saved successfully!')
    } catch (error) {
      console.error('Error adding note:', error)
      alert('Failed to save note')
    } finally {
      setLoading(false)
    }
  }

  const handleEditNote = async (noteKey: string) => {
    if (!editContent.trim()) return

    setLoading(true)
    try {
      const updatedNotes = notes.map(note => 
        note.id === noteKey 
          ? { ...note, content: editContent.trim() }
          : note
      )
      
      setNotes(updatedNotes)
      localStorage.setItem(`notes_${user.id}`, JSON.stringify(updatedNotes))
      
      setEditingNote(null)
      setEditContent('')
      console.log('Note updated successfully!')
    } catch (error) {
      console.error('Error editing note:', error)
      alert('Failed to update note')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNote = async (noteKey: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return

    try {
      const updatedNotes = notes.filter(note => note.id !== noteKey)
      setNotes(updatedNotes)
      localStorage.setItem(`notes_${user.id}`, JSON.stringify(updatedNotes))
      
      console.log('Note deleted successfully!')
    } catch (error) {
      console.error('Error deleting note:', error)
      alert('Failed to delete note')
    }
  }

  const startEdit = (note: Note, noteKey: string) => {
    setEditingNote(noteKey)
    setEditContent(note.content)
  }

  const cancelEdit = () => {
    setEditingNote(null)
    setEditContent('')
  }

  const getTodayNote = () => {
    const today = new Date().toISOString().split('T')[0]
    return notes.find(note => note.date === today)
  }

  const notePrompts = [
    "How are you feeling about your progress today?",
    "What challenged you during your workout?",
    "What healthy choice are you proud of today?",
    "How is your energy level?",
    "What's motivating you right now?",
    "Any cravings or struggles today?",
    "How did you sleep last night?",
    "What's your mood like today?"
  ]

  return (
    <div className="space-y-6">
      {/* Add Note Section */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-purple-600" />
            Daily Reflections
          </CardTitle>
          <CardDescription>
            Capture your thoughts, feelings, and observations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="How are you feeling today? Any thoughts on your fitness journey..."
              rows={4}
              className="resize-none"
            />
            
            {/* Quick Prompts */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">Quick prompts:</p>
              <div className="flex flex-wrap gap-2">
                {notePrompts.slice(0, 4).map((prompt, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer text-xs hover:bg-purple-50 hover:border-purple-300"
                    onClick={() => setNewNote(prompt + ' ')}
                  >
                    {prompt}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              onClick={handleAddNote}
              disabled={loading || !newNote.trim()}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              {loading ? 'Saving...' : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Note
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today's Note Highlight */}
      {getTodayNote() && (
        <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Calendar className="w-5 h-5" />
              Today's Reflection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 italic">"{getTodayNote()?.content}"</p>
          </CardContent>
        </Card>
      )}

      {/* Notes List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">All Notes</h2>
        
        {notes.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <StickyNote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No notes yet</h3>
              <p className="text-gray-500">Start documenting your fitness journey thoughts!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notes.map((note, index) => {
              const noteKey = Object.keys(note).find(key => key.startsWith('note_')) || `note_${index}`
              const isEditing = editingNote === noteKey
              
              return (
                <Card key={noteKey} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-gray-800">
                          {new Date(note.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(note, noteKey)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNote(noteKey)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-3">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={3}
                          className="resize-none"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEditNote(noteKey)}
                            disabled={loading || !editContent.trim()}
                            size="sm"
                            className="bg-gradient-to-r from-pink-500 to-purple-600"
                          >
                            {loading ? 'Saving...' : 'Save'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={cancelEdit}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {note.content}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}