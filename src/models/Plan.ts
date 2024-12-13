import mongoose, { Schema, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     PlanFeature:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the feature
 *         description:
 *           type: string
 *           description: Description of the feature
 *         limit:
 *           type: number
 *           description: Usage limit for the feature (null for unlimited)
 *         isUnlimited:
 *           type: boolean
 *           description: Whether the feature has unlimited usage
 * 
 *     Plan:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - billingCycle
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the plan
 *         description:
 *           type: string
 *           description: Description of the plan
 *         price:
 *           type: number
 *           description: Price of the plan
 *         billingCycle:
 *           type: string
 *           enum: [monthly, yearly]
 *           description: Billing cycle of the plan
 *         features:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PlanFeature'
 *           description: List of features included in the plan
 *         isActive:
 *           type: boolean
 *           description: Whether the plan is currently active
 */

export interface IPlanFeature {
    name: string;
    description: string;
    limit?: number;
    isUnlimited?: boolean;
}

export interface IPlan extends Document {
    name: string;
    description: string;
    price: number;
    billingCycle: 'monthly' | 'yearly';
    features: IPlanFeature[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const planFeatureSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    limit: { type: Number },
    isUnlimited: { type: Boolean, default: false }
});

const planSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    billingCycle: {
        type: String,
        required: true,
        enum: ['monthly', 'yearly']
    },
    features: [planFeatureSchema],
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
});

export const Plan = mongoose.model<IPlan>('Plan', planSchema);
