"use client"

import { useState, useEffect } from "react"
import { getDestinationPhotos } from "@/lib/places-api"
import PlaceholderImage from "./placeholder-image"

export default function DestinationBanner({ destination, imageUrl = null, children, className = "h-80 relative" }) {
  const [bannerUrl, setBannerUrl] = useState(null)
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(false)

    const fetchPhoto = async () => {
      try {
        let url = null

        if (imageUrl) {
          url = imageUrl
        } else if (destination) {
          console.log(`Fetching banner photo for destination: ${destination}`)
          // destination ka photo
          url = await getDestinationPhotos(destination)
        }

        if (isMounted) {
          setBannerUrl(url)
          setLoading(false)
        }
      } catch (err) {
        console.error(`Error fetching banner photo for ${destination}:`, err)

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
  }, [destination, imageUrl])

  return (
    <div className={className}>
      {loading ? (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <span className="text-gray-400">Loading image...</span>
        </div>
      ) : (
        <>
          <div className="absolute inset-0">
            {bannerUrl && !error ? (
              <img
                src={bannerUrl || "/placeholder.svg"}
                alt={destination}
                className="w-full h-full object-cover"
                onError={() => setError(true)}
              />
            ) : (
              <PlaceholderImage
                text={destination}
                width={1600}
                height={900}
                className="w-full h-full object-cover"
                alt={destination}
              />
            )}
          </div>
          {children}
        </>
      )}
    </div>
  )
}

