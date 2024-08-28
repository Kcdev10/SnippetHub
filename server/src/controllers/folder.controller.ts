import { Request, Response } from 'express';
import Folder, { IFolder } from '../models/folder.model';
import mongoose from 'mongoose';
import Snippet from '../models/snippet.model';
// Create a new snippet
export const createFolder = async (req: any, res: Response) => {
  try {
    console.log('aaya');
    const { name, parentId } = req.body;
    const folder = new Folder({ name, parentId, owner: req.user._id });

    if (parentId) {
      await Folder.findByIdAndUpdate(parentId, {
        $push: { subfolders: folder._id },
      });
    }

    await folder.save();

    res.json({ success: true, message: 'folder create successfull' });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error });
    }
    return res.status(500).json({ message: 'error' });
  }
};

const populateSubfolders = async (
  folderId: mongoose.Types.ObjectId | null,
  ownerId: mongoose.Types.ObjectId
): Promise<IFolder[]> => {
  const folders = await Folder.find({
    $and: [{ parentId: folderId }, { owner: ownerId }],
  }).populate('subfolders');

  const typedFolders = folders as IFolder[];

  // Recursively populate each folder's subfolders
  for (const folder of typedFolders) {
    if (folder._id) {
      folder.subfolders = await populateSubfolders(
        folder._id as mongoose.Types.ObjectId,
        folder.owner as mongoose.Types.ObjectId
      );
    }
  }

  // for (const folder of folders) {
  //   folder.subfolders = await populateSubfolders(folder._id); // Recursively populate
  // }

  return folders as IFolder[];
};

export const getFolder = async (req: any, res: Response) => {
  try {
    const folders = await populateSubfolders(null, req.user._id); // Fetch top-level folders
    res.json({ success: true, message: 'get scuccessfull', folders });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: error.message });
  }
};

async function deleteFolderAndDescendants(folderId: string) {
  try {
    // Step 1: Find all descendant folders
    const findDescendants = async (parentId: string) => {
      const subfolders = await Folder.find({ parentId });

      for (const subfolder of subfolders) {
        await findDescendants(subfolder._id as string);
        // Optionally, delete associated data here (e.g., snippets in this folder)
        await Snippet.deleteMany({ folderId: subfolder._id });
      }
      // Delete subfolder itself
      await Folder.findByIdAndDelete(parentId);
    };

    // Step 2: Start the recursive deletion
    await findDescendants(folderId);

    // Step 3: Delete the target folder
    await Folder.findByIdAndDelete(folderId);

    console.log('Folder and its descendants deleted successfully.');
  } catch (error) {
    console.error('Error deleting folder:', error);
  }
}

// Usage example:
// Replace 'folderId' with the actual folder ID you want to delete

export const deleteFolder = async (req: any, res: Response) => {
  try {
    const { folderId } = req.params;
    deleteFolderAndDescendants(folderId);
    // const isFolderExist = await Folder.findById(folderId);
    // if (!isFolderExist)
    //   return res
    //     .status(400)
    //     .json({ success: false, message: 'folder not found' });

    // if (isFolderExist.parentId) {
    //   await Folder.findByIdAndUpdate(isFolderExist.parentId, {
    //     $pull: { subfolders: folderId },
    //   });
    //   await Snippet.deleteMany({ folderId });
    //   await Folder.findByIdAndDelete(folderId);

    //   return res.json({ success: true, message: 'delete scuccessfull' });
    // }

    // const isSubFolder = isFolderExist.subfolders;

    // for (let item of isSubFolder) {
    //   await Snippet.deleteMany({ folderId: item });
    //   await Folder.findByIdAndDelete(item);
    //   await Folder.findByIdAndUpdate(folderId, {
    //     $pull: { subfolders: item },
    //   });
    // }

    // await Snippet.deleteMany({ folderId });
    // await Folder.findByIdAndDelete(folderId);
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: error.message });
  }
};
