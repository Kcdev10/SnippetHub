import { Router } from 'express';
import {
  getAuthUser,
  isAuthenticatedUser,
  loginController,
  registerController,
} from '../controllers/user.controller';
import { isAuthenticateOrNot } from '../middleware/authenticate';

const router = Router();

router.get('/authenticate', isAuthenticateOrNot, isAuthenticatedUser);
router.get('/user', isAuthenticateOrNot, getAuthUser);
router.post('/register', registerController);
router.post('/login', loginController);
// router.post('/logout', logout);

export default router;
