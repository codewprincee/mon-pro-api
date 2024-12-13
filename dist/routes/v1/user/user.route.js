"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../../middleware/auth");
const UserController_1 = require("../../../controllers/v1/user/UserController");
const router = express_1.default.Router();
// Get current user profile
router.get('/me', auth_1.auth, UserController_1.getMe);
// Delete user account
router.delete('/delete-account', auth_1.auth, UserController_1.deleteAccount);
exports.default = router;
