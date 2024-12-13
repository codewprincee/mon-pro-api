import { Router } from 'express';
import { SeedController } from '../../controllers/v1/seed/Seed.controller';
import { UserRole } from '../../interfaces/role.interface';

const router = Router();
const seedController = new SeedController();

// Protect seeding with authentication and admin-only access
router.get(
    '/seed',

    seedController.seedDatabase
);

export default router;
