"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function EnvironmentCheck() {
  const missingVars = []

  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) missingVars.push("NEXT_PUBLIC_FIREBASE_API_KEY")
  if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) missingVars.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN")
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) missingVars.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID")

  if (missingVars.length === 0) {
    return null
  }

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Firebase Configuration Error</AlertTitle>
      <AlertDescription>
        <p>The following environment variables are missing:</p>
        <ul className="list-disc pl-5 mt-2">
          {missingVars.map((variable) => (
            <li key={variable}>{variable}</li>
          ))}
        </ul>
        <p className="mt-2">Please add these environment variables to your project to enable Firebase functionality.</p>
      </AlertDescription>
    </Alert>
  )
}
