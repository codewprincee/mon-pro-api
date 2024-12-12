import express from 'express';
import { AuthController } from '../../../controllers/v1/auth/Auth.controller';
import { auth } from '../../../middleware/auth';

const router = express.Router();
const authController = new AuthController();

router.post('/register',
    authController.register
);

router.post('/login',
    authController.login
);

router.post('/logout',
    auth,
    authController.logout
);

router.post('/refresh',
    authController.refreshToken
);

export default router;