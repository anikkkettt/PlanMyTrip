import { clerkMiddleware } from "@clerk/nextjs/server"

export default clerkMiddleware({
  // Make sure to include all possible paths for sign-in and sign-up
  publicRoutes: [
    "/",
    "/sign-in(.*)", // Use regex pattern to match all routes under sign-in
    "/sign-up(.*)", // Use regex pattern to match all routes under sign-up
  ],
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}

