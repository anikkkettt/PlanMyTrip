import { NextResponse } from "next/server"
import { saveTrip } from "@/models/SavedTrip"
import { currentUser } from "@clerk/nextjs/server"

export async function POST(request) {
  try {
    const user = await currentUser()

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { tripId } = await request.json()


    if (!tripId) {
      return NextResponse.json({ success: false, error: "Trip ID is required" }, { status: 400 })
    }

    
    const result = await saveTrip(user.id, tripId)
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error("Error in save trip API:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

