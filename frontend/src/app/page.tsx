'use client'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { debounce } from 'lodash'
import Footer from '../components/core/Footer'
import EventCard from '../components/ui/EventCard'
import SearchBar from '../components/ui/SearchBar'
import CategoryFilter from '../components/ui/CategoryFilter'

export interface EventItem {
  id: number
  name: string
  description: string
  price: number
  startDate: string
  endDate: string
  location: string
  category: string
  availableSeats: number
}

const MOCK_EVENTS: EventItem[] = [
  {
    id: 1,
    name: 'Tech Conference 2025',
    description: 'Annual tech conference featuring the latest innovations',
    price: 300000,
    startDate: '2025-05-15T09:00:00',
    endDate: '2025-05-17T18:00:00',
    location: 'Jakarta Convention Center',
    category: 'Technology',
    availableSeats: 500,
  },
  {
    id: 2,
    name: 'Music Festival',
    description: 'A weekend of amazing music performances',
    price: 450000,
    startDate: '2025-06-10T14:00:00',
    endDate: '2025-06-12T23:00:00',
    location: 'Bali Beach Resort',
    category: 'Music',
    availableSeats: 2000,
  },
  {
    id: 3,
    name: 'Food & Culinary Expo',
    description: 'Explore culinary delights from around the world',
    price: 150000,
    startDate: '2025-04-20T10:00:00',
    endDate: '2025-04-22T20:00:00',
    location: 'Bandung Exhibition Center',
    category: 'Food',
    availableSeats: 1200,
  },
  {
    id: 4,
    name: 'Business Leadership Summit',
    description: 'Learn from top business leaders',
    price: 750000,
    startDate: '2025-07-05T08:00:00',
    endDate: '2025-07-06T17:00:00',
    location: 'Grand Hyatt Jakarta',
    category: 'Business',
    availableSeats: 300,
  },
  {
    id: 5,
    name: 'Charity Run',
    description: 'Run for a cause and help raise funds',
    price: 0,
    startDate: '2025-05-30T06:00:00',
    endDate: '2025-05-30T11:00:00',
    location: 'Senayan City Park',
    category: 'Sports',
    availableSeats: 5000,
  },
  {
    id: 6,
    name: 'Summer Tech Expo',
    description: 'Explore the latest in tech innovation and gadgets',
    price: 250000,
    startDate: '2025-06-15T09:00:00',
    endDate: '2025-06-15T18:00:00',
    location: 'Downtown Convention Center',
    category: 'Technology',
    availableSeats: 1200,
  },
]

const categories: string[] = [
  'All',
  'Technology',
  'Music',
  'Food',
  'Business',
  'Sports',
]
const locations: string[] = [
  'All', 
  'Jakarta', 
  'Bali', 
  'Bandung'
]

const Home: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([])
  const [filteredEvents, setFilteredEvents] = useState<EventItem[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedLocation, setSelectedLocation] = useState<string>('All')

  useEffect(() => {
    setEvents(MOCK_EVENTS)
    setFilteredEvents(MOCK_EVENTS)
  }, [])

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>EventHub - Discover Amazing Events</title>
        <meta
          name="description"
          content="Find and book the best events in your area"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 text-center">
          <h1 className="text-4xl text-black font-bold mb-4">
            Discover Amazing Events
          </h1>
          <p className="text-lg text-black mb-8">
            Find and book tickets for the best events around you
          </p>

          <div className="max-w-3xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </section>

        <section className="mb-12">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-gray-500">
                  No events found matching your criteria
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home
