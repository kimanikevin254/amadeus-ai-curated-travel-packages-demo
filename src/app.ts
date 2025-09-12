import express from 'express';
import morgan from 'morgan';

const app = express();

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

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'API route not found' });
});

export default app;