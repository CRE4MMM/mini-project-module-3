import { EventItem } from '@/app/page'
import { format } from 'date-fns'
import Link from 'next/link'

interface EventCardProps {
    event: EventItem
}

export default function EventCard({ event }: EventCardProps) {
    const { id, name, description, price, startDate, location, availableSeats } = event;
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow flex flex-col">
            <div className="bg-gray-200 h-48 w-full" />

            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{name}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {availableSeats} seats
                    </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>

                <div className="flex items-center text-sm text-gray-500 mb-1">
                    <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    {format(start, 'MMM dd, yyyy • HH:mm')}
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                    <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                    {location}
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-gray-200">
                    <div className="text-lg text-black font-bold">
                        {price === 0 ? 'Free' : `IDR ${price.toLocaleString('id-ID')}`}
                    </div>
                    <Link
                        href={`/events/${id}`}
                        className="text-blue-600 font-medium hover:text-blue-700"
                    >
                        View Details →
                    </Link>
                </div>
            </div>
        </div>
    );
}

