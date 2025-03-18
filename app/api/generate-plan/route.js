// Ye route API endpoint hai jo trip plan generate karta hai
import { NextResponse } from "next/server"
import { generateTripPlan } from "@/lib/deepseek"
import { saveTripPlan } from "@/models/TripPlan"
import { currentUser } from "@clerk/nextjs/server"

export async function POST(request) {
  console.log("Generate plan API route called")
  try {
    // User ko Clerk se authenticate karke uska ID nikal rahe hain
    const user = await currentUser()
    const userId = user?.id
    console.log("User ID:", userId)

    // Request se trip ka data JSON format mein receive kar rahe hain
    const tripData = await request.json()
    console.log("Received trip data:", tripData)

    // Trip data mein user ka ID add kar rahe hain taki pata chale ki ye plan kisne banaya
    tripData.userId = userId
    console.log("Added user ID to trip data")

    // Ab AI model se trip plan generate kar rahe hain
    console.log("Calling generateTripPlan function")
    const planData = await generateTripPlan(tripData)
    console.log("Trip plan generated successfully")

    // Generated plan ko MongoDB mein save kar rahe hain permanent storage ke liye
    console.log("Saving plan to MongoDB")
    const savedPlan = await saveTripPlan(planData)
    console.log("Plan saved to MongoDB with ID:", savedPlan._id)

    // Success response bhej rahe hain client ko
    return NextResponse.json({
      success: true,
      plan: savedPlan,
    })
  } catch (error) {
    console.error("Error in generate-plan API:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

