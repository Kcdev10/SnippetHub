"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFolder = exports.getFolder = exports.createFolder = void 0;
const folder_model_1 = __importDefault(require("../models/folder.model"));
const snippet_model_1 = __importDefault(require("../models/snippet.model"));
// Create a new snippet
const createFolder = async (req, res) => {
    try {
        const { name, parentId } = req.body;
        const folder = new folder_model_1.default({
            name,
            parentId,
            owner: req.user._id,
        });
        if (parentId) {
            await folder_model_1.default.findByIdAndUpdate(parentId, {
                $push: { subfolders: folder._id },
            });
        }
        await folder.save();
        res.json({ success: true, message: 'folder create successfull' });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error });
        }
        return res.status(500).json({ message: 'error' });
    }
};
exports.createFolder = createFolder;
const populateSubfolders = async (folderId, ownerId) => {
    const folders = await folder_model_1.default.find({
        $and: [{ parentId: folderId }, { owner: ownerId }],
    }).populate('subfolders');
    const typedFolders = folders;
    // Recursively populate each folder's subfolders
    for (const folder of typedFolders) {
        if (folder._id) {
            folder.subfolders = await populateSubfolders(folder._id, folder.owner);
        }
    }
    // for (const folder of folders) {
    //   folder.subfolders = await populateSubfolders(folder._id); // Recursively populate
    // }
    return folders;
};
const getFolder = async (req, res) => {
    try {
        const folders = await populateSubfolders(null, req.user._id); // Fetch top-level folders
        res.json({ success: true, message: 'get scuccessfull', folders });
    }
    catch (error) {
        if (error instanceof Error)
            res.status(500).json({ message: error.message });
    }
};
exports.getFolder = getFolder;
async function deleteFolderAndDescendants(folderId) {
    try {
        // Step 1: Find all descendant folders
        const findDescendants = async (parentId) => {
            const isFolderExist = await folder_model_1.default.findOne({ _id: parentId });
            if (isFolderExist?.subfolders.length > 0 && isFolderExist) {
                for (const subfolder of isFolderExist.subfolders) {
                    await findDescendants(subfolder._id);
                    await snippet_model_1.default.deleteMany({ folderId: subfolder._id });
                }
            }
            else {
                await snippet_model_1.default.deleteMany({ folderId: parentId });
            }
            // Delete subfolder itself and its snippet as well
            await folder_model_1.default.findByIdAndDelete(parentId);
            await snippet_model_1.default.deleteMany({ folderId: parentId });
        };
        await findDescendants(folderId);
    }
    catch (error) {
        console.error('Error deleting folder:', error);
    }
}
const deleteFolder = async (req, res) => {
    try {
        const { folderId } = req.params;
        if (!folderId) {
            return res
                .status(400)
                .json({ success: false, message: 'folder does not exists!' });
        }
        deleteFolderAndDescendants(folderId);
        res.status(201).json({ success: true, message: 'delete successfully' });
    }
    catch (error) {
        if (error instanceof Error)
            res.status(500).json({ message: error.message });
    }
};
exports.deleteFolder = deleteFolder;
