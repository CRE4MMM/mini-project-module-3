interface AuthResponse {
    success: boolean
    message: string
    data?: {
        token: string
        user: {
        id: string
        email: string
        firstName: string
        lastName: string
        role: string
        }
    }
}

export async function signIn(
    email: string,
    password: string
): Promise<AuthResponse> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        }
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Failed to sign in')
    }

    return data
}

interface RegisterCustomerData {
    firstName: string
    lastName: string
    email: string
    password: string
    referredBy?: string | null
}

export async function registerCustomer(
    userData: RegisterCustomerData
): Promise<AuthResponse> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        }
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Failed to register')
    }

    return data
}

interface RegisterOrganizerData {
    firstName: string
    lastName: string
    email: string
    password: string
}

export async function registerOrganizer(
    userData: RegisterOrganizerData
): Promise<AuthResponse> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({...userData, role: 'organizer'}),
        }
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Failed to register organizer')
    }

    return data
}

export function saveAuthData(token: string, user: any): void {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
}

export function getAuthData(): { token: string | null; user: any | null } {
    if (typeof window === 'undefined') {
        return { token: null, user: null }
    }

    const token = localStorage.getItem('token')
    const userJson = localStorage.getItem('user')

    return {
        token,
        user: userJson ? JSON.parse(userJson) : null,
    }
}

export function removeAuthData(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
}

export function isAuthenticated(): boolean {
    const { token } = getAuthData()
    return !!token
}
