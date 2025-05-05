"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventTransactionController = void 0;
const prisma_1 = __importDefault(require("../configs/prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class EventTransactionController {
    createEventTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { userId, evtItemId, quantity } = req.body;
            const evtItemIdNum = parseInt(evtItemId);
            const quantityNum = parseInt(quantity);
            if (isNaN(evtItemIdNum) || isNaN(quantityNum) || !userId) {
                return res.status(400).json({ error: 'Invalid input data' });
            }
            // Validate token
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
            if (!token) {
                return res.status(401).json({ error: 'Unauthorized: No token provided' });
            }
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
                if (userId !== decoded.id) {
                    return res.status(403).json({ error: 'Forbidden: User ID mismatch' });
                }
            }
            catch (error) {
                if (error.name === 'JsonWebTokenError' ||
                    error.name === 'TokenExpiredError') {
                    return res
                        .status(401)
                        .json({ error: 'Unauthorized: Invalid or expired token' });
                }
                return res.status(500).json({ error: 'Failed to validate token' });
            }
            try {
                const evtItem = yield prisma_1.default.evtItem.findUnique({
                    where: { id: evtItemIdNum },
                });
                if (!evtItem) {
                    return res.status(404).json({ error: 'Event item not found' });
                }
                if (evtItem.availableSeats < quantityNum) {
                    return res.status(400).json({ error: 'Not enough seats available' });
                }
                const totalCost = evtItem.price * quantityNum;
                const transaction = yield prisma_1.default.eventTransaction.create({
                    data: {
                        userId,
                        evtItemId: evtItemIdNum,
                        quantity: quantityNum,
                        totalCost,
                    },
                });
                yield prisma_1.default.evtItem.update({
                    where: { id: evtItemIdNum },
                    data: { availableSeats: evtItem.availableSeats - quantityNum },
                });
                res.status(201).json(transaction);
            }
            catch (error) {
                console.error('Error creating transaction:', error);
                res.status(500).json({
                    error: 'Failed to create event transaction'
                });
            }
        });
    }
    getEventTransactions(_, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transactions = yield prisma_1.default.eventTransaction.findMany({
                    include: { user: true, evtItem: true },
                });
                res.status(200).json(transactions);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch event transactions' });
            }
        });
    }
    getEventTransactionById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid transaction ID' });
            }
            try {
                const transaction = yield prisma_1.default.eventTransaction.findUnique({
                    where: { id },
                    include: { user: true, evtItem: true },
                });
                if (!transaction) {
                    return res.status(404).json({ error: 'Event transaction not found' });
                }
                res.status(200).json(transaction);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch event transaction' });
            }
        });
    }
    updateEventTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            const quantity = parseInt(req.body.quantity);
            if (isNaN(id) || isNaN(quantity)) {
                return res.status(400).json({ error: 'Invalid input' });
            }
            try {
                const transaction = yield prisma_1.default.eventTransaction.findUnique({
                    where: { id },
                    include: { evtItem: true },
                });
                if (!transaction) {
                    return res.status(404).json({ error: 'Event transaction not found' });
                }
                const seatDifference = quantity - transaction.quantity;
                if (transaction.evtItem.availableSeats < seatDifference) {
                    return res.status(400).json({ error: 'Not enough seats available' });
                }
                const totalCost = transaction.evtItem.price * quantity;
                const updatedTransaction = yield prisma_1.default.eventTransaction.update({
                    where: { id },
                    data: { quantity, totalCost },
                });
                yield prisma_1.default.evtItem.update({
                    where: { id: transaction.evtItemId },
                    data: {
                        availableSeats: transaction.evtItem.availableSeats - seatDifference,
                    },
                });
                res.status(200).json(updatedTransaction);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to update event transaction' });
            }
        });
    }
    deleteEventTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid transaction ID' });
            }
            try {
                const transaction = yield prisma_1.default.eventTransaction.findUnique({
                    where: { id },
                    include: { evtItem: true },
                });
                if (!transaction) {
                    return res.status(404).json({ error: 'Event transaction not found' });
                }
                yield prisma_1.default.eventTransaction.delete({
                    where: { id },
                });
                yield prisma_1.default.evtItem.update({
                    where: { id: transaction.evtItemId },
                    data: {
                        availableSeats: transaction.evtItem.availableSeats + transaction.quantity,
                    },
                });
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to delete event transaction' });
            }
        });
    }
}
exports.EventTransactionController = EventTransactionController;
exports.default = new EventTransactionController();
