import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SignInPage() {
    return (
        <div className="flex min-h-screen flex-col justify-center items-center px-4">
        <div className="w-full max-w-md space-y-8">
            <div className="text-center">
            <h1 className="text-3xl font-bold">Sign In</h1>
            <p className="text-muted-foreground text-sm mt-2">
                Dont have an account?{' '}
                <Link href="/sign-up" className="underline">
                Sign Up
                </Link>
            </p>
            </div>

            <form className="space-y-6">
            <div className="space-y-4">
                <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                />
                </div>

                <div>
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                />
                </div>
            </div>

            <Button type="submit" className="w-full">
                Sign In
            </Button>
            </form>
        </div>
        </div>
    )
}
