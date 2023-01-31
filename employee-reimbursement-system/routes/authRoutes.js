const express = require('express');
const userDao = require('../dao/userDao');
const jwtUtil = require('../utility/jwt-utility');

const router = express.Router();

// If user provides correct username + password, send back a JSON Web Token (JWT) containing the username + role
// of the user
// The user will keep the JSON Web Token, and send it on any request that requires them to be logged in
// The backend will receive the token and verify whether or not that token was issued by the backend
// If it was, it will extract the information (username + role) from the token to see if the user is authorized to perform
// some action
router.post('/login', async (req, res) => {
    try {
        const suppliedUsername = req.body.username;
        const suppliedPassword = req.body.password;

        const data = await userDao.getUserByUsername(suppliedUsername);
        const userObj = data.Item; // if undefined, it means there is no user item with the given username

        if (userObj) { // Is userObj defined or undefined?
            if (userObj.password === suppliedPassword) {
                const token = jwtUtil.createToken(userObj.username, userObj.role);
                // Creating a token that contains the username and role as the payload

                res.send({
                    "token": token,
                    "message": "Successful Login!"
                })
            } else {
                res.statusCode = 400;
                res.send({
                    "message": "Invalid password!"
                })
            }
        } else {
            res.statusCode = 400;
            res.send({
                "message": "Invalid username!"
            })
        }
    } catch(err) {
        res.statusCode = 500; // internal server error
        res.send({
            "message": err.message
        })
    }
});

router.post('/users', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        // const { Item } = await userDao.getUserByUsername(username);

        // if (Item) {
        //     res.send({
        //         "message": `User with username ${username} already exists`
        //     });
        // } else {
            await userDao.addUser(username, password);

            res.send({
                "message": "Successfully registered"
            });
        // }
    } catch (err) {
        res.statusCode = 500;
        res.send({
            "message": err.message
        });
    }
});

module.exports = router;