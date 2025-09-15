import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import packageRoutes from './routes/packages.routes';
import citySearchRoutes from './routes/city-search.routes';
import { logger } from './utils/logger';

const app = express();

app.use(cors())

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('short', { stream: { write: message => console.info(message.trim()) }}));

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// API routes
app.use('/api/city-search', citySearchRoutes);
app.use('/api/packages', packageRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'API route not found' });
});

// Error handling
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('Unhandled error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

export default app;