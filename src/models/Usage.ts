import mongoose, { Schema, Document } from 'mongoose';

export interface IUsage extends Document {
    userId: mongoose.Types.ObjectId;
    planId: mongoose.Types.ObjectId;
    featureName: string;
    currentUsage: number;
    lastUpdated: Date;
    billingCycleStart: Date;
    billingCycleEnd: Date;
}

const usageSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        required: true
    },
    featureName: { type: String, required: true },
    currentUsage: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
    billingCycleStart: { type: Date, required: true },
    billingCycleEnd: { type: Date, required: true }
}, {
    timestamps: true
});

// Compound index to ensure unique usage tracking per user, plan, and feature
usageSchema.index({ userId: 1, planId: 1, featureName: 1 }, { unique: true });

export const Usage = mongoose.model<IUsage>('Usage', usageSchema);
