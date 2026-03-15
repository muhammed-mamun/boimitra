/**
 * Logger middleware to log request details and execution duration
 */
const logger = (req, res, next) => {
    const start = Date.now();

    // Log when the request is initially received
    console.log(`[${new Date().toISOString()}] STARTED ${req.method} ${req.originalUrl}`);

    // Wait for the response to finish sending to the client
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] FINISHED ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | Duration: ${duration}ms`);
    });

    next();
};

module.exports = logger;
