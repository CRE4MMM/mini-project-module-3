"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const event_controller_1 = require("../controllers/event.controller");
const router = express_1.default.Router();
router.get('/', event_controller_1.getEvents);
router.get('/:id', event_controller_1.getEventById);
router.post('/create-event', event_controller_1.createEvent);
exports.default = router;
