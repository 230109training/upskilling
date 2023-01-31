const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1'
});

const documentClient = new AWS.DynamoDB.DocumentClient();

function getReimbursementById(id) {
    const params = {
        TableName: 'reimbursements',
        Key: {
            "reimbursement_id": id
        }
    }

    return documentClient.get(params).promise();
}

function getAllReimbursementsByUser(submitter) {
    const params = {
        TableName: 'reimbursements',
        IndexName: 'submitter-index',
        KeyConditionExpression: '#s = :val',
        ExpressionAttributeNames: {
            "#s": "submitter"
        },
        ExpressionAttributeValues: {
            ":val": submitter
        }
    }

    return documentClient.query(params).promise();
}

function getPendingReimbursementsByUser(submitter) {
    const params = {
        TableName: 'reimbursements',
        IndexName: 'submitter-index',
        KeyConditionExpression: '#s = :val',
        FilterExpression: "#st = :stval",
        ExpressionAttributeNames: {
            "#s": "submitter",
            "#st": "status"
        },
        ExpressionAttributeValues: {
            ":val": submitter,
            ":stval": "pending"
        },
        
    }

    return documentClient.query(params).promise();
}

function getApprovedReimbursementsByUser(submitter) {
    const params = {
        TableName: 'reimbursements',
        IndexName: 'submitter-index',
        KeyConditionExpression: '#s = :val',
        FilterExpression: "#st = :stval",
        ExpressionAttributeNames: {
            "#s": "submitter",
            "#st": "status"
        },
        ExpressionAttributeValues: {
            ":val": submitter,
            ":stval": "approved"
        },
        
    }

    return documentClient.query(params).promise();
}

function getDeniedReimbursementsByUser(submitter) {
    const params = {
        TableName: 'reimbursements',
        IndexName: 'submitter-index',
        KeyConditionExpression: '#s = :val',
        FilterExpression: "#st = :stval",
        ExpressionAttributeNames: {
            "#s": "submitter",
            "#st": "status"
        },
        ExpressionAttributeValues: {
            ":val": submitter,
            ":stval": "denied"
        },
        
    }

    return documentClient.query(params).promise();
}

// Caveat. In real life, 1 scan operation is limited to 1MB of data. So if you have more than 1MB of data in your table,
// you would need to utilize some more advanced code to loop through many different scan operations
function getAllReimbursements() {
    const params = {
        TableName: 'reimbursements'
    }

    return documentClient.scan(params).promise();
}

function getAllPendingReimbursements() {
    const params = {
        TableName: 'reimbursements',
        FilterExpression: "#st = :stval",
        ExpressionAttributeNames: {
            "#st": "status"
        },
        ExpressionAttributeValues: {
            ":stval": "pending"
        }
    }

    return documentClient.scan(params).promise();
}

function getAllApprovedReimbursements() {
    const params = {
        TableName: 'reimbursements',
        FilterExpression: "#st = :stval",
        ExpressionAttributeNames: {
            "#st": "status"
        },
        ExpressionAttributeValues: {
            ":stval": "approved"
        }
    }

    return documentClient.scan(params).promise();
}

function getAllDeniedReimbursements() {
    const params = {
        TableName: 'reimbursements',
        FilterExpression: "#st = :stval",
        ExpressionAttributeNames: {
            "#st": "status"
        },
        ExpressionAttributeValues: {
            ":stval": "denied"
        }
    }

    return documentClient.scan(params).promise();
}

function createReimbursement(amount, description, submitter) {
    const params = {
        TableName: 'reimbursements',
        Item: {
            "reimbursement_id": uuid.v4(), // autogenerate id using UUIDv4
            "amount": amount,
            "description": description,
            "submitter": submitter,
            "status": "pending"
        }
    }

    return documentClient.put(params).promise();
}

function updateReimbursementStatus(reimbursement_id, status) {
    const params = {
        TableName: 'reimbursements',
        Key: {
            "reimbursement_id": reimbursement_id
        },
        UpdateExpression: "set #s = :val",
        ExpressionAttributeNames: {
            "#s": "status"
        },
        ExpressionAttributeValues: {
            ":val": status
        }
    }

    return documentClient.update(params).promise();
}

module.exports = {
    getAllReimbursementsByUser,
    getApprovedReimbursementsByUser,
    getDeniedReimbursementsByUser,
    getPendingReimbursementsByUser,
    getAllReimbursements,
    getAllApprovedReimbursements,
    getAllDeniedReimbursements,
    getAllPendingReimbursements,
    createReimbursement,
    updateReimbursementStatus,
    getReimbursementById
}