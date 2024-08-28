import { Router } from 'express';
import {
  createFolder,
  deleteFolder,
  getFolder,
} from '../controllers/folder.controller';
import { isAuthenticateOrNot } from '../middleware/authenticate';

const router = Router();

router.route('/').get(isAuthenticateOrNot, getFolder);
router.route('/create').post(isAuthenticateOrNot, createFolder);
router.route('/delete/:folderId').delete(isAuthenticateOrNot, deleteFolder);

export default router;
