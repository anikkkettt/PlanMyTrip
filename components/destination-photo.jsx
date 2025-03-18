"use client"

import { useState, useEffect } from "react"
import { getDestinationPhotos } from "@/lib/places-api"
import PlaceholderImage from "./placeholder-image"

export default function DestinationPhoto({ destination, className = "", alt = "Destination" }) {
  const [photoUrl, setPhotoUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let isMounted = true

    if (!destination) {
      if (isMounted) {
        setLoading(false)
      }
      return
    }

    setLoading(true)
    setError(false)

    const fetchPhoto = async () => {
      try {
        console.log(`Fetching photo for destination: ${destination}`)
        // Get a photo URL for the destination using Google Places API
        const url = await getDestinationPhotos(destination)

        if (isMounted) {
          setPhotoUrl(url)
          setLoading(false)
        }
      } catch (err) {
        console.error(`Error fetching place photo for ${destination}:`, err)

        if (isMounted) {
          setError(true)
          setLoading(false)
        }
      }
    }

    fetchPhoto()

    return () => {
      isMounted = false
    }
  }, [destination])

  if (loading) {
    return (
      <div className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}>
        <span className="text-gray-400">Loading image...</span>
      </div>
    )
  }

  if (error || !photoUrl) {
    return <PlaceholderImage text={destination} className={className} alt={alt} />
  }

  return <img src={photoUrl || "/placeholder.svg"} alt={alt} className={className} onError={() => setError(true)} />
}

