"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Loader2, MapPin, Bookmark, BookmarkCheck } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { getDestinationPhotos } from "@/lib/places-api"
import PlaceholderImage from "@/components/placeholder-image"
import { saveTrip, unsaveTrip, isTripSaved } from "@/lib/saved-trips"
import { useToast } from "@/hooks/use-toast"

export default function MyPlansPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [photoUrls, setPhotoUrls] = useState({})
  const [savedTrips, setSavedTrips] = useState({})
  const [savingStates, setSavingStates] = useState({})

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        // User ke saare plans fetch karte hain
        const response = await fetch("/api/user-plans")
        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch plans")
        }

        setPlans(data.plans)

        // Initialize saved state for each plan
        const savedState = {}
        const savingState = {}

        for (const plan of data.plans) {
          savedState[plan._id] = false
          savingState[plan._id] = false

          try {
            const isSaved = await isTripSaved(plan._id)
            savedState[plan._id] = isSaved
          } catch (err) {
            console.error(`Error checking if plan ${plan._id} is saved:`, err)
          }
        }

        setSavedTrips(savedState)
        setSavingStates(savingState)

        // Har plan ke destination ki photo fetch karte hain
        const urls = {}
        for (const plan of data.plans) {
          try {
            const destination = plan.metadata.destination
            if (destination) {
              const url = await getDestinationPhotos(destination)
              if (url) {
                urls[plan._id] = url
              }
            }
          } catch (photoError) {
            console.error(`Error fetching photo for ${plan.metadata.destination}:`, photoError)
          }
        }

        setPhotoUrls(urls)
      } catch (error) {
        console.error("Error fetching plans:", error)
        setError(error.message || "Failed to fetch plans")
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  const handleToggleSave = async (e, planId) => {
    e.preventDefault()
    e.stopPropagation()



    
    // Set saving state
    setSavingStates((prev) => ({
      ...prev,
      [planId]: true,
    }))

    const isCurrentlySaved = savedTrips[planId]

    try {
      if (isCurrentlySaved) {
        const success = await unsaveTrip(planId)
        if (success) {
          toast({
            title: "Trip removed from saved destinations",
            description: "You can save it again anytime.",
          })
          setSavedTrips((prev) => ({
            ...prev,
            [planId]: false,
          }))
        }
      } else {
        const success = await saveTrip(planId)
        if (success) {
          toast({
            title: "Trip saved to destinations",
            description: "You can view all saved trips from your dashboard.",
          })
          setSavedTrips((prev) => ({
            ...prev,
            [planId]: true,
          }))
        }
      }
    } catch (error) {
      console.error("Error toggling save state:", error)
      toast({
        title: "Error",
        description: "Failed to update saved status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSavingStates((prev) => ({
        ...prev,
        [planId]: false,
      }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-xl">Loading your travel plans...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700">{error}</p>
          <Button className="mt-4" onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Travel Plans</h1>

        {plans.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">You haven't created any travel plans yet</h2>
            <p className="text-gray-600 mb-6">Generate your first AI travel plan to get started!</p>
            <Button onClick={() => router.push("/dashboard")}>Create a Plan</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan._id} className="relative">
                <Link href={`/plans/${plan._id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="h-48 relative">
                      {photoUrls[plan._id] ? (
                        <img
                          src={photoUrls[plan._id] || "/placeholder.svg"}
                          alt={plan.metadata.destination}
                          className="w-full h-full object-cover"
                          onError={() => {
                            setPhotoUrls((prev) => ({
                              ...prev,
                              [plan._id]: null,
                            }))
                          }}
                        />
                      ) : (
                        <PlaceholderImage
                          text={plan.metadata.destination}
                          className="w-full h-full object-cover"
                          alt={plan.metadata.destination}
                        />
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold mb-2">{plan.metadata.destination}</h2>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                          {plan.metadata.totalDays} Day{plan.metadata.totalDays > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>
                          {plan.metadata.budget.charAt(0).toUpperCase() + plan.metadata.budget.slice(1)} Budget
                        </span>
                      </div>
                      <p className="text-gray-700 line-clamp-3">{plan.description?.substring(0, 150)}...</p>
                      <p className="text-gray-500 text-sm mt-4">
                        Created: {new Date(plan.metadata.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 bg-white hover:bg-gray-100 z-10"
                  onClick={(e) => handleToggleSave(e, plan._id)}
                  disabled={savingStates[plan._id]}
                  title={savedTrips[plan._id] ? "Remove from saved" : "Save destination"}
                >
                  {savingStates[plan._id] ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : savedTrips[plan._id] ? (
                    <BookmarkCheck className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

