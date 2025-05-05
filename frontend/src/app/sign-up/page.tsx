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

interface SignUpData {
  firstName: string
  lastName: string
  email: string
  password: string
  role: 'CUSTOMER' | 'ORGANIZER'
  referredBy?: string
}

interface AlertMessage {
  type: 'success' | 'error'
  title: string
  message: string
}

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState<AlertMessage | null>(null)
  const router = useRouter()

  const [signUpData, setSignUpData] = useState<SignUpData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
    referredBy: '',
  })

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setAlert(null)

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ||
        'https://mini-project-module-3.vercel.app'
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signUpData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Sign up failed')
      }

      setAlert({
        type: 'success',
        title: 'Success',
        message: 'Account created successfully!',
      })

      setSignUpData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'CUSTOMER',
        referredBy: '',
      })

      setTimeout(() => router.push(`/auth/signin`), 1000)
    } catch (error: any) {
      setAlert({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to create account',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
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
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="signup-firstName">First Name</Label>
                <Input
                  id="signup-firstName"
                  value={signUpData.firstName}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-lastName">Last Name</Label>
                <Input
                  id="signup-lastName"
                  value={signUpData.lastName}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, lastName: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                value={signUpData.email}
                onChange={(e) =>
                  setSignUpData({ ...signUpData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                value={signUpData.password}
                onChange={(e) =>
                  setSignUpData({ ...signUpData, password: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-role">Role</Label>
              <select
                id="signup-role"
                value={signUpData.role}
                onChange={(e) =>
                  setSignUpData({
                    ...signUpData,
                    role: e.target.value as 'CUSTOMER' | 'ORGANIZER',
                  })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="ORGANIZER">Organizer</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-referredBy">
                Referral Code
              </Label>
              <Input
                id="signup-referredBy"
                value={signUpData.referredBy}
                onChange={(e) =>
                  setSignUpData({ ...signUpData, referredBy: e.target.value })
                }
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>
          <p className="text-sm text-muted-foreground">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
