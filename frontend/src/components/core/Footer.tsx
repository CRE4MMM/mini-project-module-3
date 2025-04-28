import { FC } from 'react'

const Footer: FC = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
        <div className="container mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            {/* Branding Left */}
            <div className="md:w-1/2">
                <h2 className="text-3xl font-extrabold text-white mb-4">
                EventHub
                </h2>
                <p className="text-gray-400 leading-relaxed">
                Connect, create, and celebrate with events that inspire. Your
                journey to unforgettable experiences starts here.
                </p>
            </div>

            <div className="md:w-1/2">
                <h4 className="text-xl font-semibold text-white mb-6">
                Stay Updated
                </h4>
                <p className="text-gray-400 mb-4">
                Subscribe to our newsletter for the latest events and updates.
                </p>
                <form className="flex flex-col sm:flex-row items-center gap-2">
                <input
                    type="email"
                    placeholder="Your email"
                    className="w-full sm:w-auto flex-1 px-4 py-2 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                >
                    Subscribe
                </button>
                </form>
            </div>
            </div>

            <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} EventHub. All rights reserved.
            </div>
        </div>
        </footer>
    )
}

export default Footer
