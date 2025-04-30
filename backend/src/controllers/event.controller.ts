import { Request, Response } from 'express'
import { PrismaClient } from '../../prisma/generated/client'

const prisma = new PrismaClient()
export const createEvent = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {
            name,
            description,
            price,
            startDate,
            endDate,
            location,
            category,
            availableSeats,
        } = req.body

        if (
            !name ||
            !description ||
            price === undefined ||
            !startDate ||
            !endDate ||
            !location ||
            !category ||
            availableSeats === undefined
        ) { res.status(400).json({
                success: false,
            message: 'All fields are required',
        })
            return
        }

        const parsedStartDate = new Date(startDate)
        const parsedEndDate = new Date(endDate)

        if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
            res.status(400).json({
                success: false,
                message: 'Invalid date format',
            })
            return
        }

        if (parsedEndDate < parsedStartDate) {
            res.status(400).json({
                success: false,
                message: 'End date must be after start date',
            })
            return
        }

        if (price < 0 || availableSeats < 0) {
            res.status(400).json({
                success: false,
                message: 'Price and available seats must be positive numbers',
            })
            return
        }

        const newEvent = await prisma.evtItem.create({
            data: {
                name,
                description,
                price: Number(price),
                startDate: parsedStartDate,
                endDate: parsedEndDate,
                location,
                category,
                availableSeats: Number(availableSeats),
            },
        })

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: newEvent,
        })
    } catch (error) {
        console.error('Error creating event:', error)
        res.status(500).json({
            success: false,
            message: 'Server error while creating event',
            error:
                process.env.NODE_ENV === 'development'
                ? (error as Error).message
                : undefined,
        })
    }
}
