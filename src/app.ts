import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import v1Routes from './routes/v1';
import { ApiError } from './utils/ApiError';
import { ApiResponse } from './utils/ApiResponse';

const createApp = (): Express => {
    const app: Express = express();
    const environment = process.env.NODE_ENV || 'development';

    // Security middleware
    app.use(helmet());
    app.use(cors(
        {
            origin: '*'
        }
    ));
    app.use(compression());
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));

    // Rate limiting
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
    });
    app.use(limiter);

    // Logging
    if (environment === 'production') {
        app.use(morgan('combined'));
    } else {
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

    // Error handling middleware
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error(err.stack);
        
        const statusCode = err instanceof ApiError ? err.statusCode : 500;
        const message = err instanceof ApiError ? err.message : 'Internal Server Error';
        const errorMessage = environment === 'development' 
            ? `${message}\n${err.stack}`
            : message;
        
        return ApiResponse.error(
            res,
            errorMessage,
            statusCode
        );
    });

    return app;
};

export default createApp;