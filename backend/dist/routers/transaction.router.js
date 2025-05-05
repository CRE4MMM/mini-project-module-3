"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transaction_controller_1 = __importDefault(require("../controllers/transaction.controller"));
const router = express_1.default.Router();
router.post('/event-transaction', transaction_controller_1.default.createEventTransaction);
router.get('/event-transaction', transaction_controller_1.default.getEventTransactions);
router.get('/event-transaction/:id', transaction_controller_1.default.getEventTransactionById);
router.put('/event-transaction/:id', transaction_controller_1.default.updateEventTransaction);
router.delete('/event-transaction/:id', transaction_controller_1.default.deleteEventTransaction);
exports.default = router;
