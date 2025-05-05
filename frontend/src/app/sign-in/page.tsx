'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext' // ✅ Import AuthContext

interface SignInData {
  email: string
  password: string
}

interface AlertMessage {
  type: 'success' | 'error'
  title: string
  message: string
}

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState<AlertMessage | null>(null)
  const [signInData, setSignInData] = useState<SignInData>({
    email: '',
    password: '',
  })

  const router = useRouter()
  const { signIn } = useAuth() // ✅ Use AuthContext

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setAlert(null)

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ||
        'https://mini-project-module-3.vercel.app'

      const response = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signInData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Sign in failed')
      }

      signIn(data.data.token, data.data.user)

      setAlert({
        type: 'success',
        title: 'Success',
        message: 'Signed in successfully!',
      })

      setSignInData({ email: '', password: '' })

      setTimeout(() => router.push('/dashboard-customer'), 1000)
    } catch (error: any) {
      setAlert({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to sign in',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alert && (
            <Alert
              variant={alert.type === 'error' ? 'destructive' : 'default'}
              className="mb-4"
            >
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                value={signInData.email}
                onChange={(e) =>
                  setSignInData({ ...signInData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password">Password</Label>
              <Input
                id="signin-password"
                type="password"
                value={signInData.password}
                onChange={(e) =>
                  setSignInData({ ...signInData, password: e.target.value })
                }
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between flex-col sm:flex-row gap-2">
          <p className="text-sm text-muted-foreground">
            Don’t have an account?{' '}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign Up
            </Link>
          </p>
          <p className="text-sm text-muted-foreground text-center sm:text-right">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
