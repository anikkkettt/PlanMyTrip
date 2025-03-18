// import { NextResponse } from "next/server"

// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url)
//     const photoName = searchParams.get("photoName")
//     const maxWidth = searchParams.get("maxWidth") || 800
//     const maxHeight = searchParams.get("maxHeight") || 800

//     if (!photoName) {
//       return NextResponse.json({ success: false, error: "Photo name is required" }, { status: 400 })
//     }

//     console.log(`API: Getting photo: ${photoName}`)

//     const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
//     const photoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=${maxHeight}&maxWidthPx=${maxWidth}&key=${apiKey}`

//     // Proxy the image to avoid CORS issues
//     const response = await fetch(photoUrl)

//     if (!response.ok) {
//       throw new Error(`Google Places API returned status: ${response.status}`)
//     }

//     const imageBuffer = await response.arrayBuffer()
//     const headers = new Headers()
//     headers.set("Content-Type", response.headers.get("Content-Type") || "image/jpeg")
//     headers.set("Cache-Control", "public, max-age=86400") // Cache for 24 hours

//     return new Response(imageBuffer, {
//       headers,
//     })
//   } catch (error) {
//     console.error("Error in places photo API:", error)
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 })
//   }
// }



// import { NextResponse } from "next/server"

// // Simple in-memory cache
// const photoCache = new Map()
// const CACHE_MAX_AGE = 7 * 24 * 60 * 60 // 7 days in seconds

// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url)
//     const photoName = searchParams.get("photoName")
//     const maxWidth = searchParams.get("maxWidth") || 800
//     const maxHeight = searchParams.get("maxHeight") || 800

//     if (!photoName) {
//       return NextResponse.json({ success: false, error: "Photo name is required" }, { status: 400 })
//     }

//     // Create a cache key from the photo name and dimensions
//     const cacheKey = `${photoName}_${maxWidth}_${maxHeight}`

//     // Check if we have this photo in our cache
//     if (photoCache.has(cacheKey)) {
//       console.log(`API: Serving cached photo: ${photoName}`)
//       const cachedPhoto = photoCache.get(cacheKey)

//       const headers = new Headers()
//       headers.set("Content-Type", cachedPhoto.contentType)
//       headers.set("Cache-Control", `public, max-age=${CACHE_MAX_AGE}`)
//       headers.set("X-Cache", "HIT")

//       return new Response(cachedPhoto.buffer, {
//         headers,
//       })
//     }

//     console.log(`API: Getting photo (cache miss): ${photoName}`)

//     const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
//     const photoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=${maxHeight}&maxWidthPx=${maxWidth}&key=${apiKey}`

//     // Proxy the image to avoid CORS issues
//     const response = await fetch(photoUrl)

//     if (!response.ok) {
//       throw new Error(`Google Places API returned status: ${response.status}`)
//     }

//     const imageBuffer = await response.arrayBuffer()
//     const contentType = response.headers.get("Content-Type") || "image/jpeg"

//     // Store in cache
//     photoCache.set(cacheKey, {
//       buffer: imageBuffer,
//       contentType,
//       timestamp: Date.now(),
//     })

//     // Manage cache size (optional)
//     if (photoCache.size > 100) {
//       // Delete oldest entries if cache gets too large
//       const oldestEntries = [...photoCache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp).slice(0, 20)

//       for (const [key] of oldestEntries) {
//         photoCache.delete(key)
//       }
//     }

//     const headers = new Headers()
//     headers.set("Content-Type", contentType)
//     headers.set("Cache-Control", `public, max-age=${CACHE_MAX_AGE}`)
//     headers.set("X-Cache", "MISS")

//     return new Response(imageBuffer, {
//       headers,
//     })
//   } catch (error) {
//     console.error("Error in places photo API:", error)
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 })
//   }
// }




import { NextResponse } from "next/server"

// Photo cache ke liye ek simple in-memory storage
const photoCache = new Map()
const CACHE_MAX_AGE = 7 * 24 * 60 * 60 // 7 din ka cache time

export async function GET(request) {
  try {
    // URL se photo ka naam aur dimensions extract kar rahe hain
    const { searchParams } = new URL(request.url)
    const photoName = searchParams.get("photoName")
    const maxWidth = searchParams.get("maxWidth") || 800
    const maxHeight = searchParams.get("maxHeight") || 800
    const v = searchParams.get("v") || "1" // Cache version parameter

    // Agar photo ka naam nahi hai toh error bhejdo
    if (!photoName) {
      return NextResponse.json({ success: false, error: "Photo name is required" }, { status: 400 })
    }

    // Cache key banate hain photo ke naam aur dimensions se
    // Logs ko readable banane ke liye photo ka naam chota kar rahe hain
    const shortPhotoName = photoName.split("/").pop() || photoName.substring(0, 20)
    const cacheKey = `${photoName}_${maxWidth}_${maxHeight}`

    // Check karte hain ki kya ye photo cache mein hai ya nahi
    if (photoCache.has(cacheKey)) {
      console.log(`API: Serving cached photo: ${shortPhotoName}`)
      const cachedPhoto = photoCache.get(cacheKey)

      // Cache se photo serve kar rahe hain
      const headers = new Headers()
      headers.set("Content-Type", cachedPhoto.contentType)
      headers.set("Cache-Control", `public, max-age=${CACHE_MAX_AGE}`)
      headers.set("X-Cache", "HIT")

      return new Response(cachedPhoto.buffer, {headers,})
    }

    console.log(`API: Getting photo (cache miss): ${shortPhotoName}`)

    // Google Places API se photo fetch karlo
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
    const photoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=${maxHeight}&maxWidthPx=${maxWidth}&key=${apiKey}`

    // CORS issues se bachne ke liye image ko proxy karo
    const response = await fetch(photoUrl, {
      cache: "no-store",
      headers: {
        Accept: "image/*",
      },
    })

    if (!response.ok) {
      throw new Error(`Google Places API returned status: ${response.status}`)
    }

    // Image ko buffer mein convert kar rahe hain
    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get("Content-Type") || "image/jpeg"

    // Cache mein store kar rahe hain - ArrayBuffer ko Uint8Array mein convert karke
    // Ye ensure karta hai ki garbage collection se data na jaye
    const uint8Array = new Uint8Array(imageBuffer)

    photoCache.set(cacheKey, {
      buffer: uint8Array,
      contentType,
      timestamp: Date.now(),
    })

    console.log(`API: Cached photo: ${shortPhotoName} (cache size: ${photoCache.size})`)

    // Cache size ko manage kar rahe hain
    if (photoCache.size > 100) {
      // Agar cache bahut bada ho jaye toh purane entries ko delete kar rahe hain
      const oldestEntries = [...photoCache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp).slice(0, 20)


      
      for (const [key] of oldestEntries) {
        photoCache.delete(key)
      }
      console.log(`API: Pruned cache to ${photoCache.size} entries`)
    }




    const headers = new Headers()
    headers.set("Content-Type", contentType)
    headers.set("Cache-Control", `public, max-age=${CACHE_MAX_AGE}`)
    headers.set("X-Cache", "MISS")

    return new Response(imageBuffer, {headers,})
  } catch (error) {
    console.error("Error in places photo API:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

