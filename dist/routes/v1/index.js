"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
const user_route_1 = __importDefault(require("./user/user.route"));
const plan_routes_1 = __importDefault(require("./plans/plan.routes"));
const seed_route_1 = __importDefault(require("./seed.route"));
const monitor_route_1 = __importDefault(require("./monitor/monitor.route"));
const router = (0, express_1.Router)();
// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
// Mount routes
router.use('/auth', auth_routes_1.default);
router.use('/users', user_route_1.default);
router.use('/admin', seed_route_1.default);
router.use('/plans', plan_routes_1.default);
router.use('/monitor', monitor_route_1.default);
exports.default = router;
