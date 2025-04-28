"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const auth_router_1 = __importDefault(require("./routers/auth.router"));
const PORT = process.env.PORT || 9009;
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.configure();
        this.route();
    }
    configure() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
    }
    route() {
        this.app.get('/', (req, res) => {
            res.status(200).send('<h1>Test</h1>');
        });
        this.app.use('/auth', auth_router_1.default);
    }
    start() {
        this.app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
}
exports.default = App;
