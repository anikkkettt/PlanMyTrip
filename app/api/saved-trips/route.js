import { NextResponse } from "next/server"
import { getSavedTripIds } from "@/models/SavedTrip"
import { currentUser } from "@clerk/nextjs/server"

export async function GET() {
  try {
    const user = await currentUser()

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }


    const savedTripIds = await getSavedTripIds(user.id)
    return NextResponse.json({ success: true, savedTripIds })
  } catch (error) {
    console.error("Error in get saved trips API:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

