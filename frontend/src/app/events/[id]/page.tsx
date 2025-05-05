'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface EventItem {
  id: number
  name: string
  description: string
  price: number
  availableSeats: number
  location: string
  startDate: string
  endDate: string
}

interface TransactionResponse {
  id: number
  userId: string
  evtItemId: number
  quantity: number
  totalCost: number
}

const EventDetailPage = () => {
  const { id } = useParams()
  const [event, setEvent] = useState<EventItem | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [userId] = useState<string>('user123')

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL ||
          'https://mini-project-module-3.vercel.app'
        const response = await fetch(`${API_URL}/api/event/${id}`)
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Event not found: ${errorText || 'Unknown error'}`)
        }
        const result = await response.json()
        if (!result.success || !result.data || !result.data.id) {
          throw new Error('Invalid event data')
        }
        setEvent(result.data)
      } catch (err: any) {
        console.error('Fetch error:', err)
        setError(`Failed to load event details: ${err.message}`)
      }
    }
    fetchEvent()
  }, [id])

  const handleBookEvent = async () => {
    if (!event || quantity < 1 || quantity > event.availableSeats) {
      setMessage('Invalid quantity: Please select a valid number of seats.')
      return
    }

    if (!userId) {
      setMessage('User ID is required to book an event.')
      return
    }

    setLoading(true)
    setMessage(null)
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ||
        'https://mini-project-module-3.vercel.app'
      const response = await fetch(`${API_URL}/api/transaction/event-transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          evtItemId: event.id,
          quantity,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to book event')
      }

      const transaction: TransactionResponse = await response.json()
      setMessage(
        `Booking Successful! You have booked ${quantity} seat(s) for ${
          event.name
        }. Total cost: Rp ${transaction.totalCost.toLocaleString()}`
      )

      setEvent((prev) =>
        prev
          ? { ...prev, availableSeats: prev.availableSeats - quantity }
          : null
      )
      setQuantity(1)
    } catch (err: any) {
      setMessage(`Booking Failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  if (!event) {
    return <div className="text-center">Loading...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>{event.name}</CardTitle>
          <span className="text-sm text-gray-500">{event.location}</span>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">{event.description}</p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Date:</span>{' '}
            {new Date(event.startDate).toLocaleString()} -{' '}
            {new Date(event.endDate).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Price:</span> Rp{' '}
            {event.price.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Available Seats:</span>{' '}
            {event.availableSeats}
          </p>

          <div className="mt-6">
            <Label htmlFor="quantity">Number of Seats</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={event.availableSeats}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="mt-1"
            />
          </div>

          {message && (
            <div
              className={`mt-4 p-2 rounded ${
                message.includes('Failed')
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {message}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleBookEvent}
            disabled={loading || event.availableSeats === 0}
            className="w-full"
          >
            {loading ? 'Booking...' : 'Book Now'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default EventDetailPage
