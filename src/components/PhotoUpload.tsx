import React, { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../utils/supabase/client'
import { projectId, publicAnonKey } from '../utils/supabase/info'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { Camera, Upload, Calendar, Trash2 } from 'lucide-react'

interface PhotoEntry {
  id: string
  user_id: string
  file_name: string
  file_url: string
  upload_date: string
  week_number: number
  created_at: string
}

interface PhotoUploadProps {
  user: User
}

export default function PhotoUpload({ user }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<PhotoEntry[]>([])
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Create bucket if it doesn't exist
      const bucketName = 'make-6a2efb2d-photos'
      const { data: buckets } = await supabase.storage.listBuckets()
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName)
      
      if (!bucketExists) {
        await supabase.storage.createBucket(bucketName, { public: false })
      }

      // List files in the user's folder
      const { data: files, error } = await supabase.storage
        .from(bucketName)
        .list(`${session.user.id}`, {
          limit: 100,
          offset: 0,
        })

      if (error) {
        console.error('Error listing photos:', error)
        return
      }

      // Convert files to photo entries
      const photos: PhotoEntry[] = []
      for (const file of files || []) {
        // Get signed URL for the file
        const { data: urlData } = await supabase.storage
          .from(bucketName)
          .createSignedUrl(`${session.user.id}/${file.name}`, 60 * 60 * 24 * 365) // 1 year

        // Extract metadata from filename (format: timestamp-originalname)
        const timestamp = file.name.split('-')[0]
        const uploadDate = new Date(parseInt(timestamp)).toISOString().split('T')[0]
        
        photos.push({
          id: file.id || file.name,
          user_id: session.user.id,
          file_name: file.name,
          file_url: urlData?.signedUrl || '',
          upload_date: uploadDate,
          week_number: getWeekNumber(),
          created_at: new Date(parseInt(timestamp)).toISOString()
        })
      }

      setPhotos(photos.sort((a: PhotoEntry, b: PhotoEntry) => 
        new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime()
      ))
    } catch (error) {
      console.error('Error fetching photos:', error)
    }
  }

  const getWeekNumber = () => {
    const startDate = new Date('2024-01-01') // Arbitrary start date for week counting
    const today = new Date()
    const diffTime = today.getTime() - startDate.getTime()
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))
    return diffWeeks
  }

  const hasPhotoToday = () => {
    const today = new Date().toISOString().split('T')[0]
    return photos.some(photo => photo.upload_date === today)
  }

  const uploadPhoto = async (file: File) => {
    if (!file || file.type.indexOf('image') === -1) {
      alert('Please select a valid image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB')
      return
    }

    setUploading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Please sign in to upload photos')
        setUploading(false)
        return
      }

      // Create bucket if it doesn't exist
      const bucketName = 'make-6a2efb2d-photos'
      const { data: buckets } = await supabase.storage.listBuckets()
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName)
      
      if (!bucketExists) {
        await supabase.storage.createBucket(bucketName, { public: false })
      }

      // Upload file
      const fileName = `${Date.now()}-${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(`${session.user.id}/${fileName}`, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        alert(`Upload failed: ${uploadError.message}`)
        setUploading(false)
        return
      }

      console.log('Photo uploaded successfully!')
      // Refresh the photos list
      await fetchPhotos()
    } catch (error) {
      console.error('Error uploading photo:', error)
      alert('Error uploading photo')
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadPhoto(file)
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
    
    const file = event.dataTransfer.files[0]
    if (file) {
      uploadPhoto(file)
    }
  }

  const deletePhoto = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Find the photo to get the file path
      const photo = photos.find(p => p.id === photoId)
      if (!photo) {
        alert('Photo not found')
        return
      }

      // Delete from storage
      const bucketName = 'make-6a2efb2d-photos'
      const { error: deleteError } = await supabase.storage
        .from(bucketName)
        .remove([`${session.user.id}/${photo.file_name}`])

      if (deleteError) {
        console.error('Delete error:', deleteError)
        alert(`Delete failed: ${deleteError.message}`)
        return
      }

      console.log('Photo deleted successfully!')
      // Refresh the photos list
      await fetchPhotos()
    } catch (error) {
      console.error('Error deleting photo:', error)
      alert('Error deleting photo')
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-purple-600" />
            Progress Photos
          </CardTitle>
          <CardDescription>
            Track your visual transformation journey to the wedding
          </CardDescription>
        </CardHeader>
        <CardContent>
          {false ? ( // Remove restriction - always allow upload
            <div className="text-center py-8">
              <Badge className="bg-green-100 text-green-800 border-green-200 mb-4">
                Photo uploaded today ✓
              </Badge>
              <p className="text-gray-600">
                Photo uploaded successfully!
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver 
                  ? 'border-purple-400 bg-purple-50' 
                  : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
              }`}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Upload Progress Photo
              </h3>
              <p className="text-gray-500 mb-4">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long', 
                  day: 'numeric' 
                })} • Drag and drop or click to select
              </p>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="photo-upload"
                disabled={uploading}
              />
              
              <label htmlFor="photo-upload">
                <Button
                  asChild
                  disabled={uploading}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  <span className="cursor-pointer">
                    {uploading ? (
                      <>Uploading...</>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Photo
                      </>
                    )}
                  </span>
                </Button>
              </label>
              
              <p className="text-xs text-gray-400 mt-4">
                Supported formats: JPG, PNG, GIF (max 5MB)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Photo Gallery */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Progress Gallery</h2>
        
        {photos.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No photos yet</h3>
              <p className="text-gray-500">Start documenting your transformation journey!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <Card key={photo.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
                <div className="aspect-square relative">
                  <ImageWithFallback
                    src={photo.file_url}
                    alt={`Progress photo week ${photo.week_number}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => deletePhoto(photo.id)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {new Date(photo.upload_date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(photo.upload_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}