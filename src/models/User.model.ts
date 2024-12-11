import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  isActive: boolean;
  organization?: string;
  lastLoginAt?: Date;
  subscriptionStatus: 'trial' | 'active' | 'cancelled' | 'expired';
  trialEndsAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  tokenVersion: number;
  isOnboardingCompleted: boolean;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: false,
    },
    lastLoginAt: {
      type: Date,
    },
    subscriptionStatus: {
      type: String,
      enum: ['trial', 'active', 'cancelled', 'expired'],
      default: 'trial',
    },
    trialEndsAt: {
      type: Date,
    },
    tokenVersion: {
      type: Number,
      default: 0,
      select: false
    },
    isOnboardingCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add password validation
userSchema.path('password').validate(function(password: string) {
  return password.length >= 8;
}, 'Password must be at least 8 characters long');

// Add any pre-save hooks, methods, or statics here
userSchema.pre('save', async function (next) {
  // Add password hashing or other pre-save operations here
  next();
});

export const User = model<IUser>('User', userSchema);
