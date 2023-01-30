const AWS = require('aws-sdk');

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
    const params = {
        TableName: 'grocery_items',
        Item: {
            grocery_item_id: 'testing123',
            name: 'strawberry',
            quantity: 1,
            price: 10.52
        }
    };

    // Pause the function until the promise is done resolving (or rejecting)
    const data = await documentClient.put(params).promise();
    console.log(data); // {}

    const params2 = {
        TableName: 'grocery_items',
        Key: {
            grocery_item_id: 'testing123'
        }
    }

    const data2 = await documentClient.get(params2).promise();
    console.log(data2.Item);
}

myAsyncFunction();