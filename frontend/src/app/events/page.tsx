'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { CalendarIcon, MapPinIcon } from 'lucide-react'

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

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <div className="container py-8 mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        Upcoming Events
      </h1>

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
      ) : events.length === 0 ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <p>No events available at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
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
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
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
      )}
    </div>
  )
}
