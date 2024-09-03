"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aap_1 = __importDefault(require("./aap"));
const constant_1 = require("./constants/constant");
aap_1.default.listen(constant_1.ENV.PORT, () => {
    console.log(`Server is running on port ${constant_1.ENV.PORT} 🎉🎉`);
});
