import '@dotenvx/dotenvx/config'
import app from './app';

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
    console.info(`App running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.info('SIGTERM received, shutting down gracefully.');

    server.close(() => {
        console.info('Process terminated');
    });
});

export default server;