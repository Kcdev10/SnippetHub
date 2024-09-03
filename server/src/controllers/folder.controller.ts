import { Response, Request } from 'express';
import Folder, { IFolder } from '../models/folder.model';
import mongoose from 'mongoose';
import Snippet from '../models/snippet.model';
import { CustomRequest } from '../middleware/authenticate';

// Create a new snippet

export const createFolder = async (req: Request, res: Response) => {
  try {
    const { name, parentId } = req.body;
    const folder = new Folder({
      name,
      parentId,
      owner: (req as CustomRequest).user._id,
    });

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
  ownerId: mongoose.Types.ObjectId | string
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

export const getFolder = async (req: Request, res: Response) => {
  try {
    const folders = await populateSubfolders(
      null,
      (req as CustomRequest).user._id
    ); // Fetch top-level folders
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
      const isFolderExist = await Folder.findOne({ _id: parentId });

      if ((isFolderExist?.subfolders.length as number) > 0 && isFolderExist) {
        for (const subfolder of isFolderExist.subfolders) {
          await findDescendants(subfolder._id as string);
          await Snippet.deleteMany({ folderId: subfolder._id });
        }
      } else {
        await Snippet.deleteMany({ folderId: parentId });
      }

      // Delete subfolder itself and its snippet as well
      await Folder.findByIdAndDelete(parentId);
      await Snippet.deleteMany({ folderId: parentId });
    };

    await findDescendants(folderId);
  } catch (error) {
    console.error('Error deleting folder:', error);
  }
}

export const deleteFolder = async (req: Request, res: Response) => {
  try {
    const { folderId } = req.params;
    if (!folderId) {
      return res
        .status(400)
        .json({ success: false, message: 'folder does not exists!' });
    }
    deleteFolderAndDescendants(folderId);
    res.status(201).json({ success: true, message: 'delete successfully' });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: error.message });
  }
};
