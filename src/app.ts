import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import v1Routes from './routes/v1';
import { ApiError } from './utils/ApiError';
import { ApiResponse } from './utils/ApiResponse';
import { errorConverter, errorHandler } from './middleware/error';
import { swaggerSpec } from './config/swagger';
import basicAuth from 'express-basic-auth';

const createApp = (): Express => {
    const app: Express = express();
    const environment = process.env.NODE_ENV || 'development';

    // Security middleware
    app.use(helmet());
    app.use(cors(
        {
            origin: 'http://localhost:5173'
        }
    ));
    app.use(compression());
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));

    // Rate limiting
    // const limiter = rateLimit({
    //     windowMs: 15 * 60 * 1000, // 15 minutes
    //     max: 100 // limit each IP to 100 requests per windowMs
    // });
    // app.use(limiter);

    // Logging
    if (environment === 'production') {
        app.use(morgan('combined'));
    } else if (environment !== 'test') {
        app.use(morgan('dev'));
    }

    // API versioning routes
    const API_VERSION = {
        V1: '/api/v1',
        V2: '/api/v2'
    };

    // Mount versioned routes
    app.use(API_VERSION.V1, v1Routes);

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

    // Swagger documentation with password protection
    if (environment === 'development') {
        app.use('/docs', basicAuth({
            users: { 'admin': 'password' },
            challenge: true,
        }), swaggerUi.serve);
        app.get('/docs', swaggerUi.setup(swaggerSpec, {
            explorer: true,
            customCss: '.swagger-ui .topbar { display: none }',
        }));

        // Endpoint to get swagger.json (also protected)
        app.get('/swagger.json', basicAuth({
            users: { 'admin': 'password' },
            challenge: true,
        }), (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(swaggerSpec);
        });
    }

    // Handle 404
    app.use((req, res, next) => {
        next(new ApiError(404, 'Not found'));
    });

    // Convert error to ApiError, if needed
    app.use(errorConverter);

    // Handle error
    app.use(errorHandler);

    return app;
};

export default createApp;