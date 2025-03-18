"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Star } from "lucide-react"
import Link from "next/link"
import { searchPlaceWithPhotos, getPlacePhoto } from "@/lib/places-api"
import PlaceholderImage from "./placeholder-image"

export default function HotelCard({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const [error, setError] = useState(false)

  // Agar hotel data nahi hai toh warning deke return kar dete hain
  if (!hotel) {
    console.warn("Hotel object is undefined in HotelCard")

    return null
  }

  // Hotel data ko default values ke saath destructure karte hain
  const {
    name = "Hotel",
    address = "Address not available",
    rating = 0,
    description = "No description available",
    imageUrl = null,
  } = hotel

  useEffect(() => {
    let isMounted = true
    let didCancel = false

    const fetchData = async () => {
      setLoading(true)
      setError(false)

      try {
        let url = null

        if (imageUrl) {
          url = imageUrl
        } else {
          // Hotel ki photo search karte hain
          const searchTerm = `${name} ${address} hotel`
          console.log(`Fetching photo for hotel: ${searchTerm}`)

          const place = await searchPlaceWithPhotos(searchTerm)



          if (place && place.photos && place.photos.length > 0) {
            const photoName = place.photos[0].name
            url = await getPlacePhoto(photoName)
          }
        }

        if (!didCancel) {
          setPhotoUrl(url)
          setLoading(false)
        }
      } catch (err) {
        console.error(`Error fetching hotel photo for ${name}:`, err)
        if (!didCancel) {
          setError(true)
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
      didCancel = true
    }
  }, [name, address, imageUrl])

  // Format coordinates for Google Maps URL
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ", " + address)}`
  const placeholderText = `${name} ${address}`

  return (
    <Link href={mapsUrl} target="_blank" rel="noopener noreferrer">
      <Card className="overflow-hidden transition-all hover:shadow-lg">
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
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg line-clamp-1">{name}</h3>
            <div className="flex items-center text-amber-500">
              <span className="mr-1">{rating}</span>
              <Star className="h-4 w-4 fill-amber-500" />
            </div>
          </div>
          <div className="flex items-start mb-2">
            <MapPin className="h-4 w-4 text-gray-500 mr-1 mt-1 flex-shrink-0" />
            <p className="text-gray-600 text-sm line-clamp-2">{address}</p>
          </div>
          <p className="text-gray-700 text-sm line-clamp-2">{description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

