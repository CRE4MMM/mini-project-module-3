import express from 'express';
import eventTransactionController from '../controllers/transaction.controller';

const router = express.Router();

router.post('/event-transaction', eventTransactionController.createEventTransaction);
router.get('/event-transaction', eventTransactionController.getEventTransactions);
router.get('/event-transaction/:id', eventTransactionController.getEventTransactionById);
router.put('/event-transaction/:id', eventTransactionController.updateEventTransaction);
router.delete('/event-transaction/:id', eventTransactionController.deleteEventTransaction);

export default router;
