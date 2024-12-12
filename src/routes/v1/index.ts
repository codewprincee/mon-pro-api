import { Router } from 'express';

import authRoutes from './auth/auth.routes';
import userRoutes from './user/user.route';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;