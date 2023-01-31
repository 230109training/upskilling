const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1'
});

const documentClient = new AWS.DynamoDB.DocumentClient();

// Return a Promise that will resolve to the data being retrieved by the .get operation
function getUserByUsername(username) {
    const params = {
        TableName: 'users',
        Key: {
            "username": username,
        }
    }

    return documentClient.get(params).promise();
}

function addUser(username, password) {
    const params = {
        TableName: 'users',
        Item: {
            "username": username,
            "password": password,
            "role": "employee" // hardcoding the employee role
        },
        ConditionExpression: 'attribute_not_exists(#u)', // Make sure we're not replacing anyone that already exists
        ExpressionAttributeNames: {
            "#u": "username"
        }
    }

    return documentClient.put(params).promise();
}



module.exports = {
    getUserByUsername,
    addUser
}