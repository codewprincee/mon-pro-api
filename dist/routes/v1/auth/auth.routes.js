"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth_controller_1 = require("../../../controllers/v1/auth/Auth.controller");
const auth_1 = require("../../../middleware/auth");
const router = express_1.default.Router();
const authController = new Auth_controller_1.AuthController();
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', auth_1.auth, authController.logout);
router.post('/refresh', authController.refreshToken);
exports.default = router;
