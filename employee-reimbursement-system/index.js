require('dotenv').config(); // load environment variables for AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY from .env file
const express = require('express');
const bodyParser = require('body-parser');

const authRouter = require('./routes/authRoutes');
const reimbursementsRouter = require('./routes/reimbursementRoutes');

const loggingMiddleware = require('./middleware/logger');

const app = express();
app.use(loggingMiddleware);
app.use(bodyParser.json()); // Use body parser middleware to convert JSON request body into an object in req.body

// Registering the routers
app.use(authRouter);
app.use('/reimbursements', reimbursementsRouter);

app.listen(8080, () => {
    console.log('Listening on port 8080');
});