import express from 'express'
import { createEvent } from '../controllers/event.controller'
import { protectWithRole } from '../middleware/rolecheck'

const router = express.Router()

router.post('/create-event', protectWithRole(["ORGANIZER"]), createEvent)

export default router
