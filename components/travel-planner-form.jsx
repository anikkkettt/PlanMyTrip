"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format, differenceInDays } from "date-fns"
import {
  CalendarIcon,
  MapPin,
  Users,
  ShoppingBag,
  Camera,
  Mountain,
  Building2,
  Coffee,
  Music,
  Loader2,
} from "lucide-react"
import GooglePlacesAutocomplete from "react-google-places-autocomplete"
import { useToast } from "@/hooks/use-toast"

export default function TravelPlannerForm({ className }) {
  const router = useRouter()
  const { toast } = useToast()

  const [step, setStep] = useState(1)

  const [destination, setDestination] = useState(null)
  const [date, setDate] = useState({
    from: undefined,
    to: undefined,
  })


  const [budget, setBudget] = useState("")

  const [activities, setActivities] = useState([])
  const [travelWith, setTravelWith] = useState("")
  
  const [isGenerating, setIsGenerating] = useState(false)

  const activities_options = [
    { icon: <Camera className="h-5 w-5" />, label: "Sightseeing" },
    { icon: <Mountain className="h-5 w-5" />, label: "Adventure" },
    { icon: <Building2 className="h-5 w-5" />, label: "Cultural" },
    { icon: <Coffee className="h-5 w-5" />, label: "Relaxation" },
    { icon: <ShoppingBag className="h-5 w-5" />, label: "Shopping" },
    { icon: <Music className="h-5 w-5" />, label: "Nightlife" },
  ]

  const travel_with_options = [
    { icon: <Users className="h-5 w-5" />, label: "Solo", description: "Discovering on Your Own", count: "1 Person" },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Couple",
      description: "Exploring with a Loved One",
      count: "2 People",
    },
    { icon: <Users className="h-5 w-5" />, label: "Family", description: "Fun for All Ages", count: "3 to 5 People" },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Group",
      description: "Adventure with Your Crew",
      count: "5 to 10 People",
    },
  ]

  const budget_options = [
    { label: "Cheap", description: "Economize and Save", value: "cheap" },
    { label: "Moderate", description: "Balance Cost and Comfort", value: "moderate" },
    { label: "Luxury", description: "Indulge without Limits", value: "luxury" },
  ]

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleCreatePlan = async () => {
    // regular plan creation logic
    console.log({
      destination: destination?.label || destination?.value?.description,
      date,
      budget,
      activities,
      travelWith,
    })

    //   after submission Reset form
    resetForm()
  }

  const handleGenerateAIPlan = async () => {
    try {
      setIsGenerating(true)

      const tripData = {
        destination: destination?.label || destination?.value?.description,
        date,
        budget,
        activities: activities.map((a) => a),
        travelWith,
      }

      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tripData),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to generate plan")
      }

      // Reset form
      resetForm()

      //navigate to the plan page
      router.push(`/plans/${data.plan._id}`)
    } catch (error) {
      console.error("Error generating AI plan:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to generate AI plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const resetForm = () => {
    setDestination(null)
    setDate({
      from: undefined,
      to: undefined,
    })
    setBudget("")
    setActivities([])
    setTravelWith("")
    setStep(1)
  }

  const toggleActivity = (activity) => {
    if (activities.includes(activity)) {
      setActivities(activities.filter((a) => a !== activity))
    } else {
      setActivities([...activities, activity])
    }
  }

  return (
    <Card className={cn("bg-white", className)}>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Create Travel Plan</h2>
            <p className="text-sm text-gray-500">
              Step {step} of 4:{" "}
              {step === 1
                ? "Choose your destination"
                : step === 2
                  ? "Select your dates"
                  : step === 3
                    ? "Set your budget"
                    : "Choose your preferences"}
            </p>
          </div>

          <div className="space-y-4">
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="destination">Search for your destination city</Label>
                  <div className="relative">
                    <GooglePlacesAutocomplete
                      apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}
                      selectProps={{
                        value: destination,
                        onChange: setDestination,
                        placeholder: "Search for your destination city...",
                        styles: {
                          control: (provided) => ({
                            ...provided,
                            padding: "6px 8px 6px 36px",
                            borderColor: "#e2e8f0",
                            "&:hover": {
                              borderColor: "#cbd5e1",
                            },
                          }),
                          input: (provided) => ({
                            ...provided,
                            color: "#1e293b",
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isFocused ? "#f1f5f9" : "white",
                            color: "#1e293b",
                          }),
                        },
                      }}
                    />
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Dates</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                              <span className="ml-2 text-sm text-gray-500">
                                ({differenceInDays(date.to, date.from)} days)
                              </span>
                            </>
                          ) : (
                            format(date.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick your travel dates</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <Label>What is your Budget?</Label>
                <div className="grid gap-4 md:grid-cols-3">
                  {budget_options.map((option) => (
                    <Button
                      key={option.value}
                      variant="outline"
                      className={cn(
                        "h-auto flex-col items-start space-y-2 p-4",
                        budget === option.value && "border-2 border-blue-600",
                      )}
                      onClick={() => setBudget(option.value)}
                    >
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Select the kind of activities you want to do (Optional)</Label>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {activities_options.map((activity) => (
                      <Button
                        key={activity.label}
                        variant="outline"
                        className={cn(
                          "h-auto justify-start space-x-2 px-3 py-2",
                          activities.includes(activity.label) && "border-2 border-blue-600",
                        )}
                        onClick={() => toggleActivity(activity.label)}
                      >
                        {activity.icon}
                        <span>{activity.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Who are you travelling with? (Optional)</Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    {travel_with_options.map((option) => (
                      <Button
                        key={option.label}
                        variant="outline"
                        className={cn(
                          "h-auto flex-col items-start space-y-2 p-4",
                          travelWith === option.label && "border-2 border-blue-600",
                        )}
                        onClick={() => setTravelWith(option.label)}
                      >
                        <div className="flex w-full items-center space-x-2">
                          {option.icon}
                          <span className="font-semibold">{option.label}</span>
                        </div>
                        <div className="text-sm text-gray-500">{option.description}</div>
                        <div className="text-xs text-gray-400">{option.count}</div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} disabled={isGenerating}>
                Back
              </Button>
            )}
            {step < 4 ? (
              <Button className="ml-auto" onClick={handleNext} disabled={step === 1 && !destination}>
                Next
              </Button>
            ) : (
              <div className="ml-auto space-x-2">
                <Button variant="outline" onClick={handleCreatePlan} disabled={isGenerating}>
                  Create Your Plan
                </Button>
                <Button onClick={handleGenerateAIPlan} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate AI Plan"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

