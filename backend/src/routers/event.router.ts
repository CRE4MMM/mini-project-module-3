import express from 'express'
import { createEvent, getEventById, getEvents } from '../controllers/event.controller'

const router = express.Router()

router.get('/', getEvents)
router.get('/:id', getEventById)
router.post('/create-event', createEvent)

export default router
