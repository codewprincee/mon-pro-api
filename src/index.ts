import dotenv from 'dotenv';
import path from 'path';

// Load environment variables based on NODE_ENV
const environment = process.env.NODE_ENV || 'development';
dotenv.config({
    path: path.resolve(__dirname, `../.env.${environment}`)
});

// After loading env variables, import other modules
import createApp from './app';
import connectDB from './config/DbConn';

// Create and configure Express app
const app = createApp();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Server running in ${environment} mode on port ${port}`);
            console.log('Environment variables loaded from:', path.resolve(__dirname, `../.env.${environment}`));
            console.log('JWT Access Secret:', process.env.JWT_ACCESS_SECRET ? 'is set' : 'not set');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();