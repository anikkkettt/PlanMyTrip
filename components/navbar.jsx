"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { UserButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs"

export default function Navbar() {
  const { user, isLoaded } = useUser()

  return (
    <header className="border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">PlanMyTrip</span>
          </Link>

          <SignedIn>
            <div className="flex items-center space-x-2 mr-auto ml-6">
              {isLoaded && user && (
                <span className="text-gray-600">
                  Hello, <span className="font-semibold">{user.firstName || user.username}</span>
                </span>
              )}
            </div>
          </SignedIn>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link href="/#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </Link>

          </nav>

          <div className="flex items-center space-x-4">
            <SignedIn>
              <Link href="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white mx-3">My Dashboard</Button>
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-10 h-10",
                  },
                }}
                afterSignOut={{ redirectUrl: "/" }}
              />
            </SignedIn>

            <SignedOut>
              <Link href="/sign-in">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
              </Link>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  )
}

