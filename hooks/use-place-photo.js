"use client"

import { useState, useEffect } from "react"

// Cache for photos to avoid duplicate requests
const photoCache = new Map()

export function usePlacePhoto(destination) {
  const [photoUrl, setPhotoUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!destination) return

    // Check cache first
    if (photoCache.has(destination)) {
      setPhotoUrl(photoCache.get(destination))
      return
    }

    const fetchPhoto = async () => {
      setLoading(true)
      setError(null)

      try {
        // Use Unsplash as our photo source for simplicity
        const fallbackUrl = `https://source.unsplash.com/featured/?travel,${encodeURIComponent(destination)}`
        setPhotoUrl(fallbackUrl)
        photoCache.set(destination, fallbackUrl)
      } catch (err) {
        console.error("Error fetching place photo:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPhoto()
  }, [destination])

  return { photoUrl, loading, error }
}

