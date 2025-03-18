"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import HotelCard from "@/components/hotel-card"
import ActivityCard from "@/components/activity-card"
import {
  Calendar,CloudSun,Compass,Hotel,Info,Loader2,
  Utensils,Backpack,Sun,Sunrise,Sunset,CreditCard,
} from "lucide-react"

import Navbar from "@/components/navbar"

import { getDestinationPhotos } from "@/lib/places-api"

import PlaceholderImage from "@/components/placeholder-image"

export default function PlanPage() {
  const { id } = useParams()
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bannerUrl, setBannerUrl] = useState(null)

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        // Plan ka data fetch karte hain
        const response = await fetch(`/api/plans/${id}`)
        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch plan")
        }

        setPlan(data.plan)

        // Destination ki photo fetch karte hain banner ke liye
        if (data.plan.metadata?.destination) {
          const url = await getDestinationPhotos(data.plan.metadata.destination)
          if (url) {
            setBannerUrl(url)
          }
        }
      } catch (error) {
        console.error("Error fetching plan:", error)
        setError(error.message || "Failed to fetch plan")
      } finally {
        setLoading(false)
      }
    }

    fetchPlan()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-xl">Loading your travel plan...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-700">{error}</p>
        <Button className="mt-4" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Plan Not Found</h1>
        <p className="text-gray-700">The requested travel plan could not be found.</p>
        <Button className="mt-4" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  const {
    description,
    bestTimeToVisit,
    weather,
    activities,
    topSpots,
    hotels,
    itinerary,
    localCuisine,
    packingList,
    budget,
    metadata,
  } = plan

  return (
    <div className="min-h-screen bg-white">
      <Navbar/>
      {/* Banner */}
      <div
        className="h-80 bg-cover bg-center relative"
        style={{ backgroundImage: bannerUrl ? `url(${bannerUrl})` : undefined }}
      >
        {!bannerUrl && (
          <div className="absolute inset-0">
            <PlaceholderImage
              text={metadata.destination}
              width={1600}
              height={900}
              className="w-full h-full object-cover"
              alt={metadata.destination}
            />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white p-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{metadata.destination} ✈️</h1>
            <p className="text-xl">
              {metadata.totalDays} Day{metadata.totalDays > 1 ? "s" : ""} •{" "}
              {metadata.budget.charAt(0).toUpperCase() + metadata.budget.slice(1)} Budget
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center">
              <CloudSun className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-700">Weather</h3>
                <p className="text-gray-600">{weather || "Information not available"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center">
              <Calendar className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-700">Best Time to Visit</h3>
                <p className="text-gray-600">{bestTimeToVisit || "Information not available"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center">
              <Compass className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-700">Travel Type</h3>
                <p className="text-gray-600">
                  {metadata.travelWith} • {metadata.activities.join(", ") || "General"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="about" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="about">
              <Info className="h-4 w-4 mr-2" />
              About
            </TabsTrigger>
            <TabsTrigger value="itinerary">
              <Calendar className="h-4 w-4 mr-2" />
              Itinerary
            </TabsTrigger>
            <TabsTrigger value="hotels">
              <Hotel className="h-4 w-4 mr-2" />
              Hotels
            </TabsTrigger>
            <TabsTrigger value="activities">
              <Compass className="h-4 w-4 mr-2" />
              Activities
            </TabsTrigger>
            <TabsTrigger value="budget">
              <CreditCard className="h-4 w-4 mr-2" />
              Budget
            </TabsTrigger>
            <TabsTrigger value="cuisine">
              <Utensils className="h-4 w-4 mr-2" />
              Cuisine
            </TabsTrigger>
            <TabsTrigger value="packing">
              <Backpack className="h-4 w-4 mr-2" />
              Packing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">About {metadata.destination} 🌍</h2>
                <p className="text-gray-700 whitespace-pre-line">{description}</p>
              </CardContent>
            </Card>

            <h2 className="text-2xl font-bold mt-8 mb-4">Top Places to Visit 📍</h2>
            {topSpots && topSpots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topSpots.map((spot, index) => (
                  <ActivityCard key={index} activity={spot} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No top spots information available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="itinerary">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Your {metadata.totalDays}-Day Itinerary 📅</h2>

                {itinerary?.map((day, dayIndex) => (
                  <div key={dayIndex} className="mb-8 border-b pb-6 last:border-0">
                    <h3 className="text-xl font-bold mb-4">{day.day || `Day ${dayIndex + 1}`}</h3>

                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="bg-amber-100 p-2 rounded-full mr-4">
                          <Sunrise className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg mb-2">Morning</h4>
                          <ul className="space-y-2">
                            {day.activities?.morning?.map((item, index) => (
                              <li key={index} className="text-gray-700">
                                <span className="font-medium">{item.itineraryItem}</span>
                                {item.briefDescription && (
                                  <p className="text-sm text-gray-600 mt-1">{item.briefDescription}</p>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-4">
                          <Sun className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg mb-2">Afternoon</h4>
                          <ul className="space-y-2">
                            {day.activities?.afternoon?.map((item, index) => (
                              <li key={index} className="text-gray-700">
                                <span className="font-medium">{item.itineraryItem}</span>
                                {item.briefDescription && (
                                  <p className="text-sm text-gray-600 mt-1">{item.briefDescription}</p>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-indigo-100 p-2 rounded-full mr-4">
                          <Sunset className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg mb-2">Evening</h4>
                          <ul className="space-y-2">
                            {day.activities?.evening?.map((item, index) => (
                              <li key={index} className="text-gray-700">
                                <span className="font-medium">{item.itineraryItem}</span>
                                {item.briefDescription && (
                                  <p className="text-sm text-gray-600 mt-1">{item.briefDescription}</p>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hotels">
            <h2 className="text-2xl font-bold mb-6">Recommended Hotels 🏨</h2>
            {hotels && hotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotels.map((hotel, index) => (
                  <HotelCard key={index} hotel={hotel} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No hotel recommendations available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="activities">
            <h2 className="text-2xl font-bold mb-6">Top Activities 🚵‍♂️</h2>
            {activities && activities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map((activity, index) => (
                  <ActivityCard key={index} activity={activity} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No activities information available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="budget">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Approximate Budget Breakdown (INR) 💰</h2>

                {/* Budget Summary */}
                <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="text-xl font-semibold mb-2 text-blue-800">Budget Summary</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Total Estimated Cost:</span>
                    <span className="text-2xl font-bold text-blue-700">
                      ₹{budget?.total?.toLocaleString("en-IN") || "N/A"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Based on {metadata?.totalDays} days, {metadata?.budget} budget for {metadata?.travelWith || "solo"}{" "}
                    travel
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 border-b pb-2">Accommodation</h3>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-700">Hotels ({metadata?.totalDays} nights)</span>
                      <span className="font-medium">₹{budget?.accommodation?.toLocaleString("en-IN") || "N/A"}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 border-b pb-2">Food & Dining</h3>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-700">Meals (3 per day)</span>
                      <span className="font-medium">₹{budget?.food?.toLocaleString("en-IN") || "N/A"}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 border-b pb-2">Transportation</h3>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-700">Local Transport</span>
                      <span className="font-medium">₹{budget?.transportation?.toLocaleString("en-IN") || "N/A"}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 border-b pb-2">Activities & Sightseeing</h3>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-700">Entrance Fees & Tours</span>
                      <span className="font-medium">₹{budget?.activities?.toLocaleString("en-IN") || "N/A"}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 border-b pb-2">Miscellaneous</h3>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-700">Shopping, Souvenirs & Contingency</span>
                      <span className="font-medium">₹{budget?.miscellaneous?.toLocaleString("en-IN") || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Budget Notes */}
                {budget?.notes && budget.notes.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-3 border-b pb-2">Budget Notes</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {budget.notes.map((note, index) => (
                        <li key={index} className="text-gray-700">
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-8 text-sm text-gray-500">
                  <p>
                    * This is an approximate budget based on average costs. Actual expenses may vary based on season,
                    specific choices, and current rates.
                  </p>
                  <p>* Budget calculations are estimates for planning purposes only.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cuisine">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Local Cuisine Recommendations 🍽️</h2>
                <ul className="space-y-4">
                  {localCuisine?.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-2xl mr-2">🍴</span>
                      <div>
                        <p className="text-gray-700">{item}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="packing">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Packing Checklist 🧳</h2>
                <ul className="space-y-2 columns-1 md:columns-2 lg:columns-3">
                  {packingList?.map((item, index) => (
                    <li key={index} className="flex items-center break-inside-avoid">
                      <span className="text-lg mr-2">✅</span>
                      <p className="text-gray-700">{item}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

