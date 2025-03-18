import { NextResponse } from "next/server"
import { isTripSaved } from "@/models/SavedTrip"
import { currentUser } from "@clerk/nextjs/server"

export async function POST(request) {
  try {
    // User ko Clerk se authenticate karke uska data fetch kar rahe hain
    const user = await currentUser()

    // Agar user logged in nahi hai toh unauthorized error bhej rahe hain
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Request se trip ID extract kar rahe hain
    const { tripId } = await request.json()

    // Agar trip ID nahi hai toh error bhej rahe hain
    if (!tripId) {
      return NextResponse.json({ success: false, error: "Trip ID is required" }, { status: 400 })
    }

    

    // Check karte hain ki kya ye trip user ne save kiya hai
    const saved = await isTripSaved(user.id, tripId)

    // Result ko response ke saath bhej rahe hain
    return NextResponse.json({ success: true, saved })
  } catch (error) {
    console.error("Error in check saved trip API:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

