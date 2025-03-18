import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
            card: "bg-white border border-gray-200 shadow-md",
            headerTitle: "text-gray-800",
            headerSubtitle: "text-gray-600",
            formFieldLabel: "text-gray-700",
            formFieldInput: "bg-white border-gray-300 text-gray-800",
            footerActionLink: "text-blue-600 hover:text-blue-800",
            identityPreviewText: "text-gray-800",
            identityPreviewEditButton: "text-blue-600 hover:text-blue-800",
          },
        }}
        afterSignUpUrl="/"
        signInUrl="/sign-in"
      />
    </div>
  )
}

