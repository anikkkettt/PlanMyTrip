// Google Maps API ko load karne ka utility
let googleMapsPromise = null

export function loadGoogleMapsApi() {
  // Server side pe hai toh null return karo
  if (typeof window === "undefined") {
    return Promise.resolve(null)
  }

  if (googleMapsPromise) {
    return googleMapsPromise
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    // Agar pehle se load hai toh skip karo
    if (window.google?.maps?.places) {
      console.log("Google Maps API already loaded")
      resolve(window.google.maps)
      return
    }

    console.log("Loading Google Maps API")

    // Unique callback name generate karo
    const callbackName = `googleMapsCallback_${Date.now()}`

    // Window object pe callback add karo
    window[callbackName] = () => {
      console.log("Google Maps API loaded successfully")
      resolve(window.google.maps)
      // Cleanup
      delete window[callbackName]
    }

    // Script element create karo
    const script = document.createElement("script")
    
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=${callbackName}`
    script.async = true
    script.defer = true

   
    script.onerror = () => {
      console.error("Failed to load Google Maps API")
      delete window[callbackName]
      reject(new Error("Failed to load Google Maps API"))
    }

    // Loading timeout set karo
    const timeoutId = setTimeout(() => {
      if (!window.google?.maps) {
        console.error("Google Maps API loading timed out")
        script.onerror()
      }
    }, 10000)

    // Script ko document mein add karo
    document.head.appendChild(script)
  })

  return googleMapsPromise
}

