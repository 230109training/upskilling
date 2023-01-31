const express = require('express');

const router = express.Router();
const jwtUtil = require('../utility/jwt-utility');
const reimbDao = require('../dao/reimbursementDao');

// GET /reimbursements
router.get('/', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
    
        // Payload contains username and role
        const payload = await jwtUtil.verifyTokenAndReturnPayload(token);

        // employee or finance_manager
        if (payload.role === 'employee') {
            if (req.query.status) {
                if (req.query.status === 'pending') {
                    const { Items } = await reimbDao.getPendingReimbursementsByUser(payload.username)
                    res.send(Items);
                } else if (req.query.status === 'approved') {
                    const { Items } = await reimbDao.getApprovedReimbursementsByUser(payload.username)
                    res.send(Items);
                } else if (req.query.status === 'denied') {
                    const { Items } = await reimbDao.getDeniedReimbursementsByUser(payload.username)
                    res.send(Items);
                } else {
                    res.send({
                        "message": "Invalid value for status query parameter"
                    })
                }
            } else {
                const { Items } = await reimbDao.getAllReimbursementsByUser(payload.username) // pending, approved, denied
                res.send(Items);
            }
        } else if (payload.role === 'finance_manager') {
            if (req.query.status) {
                if (req.query.status === 'pending') {
                    const { Items } = await reimbDao.getAllPendingReimbursements();
                    res.send(Items);
                } else if (req.query.status === 'approved') {
                    const { Items } = await reimbDao.getAllApprovedReimbursements();
                    res.send(Items);
                } else if (req.query.status === 'denied') {
                    const { Items } = await reimbDao.getAllDeniedReimbursements();
                    res.send(Items);
                } else {
                    res.send({
                        "message": "Invalid value for status query parameter"
                    })
                }
            } else {
                const { Items } = await reimbDao.getAllReimbursements(); // pending, approved, denied
                res.send(Items);
            }
        } else {
            res.statusCode = 400;
            res.send({
                "message": "Not of role employee or finance_manager"
            });
        }
    } catch(err) {
        res.statusCode = 500;
        res.send({
            "message": err.message
        });
    }
});

// POST /reimbursements 
router.post('/', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
    
        // Payload contains username and role
        const payload = await jwtUtil.verifyTokenAndReturnPayload(token);

        if (payload.role === 'employee') {
            const amount = req.body.amount;
            const description = req.body.description;

            await reimbDao.createReimbursement(amount, description, payload.username);

            res.statusCode = 201; // 201 created
            res.send({
                "message": "Reimbursement submitted!"
            })
        } else {
            res.statusCode = 401; // 401 unauthorized
            res.send({
                "message": "Role is not 'employee'"
            });
        }
    } catch(err) {
        res.statusCode = 500;
        res.send({
            "message": err.message
        });
    }
});

// PATCH /reimbursements/:id/status
router.patch('/:id/status', async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    
    // Payload contains username and role
    const payload = await jwtUtil.verifyTokenAndReturnPayload(token);

    if (payload.role === 'finance_manager') {
        // Note: reimbursements must already exist to be updated AND the reimbursement must be pending
        // Make sure to retrieve the reimbursement and check for these conditions before proceeding
        const { Item } = await reimbDao.getReimbursementById(req.params.id);
        if (Item) { // if Item is defined
            if (Item.status === 'pending') {
                if (req.body.status === 'approved' || req.body.status === 'denied') {
                    reimbDao.updateReimbursementStatus(req.params.id, req.body.status);

                    res.send({
                        "message": "Status of reimbursement updated successfully!"
                    });
                } else {
                    res.statusCode = 400;
                    res.send({
                        "message": "Status is invalid"
                    })
                }
            } else {
                res.statusCode = 400;
                res.send({
                    "message": "Cannot update reimbursement status that is not pending"
                });
            }
        } else {
            res.statusCode = 404; // 404 not found
            res.send({
                "message": `Reimbursement with id ${req.params.id} does not exist`
            })
        }
    } else {
        res.statusCode = 401;
        res.send({
            "message": "Must be finance_manager to update reimbursement status"
        });
    }
});

module.exports = router;