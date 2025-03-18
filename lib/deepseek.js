import { differenceInDays } from "date-fns"

// Unsplash URLs ko placeholder images se replace karte hain
function replaceUnsplashUrls(planData) {
  // Helper function to process a single URL
  const processUrl = (url) => {
    if (typeof url === "string" && url.includes("unsplash.com")) {
      // Extract the search query from the Unsplash URL
      const searchQuery = url.split("?").pop().replace(/&.*$/, "")

      // Use a placeholder image with the same dimensions
      return `/placeholder.svg?height=900&width=1600&text=${encodeURIComponent(searchQuery)}`
    }
    return url
  }

  // Plan ke saare image URLs ko process karte hain
  if (planData.activities) {
    planData.activities.forEach((activity) => {
      if (activity.imageUrl) {
        activity.imageUrl = processUrl(activity.imageUrl)
      }
    })
  }

  if (planData.topSpots) {
    planData.topSpots.forEach((spot) => {
      if (spot.imageUrl) {
        spot.imageUrl = processUrl(spot.imageUrl)
      }
    })
  }

  if (planData.hotels) {
    planData.hotels.forEach((hotel) => {
      if (hotel.imageUrl) {
        hotel.imageUrl = processUrl(hotel.imageUrl)
      }
    })
  }

  return planData
}

// Trip plan ka schema 
const tripPlanSchema = {
  type: "object",
  properties: {
    description: {
      type: "string",
      description: "A detailed description about the place (at least 150 words)",
    },
    bestTimeToVisit: {
      type: "string",
      description: "The best time of year to visit this destination",
    },
    weather: {
      type: "string",
      description: "Current weather conditions at the destination",
    },
    activities: {
      type: "array",
      description: "Top 5 activities to do at the destination",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          location: { type: "string" },
          imageUrl: { type: "string" },
        },
        required: ["name", "description", "location"],
      },
    },
    topSpots: {
      type: "array",
      description: "Top 5 spots to visit at the destination",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          location: { type: "string" },
          imageUrl: { type: "string" },
          geoCoordinates: {
            type: "object",
            properties: {
              latitude: { type: "number" },
              longitude: { type: "number" },
            },
            required: ["latitude", "longitude"],
          },
        },
        required: ["name", "description", "location"],
      },
    },
    hotels: {
      type: "array",
      description: "3-5 hotel recommendations",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          address: { type: "string" },
          rating: { type: "number" },
          description: { type: "string" },
          imageUrl: { type: "string" },
          geoCoordinates: {
            type: "object",
            properties: {
              latitude: { type: "number" },
              longitude: { type: "number" },
            },
            required: ["latitude", "longitude"],
          },
        },
        required: ["name", "address", "rating", "description"],
      },
    },
    itinerary: {
      type: "array",
      description: "Daily itinerary for the trip",
      items: {
        type: "object",
        properties: {
          day: { type: "string" },
          activities: {
            type: "object",
            properties: {
              morning: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    itineraryItem: { type: "string" },
                    briefDescription: { type: "string" },
                  },
                  required: ["itineraryItem"],
                },
              },
              afternoon: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    itineraryItem: { type: "string" },
                    briefDescription: { type: "string" },
                  },
                  required: ["itineraryItem"],
                },
              },
              evening: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    itineraryItem: { type: "string" },
                    briefDescription: { type: "string" },
                  },
                  required: ["itineraryItem"],
                },
              },
            },
            required: ["morning", "afternoon", "evening"],
          },
        },
        required: ["day", "activities"],
      },
    },
    localCuisine: {
      type: "array",
      description: "Local cuisine recommendations (at least 5)",
      items: { type: "string" },
    },
    packingList: {
      type: "array",
      description: "Packing checklist based on the destination and activities",
      items: { type: "string" },
    },
    budget: {
      type: "object",
      description: "Detailed budget breakdown in INR",
      properties: {
        total: {
          type: "number",
          description: "Total estimated cost in INR",
        },
        accommodation: {
          type: "number",
          description: "Total accommodation cost in INR",
        },
        food: {
          type: "number",
          description: "Total food cost in INR",
        },
        transportation: {
          type: "number",
          description: "Total transportation cost in INR",
        },
        activities: {
          type: "number",
          description: "Total activities cost in INR",
        },
        miscellaneous: {
          type: "number",
          description: "Total miscellaneous cost in INR",
        },
        notes: {
          type: "array",
          description: "Additional budget notes and tips",
          items: { type: "string" },
        },
      },
      required: ["total", "accommodation", "food", "transportation", "activities", "miscellaneous"],
    },
  },
  required: [
    "description",
    "bestTimeToVisit",
    "weather",
    "activities",
    "topSpots",
    "hotels",
    "itinerary",
    "localCuisine",
    "packingList",
    "budget",
  ],
}

