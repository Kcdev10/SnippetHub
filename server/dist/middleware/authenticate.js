"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticateOrNot = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuthenticateOrNot = async (req, res, next) => {
    try {
        const accessToken = req?.cookies?.auth_user_access_token ||
            req.headers.authorization?.split('Bearer')[1].trim();
        console.log(req.headers.authorization);
        // console.log(req.cookies);
        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: 'user is not authenticated',
            });
        }
        const user = (await jsonwebtoken_1.default.verify(accessToken, process.env.ACCESSJWTTOKEN));
        if (user && typeof user !== 'string') {
            req.user = user;
        }
        next();
    }
    catch (error) {
        if (error && error instanceof Error) {
            return res.status(401).json({ message: error.message, success: false });
        }
    }
};
exports.isAuthenticateOrNot = isAuthenticateOrNot;
