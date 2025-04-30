import { Request, Response, NextFunction, RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

interface JwtPayload {
    id: string
    email: string
    role: string
}

export const protectWithRole = (allowedRoles: string[]): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Unauthorized' })
            return
        }

        const token = authHeader.split(' ')[1]

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload

            if (!allowedRoles.includes(decoded.role)) {
                res.status(403).json({ message: 'Forbidden: Insufficient permissions' })
                return
            }

            next()
        } catch (err) {
            res.status(401).json({ message: 'Unauthorized: Invalid token' })
        }
    }
}

