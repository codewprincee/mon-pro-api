import mongoose from 'mongoose';
import { Plan } from '../models/Plan';

export const planSeeds = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Free',
    description: 'Basic features for personal use',
    price: 0,
    billingCycle: 'monthly',
    features: [
      {
        name: 'api_calls',
        limit: 1000,
        isUnlimited: false,
        description: 'API calls per month'
      },
      {
        name: 'storage',
        limit: 512, // 512MB
        isUnlimited: false,
        description: 'Storage space in MB'
      },
      {
        name: 'projects',
        limit: 3,
        isUnlimited: false,
        description: 'Number of projects'
      }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Pro',
    description: 'Advanced features for professionals',
    price: 29.99,
    billingCycle: 'monthly',
    features: [
      {
        name: 'api_calls',
        limit: 10000,
        isUnlimited: false,
        description: 'API calls per month'
      },
      {
        name: 'storage',
        limit: 5120, // 5GB
        isUnlimited: false,
        description: 'Storage space in MB'
      },
      {
        name: 'projects',
        limit: 10,
        isUnlimited: false,
        description: 'Number of projects'
      },
      {
        name: 'team_members',
        limit: 5,
        isUnlimited: false,
        description: 'Team members per project'
      }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Enterprise',
    description: 'Ultimate features for large teams',
    price: 99.99,
    billingCycle: 'monthly',
    features: [
      {
        name: 'api_calls',
        limit: 0,
        isUnlimited: true,
        description: 'Unlimited API calls'
      },
      {
        name: 'storage',
        limit: 51200, // 50GB
        isUnlimited: false,
        description: 'Storage space in MB'
      },
      {
        name: 'projects',
        limit: 0,
        isUnlimited: true,
        description: 'Unlimited projects'
      },
      {
        name: 'team_members',
        limit: 0,
        isUnlimited: true,
        description: 'Unlimited team members'
      },
      {
        name: 'priority_support',
        limit: 0,
        isUnlimited: true,
        description: '24/7 Priority support'
      }
    ]
  }
];
