const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

function createToken(username, role) {
    return jwt.sign({ "username": username, "role": role }, 'thisisthesecretpasswordusedtosignthetoken');
}

// function verifyTokenAndReturnPayload(token) {
//     return new Promise((resolve, reject) => {
//         jwt.verify(token, 'thisisthesecretpasswordusedtosignthetoken', (err, data) => {
//             if (data) {
//                 resolve(data); // resolve the promise w/ data
//             } else {
//                 reject(err); // reject the promise w/ error data
//             }
//         });
//     })
// }

function verifyTokenAndReturnPayload(token) {
    // Modify the jwt.verify function to return a promise instead of using a callback function (err, data) =>{} as the third argument
    // In order for Promise.promisify to modify a function to return a promise, the last argument
    // of the function being modified must be a callback function of the format (err, data) => {}
    jwt.verify = Promise.promisify(jwt.verify);

    return jwt.verify(token, 'thisisthesecretpasswordusedtosignthetoken');
}

module.exports = {
    createToken,
    verifyTokenAndReturnPayload
}