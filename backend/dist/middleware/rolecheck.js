"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectWithRole = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const protectWithRole = (allowedRoles) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Unauthorized: No token provided' });
            return;
        }
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (!allowedRoles.includes(decoded.role)) {
                res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
                return;
            }
            next();
        }
        catch (err) {
            res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
    };
};
exports.protectWithRole = protectWithRole;
