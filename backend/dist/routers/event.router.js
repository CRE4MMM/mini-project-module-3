import express from 'express';
import { createEvent, getEvents } from '../controllers/event.controller';
const router = express.Router();
router.get('/', getEvents);
router.post('/create-event', createEvent);
export default router;
