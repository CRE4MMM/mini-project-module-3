'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600">
                EventHub
            </Link>

            <div className="hidden md:flex space-x-8">
                <Link href="/" className="text-gray-800 hover:text-blue-600">
                Home
                </Link>
                <Link href="/events" className="text-gray-800 hover:text-blue-600">
                Events
                </Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
                <Link
                href="/sign-in"
                className="text-gray-800 hover:text-blue-600 font-medium"
                >
                Login
                </Link>
                <Link
                href="/sign-up"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                >
                Sign Up
                </Link>
            </div>

            <button
                className="md:hidden text-gray-500"
                onClick={handleMenuToggle}
            >
                <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                >
                {isMenuOpen ? (
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                    ></path>
                ) : (
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                )}
                </svg>
            </button>
            </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
            <div className="md:hidden bg-white py-2 px-4 shadow-md">
            <Link
                href="/"
                className="block py-2 text-gray-800 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
            >
                Home
            </Link>
            <Link
                href="/events"
                className="block py-2 text-gray-800 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
            >
                Events
            </Link>
            <Link
                href="/create-event"
                className="block py-2 text-gray-800 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
            >
                Create Event
            </Link>
            <div className="mt-4 pt-4 border-t">
                <Link
                href="/login"
                className="block py-2 text-gray-800 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
                >
                Login
                </Link>
                <Link
                href="/register"
                className="block py-2 text-gray-800 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
                >
                Sign Up
                </Link>
            </div>
            </div>
        )}
        </nav>
    )
}
