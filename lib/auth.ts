import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { FirebaseError } from "firebase/app"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "./firebase"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Check if Firebase is properly initialized
          if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
            console.error("Firebase API key is missing. Please check your environment variables.")
            throw new Error("Firebase configuration is missing")
          }

          const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password)

          const user = userCredential.user

          if (user) {
            return {
              id: user.uid,
              name: user.displayName,
              email: user.email,
            }
          }
          return null
        } catch (error) {
          if (error instanceof FirebaseError) {
            console.error("Firebase Auth Error:", error.code, error.message)
          } else {
            console.error("Unknown Auth Error:", error)
          }
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}
