'use client'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { debounce } from 'lodash'
import { useRouter } from 'next/navigation'
import { CalendarIcon, MapPinIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import SearchBar from '../../components/ui/SearchBar'
import CategoryFilter from '../../components/ui/CategoryFilter'
import Footer from '../../components/core/Footer'

interface Event {
    id: string
    name: string
    description: string
    price: number
    startDate: string
    endDate: string
    location: string
    category: string
    availableSeats: number
}

const Home: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([])
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [selectedCategory, setSelectedCategory] = useState<string>('All')
    const [selectedLocation, setSelectedLocation] = useState<string>('All')

    const [categories, setCategories] = useState<string[]>(['All'])
    const [locations, setLocations] = useState<string[]>(['All'])

    const router = useRouter()    

    useEffect(() => {
        const fetchEvents = async () => {
        try {
            const response = await fetch(
            'https://mini-project-module-3.vercel.app/api/event'
            )

            if (!response.ok) {
            throw new Error(
                `Error: ${response.status} - The API endpoint might not exist or is not accessible`
            )
            }

            const result = await response.json()

            if (result.success) {
            const sortedEvents = [...result.data].sort((a, b) => {
                if (a.createdAt && b.createdAt) {
                return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                }
                if (!isNaN(Number(a.id)) && !isNaN(Number(b.id))) {
                return Number(b.id) - Number(a.id)
                }
                return (
                new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
                )
            })

            setEvents(sortedEvents)
            setFilteredEvents(sortedEvents)
            setCategories([
                'All',
                ...new Set(sortedEvents.map((event) => event.category)),
            ])
            setLocations([
                'All',
                ...new Set(
                sortedEvents.map((event) => event.location.split(' ')[0])
                ),
            ])
            } else {
            setError(result.message || 'Failed to fetch events')
            }
        } catch (err) {
            console.error('Error fetching events:', err)
            setError(
            err instanceof Error ? err.message : 'An unknown error occurred'
            )
        } finally {
            setLoading(false)
        }
        }

        fetchEvents()
    }, [])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        })
    }

    const EventSkeleton = () => (
        <Card className="w-full h-full">
        <CardHeader className="pb-2">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/4" />
        </CardHeader>
        <CardContent className="pb-2">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-1/3" />
            </div>
            <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-2/3" />
            </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-5 w-1/4" />
        </CardFooter>
        </Card>
    )

    useEffect(() => {
        const filtered = events.filter((evt) => {
        const matchesSearch =
            evt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            evt.description.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesCategory =
            selectedCategory === 'All' || evt.category === selectedCategory

        const matchesLocation =
            selectedLocation === 'All' || evt.location.includes(selectedLocation)

        return matchesSearch && matchesCategory && matchesLocation
        })

        setFilteredEvents(filtered)
    }, [searchTerm, selectedCategory, selectedLocation, events])

    const handleSearch = debounce((value: string) => {
        setSearchTerm(value)
    }, 1000)

    const handleSeeAll = () => {
        router.push('/events')
    }

    return (
        <div className="flex flex-col min-h-screen">
        <Head>
            <title>Discover Amazing Events</title>
            <meta
            name="description"
            content="Find and book the best events in your area"
            />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex-grow container py-8 mx-auto">
            <h1 className="text-3xl font-bold tracking-tight mb-4 text-center">
            Discover Amazing Events
            </h1>
            <p className="text-center text-lg text-gray-600 mb-8">
            Welcome to EventHub, your gateway to unforgettable experiences! Explore a diverse range of events, from thrilling concerts to insightful workshops, and book your spot today. Join a vibrant community and create lasting memories!
            </p>

            <div className="max-w-3xl mx-auto mb-8">
            <SearchBar onSearch={handleSearch} />
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
            <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelect={setSelectedCategory}
            />

            <div className="ml-auto">
                <select
                className="bg-blue-600 text-white border border-blue-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:bg-blue-700 transition duration-200 appearance-none cursor-pointer"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                >
                {locations.map((location) => (
                    <option
                    key={location}
                    value={location}
                    className="bg-blue-800 text-white"
                    >
                    {location}
                    </option>
                ))}
                </select>
            </div>
            </div>

            {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                <EventSkeleton key={index} />
                ))}
            </div>
            ) : error ? (
            <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded">
                <p className="text-destructive">{error}</p>
            </div>
            ) : filteredEvents.length === 0 ? (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
                <p>No events found matching your criteria</p>
            </div>
            ) : (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.slice(0, 3).map((event) => (
                    <Card key={event.id} className="h-full flex flex-col">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{event.name}</CardTitle>
                        <Badge variant="secondary">{event.category}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                        {event.description}
                        </p>

                        <div className="flex items-center text-muted-foreground mb-2">
                        <MapPinIcon className="w-4 h-4 mr-2" />
                        <span className="text-sm">{event.location}</span>
                        </div>

                        <div className="flex items-center text-muted-foreground">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                            {formatDate(event.startDate)} -{' '}
                            {formatDate(event.endDate)}
                        </span>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between border-t pt-4">
                        <div className="text-green-600 font-bold">
                        Rp {event.price.toLocaleString('id-ID')}
                        </div>
                        <div className="text-muted-foreground text-sm">
                        {event.availableSeats} seats available
                        </div>
                    </CardFooter>

                    <div className="px-6 pb-6">
                        <Button className="w-full">Book Now</Button>
                    </div>
                    </Card>
                ))}
                </div>
                {filteredEvents.length > 3 && (
                <div className="text-center mt-6">
                    <Button onClick={handleSeeAll} variant="outline">
                    See All
                    </Button>
                </div>
                )}
            </>
            )}
        </main>

        <Footer />
        </div>
    )
}

export default Home