"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Load environment variables
const constant_1 = require("./constants/constant");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const folder_route_1 = __importDefault(require("./routes/folder.route"));
const snippet_route_1 = __importDefault(require("./routes/snippet.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
// import snippetRoutes from './routes/snippetRoutes';
const app = (0, express_1.default)();
// Connect to MongoDB
(0, db_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: constant_1.ENV.CORS_ORIGIN_ACCESS,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/api/v1/folder', folder_route_1.default);
app.use('/api/v1/code-snippet', snippet_route_1.default);
app.use('/api/v1/auth', user_route_1.default);
// health check route
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'health is good ❤️' });
});
// Routes
// app.use('/api/snippets', snippetRoutes);
exports.default = app;
