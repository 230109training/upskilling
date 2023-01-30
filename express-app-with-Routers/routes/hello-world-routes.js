const express = require('express');

const router = express.Router(); // Router object

router.get('/hello', (req, res) => {
    res.send({
        message: "Hello!",
        logMessage: req.logMessage
    });
});

router.get('/hi', (req, res) => {
    res.send({
        message: "Hi!",
        logMessage: req.logMessage
    });
});

module.exports = router;