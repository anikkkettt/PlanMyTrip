// // Google Places API service functions

// // Function to search for a place by text query and get photos
// export async function searchPlaceWithPhotos(query, retries = 2) {
//   try {
//     console.log(`Searching for place with photos: ${query}`)

//     const response = await fetch("/api/places/search", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ query }),
//     })

//     if (!response.ok) {
//       throw new Error(`Search API returned status: ${response.status}`)
//     }

//     const result = await response.json()

//     if (!result.success) {
//       throw new Error(result.error || "Failed to search for place")
//     }

//     const { data } = result

//     if (!data.places || data.places.length === 0) {
//       console.warn(`No places found for query: ${query}`)
//       return null
//     }

//     return data.places[0]
//   } catch (error) {
//     console.error("Error searching for place with photos:", error)

//     // Retry logic with exponential backoff
//     if (retries > 0) {
//       const delay = Math.pow(2, 3 - retries) * 1000
//       console.log(`Retrying search in ${delay}ms... (${retries} retries left)`)
//       await new Promise((resolve) => setTimeout(resolve, delay))
//       return searchPlaceWithPhotos(query, retries - 1)
//     }

//     return null
//   }
// }

// // Function to get a photo URL for a place using Google Places API
// export async function getPlacePhoto(photoName, maxWidth = 800, maxHeight = 800) {
//   try {
//     if (!photoName) {
//       throw new Error("Photo name is required")
//     }

//     console.log(`Getting photo: ${photoName}`)

//     // Use our API route to proxy the request
//     return `/api/places/photo?photoName=${encodeURIComponent(photoName)}&maxWidth=${maxWidth}&maxHeight=${maxHeight}`
//   } catch (error) {
//     console.error("Error getting place photo:", error)
//     return null
//   }
// }

// // Function to get photos for a destination
// export async function getDestinationPhotos(destination) {
//   if (!destination) return null

//   try {
//     console.log(`Getting photos for destination: ${destination}`)

//     // First search for the place to get its details including photos
//     const place = await searchPlaceWithPhotos(destination)

//     if (!place || !place.photos || place.photos.length === 0) {
//       console.warn(`No photos found for destination: ${destination}`)
//       return null
//     }

//     // Get the first photo
//     const photoName = place.photos[0].name
//     return await getPlacePhoto(photoName)
//   } catch (error) {
//     console.error("Error getting destination photos:", error)
//     return null
//   }
// }



// Google Places API service functions

// Cache version to help with cache busting when needed
// const CACHE_VERSION = "1"

// // Function to search for a place by text query and get photos
// export async function searchPlaceWithPhotos(query, retries = 2) {
//   try {
//     console.log(`Searching for place with photos: ${query}`)

//     const response = await fetch("/api/places/search", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ query }),
//       // Add cache: 'force-cache' to use the browser's cache when available
//       cache: "force-cache",
//     })

//     if (!response.ok) {
//       throw new Error(`Search API returned status: ${response.status}`)
//     }

//     const result = await response.json()

//     if (!result.success) {
//       throw new Error(result.error || "Failed to search for place")
//     }

//     const { data } = result

//     if (!data.places || data.places.length === 0) {
//       console.warn(`No places found for query: ${query}`)
//       return null
//     }

//     return data.places[0]
//   } catch (error) {
//     console.error("Error searching for place with photos:", error)

//     // Retry logic with exponential backoff
//     if (retries > 0) {
//       const delay = Math.pow(2, 3 - retries) * 1000
//       console.log(`Retrying search in ${delay}ms... (${retries} retries left)`)
//       await new Promise((resolve) => setTimeout(resolve, delay))
//       return searchPlaceWithPhotos(query, retries - 1)
//     }

//     return null
//   }
// }

// // Function to get a photo URL for a place using Google Places API
// export async function getPlacePhoto(photoName, maxWidth = 800, maxHeight = 800) {
//   try {
//     if (!photoName) {
//       throw new Error("Photo name is required")
//     }

//     console.log(`Getting photo: ${photoName}`)

//     // Use our API route to proxy the request
//     // Add cache version and timestamp for cache busting if needed
//     return `/api/places/photo?photoName=${encodeURIComponent(photoName)}&maxWidth=${maxWidth}&maxHeight=${maxHeight}&v=${CACHE_VERSION}`
//   } catch (error) {
//     console.error("Error getting place photo:", error)
//     return null
//   }
// }

// // Function to get photos for a destination
// export async function getDestinationPhotos(destination) {
//   if (!destination) return null

//   try {
//     console.log(`Getting photos for destination: ${destination}`)

//     // First search for the place to get its details including photos
//     const place = await searchPlaceWithPhotos(destination)

//     if (!place || !place.photos || place.photos.length === 0) {
//       console.warn(`No photos found for destination: ${destination}`)
//       return null
//     }

//     // Get the first photo
//     const photoName = place.photos[0].name
//     return await getPlacePhoto(photoName)
//   } catch (error) {
//     console.error("Error getting destination photos:", error)
//     return null
//   }
// }





// Cache version to help with cache busting when needed
const CACHE_VERSION = "2"

// Place search karo and get photos
export async function searchPlaceWithPhotos(query, retries = 2) {
  try {
    console.log(`Searching for place with photos: ${query}`)

    const response = await fetch("/api/places/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
      // Browser cache use karo
      cache: "force-cache",
    })

    if (!response.ok) {
      throw new Error(`Search API returned status: ${response.status}`)
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || "Failed to search for place")
    }

    const { data } = result

    if (!data.places || data.places.length === 0) {
      console.warn(`No places found for query: ${query}`)
      return null
    }

    return data.places[0]
  } catch (error) {
    console.error("Error searching for place with photos:", error)

    // Retry karo with exponential backoff
    if (retries > 0) {
      const delay = Math.pow(2, 3 - retries) * 1000
      console.log(`Retrying search in ${delay}ms... (${retries} retries left)`)
      await new Promise((resolve) => setTimeout(resolve, delay))
      return searchPlaceWithPhotos(query, retries - 1)
    }

    return null
  }
}

// Place ka photo URL get karo
export async function getPlacePhoto(photoName, maxWidth = 800, maxHeight = 800) {
  try {
    if (!photoName) {
      throw new Error("Photo name is required")
    }

    console.log(`Getting photo: ${photoName.split("/").pop() || photoName.substring(0, 20)}`)

    // API route se photo proxy karo
    return `/api/places/photo?photoName=${encodeURIComponent(photoName)}&maxWidth=${maxWidth}&maxHeight=${maxHeight}&v=${CACHE_VERSION}`
  } catch (error) {
    console.error("Error getting place photo:", error)
    return null
  }
}

// Destination ke photos get karo
export async function getDestinationPhotos(destination) {
  if (!destination) return null

  try {
    console.log(`Getting photos for destination: ${destination}`)

    // Pehle place search karo photos ke liye
    const place = await searchPlaceWithPhotos(destination)

    if (!place || !place.photos || place.photos.length === 0) {
      console.warn(`No photos found for destination: ${destination}`)
      return null
    }

    // First photo get karo
    const photoName = place.photos[0].name
    return await getPlacePhoto(photoName)
  } catch (error) {
    console.error("Error getting destination photos:", error)
    return null
  }
}

