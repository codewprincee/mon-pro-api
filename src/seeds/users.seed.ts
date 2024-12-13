import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { planSeeds } from './plans.seed';
import { UserRole } from '../interfaces/role.interface';

export const userSeeds = [
  {
    _id: new mongoose.Types.ObjectId(),
    email: 'free@example.com',
    password: bcrypt.hashSync('password123', 10),
    firstName: 'Free',
    lastName: 'User',
    role: UserRole.USER,
    tokenVersion: 0,
    planId: planSeeds[0]._id,
    isActive: true,
    trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(),
    email: 'pro@example.com',
    password: bcrypt.hashSync('password123', 10),
    firstName: 'Pro',
    lastName: 'User',
    role: UserRole.USER,
    tokenVersion: 0,
    planId: planSeeds[1]._id,
    isActive: true,
    trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(),
    email: 'admin@example.com',
    password: bcrypt.hashSync('admin123', 10),
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN,
    tokenVersion: 0,
    planId: planSeeds[2]._id,
    isActive: true,
    trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(),
    email: 'inactive@example.com',
    password: bcrypt.hashSync('password123', 10),
    firstName: 'Inactive',
    lastName: 'User',
    role: UserRole.USER,
    tokenVersion: 0,
    planId: planSeeds[0]._id,
    isActive: false,
    trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(),
    email: 'free2@example.com',
    password: bcrypt.hashSync('password123', 10),
    firstName: 'Free2',
    lastName: 'User',
    role: UserRole.USER,
    tokenVersion: 0,
    planId: planSeeds[0]._id,
    isActive: true,
    trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  },{
    _id: new mongoose.Types.ObjectId(),
    email: 'pro2@example.com',
    password: bcrypt.hashSync('password123', 10),
    firstName: 'Pro2',
    lastName: 'User',
    role: UserRole.USER,
    tokenVersion: 0,
    planId: planSeeds[1]._id,
    isActive: true,
    trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(),
    email: 'admin2@example.com',
    password: bcrypt.hashSync('admin123', 10),
    firstName: 'Admin2',
    lastName: 'User',
    role: UserRole.ADMIN,
    tokenVersion: 0,
    planId: planSeeds[2]._id,
    isActive: true,
    trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
