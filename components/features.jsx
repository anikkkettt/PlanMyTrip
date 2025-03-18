import { MapPin,Calendar,Hotel,Compass,CreditCard,Utensils } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: <MapPin className="h-10 w-10 text-blue-600" />,
      title: "Discover Destinations",
      description: "Explore thousands of exciting destinations around the world.",
    },
    {
      icon: <Calendar className="h-10 w-10 text-blue-600" />,
      title: "Smart Itineraries",
      description: "Create personalized day-by-day travel plans that fit your style.",
    },
    {
      icon: <Hotel className="h-10 w-10 text-blue-600" />,
      title: "Best Accommodations",
      description: "Find and book the perfect places to stay within your budget.",
    },
    {
      icon: <Utensils className="h-10 w-10 text-blue-600" />,
      title: "Local Cuisine",
      description: "Get local cuisine reccomendations for your destination.",
    },
    {
      icon: <Compass className="h-10 w-10 text-blue-600" />,
      title: "Recommended activities",
      description: "Discover exciting fun activities for your destination.",
    },
    {
      icon: <CreditCard className="h-10 w-10 text-blue-600" />,
      title: "Budget Management",
      description: "Get an approximate budget breakdown based on your budget level.",
    },
  ]

  return (
    <section id="features" className="py-16">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose Our Trip Planner</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 rounded-lg bg-white border border-gray-200 shadow-sm hover:border-blue-500 transition-colors"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

