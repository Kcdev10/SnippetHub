"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({
    path: path_1.default.join(__dirname, '../config/.env'),
});
exports.ENV = {
    PORT: process.env.PORT || '8066',
    MONGODB_URI: process.env.MONGODB_URI || '',
    CORS_ORIGIN_ACCESS: process.env.CORS_ORIGIN_ACCESS || '',
};
