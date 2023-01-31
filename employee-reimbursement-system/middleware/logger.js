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

const loggingMiddleware = (req, res, next) => { // custom middleware
    // ex. GET request received at endpoint /reimbursements
    logger.info(`${req.method} request received at endpoint ${req.url}`)
    next(); // pass the req and res to the next middleware in the "stack"
}

module.exports = loggingMiddleware;