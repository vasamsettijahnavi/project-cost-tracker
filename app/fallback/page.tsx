import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EnvironmentCheck } from "@/components/environment-check"

export default function FallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Project Cost Tracker</CardTitle>
          <CardDescription>Firebase Configuration Required</CardDescription>
        </CardHeader>
        <CardContent>
          <EnvironmentCheck />
          <div className="mt-4">
            <p>
              This application requires Firebase to be properly configured. Please add the required environment
              variables to continue.
            </p>
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <p className="font-mono text-sm">NEXT_PUBLIC_FIREBASE_API_KEY</p>
              <p className="font-mono text-sm">NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</p>
              <p className="font-mono text-sm">NEXT_PUBLIC_FIREBASE_PROJECT_ID</p>
              <p className="font-mono text-sm">NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</p>
              <p className="font-mono text-sm">NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</p>
              <p className="font-mono text-sm">NEXT_PUBLIC_FIREBASE_APP_ID</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/" className="w-full">
            <Button className="w-full">Try Again</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
