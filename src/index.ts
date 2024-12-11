import dotenv from 'dotenv';
import path from 'path';
import createApp from './app';
import connectDB from './config/DbConn';

// Load environment variables based on NODE_ENV
const environment = process.env.NODE_ENV || 'development';
dotenv.config({
    path: path.resolve(__dirname, `../.env.${environment}`)
});

// Create and configure Express app
const app = createApp();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Server running in ${environment} mode on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();