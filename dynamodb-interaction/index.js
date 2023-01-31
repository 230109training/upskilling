require('dotenv').config() // load the environment variables from .env
const AWS = require('aws-sdk');

/*
    By convention, AWS SDK will automatically look for the following environment variables
    1. AWS_ACCESS_KEY_ID
    2. AWS_SECRET_ACCESS_KEY
*/

AWS.config.update({
    region: 'us-east-1'
});
// DynamoDB client can be harder to work with and is more verbose
// const dynamoDBClient = new AWS.DynamoDB();

// DocumentClient provides an easier way to work with items
// The items will automatically be formatted in the way that we would expect a JS object to be formatted when we
// retrieve an item from a table
const documentClient = new AWS.DynamoDB.DocumentClient();

/*
    Promises

    Promises are often utilized when facilitating asynchronous operations

    An example of an asynchronous operation would be retrieving data from a database
        -> We don't really know exactly how long it will take for data to be retrieved from the database
        -> So until the data is retrieved, we want the rest of our code to be able to continue running
            without being blocked
        
    A promise is an object that has 3 different states
        1. pending: waiting for the asynchronous operation to complete
        2. rejected: operation failed, and we should get back the "error data"
        3. resolved: operation succeeded, and we should get back the "success data"
*/

/*
    Get Example
*/
// const params = {
//     TableName: 'grocery_items',
//     Key: {
//         grocery_item_id: 'abc123'
//     }
// }

// const promiseObject = documentClient.get(params).promise();

// Handling a promise
// When a promise resolves (success), we want it to execute the success callback function that takes the "success data"
//  as an input

// When we run this statement, we're not actually running the code in the callback functions, we're just 
// registering the appropriate callback functions to the promise
// promiseObject.then((data) => { // (data) => {} is the callback function that gets executed if the operation is successful
//     console.log(data); // { Item: {...} }
//     console.log(data.Item);
// }).catch((err) => { // (err) => {} is the callback function that gets executed if the operation is unsuccessful
//     console.error(err);
// });

// console.log('This code will run before the callback functions registered to the promise');

/*
    Put Example
*/
// const params2 = {
//     TableName: 'grocery_items',
//     Item: {
//         grocery_item_id: 'abc125',
//         name: 'banana',
//         quantity: 5,
//         price: 5.25
//     }
// }

// documentClient.put(params2).promise().then((data) => {
//     console.log(data); // {}
// }).catch((err) => {
//     console.error(err);
// });

/*
    Async-await

    Async await is used for dealing with promises in a sequential manner
*/
// app.get('/groceryitems/:id, async (req, res) => {
//      await <promise>
//})

// Ex. I want to add an item, and then use the get operation on the item
// documentClient.put({
//     TableName: 'grocery_items',
//     Item: {
//         grocery_item_id: 'testing123',
//         name: 'strawberry',
//         quantity: 1,
//         price: 10.52
//     }
// }).promise().then((data) => {

//     documentClient.get({
//         TableName: 'grocery_items',
//         Key: {
//             grocery_item_id: 'testing123'
//         }
//     }).promise().then((data) => {
//         console.log(data);
//     })

// });

// If you want to do asynchronous opeations sequentially, if you were to use .then(), you would need to nest each subsequent operation
// within the .thens, which gets really ugly
// JS world -> Callback hell (you are nesting callbacks inside of callbacks inside of callbacks)

// Better approach is to use async-await
// async: a keyword used to designate a function as an async function
// await: a keyword that can be only be used in async functions. It is used to extract the data from a successfully resolved
// promise (similar to .then())
async function myAsyncFunction() {
    console.log('Async function started');

    /*
        Put
    */
    const params = {
        TableName: 'grocery_items',
        Item: {
            grocery_item_id: 'testing123',
            name: 'strawberry',
            quantity: 1,
            price: 10.52
        }
    };

    // Await: Pause the function until the promise is done resolving (or rejecting)
    // When the function is paused, it will continue running other code outside of the async function
    // When all of that code is done running, then it will jump back into the async function when the promise
    // is resolved
    const data = await documentClient.put(params).promise();
    console.log(data); // {}

    /*
        Get
    */
    const params2 = {
        TableName: 'grocery_items',
        Key: {
            grocery_item_id: 'testing123'
        }
    }

    const data2 = await documentClient.get(params2).promise();
    console.log(data2.Item);


    /*
        Delete
    */
    const params3 = {
        TableName: 'grocery_items',
        Key: {
            grocery_item_id: 'testing123'
        }
    }

    const data3 = await documentClient.delete(params3).promise();
    console.log(data3); // {}

    /*
        Update: used to partially update some attributes for a single item
    */
    const params5 = {
        TableName: 'grocery_items',
        Key: {
            grocery_item_id: 'abc125'
        },
        UpdateExpression: 'set #p = :v',
        ExpressionAttributeNames: { // The purpose of using placeholders is to get around the problem of "reserved keywords"
            "#p": "price"
        },
        ExpressionAttributeValues: {
            ":v": 7.57
        }
    }

    await documentClient.update(params5).promise();

    /*
        Query: efficient O(1)
    */
    // Querying on a table
    const params6 = {
        TableName: 'notes',
        KeyConditionExpression: "#i = :val",
        ExpressionAttributeNames: {
            "#i": "user_id"
        },
        ExpressionAttributeValues: {
            ":val": "abc1"
        }
    }

    const data6 = await documentClient.query(params6).promise();
    console.log(data6);
    console.log(data6.Items);

    // Query on an index
    const params8 = {
        TableName: 'grocery_items',
        IndexName: 'category-index',
        KeyConditionExpression: "#i = :val",
        ExpressionAttributeNames: {
            "#i": "category"
        },
        ExpressionAttributeValues: {
            ":val": "meat" // If this were a "foreign key", then the "category" attribute belonging to the Global secondary
            // index can be queried
        }
    }

    let data8 = await documentClient.query(params8).promise();
    console.log(data8);

    /*
        Scan: inefficient O(n)
    */
    const params7 = {
        TableName: 'notes',
        FilterExpression: '#i = :val',
        ExpressionAttributeNames: {
            "#i": "user_id"
        },
        ExpressionAttributeValues: {
            ":val": "abc1"
        }
    }

    const data7 = await documentClient.scan(params7).promise();
    console.log(data7);
}

myAsyncFunction();
console.log('This will print first');
