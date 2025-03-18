import clientPromise from "../lib/mongodb"
import { ObjectId } from "mongodb"

export async function saveTripPlan(planData) {
  console.log("Saving trip plan to MongoDB")
  const client = await clientPromise
  const db = client.db("planmytrip")

  // Generate a unique ID if not provided
  if (!planData._id) {
    planData._id = new ObjectId()
    console.log("Generated new ObjectId for plan:", planData._id)
  }

  console.log("Inserting plan into tripPlans collection")
  const result = await db.collection("tripPlans").insertOne(planData)
  console.log("Plan inserted with ID:", result.insertedId)

  return { ...planData, _id: result.insertedId }
}

export async function getTripPlanById(id) {
  console.log("Getting trip plan by ID:", id)
  const client = await clientPromise
  const db = client.db("planmytrip")

  try {
    const objectId = new ObjectId(id)
    console.log("Created ObjectId:", objectId)

    const plan = await db.collection("tripPlans").findOne({ _id: objectId })
    console.log("Plan found:", plan ? "Yes" : "No")

    return plan
  } catch (error) {
    console.error("Error getting trip plan by ID:", error)
    throw error
  }
}

export async function getTripPlansByUserId(userId) {
  console.log("Getting trip plans by user ID:", userId)
  const client = await clientPromise
  const db = client.db("planmytrip")

  const plans = await db
    .collection("tripPlans")
    .find({ "metadata.userId": userId })
    .sort({ "metadata.createdAt": -1 })
    .toArray()

  console.log(`Found ${plans.length} plans for user`)
  return plans
}

