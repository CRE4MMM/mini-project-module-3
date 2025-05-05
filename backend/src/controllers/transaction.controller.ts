import { Request, Response } from 'express'
import prisma from '../configs/prisma'
import jwt from 'jsonwebtoken'

export class EventTransactionController {
  async createEventTransaction(req: Request, res: Response): Promise<any> {
    const { userId, evtItemId, quantity } = req.body
    const evtItemIdNum = parseInt(evtItemId)
    const quantityNum = parseInt(quantity)

    if (isNaN(evtItemIdNum) || isNaN(quantityNum) || !userId) {
      return res.status(400).json({ error: 'Invalid input data' })
    }

    // Validate token
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' })
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key'
      ) as { id: string }
      if (userId !== decoded.id) {
        return res.status(403).json({ error: 'Forbidden: User ID mismatch' })
      }
    } catch (error: any) {
      if (
        error.name === 'JsonWebTokenError' ||
        error.name === 'TokenExpiredError'
      ) {
        return res
          .status(401)
          .json({ error: 'Unauthorized: Invalid or expired token' })
      }
      return res.status(500).json({ error: 'Failed to validate token' })
    }

    try {
      const evtItem = await prisma.evtItem.findUnique({
        where: { id: evtItemIdNum },
      })

      if (!evtItem) {
        return res.status(404).json({ error: 'Event item not found' })
      }

      if (evtItem.availableSeats < quantityNum) {
        return res.status(400).json({ error: 'Not enough seats available' })
      }

      const totalCost = evtItem.price * quantityNum

      const transaction = await prisma.eventTransaction.create({
        data: {
          userId,
          evtItemId: evtItemIdNum,
          quantity: quantityNum,
          totalCost,
        },
      })

      await prisma.evtItem.update({
        where: { id: evtItemIdNum },
        data: { availableSeats: evtItem.availableSeats - quantityNum },
      })

      res.status(201).json(transaction)
    } catch (error) {
      console.error('Error creating transaction:', error)
      res.status(500).json({
        error: 'Failed to create event transaction'
      })
    }
  }

  async getEventTransactions(_: Request, res: Response): Promise<any> {
    try {
      const transactions = await prisma.eventTransaction.findMany({
        include: { user: true, evtItem: true },
      })
      res.status(200).json(transactions)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch event transactions' })
    }
  }

  async getEventTransactionById(req: Request, res: Response): Promise<any> {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid transaction ID' })
    }

    try {
      const transaction = await prisma.eventTransaction.findUnique({
        where: { id },
        include: { user: true, evtItem: true },
      })

      if (!transaction) {
        return res.status(404).json({ error: 'Event transaction not found' })
      }

      res.status(200).json(transaction)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch event transaction' })
    }
  }

  async updateEventTransaction(req: Request, res: Response): Promise<any> {
    const id = parseInt(req.params.id)
    const quantity = parseInt(req.body.quantity)

    if (isNaN(id) || isNaN(quantity)) {
      return res.status(400).json({ error: 'Invalid input' })
    }

    try {
      const transaction = await prisma.eventTransaction.findUnique({
        where: { id },
        include: { evtItem: true },
      })

      if (!transaction) {
        return res.status(404).json({ error: 'Event transaction not found' })
      }

      const seatDifference = quantity - transaction.quantity

      if (transaction.evtItem.availableSeats < seatDifference) {
        return res.status(400).json({ error: 'Not enough seats available' })
      }

      const totalCost = transaction.evtItem.price * quantity

      const updatedTransaction = await prisma.eventTransaction.update({
        where: { id },
        data: { quantity, totalCost },
      })

      await prisma.evtItem.update({
        where: { id: transaction.evtItemId },
        data: {
          availableSeats: transaction.evtItem.availableSeats - seatDifference,
        },
      })

      res.status(200).json(updatedTransaction)
    } catch (error) {
      res.status(500).json({ error: 'Failed to update event transaction' })
    }
  }

  async deleteEventTransaction(req: Request, res: Response): Promise<any> {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid transaction ID' })
    }

    try {
      const transaction = await prisma.eventTransaction.findUnique({
        where: { id },
        include: { evtItem: true },
      })

      if (!transaction) {
        return res.status(404).json({ error: 'Event transaction not found' })
      }

      await prisma.eventTransaction.delete({
        where: { id },
      })

      await prisma.evtItem.update({
        where: { id: transaction.evtItemId },
        data: {
          availableSeats:
            transaction.evtItem.availableSeats + transaction.quantity,
        },
      })

      res.status(204).send()
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete event transaction' })
    }
  }
}

export default new EventTransactionController()
