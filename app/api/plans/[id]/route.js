import { NextResponse } from "next/server"
import { getTripPlanById } from "@/models/TripPlan"

export async function GET(request, context) {
  console.log("Get plan API route called")
  try {
    // URL se plan ka ID destructure karna
    const params = await context.params
    const { id } = params
    console.log("Fetching plan with ID:", id)

    // Database se plan ka data fetch 
    const plan = await getTripPlanById(id)
    console.log("Plan fetched:", plan ? "Success" : "Not found")
    if (!plan) {
      console.log("Plan not found")
      return NextResponse.json({ success: false, error: "Plan not found" }, { status: 404 })
    }


    
    console.log("Returning plan data")
    return NextResponse.json({ success: true, plan })
  } catch (error) {
    console.error("Error in get plan API:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

