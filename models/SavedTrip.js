import clientPromise from "../lib/mongodb"

export async function getSavedTripsByUserId(userId) {
  console.log("Getting saved trips for user:", userId)
  const client = await clientPromise
  const db = client.db("planmytrip")

  const savedTrips = await db.collection("savedTrips").find({ userId }).toArray()

  console.log(`Found ${savedTrips.length} saved trips for user`)
  return savedTrips
}

export async function saveTrip(userId, tripId) {
  console.log(`Saving trip ${tripId} for user ${userId}`)
  const client = await clientPromise
  const db = client.db("planmytrip")

  //   check if already saved
  const existingSave = await db.collection("savedTrips").findOne({ userId, tripId })

  if (existingSave) {
    console.log("Trip already saved")
    return { success: true, alreadySaved: true }
  }

  // save  trip
  const result = await db.collection("savedTrips").insertOne({
    userId,
    tripId,
    savedAt: new Date(),
  })

  console.log("Trip saved with ID:", result.insertedId)
  return { success: true, savedId: result.insertedId }
}

export async function unsaveTrip(userId, tripId) {
  console.log(`Removing saved trip ${tripId} for user ${userId}`)
  const client = await clientPromise
  const db = client.db("planmytrip")

  const result = await db.collection("savedTrips").deleteOne({ userId, tripId })

  console.log(`Deleted ${result.deletedCount} saved trip(s)`)
  return { success: true, deleted: result.deletedCount > 0 }
}

export async function isTripSaved(userId, tripId) {
  console.log(`Checking if trip ${tripId} is saved for user ${userId}`)
  const client = await clientPromise
  const db = client.db("planmytrip")

  const savedTrip = await db.collection("savedTrips").findOne({ userId, tripId })

  return !!savedTrip
}

export async function getSavedTripIds(userId) {
  console.log("Getting saved trip IDs for user:", userId)
  const client = await clientPromise
  const db = client.db("planmytrip")

  const savedTrips = await db.collection("savedTrips").find({ userId }).toArray()

  const tripIds = savedTrips.map((trip) => trip.tripId)
  console.log(`Found ${tripIds.length} saved trip IDs for user`)
  return tripIds
}

