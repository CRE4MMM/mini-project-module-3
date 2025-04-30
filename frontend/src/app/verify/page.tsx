'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, Check, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function VerifyPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams?.get('token')

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
        'loading'
    )
    const [message, setMessage] = useState<string>('')

    useEffect(() => {
        const verifyToken = async () => {
        if (!token) {
            setStatus('error')
            setMessage('Verification token is missing')
            return
        }

        try {
            const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
            {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            }
            )

            const data = await response.json()

            if (!response.ok) {
            throw new Error(data.message || 'Failed to verify account')
            }

            setStatus('success')
            setMessage(
            data.message || 'Your account has been successfully verified!'
            )
        } catch (err) {
            setStatus('error')
            setMessage(
            err instanceof Error
                ? err.message
                : 'An error occurred during verification'
            )
        }
        }

        verifyToken()
    }, [token])

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
            <Card>
            <CardHeader>
                <CardTitle className="text-center text-2xl">
                Account Verification
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {status === 'loading' && (
                <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
                    <p className="mt-4 text-lg text-gray-600">
                    Verifying your account...
                    </p>
                </div>
                )}

                {status === 'success' && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                    <Check className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{message}</AlertDescription>
                </Alert>
                )}

                {status === 'error' && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{message}</AlertDescription>
                </Alert>
                )}
            </CardContent>
            <CardFooter>
                {status !== 'loading' && (
                <div className="w-full space-y-4">
                    {status === 'success' && (
                    <Button
                        className="w-full"
                        onClick={() => router.push('/signin')}
                    >
                        Proceed to Sign In
                    </Button>
                    )}
                    {status === 'error' && (
                    <div className="space-y-2">
                        <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => router.push('/signup')}
                        >
                        Back to Sign Up
                        </Button>
                        <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link
                            href="/signin"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Sign in
                        </Link>
                        </p>
                    </div>
                    )}
                </div>
                )}
            </CardFooter>
            </Card>
        </div>
        </div>
    )
}
