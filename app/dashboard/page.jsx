"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"

import TravelPlannerForm from "@/components/travel-planner-form"
import { Card,CardContent,CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button} from "@/components/ui/button"

import { MapPin, Plane, History, Bookmark, Loader2 } from "lucide-react"
import { getDestinationPhotos } from "@/lib/places-api"

import { getSavedTripIds } from "@/lib/saved-trips"
import PlaceholderImage from "@/components/placeholder-image"

export default function DashboardPage() {
  const { user } = useUser()

  const router = useRouter()
  const [destinationImages, setDestinationImages] = useState({})
  const [loading, setLoading] = useState(true)
  
  // User ke trips ka count track karne ke liye state
  const [tripCounts, setTripCounts] = useState({
    total: 0,
    saved: 0,
  })

  const recommendedDestinations = ["Bali, Indonesia", "Tokyo, Japan", "Santorini, Greece"]

  useEffect(() => {
    const fetchData = async () => {
      try {
        // User ke trips aur saved destinations ka data fetch karte hain
        const response = await fetch("/api/user-plans")
        const data = await response.json()

        if (data.success) {
          const totalTrips = data.plans.length
          const savedTripIds = await getSavedTripIds()
          const savedTrips = savedTripIds.length

          setTripCounts({
            total: totalTrips,
            saved: savedTrips,
          })
        }

        // Recommended destinations ki photos fetch karte hain
        const images = {}
        for (const destination of recommendedDestinations) {
          try {
            const url = await getDestinationPhotos(destination)
            if (url) {
              images[destination] = url
            }
          } catch (error) {
            console.error(`Error fetching image for ${destination}:`, error)
          }
        }
        setDestinationImages(images)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome, {user?.firstName || user?.username || "Traveler"}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card
              className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push("/saved-destinations")}
            >
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <MapPin className="mr-2 h-5 w-5 text-blue-600" />
                  Saved Destinations
                </CardTitle>
                <CardDescription className="text-gray-600">Places you want to visit</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-gray-800">{tripCounts.saved}</p>
                )}
              </CardContent>
            </Card>

            <Card
              className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push("/my-plans")}
            >
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <Plane className="mr-2 h-5 w-5 text-blue-600" />
                  Previously Created Trips
                </CardTitle>
                <CardDescription className="text-gray-600">Your travel history</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-gray-800">{tripCounts.total}</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <Bookmark className="mr-2 h-5 w-5 text-blue-600" />
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-gray-600">Manage your trips</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/my-plans")}>
                  <History className="mr-2 h-4 w-4" />
                  View All Plans
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/saved-destinations")}
                >
                  <Bookmark className="mr-2 h-4 w-4" />
                  View Saved Destinations
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Travel Planner Form */}
          <div className="mb-12">
            <TravelPlannerForm />
          </div>

          <h2 className="text-2xl font-bold mb-6 text-gray-800">Recommended Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedDestinations.map((destination, index) => (
              <Card key={index} className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-0">
                  <div className="h-48 bg-gray-100 relative">
                    {loading ? (
                      <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                        <span className="text-gray-400">Loading image...</span>
                      </div>
                    ) : destinationImages[destination] ? (
                      <img
                        src={destinationImages[destination] || "/placeholder.svg"}
                        alt={destination}
                        className="w-full h-full object-cover"
                        onError={() => {
                          setDestinationImages((prev) => ({
                            ...prev,
                            [destination]: null,
                          }))
                        }}
                      />
                    ) : (
                      <PlaceholderImage text={destination} className="w-full h-full object-cover" alt={destination} />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2 text-gray-800">{destination}</h3>
                    <p className="text-gray-600 mb-4">Experience the beauty and culture</p>
                    <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-100">
                      Explore
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

