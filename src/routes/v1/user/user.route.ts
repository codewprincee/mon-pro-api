import express from 'express';
import { auth } from '../../../middleware/auth';
import { getMe, deleteAccount } from '../../../controllers/v1/user/UserController';

const router = express.Router();

// Get current user profile
router.get('/me', auth, getMe);

// Delete user account
router.delete('/delete-account', auth, deleteAccount);

export default router;
