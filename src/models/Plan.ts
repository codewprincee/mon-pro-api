import mongoose, { Schema, Document } from 'mongoose';

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
