'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
  Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'

const formSchema = z
    .object({
        name: z.string().min(1, { message: 'Event name is required' }),
        description: z
        .string()
        .min(10, { message: 'Description must be at least 10 characters' }),
        price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: 'Price must be a positive number',
        }),
        startDate: z.date({ required_error: 'Start date is required' }),
        endDate: z
        .date({ required_error: 'End date is required' })
        .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
            message: 'End date is required',
        }),
        location: z.string().min(1, { message: 'Location is required' }),
        category: z.string().min(1, { message: 'Category is required' }),
        availableSeats: z
        .string()
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: 'Available seats must be a positive number',
        }),
    })
    .refine((data) => data.endDate >= data.startDate, {
        message: 'End date must be after start date',
        path: ['endDate'],
    })

type FormValues = z.infer<typeof formSchema>

const Toast = ({
    message,
    type,
    onClose,
}: {
    message: string
    type: 'success' | 'error'
    onClose: () => void
}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
        onClose()
        }, 5000)

        return () => clearTimeout(timer)
    }, [onClose])

    return (
        <div
        className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}
        >
        <div className="flex items-center justify-between">
            <span>{message}</span>
            <button
            onClick={onClose}
            className="ml-4 text-white hover:text-gray-200"
            >
            ×
            </button>
        </div>
        </div>
    )
}

const EVENT_CATEGORIES = [
    'Conference',
    'Workshop',
    'Seminar',
    'Cultural',
    'Concert',
    'Exhibition',
    'Sports',
    'Networking',
    'Other',
]

export default function CreateEventPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [toast, setToast] = useState<{
        message: string
        type: 'success' | 'error'
    } | null>(null)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        name: '',
        description: '',
        price: '0',
        location: '',
        category: '',
        availableSeats: '0',
        },
    })

    async function onSubmit(values: FormValues) {
        setIsSubmitting(true)

        try {
        const eventData = {
            name: values.name,
            description: values.description,
            price: Number(values.price),
            startDate: values.startDate.toISOString(),
            endDate: values.endDate.toISOString(),
            location: values.location,
            category: values.category,
            availableSeats: Number(values.availableSeats),
        }

        const API_URL =
            process.env.NEXT_PUBLIC_API_URL || 'https://mini-project-module-3.vercel.app'
        const response = await fetch(`${API_URL}/api/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
        })

        const result = await response.json()

        if (result.success) {
            setToast({ message: 'Event created successfully', type: 'success' })

            setTimeout(() => {
            router.push('/events')
            }, 1500)
        } else {
            setToast({
            message: result.message || 'Failed to create event',
            type: 'error',
            })
        }
        } catch (error) {
        console.error('Error creating event:', error)
        setToast({ message: 'An unexpected error occurred', type: 'error' })
        } finally {
        setIsSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto py-10">
        {toast && (
            <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
            />
        )}
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
            <CardTitle className="text-2xl font-bold">Create New Event</CardTitle>
            <CardDescription>
                Fill in the details below to create a new event
            </CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Event Name</FormLabel>
                        <FormControl>
                        <Input placeholder="Enter event name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                        <Textarea
                            placeholder="Describe your event"
                            className="resize-none min-h-32"
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Price (Rp)</FormLabel>
                        <FormControl>
                            <Input
                            type="number"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="availableSeats"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Available Seats</FormLabel>
                        <FormControl>
                            <Input
                            type="number"
                            placeholder="0"
                            min="0"
                            step="1"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant="outline"
                                className={cn(
                                    'pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                )}
                                >
                                {field.value ? (
                                    format(field.value, 'PPP')
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant="outline"
                                className={cn(
                                    'pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                )}
                                >
                                {field.value ? (
                                    format(field.value, 'PPP')
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                date < form.getValues('startDate')
                                }
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                        <Input placeholder="Event location" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        >
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {EVENT_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                                {category}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Creating...' : 'Create Event'}
                </Button>
                </form>
            </Form>
            </CardContent>
        </Card>
        </div>
    )
}
