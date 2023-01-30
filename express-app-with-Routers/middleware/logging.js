const winston = require('winston');

const logger = winston.createLogger({
    level: 'info', // log info level log messages and more severe (info, warn, error)
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'mymessages.log'
        })
    ]
});

function logEachRequestMethodAndUrl(req, res, next) {
    // Output info level message to the logger
    logger.info(`${req.method} request to ${req.url} received`);

    req.logMessage = `${req.method} request to ${req.url} received`;

    next(); // Pass the req and res objects to the next middleware in the "stack" (bodyParser.json middleware)
}

module.exports = {
    logEachRequestMethodAndUrl
}