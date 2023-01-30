// In the express package,
// module.exports = express;
// where express is a function
// function express() {}

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser'); // body-parser is a dependency included as part of installing express

const app = express(); // express() returns an object that represents the server itself

// This middleware takes the request body, parses it from JSON into a JavaScript object, and attaches that JS
// object to the .body property of the req object
// JSON String -> JS object -> req.body = <JS object>
app.use(bodyParser.json()); // bodyParser.json() is what is known as "middleware". "Middleware" refers to a function
// with the format of (req, res, next) => {} that sits between the route. It intercepts the req and res objects
// before the req and res objects get passed to the next middleware or the route itself

/*
    Types of middleware
    1. Global middleware
        - This middleware applies to every endpoint
        - app.use(bodyParser.json())
    2. URL specific middleware
        - This middleware will apply to any endpoint with the URL /reimbursements
        - app.use(['/reimbursements', '/users'], <middleware>)
    3. Endpoint specific middleware
        - This middleware is specific to this particular endpoint
        - app.post('/test', <middleware>, (req, res) => {})
*/

// HTTP Request
// URL
//  1. query parameters (?status=pending&count=10) <- status + count
//  2. path parameters (/users/10) <- 10
// Method
//  1. GET
//  2. POST
//  3. PUT
//  4. PATCH
//  5. DELETE
// Body
//  - JSON
// Headers
//  - Key-value pairs

// This is a route, and (req, res) => {} is a "route handler"
app.get('/test', (req, res) => {
    res.send('Hello world!');
});

// Path parameters
app.get('/users/:mypathparameter', (req, res) => {
    // Send object w/ message property in the response body
    res.send({
        message: `The path parameter that was passed in has a value of ${req.params.mypathparameter}`
    });
});

// GET /reimbursements
// GET /reimbursements?status=pending
// GET /reimbursements?status=pending&count=10
// GET /reimbursements?count=10
app.get('/reimbursements', (req, res) => {

    // Falsy and truthy values
    // Falsy values
    //  0 falsy
    //  '' falsy
    //  undefined falsy
    //  null falsy
    //  NaN falsy
    //  false falsy
    if (req.query.status && req.query.count) {
        res.send({
            "message": `Both status and count were provided. status=${req.query.status} and count=${req.query.count}`
        })
    } else if (req.query.status) {
        res.send({
            "message": `Only status was provided. status=${req.query.status}`
        })
    } else if (req.query.count) {
        res.send({
            "message": `Only count was provided. count=${req.query.count}`
        })
    } else {
        res.send({
            "message": "Neither status or count were provided"
        });
    }
});

// Hypothetically, this endpoint might be protected using JSON Web Tokens
// Let's grab the JWT from the Authorization header
app.post('/reimbursements', (req, res) => {
    const authHeader = req.headers.authorization; // "Bearer tokenvalue"
    const token = authHeader.split(" ")[1];

    console.log(req.body); // { amount: 12.75, description: 'This reimbursement request is for the team building lunch' }

    res.send({
        "message": `Token that was sent has value of ${token}`
    })
});

// GET /testing1, GET /testing2
app.get(['/testing1', '/testing2'], (req, res) => {
    res.send({
        "message": "Hello there!"
    });
})


app.listen(8080, () => {
    console.log('Server listening on port 8080');
}); // app.listen will begin to start up the server, but not finish before moving on to execute other code
// when the server is fully finished starting up and is available to process incoming connections, then it will invoke
// the callback function passed into it. 

console.log('This runs before the callback function\'s console.log');

// Node.js revolves around the idea of asynchronous JS
// Asynchronous refers to the ability to execute code that does not block other code from running
// This is an advantage with operations that take a long time to complete, such as reading large files,
// etc.
// Callback functions are a common way to facilitate asynchronous JS. It allows us to execute callback functions
// that only run whenever the long running operation is done. This allows us to run other code in our application
// in the meantime