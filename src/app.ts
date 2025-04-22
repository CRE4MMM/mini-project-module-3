import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import express, { Request, Response, NextFunction, Application } from 'express'
import { request } from 'node:https'

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
        res.status(200).send('<h1>Tes</h1>')
        })
    }

    public start(): void {
        this.app.listen(PORT, () => {
            console.log("Run on", PORT)
        })
    }
}

export default App