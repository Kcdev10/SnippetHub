import { Router } from 'express';
import {
  createSnippet,
  deleteSnippets,
  getSnippets,
  updateSnippet,
  //   getSnippetById,
  //   deleteSnippet,
} from '../controllers/snippet.controller';
import { isAuthenticateOrNot } from '../middleware/authenticate';

const router = Router();

router.route('/').get(getSnippets);
router.route('/folder/:folderId').get(getSnippets);
router.route('/create').post(createSnippet);
router.route('/update/:snippetId').post(updateSnippet);
router.route('/delete/:snippetId').delete(deleteSnippets);

// router.route('/:id').get(getSnippetById).delete(deleteSnippet);

export default router;
