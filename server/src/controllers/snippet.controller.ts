import { Request, Response } from 'express';
import Snippet from '../models/snippet.model';
import { formatCode } from '../utils/formatCode';

// Create a new snippet
export const createSnippet = async (req: Request, res: Response) => {
  try {
    const { title, code, folderId, isPublic } = req.body;
    const isPublicValue = isPublic === 'private' ? 'false' : 'true';
    const formattedCode = await formatCode(code);

    const snippet = new Snippet({
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
  } catch (error) {
    if (error && error instanceof Error)
      res.status(500).json({ message: error.message });
  }
};

// Get all snippets
export const getSnippets = async (req: Request, res: Response) => {
  try {
    const { folderId } = req.params;
    const { public_snippet } = req.query;

    if (public_snippet) {
      const snippets = await Snippet.find({
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

    const snippets = await Snippet.find({ folderId });
    res.status(200).json({ success: true, snippets });
  } catch (error) {
    if (error instanceof Error) res.status(400).json({ error: error.message });
  }
};

// update snippets
export const updateSnippet = async (req: Request, res: Response) => {
  try {
    const { snippetId } = req.params;
    const { title, code, folderId, isPublic } = req.body;
    const isPublicValue = isPublic === 'private' ? 'false' : 'true';
    const formattedCode = await formatCode(code);

    await Snippet.findByIdAndUpdate(
      snippetId,
      {
        $set: {
          title,
          code: formattedCode,
          folderId,
          isPublic: isPublicValue,
        },
      },
      {
        new: true,
      }
    );

    res.status(201).json({ success: true, message: 'update successfull' });
  } catch (error) {
    if (error && error instanceof Error)
      res.status(500).json({ message: 'Server Error' });
  }
};

// Get delete snippets
export const deleteSnippets = async (req: Request, res: Response) => {
  try {
    const { snippetId } = req.params;
    const isSnippetExist = await Snippet.findById(snippetId);

    if (!isSnippetExist)
      return res
        .status(401)
        .json({ success: false, message: 'snippet not found' });

    await Snippet.findByIdAndDelete(snippetId);
    res
      .status(200)
      .json({ success: true, message: 'snippet delete successfull' });
  } catch (error) {
    if (error instanceof Error) res.status(400).json({ error: error.message });
  }
};

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
