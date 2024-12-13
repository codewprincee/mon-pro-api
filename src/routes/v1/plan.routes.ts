import express from 'express';
import { getPlans, createPlan, updatePlan, getUserUsage, incrementUsage } from '../../controllers/v1/plan/PlanController';
import { auth } from '../../middleware/auth';
import { verifyRoles, UserRole } from '../../middleware/verifyRoles';
import { verifyFeatureAccess } from '../../middleware/verifyFeatureAccess';

const router = express.Router();

// Public routes
router.get('/', getPlans);

// Protected routes (for all authenticated users)
router.get('/usage', 
    auth, 
    verifyRoles(UserRole.USER, UserRole.PREMIUM, UserRole.ADMIN),
    verifyFeatureAccess('usage-tracking'),
    getUserUsage
);

router.post('/usage/increment', 
    auth, 
    verifyRoles(UserRole.USER, UserRole.PREMIUM, UserRole.ADMIN),
    verifyFeatureAccess('usage-tracking', 1), // Check if user can increment by 1
    incrementUsage
);

// Admin only routes
router.post('/', auth, verifyRoles(UserRole.ADMIN), createPlan);
router.put('/:id', auth, verifyRoles(UserRole.ADMIN), updatePlan);

export default router;
