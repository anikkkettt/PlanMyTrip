

// Saved trip IDs get karo
export async function getSavedTripIds() {
  try {
    const response = await fetch("/api/saved-trips")
    const data = await response.json()

    if (!data.success) {
      console.error("Error getting saved trips:", data.error)
      return []
    }

    return data.savedTripIds || []
  } catch (error) {
    console.error("Error getting saved trips:", error)
    return []
  }
}

// Trip ko save karo
export async function saveTrip(tripId) {
  try {
    const response = await fetch("/api/saved-trips/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tripId }),
    })

    const data = await response.json()

    if (!data.success) {
      console.error("Error saving trip:", data.error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error saving trip:", error)
    return false
  }
}

// Saved trip ko remove karo
export async function unsaveTrip(tripId) {
  try {
    const response = await fetch("/api/saved-trips/unsave", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tripId }),
    })

    const data = await response.json()

    if (!data.success) {
      console.error("Error unsaving trip:", data.error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error unsaving trip:", error)
    return false
  }
}



// Check karo if trip saved hai
export async function isTripSaved(tripId) {
  try {
    const response = await fetch("/api/saved-trips/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tripId }),
    })

    const data = await response.json()

    
    if (!data.success) {
      console.error("Error checking if trip is saved:", data.error)
      return false
    }
    return data.saved
  } catch (error) {
    console.error("Error checking if trip is saved:", error)
    return false
  }
}

