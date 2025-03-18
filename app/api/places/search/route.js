// import { NextResponse } from "next/server"

// export async function POST(request) {
//   try {
//     const { query } = await request.json()

//     if (!query) {
//       return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 })
//     }

//     console.log(`API: Searching for place: ${query}`)

//     const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
//     const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-Goog-Api-Key": apiKey,
//         "X-Goog-FieldMask": "places.photos,places.displayName,places.id,places.formattedAddress",
//       },
//       body: JSON.stringify({
//         textQuery: query,
//       }),
//     })

//     if (!response.ok) {
//       throw new Error(`Google Places API returned status: ${response.status}`)
//     }

//     const data = await response.json()
//     return NextResponse.json({ success: true, data })
//   } catch (error) {
//     console.error("Error in places search API:", error)
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 })
//   }
// }



import { NextResponse } from "next/server"

// Search results ke liye in-memory cache
const searchCache = new Map()
const CACHE_MAX_AGE = 24 * 60 * 60 // 24 ghante ka cache time

export async function POST(request) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 })
    }



    // Check karte hain ki kya ye search query cache mein hai
    if (searchCache.has(query)) {
      console.log(`API: Serving cached search results for: ${query}`)
      const cachedResult = searchCache.get(query)



      // Cache se results serve kar rahe hain
      return NextResponse.json(
        {
          success: true,
          data: cachedResult.data,
          cached: true,
        },
        {
          headers: {
            "Cache-Control": `public, max-age=${CACHE_MAX_AGE}`,
            "X-Cache": "HIT",
          },
        },
      )
    }

    console.log(`API: Searching for place (cache miss): ${query}`)



    // Google Places API se search results fetch kar rahe hain
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.photos,places.displayName,places.id,places.formattedAddress",
      },
      body: JSON.stringify({
        textQuery: query,
      }),
    })

    if (!response.ok) {
      throw new Error(`Google Places API returned status: ${response.status}`)
    }


    const data = await response.json()

    // Search results ko cache mein store kardo
    searchCache.set(query, {
      data,
      timestamp: Date.now(),
    })

    // Cache size ko manage karna padega
    if (searchCache.size > 100) {
      // Agar cache bahut bada ho jaye toh purane entries ko delete kardo
      const oldestEntries = [...searchCache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp).slice(0, 20)

      for (const [key] of oldestEntries) {
        searchCache.delete(key)
      }
    }

    // Fresh results response mein bhej do
    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        headers: {
          "Cache-Control": `public, max-age=${CACHE_MAX_AGE}`,
          "X-Cache": "MISS",
        },
      },
    )
  } 
  catch (error) {
    console.error("Error in places search API:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

