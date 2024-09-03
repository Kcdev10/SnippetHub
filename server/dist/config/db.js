"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const constant_1 = require("../constants/constant");
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(constant_1.ENV.MONGODB_URI);
        console.log('database connected 🥳🥳');
    }
    catch (error) {
        if (error instanceof Error)
            console.error('MongoDB connection failed:', error.message);
        else
            console.error('MongoDB connection failed:', 'Unknown Error');
        process.exit(1);
    }
};
exports.default = connectDB;
