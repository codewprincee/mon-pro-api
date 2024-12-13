import mongoose from 'mongoose';
import { Plan } from '../models/Plan';
import { User } from '../models/User';
import { Usage } from '../models/Usage';
import { planSeeds } from './plans.seed';
import { userSeeds } from './users.seed';
import { usageSeeds } from './usage.seed';
import dotenv from 'dotenv';


const seedDatabase = async () => {

  try {
    // Connect to MongoDB
    

    // Clear existing data
    // await Promise.all([
    //   Plan.deleteMany({}),
    //   User.deleteMany({}),
    //   Usage.deleteMany({})
    // ]);
    // console.log('Cleared existing data');

    // Insert seed data
    await Plan.insertMany(planSeeds);
    console.log('Seeded plans');

    await User.insertMany(userSeeds);
    console.log('Seeded users');

    await Usage.insertMany(usageSeeds);
    console.log('Seeded usage data');

    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
