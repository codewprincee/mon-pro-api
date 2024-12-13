import mongoose from 'mongoose';
import { userSeeds } from './users.seed';

export const usageSeeds = [
  // Free User Usage
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userSeeds[0]._id,
    featureName: 'api_calls',
    count: 750,
    lastUpdated: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userSeeds[0]._id,
    featureName: 'storage',
    count: 256,
    lastUpdated: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userSeeds[0]._id,
    featureName: 'projects',
    count: 2,
    lastUpdated: new Date()
  },

  // Pro User Usage
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userSeeds[1]._id,
    featureName: 'api_calls',
    count: 5000,
    lastUpdated: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userSeeds[1]._id,
    featureName: 'storage',
    count: 2048,
    lastUpdated: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userSeeds[1]._id,
    featureName: 'projects',
    count: 5,
    lastUpdated: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userSeeds[1]._id,
    featureName: 'team_members',
    count: 3,
    lastUpdated: new Date()
  },

  // Enterprise User Usage
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userSeeds[2]._id,
    featureName: 'api_calls',
    count: 25000,
    lastUpdated: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userSeeds[2]._id,
    featureName: 'storage',
    count: 25600,
    lastUpdated: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userSeeds[2]._id,
    featureName: 'projects',
    count: 15,
    lastUpdated: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userSeeds[2]._id,
    featureName: 'team_members',
    count: 12,
    lastUpdated: new Date()
  }
];
