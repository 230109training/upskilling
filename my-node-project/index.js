// Importing in Node.js
// require()

// // Local import
// const { add, subtract, isOdd, isEven } = require('./math'); // we don't need to include the .js extension for math.js

// // Node module (global) import
// const fs = require('fs'); // fs is a built-in Node module

// // Think of index.js kind of like the "main" method in Java
// // It is conventionally the entrypoint to the application
// console.log(add(1, 2));
// console.log(subtract(10, 2));
// console.log(isOdd(5));
// console.log(isEven(5));

// fs.writeFileSync('./myfile.txt', 'Hello there!', 'utf-8');

// const contents = fs.readFileSync('./myfile.txt', 'utf-8');
// console.log(contents);

// Use HTTP on a "low-level" basis with Node out of the box
const http = require('http');
const { test, endpointNotFound } = require('./endpoint-handlers');

const server = http.createServer(function (req, res) {
    if (req.method === 'GET' && req.url === '/test') {
        test(req, res);
    } else {
        endpointNotFound(req, res);
    }
});

server.listen(8080, () => {
    console.log('Listening on port 8080');
})
