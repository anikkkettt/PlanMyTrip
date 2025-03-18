"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs"

export default function Hero() {
  const { user } = useUser()

  return (
    <section className="py-12 md:py-24 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
        <SignedIn>Welcome Back to TripPlanner</SignedIn>
        <SignedOut>Plan Your Perfect Trip</SignedOut>
      </h1>
      <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
        <SignedIn>
          {user?.firstName
            ? `Ready to continue planning your adventures, ${user.firstName}?`
            : "Ready to continue planning your adventures?"}
        </SignedIn>
        <SignedOut>
          Discover amazing destinations, create personalized itineraries, and make unforgettable memories with our
          intelligent trip planning platform.
        </SignedOut>
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <SignedIn>
          <Link href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 h-auto">
              Go to Dashboard
            </Button>
          </Link>
        </SignedIn>

        <SignedOut>
          <Link href="/sign-in">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 h-auto">
              Start Planning
            </Button>
          </Link>
        </SignedOut>

        <Link href="#features">
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-100 text-lg px-8 py-6 h-auto"
          >
            Learn More
          </Button>
        </Link>
      </div>
    </section>
  )
}

