"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSnippets = exports.updateSnippet = exports.getSnippets = exports.createSnippet = void 0;
const snippet_model_1 = __importDefault(require("../models/snippet.model"));
const formatCode_1 = require("../utils/formatCode");
// Create a new snippet
const createSnippet = async (req, res) => {
    try {
        const { title, code, folderId, isPublic } = req.body;
        const isPublicValue = isPublic === 'private' ? 'false' : 'true';
        const formattedCode = await (0, formatCode_1.formatCode)(code);
        const snippet = new snippet_model_1.default({
            code: formattedCode,
            folderId,
            title,
            isPublic: isPublicValue,
        });
        const createdSnippet = await snippet.save();
        res.status(201).json({
            success: true,
            codeSnippet: createdSnippet,
            message: 'code snippet created!',
        });
    }
    catch (error) {
        if (error && error instanceof Error)
            res.status(500).json({ message: error.message });
    }
};
exports.createSnippet = createSnippet;
// Get all snippets
const getSnippets = async (req, res) => {
    try {
        const { folderId } = req.params;
        const { public_snippet } = req.query;
        if (public_snippet) {
            const snippets = await snippet_model_1.default.find({
                isPublic: true,
            });
            return res.status(200).json({ success: true, snippets });
        }
        if (!folderId) {
            return res.json({
                success: false,
                message: 'no code snippet for this particular folder',
            });
        }
        const snippets = await snippet_model_1.default.find({ folderId });
        res.status(200).json({ success: true, snippets });
    }
    catch (error) {
        if (error instanceof Error)
            res.status(400).json({ error: error.message });
    }
};
exports.getSnippets = getSnippets;
// update snippets
const updateSnippet = async (req, res) => {
    try {
        const { snippetId } = req.params;
        const { title, code, folderId, isPublic } = req.body;
        const isPublicValue = isPublic === 'private' ? 'false' : 'true';
        const formattedCode = await (0, formatCode_1.formatCode)(code);
        await snippet_model_1.default.findByIdAndUpdate(snippetId, {
            $set: {
                title,
                code: formattedCode,
                folderId,
                isPublic: isPublicValue,
            },
        }, {
            new: true,
        });
        res.status(201).json({ success: true, message: 'update successfull' });
    }
    catch (error) {
        if (error && error instanceof Error)
            res.status(500).json({ message: 'Server Error' });
    }
};
exports.updateSnippet = updateSnippet;
// Get delete snippets
const deleteSnippets = async (req, res) => {
    try {
        const { snippetId } = req.params;
        const isSnippetExist = await snippet_model_1.default.findById(snippetId);
        if (!isSnippetExist)
            return res
                .status(401)
                .json({ success: false, message: 'snippet not found' });
        await snippet_model_1.default.findByIdAndDelete(snippetId);
        res
            .status(200)
            .json({ success: true, message: 'snippet delete successfull' });
    }
    catch (error) {
        if (error instanceof Error)
            res.status(400).json({ error: error.message });
    }
};
exports.deleteSnippets = deleteSnippets;
// // Get a single snippet by ID
// export const getSnippetById = async (req: Request, res: Response) => {
//   try {
//     const snippet = await Snippet.findById(req.params.id);
//     if (!snippet) {
//       return res.status(404).json({ message: 'Snippet not found' });
//     }
//     res.status(200).json(snippet);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error' });
//   }
// };
// // Delete a snippet by ID
// export const deleteSnippet = async (req: Request, res: Response) => {
//   try {
//     const snippet = await Snippet.findById(req.params.id);
//     if (!snippet) {
//       return res.status(404).json({ message: 'Snippet not found' });
//     }
//     await snippet.remove();
//     res.status(204).json({});
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error' });
//   }
// };
