import express from 'express';
import { getPlans, createPlan, updatePlan, getUserUsage, incrementUsage } from '../../../controllers/v1/plan/PlanController';
import { auth } from '../../../middleware/auth';
import { verifyRoles, UserRole } from '../../../middleware/verifyRoles';
import { verifyFeatureAccess } from '../../../middleware/verifyFeatureAccess';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Plans
 *   description: Plan management and subscription endpoints
 */

/**
 * @swagger
 * /v1/plans:
 *   get:
 *     summary: Get all available plans
 *     tags: [Plans]
 *     responses:
 *       200:
 *         description: List of all plans
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Plan'
 *       500:
 *         description: Server error
 */
router.get('/', getPlans);

/**
 * @swagger
 * /v1/plans/usage:
 *   get:
 *     summary: Get user's feature usage
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's feature usage statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     features:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           featureName:
 *                             type: string
 *                           currentUsage:
 *                             type: number
 *                           limit:
 *                             type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/usage', 
    auth, 
    verifyRoles(UserRole.USER, UserRole.PREMIUM, UserRole.ADMIN),
    verifyFeatureAccess('usage-tracking'),
    getUserUsage
);

/**
 * @swagger
 * /v1/plans/usage/increment:
 *   post:
 *     summary: Increment feature usage
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - featureName
 *             properties:
 *               featureName:
 *                 type: string
 *               increment:
 *                 type: number
 *                 default: 1
 *     responses:
 *       200:
 *         description: Usage incremented successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden or usage limit exceeded
 */
router.post('/usage/increment', 
    auth, 
    verifyRoles(UserRole.USER, UserRole.PREMIUM, UserRole.ADMIN),
    verifyFeatureAccess('usage-tracking', 1),
    incrementUsage
);

/**
 * @swagger
 * /v1/plans:
 *   post:
 *     summary: Create a new plan
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plan'
 *     responses:
 *       201:
 *         description: Plan created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.post('/', auth, verifyRoles(UserRole.ADMIN), createPlan);

/**
 * @swagger
 * /v1/plans/{id}:
 *   put:
 *     summary: Update a plan
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Plan ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plan'
 *     responses:
 *       200:
 *         description: Plan updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Plan not found
 */
router.put('/:id', auth, verifyRoles(UserRole.ADMIN), updatePlan);

export default router;
