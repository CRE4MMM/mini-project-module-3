import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import express, { Request, Response, NextFunction, Application } from 'express'
import authRouter from './routers/auth.router'
import eventRouter from './routers/event.router'
import transactionRouter from './routers/transaction.router'

const PORT = process.env.PORT || 9009
class App {
    app: Application

    constructor() {
        this.app = express()
        this.configure()
        this.route()
    }

    private configure(): void {
        this.app.use(cors())
        this.app.use(express.json())
    }

    private route(): void {
        this.app.get('/', (req: Request, res: Response) => {
            res.status(200).send('<h1>Test</h1>')
        })

        this.app.use('/auth', authRouter)
        this.app.use('/api/event', eventRouter)
        this.app.use('/api/transaction', transactionRouter)
    }

    public start(): void {
        this.app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    }
}

export default App