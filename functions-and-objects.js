// 3 different types
// 1. Named functions
// 2. Anonymous functions: no-name
// 3. Arrow functions: no-name

// Hoisted
function add(a, b) {
    return a + b;
}

// These two functions will NOT be hoisted
const subtract = function(a, b) {
    return a - b;
}

const multiply = (a, b) => {
    return a * b;
}

// In JavaScript, functions are considered "first-class citizens"
// It is something that can be returned from a function, passed as an argument into a function,
// and assigned to a variable
// A function in JS is an object

console.log(add(1, 2))
console.log(subtract(10, 2))
console.log(multiply(4, 9))

/*  
    In memory for the example here, we have 1 single function object
    
    Both person1 and person2 are referring to this single function object

    person1.greet -----------------> function object
    person2.greet ---------------------^^^
*/
const person1 = {
    firstName: "Bach",
    lastName: "Tran",
    age: 25,
    greet: function() {
        console.log(`Hi, my name is ${this.firstName} ${this.lastName} and my age is ${this.age}`);
    }
}

const person2 = {
    firstName: "John",
    lastName: "Doe",
    age: 30
}

person1.greet();

person2.greet = person1.greet;
person2.greet(); // For both named and anonymous functions, the "this" keyword inside the function is based off
// of the object that is invoking that function

/*
    Arrow functions

    Biggest difference between arrow functions and (named + anonymous functions) is in how arrow functions
    treat the "this" keyword

    The "this" keyword for arrow functions does not come from the object that is invoking that function, it comes
    from the scope in which that arrow function was defined
*/

const a = this; // {} The global "this" object is an empty object

const anArrowFunction = () => { // The arrow function here gets its "this" from the global scope
    console.log(this == a);
}

anArrowFunction();

const person3 = {
    firstName: "Bach",
    lastName: "Tran",
    age: 25,
    greet: () => { // The arrow function here gets its "this" from the global scope
        console.log(this == a); // true
        console.log(`Hi, my name is ${this.firstName} ${this.lastName} and my age is ${this.age}`);
    }
}

person3.greet();

const person4 = {
    firstName: "Bach",
    lastName: "Tran",
    age: 25,
    greet: function() {

        const a = this; // person4
        console.log(this); // {firstName: 'Bach',lastName: 'Tran',age: 25,greet: [Function: greet]}

        const arrowFunction = () => { // The arrow function here gets its "this" from the function scope
            console.log(this == a); // true
            console.log(`Hi, my name is ${this.firstName} ${this.lastName} and my age is ${this.age}`);
        }

        arrowFunction();

    }
}

person4.greet();

console.log(person4);

/*

    Objects
    
    Ways of creating
    1. Object literals {}
    2. Function constructors
    3. Classes

*/

const myObj = {};
// Unlike in Java, we can continue to add additional properties to an object during runtime
myObj.property1 = 'testing';
myObj.property2 = 'testing123';

console.log(myObj); // { property1: 'testing', property2: 'testing123' }

// Function constructors
// -> Old way of defining "blueprints" for creating objects that share the same set of properties
function Person(firstName, lastName, age) { // Naming convention is to capitalize the first letter of a function constructor
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;

    // Wrong way of defining functions for function constructor based objects
    // Because each object being created will have its own instance of a function
    // -> Waste of memory
    // this.greet = function() {
    //     console.log(`Hi, my name is ${this.firstName} ${this.lastName} and my age is ${this.age}`);
    // }

    // The right approach would be to define the greet function in one location, and have every object
    // inherit that single function instance
}

// Specifically for function constructors: prototype property
// Person.prototype is an object nested within the Person object (function) that contains properties
// that every object constructed from the function constructor will inherit

// We are adding the "greet" property to the prototype object
Person.prototype.greet = function() {
    console.log(`Hi, my name is ${this.firstName} ${this.lastName} and my age is ${this.age}`);
}

// Both of the objects below are inheriting the greet property inside of the .prototype object
const person5 = new Person('Jane', 'Doe', 40); // The new keyword creates an empty object {} that is then assumed
// within the constructor function as the "this" keyword
const person6 = new Person('David', 'Rodriguez', 30);

person5.greet();
person6.greet();

// (double underscore) __proto__ (double underscore)
// __proto__ is a special property that every object in JS has
// whatever __proto__ is set to, is the object that the object is inheriting from

console.log(person5.__proto__ == Person.prototype); // true
// -> person5 is inheriting from Person.prototype

console.log(Object.getOwnPropertyNames(Person));
console.log(Person.prototype);
console.log(person5.__proto__); // { greet: [Function (anonymous)] }

console.log(Object.getOwnPropertyNames(person5));
console.log(person5);

// Using __proto__ on object literal based objects
const mySharedPersonFunctions = {
    greet: function() {
        console.log(`Hi, my name is ${this.firstName} ${this.lastName} and my age is ${this.age}`);
    },
    increaseAgeByOne: function() {
        this.age = this.age + 1
    }
}

const p1 = {
    firstName: "John",
    lastName: "Doe",
    age: 20
};

const p2 = {
    firstName: "Jane",
    lastName: "Doe",
    age: 30
};

// Have p1 and p2 inherit the mySharedPersonFunctions object
p1.__proto__ = mySharedPersonFunctions;
p2.__proto__ = mySharedPersonFunctions;

p1.greet();
p1.increaseAgeByOne();
p1.greet();

p2.greet();
p2.increaseAgeByOne();
p2.greet();

// Object.create
// MDN web docs:
// The Object.create() static method creates a new object, 
// using an existing object as the prototype of the newly created object.
const p3 = Object.create(mySharedPersonFunctions, { 
    firstName: {
        value: "Test",
        writable: true,
        configurable: true
    }, 
    lastName: {
        value: "123",
        writable: true,
        configurable: true
    }, 
    age: {
        value: 19,
        writable: true,
        configurable: true
    }
});

console.log(p3.__proto__ == mySharedPersonFunctions);
p3.greet();

p3.firstName = 'dfsdf';
p3.greet();

/*
    Classes were added in ES6
    
    Classes essentially replaced function constructors as the standard way to create "blueprints"
*/

// "Classes are basically syntactic sugar for function constructors"
// Common statement that is made, but not exactly the case
class Car {
    constructor(make, model, year) {
        this.make = make;
        this.model = model;
        this.year = year;
    }

    drive() {
        console.log(`Driving the ${this.year} ${this.make} ${this.model}`)
    }
}

const car1 = new Car("Ford", "Mustang", 2018);
car1.drive();

console.log(Car);

/*
    JSON.stringify(): takes an object and turn it into a JSON string
    JSON.parse(): take a JSON string and turn it into an object
*/

const JSONString = '{ "firstName": "Bach", "lastName": "Tran", "age": 25 }'
console.log(JSON.parse(JSONString));

console.log(JSON.stringify(car1));