// DeepSeek API service
export async function generateTripPlan(tripData) {
  console.log("Starting trip plan generation with data:", tripData)
  const { destination, date, budget, activities, travelWith } = tripData

  // Trip ke din calculate 
  const totalDays = date.to ? differenceInDays(date.to, date.from) + 1 : 1
  console.log(`Planning a ${totalDays}-day trip to ${destination}`)

  // Activities ko prompt ke liye format
  const activitiesText = activities && activities.length > 0 ? `Activities of interest: ${activities.join(", ")}.` : ""

  // Travel companions ko format 
  const travelWithText = travelWith ? `Traveling with: ${travelWith}.` : "Traveling solo."

  // Prompt create karo hain with strict JSON formatting
  const prompt = `
  Generate a comprehensive travel plan for ${destination} for ${totalDays} days.
  Budget level: ${budget || "moderate"}.
  ${travelWithText}
  ${activitiesText}
  
  IMPORTANT: You MUST respond with VALID JSON only. Do not include any text outside the JSON object.
  Do not include markdown formatting, code blocks, or any other text.
  Your entire response must be a single, valid JSON object that follows this exact schema:
  
  ${JSON.stringify(tripPlanSchema, null, 2)}
  
  Ensure all fields in the schema are included and properly formatted.
  Do not include image URLs in your response. Leave the imageUrl fields empty or null.
  For coordinates, provide accurate latitude and longitude values.
  
  For the budget section, provide realistic and detailed cost estimates in Indian Rupees (INR) for ${destination} based on the ${budget} budget level.
  Break down costs for accommodation, food, transportation, activities, and miscellaneous expenses.
  Consider local prices, seasonal variations, and typical costs for ${destination}.
  
  The itinerary should cover exactly ${totalDays} days, with detailed activities for morning, afternoon, and evening each day.
  Include at least 5 activities, 5 top spots, 3-5 hotels, 5 local cuisine recommendations, and a comprehensive packing list.
`

  console.log("Sending prompt to DeepSeek API")

  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "You are a travel planning assistant that generates detailed travel plans in JSON format. You MUST respond with VALID JSON only. Do not include any text, markdown formatting, or code blocks outside the JSON object.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })

    const data = await response.json()
    console.log("Received response from DeepSeek API:", data)

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Invalid response structure from DeepSeek API:", data)
      throw new Error("Invalid response from DeepSeek API")
    }

 
    const content = data.choices[0].message.content
    console.log("Raw content from DeepSeek:", content)

    // Different methods se JSON extract karne ki koshish karte hain
    let planData

    try {
      // First attempt: Try to parse the entire content as JSON
      planData = JSON.parse(content)
      console.log("Successfully parsed content as JSON directly")
    } catch (parseError) {
      console.log("Failed to parse content directly as JSON, trying to extract JSON from text")

      // Second attempt: Try to extract JSON from markdown code blocks
      const jsonMatch =
        content.match(/```json\n([\s\S]*?)\n```/) ||
        content.match(/```\n([\s\S]*?)\n```/) ||
        content.match(/\{[\s\S]*\}/)

      if (jsonMatch) {
        try {
          planData = JSON.parse(jsonMatch[1] || jsonMatch[0])
          console.log("Successfully extracted and parsed JSON from markdown")
        } catch (extractError) {
          console.error("Failed to parse extracted JSON:", extractError)
          throw new Error("Failed to parse JSON from response")
        }
      } else {
        console.error("No JSON found in response")
        throw new Error("No JSON found in response")
      }
    }

    console.log("Parsed plan data:", planData)

    // Required fields check karte hain
    const requiredFields = [
      "description",
      "bestTimeToVisit",
      "weather",
      "activities",
      "topSpots",
      "hotels",
      "itinerary",
      "localCuisine",
      "packingList",
      "budget",
    ]

    const missingFields = requiredFields.filter((field) => !planData[field])
    if (missingFields.length > 0) {
      console.error("Missing required fields in plan data:", missingFields)

      // Missing fields ke liye default values set karte hain
      missingFields.forEach((field) => {
        console.log(`Adding default value for missing field: ${field}`)
        switch (field) {
          case "description":
            planData.description = `${destination} is a wonderful destination with much to offer visitors. The area is known for its unique attractions and cultural experiences.`
            break
          case "bestTimeToVisit":
            planData.bestTimeToVisit =
              "The best time to visit is typically during spring and fall when the weather is pleasant."
            break
          case "weather":
            planData.weather = "Weather conditions vary by season. Check local forecasts before your trip."
            break
          case "activities":
            planData.activities = [
              {
                name: "Sightseeing Tour",
                description: "Explore the main attractions of the area.",
                location: destination,
                imageUrl: null,
              },
            ]
            break
          case "topSpots":
            planData.topSpots = [
              {
                name: "Main Attraction",
                description: "The most popular spot in the area.",
                location: destination,
                imageUrl: null,
                geoCoordinates: { latitude: 0, longitude: 0 },
              },
            ]
            break
          case "hotels":
            planData.hotels = [
              {
                name: "Central Hotel",
                address: `Downtown, ${destination}`,
                rating: 4.5,
                description: "A comfortable hotel in a central location.",
                imageUrl: null,
                geoCoordinates: { latitude: 0, longitude: 0 },
              },
            ]
            break
          case "itinerary":
            planData.itinerary = Array.from({ length: totalDays }, (_, i) => ({
              day: `Day ${i + 1}`,
              activities: {
                morning: [{ itineraryItem: "Breakfast at hotel", briefDescription: "Start your day with a good meal" }],
                afternoon: [{ itineraryItem: "Explore local attractions", briefDescription: "Visit the main sights" }],
                evening: [{ itineraryItem: "Dinner at local restaurant", briefDescription: "Try the local cuisine" }],
              },
            }))
            break
          case "localCuisine":
            planData.localCuisine = [
              "Local specialty dish",
              "Traditional beverage",
              "Popular street food",
              "Famous dessert",
              "Regional delicacy",
            ]
            break
          case "packingList":
            planData.packingList = [
              "Comfortable walking shoes",
              "Weather-appropriate clothing",
              "Travel documents",
              "Camera",
              "Adapter plugs",
            ]
            break
          case "budget":
            // Generate default budget based on budget level and days
            const budgetMultiplier = budget === "luxury" ? 3 : budget === "budget" ? 0.5 : 1
            const baseAccommodation = 3500 * budgetMultiplier
            const baseFood = 1500 * budgetMultiplier
            const baseTransportation = 1000 * budgetMultiplier
            const baseActivities = 1200 * budgetMultiplier
            const baseMiscellaneous = 800 * budgetMultiplier

            planData.budget = {
              total:
                (baseAccommodation + baseFood + baseTransportation + baseActivities + baseMiscellaneous) * totalDays,
              accommodation: baseAccommodation * totalDays,
              food: baseFood * totalDays,
              transportation: baseTransportation * totalDays,
              activities: baseActivities * totalDays,
              miscellaneous: baseMiscellaneous * totalDays,
              notes: [
                "Prices may vary based on season and availability",
                "Budget is an estimate and actual costs may differ",
                "Consider exchange rate fluctuations if applicable",
              ],
            }
            break
        }
      })
    }

    // metadata add 
    planData.metadata = {
      destination,
      totalDays,
      budget: budget || "moderate",
      travelWith: travelWith || "solo",
      activities: activities || [],
      createdAt: new Date().toISOString(),
      userId: tripData.userId || null,
    }

    console.log("Final plan data with metadata:", planData)
    planData = replaceUnsplashUrls(planData)
    console.log("Plan data after replacing Unsplash URLs:", planData)
    return planData
  } catch (error) {
    console.error("Error generating trip plan:", error)
    throw error
  }
}

