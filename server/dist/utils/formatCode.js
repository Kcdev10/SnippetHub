"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCode = void 0;
const prettier_1 = __importDefault(require("prettier"));
const detectParser = (code) => {
    // Simple heuristics to determine the type of code
    if (code.trim().startsWith('{') || code.trim().startsWith('[')) {
        return 'json';
    }
    if (code.includes('const') ||
        code.includes('let') ||
        code.includes('function')) {
        // Basic check for JavaScript/TypeScript
        if (code.includes('interface') ||
            code.includes('type') ||
            code.includes('import')) {
            return 'typescript';
        }
        return 'babel'; // Default to JavaScript
    }
    if (code.includes('<') && code.includes('>')) {
        return 'html';
    }
    if (code.includes('body {') ||
        code.includes('.class {') ||
        code.includes('color:')) {
        return 'css';
    }
    // Default to JavaScript if undetermined
    return 'babel';
};
const formatCode = async (code) => {
    try {
        const parser = detectParser(code);
        return prettier_1.default.format(code, {
            parser: parser,
            semi: true,
            singleQuote: true,
            tabWidth: 2,
            trailingComma: 'all',
            printWidth: 80,
        });
    }
    catch (error) {
        console.error('Error formatting code:', error);
        return code; // Return unformatted code in case of an error
    }
};
exports.formatCode = formatCode;
