import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';
import authRouter from './routers/auth.router';
import eventRouter from './routers/event.router';
const PORT = process.env.PORT || 9009;
class App {
    constructor() {
        this.app = express();
        this.configure();
        this.route();
    }
    configure() {
        this.app.use(cors());
        this.app.use(express.json());
    }
    route() {
        this.app.get('/', (req, res) => {
            res.status(200).send('<h1>Test</h1>');
        });
        this.app.use('/auth', authRouter);
        this.app.use('/api/event', eventRouter);
    }
    start() {
        this.app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
}
export default App;
