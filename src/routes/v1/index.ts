import { Router } from 'express';
import userRoutes from './user/user.routes';
import authRoutes from './auth/auth.routes';


const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Mount routes
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

export default router; 