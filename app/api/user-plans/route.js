import { NextResponse } from "next/server"
import { getTripPlansByUserId } from "@/models/TripPlan"
import { currentUser } from "@clerk/nextjs/server"

export async function GET() {
  try {
    const user = await currentUser()

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const plans = await getTripPlansByUserId(user.id)

    return NextResponse.json({ success: true, plans })
  } catch (error) {
    console.error("Error in get user plans API:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

