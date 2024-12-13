"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const v1_1 = __importDefault(require("./routes/v1"));
const ApiError_1 = require("./utils/ApiError");
const error_1 = require("./middleware/error");
const createApp = () => {
    const app = (0, express_1.default)();
    const environment = process.env.NODE_ENV || 'development';
    // Security middleware
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: 'http://localhost:5173'
    }));
    app.use((0, compression_1.default)());
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true }));
    // Rate limiting
    // const limiter = rateLimit({
    //     windowMs: 15 * 60 * 1000, // 15 minutes
    //     max: 100 // limit each IP to 100 requests per windowMs
    // });
    // app.use(limiter);
    // Logging
    if (environment === 'production') {
        app.use((0, morgan_1.default)('combined'));
    }
    else if (environment !== 'test') {
        app.use((0, morgan_1.default)('dev'));
    }
    // API versioning routes
    const API_VERSION = {
        V1: '/api/v1',
        V2: '/api/v2'
    };
    // Mount versioned routes
    app.use(API_VERSION.V1, v1_1.default);
    // API version information route
    app.get('/api', (req, res) => {
        res.json({
            message: 'API Version Information',
            versions: {
                v1: {
                    status: 'active',
                    url: API_VERSION.V1
                }
            }
        });
    });
    // Base route
    app.get('/', (req, res) => {
        res.json({
            message: 'Welcome to the API',
            documentation: '/api'
        });
    });
    // Handle 404
    app.use((req, res, next) => {
        next(new ApiError_1.ApiError(404, 'Not found'));
    });
    // Convert error to ApiError, if needed
    app.use(error_1.errorConverter);
    // Handle error
    app.use(error_1.errorHandler);
    return app;
};
exports.default = createApp;
