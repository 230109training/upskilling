console.log('math.js is running');

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function isOdd(number) { // true/false
    return number % 2 == 1;
}

function isEven(number) { // true/false
    return number % 2 == 0;
}

// Longhand
// const myObj = {
//     "add": add,
//     "subtract": subtract,
//     "isOdd": isOdd,
//     "isEven": isEven
// }

// Shorthand
// const myObj = {
//     add, // The key is going to have the same name as the variable being used for the value
//     subtract, // "subtract": subtract
//     isOdd, // ...
//     isEven
// }

// module.exports is the object that is imported whenever over files use the require() function
// By default, module.exports is an empty object {}
module.exports = {
    add,
    subtract,
    isOdd,
    isEven
}