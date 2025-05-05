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

export const getEvents = async (req: Request, res: Response): Promise<void> => {
    try {
        const events = await prisma.evtItem.findMany()
        res.status(200).json({
        success: true,
        message: 'Events fetched successfully',
        data: events,
        })
    } catch (error) {
        console.error('Error fetching events:', error)
        res.status(500).json({
        success: false,
        message: 'Server error while fetching events',
        error:
            process.env.NODE_ENV === 'development'
            ? (error as Error).message
            : undefined,
        })
    }
}

export const getEventById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const eventId = Number(id);
    if (isNaN(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid event ID' });
    }
    const event = await prisma.evtItem.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching event',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};
