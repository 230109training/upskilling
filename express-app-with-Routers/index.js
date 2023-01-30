const express = require('express');
const bodyParser = require('body-parser');

// Router: a router is an object that functions as a place in which we can register routes
// We can then utilize this router by attaching it to our server (app object) as middleware
// This allows us to separate routes into different files, which enhances organization of our project
const helloWorldRouter = require('./routes/hello-world-routes');

const { logEachRequestMethodAndUrl } = require('./middleware/logging');

const app = express();

// When doing app.use, order does matter
// The middleware that is registered first will be the one that gets executed first when we traverse through the
// "middleware stack"
app.use(logEachRequestMethodAndUrl);
app.use(bodyParser.json());
app.use(helloWorldRouter); // register the Router

// Routes themselves are technically middleware
app.get('/', (req, res) => {
    res.send({
        message: "Hello from GET /",
        logMessage: req.logMessage
    });
})

app.listen(8080, () => {
    console.log('Listening on port 8080');
});