import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Features from "@/components/features"

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Hero />
        <Features />
      </main>
    </div>
  )
}

