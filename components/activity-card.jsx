"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { searchPlaceWithPhotos, getPlacePhoto } from "@/lib/places-api"
import PlaceholderImage from "./placeholder-image"

export default function ActivityCard({ activity }) {
  const [photoUrl, setPhotoUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Agar activity undefined hai toh default values set karte hain
  const activityData = activity || {}

  // Undefined errors se bachne ke liye default values ke saath destructure karte hain
  const {
    name = "Activity",
    description = "No description available",
    location = "Location not specified",
    imageUrl = null,
  } = activityData

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(false)

    const fetchData = async () => {
      try {
        let url = null

        if (imageUrl) {
          url = imageUrl
        } else {
          // Activity ke liye photo search karte hain
          const searchTerm = `${name} ${location}`
          console.log(`Fetching photo for activity: ${searchTerm}`)

          const place = await searchPlaceWithPhotos(searchTerm)

          if (place && place.photos && place.photos.length > 0) {
            const photoName = place.photos[0].name
            url = await getPlacePhoto(photoName)
          }
        }

        if (isMounted) {
          setPhotoUrl(url)
          setLoading(false)
        }
      } catch (err) {
        console.error(`Error fetching activity photo for ${name}:`, err)

        if (isMounted) {
          setError(true)
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [name, location, imageUrl])

  const placeholderText = `${name} ${location}`

  // Create Google Maps URL for the location
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ", " + location)}`

  const handleCardClick = () => {
    window.open(mapsUrl, "_blank")
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg cursor-pointer" onClick={handleCardClick}>
      <div className="aspect-video relative overflow-hidden">
        {loading ? (
          <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
            <span className="text-gray-400">Loading image...</span>
          </div>
        ) : photoUrl && !error ? (
          <img
            src={photoUrl || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
            onError={() => setError(true)}
          />
        ) : (
          <PlaceholderImage
            text={placeholderText}
            className="w-full h-full transition-transform hover:scale-105"
            alt={name}
          />
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2">{name}</h3>
        {location && (
          <div className="flex items-start mb-2">
            <MapPin className="h-4 w-4 text-gray-500 mr-1 mt-1 flex-shrink-0" />
            <p className="text-gray-600 text-sm">{location}</p>
          </div>
        )}
        <p className="text-gray-700 text-sm line-clamp-3">{description}</p>
      </CardContent>
    </Card>
  )
}

