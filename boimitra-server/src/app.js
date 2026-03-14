const express = require('express');
const cors = require('cors');

// Import routes
const routes = require('./routes');

// Import middlewares
const logger = require('./middlewares/logger.middleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Mount routes
app.use('/api', routes);

// Basic root path for sanity check
app.get('/', (req, res) => {
    res.send('Boimitra API is running...');
});

// Error handling middleware (Fallback)
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

module.exports = app;
