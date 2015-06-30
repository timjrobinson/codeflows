var library = require("./library");

var randomNumberFunctionName = "getRandomNumber"; // Dynamic function names are the best function names
var superSecretRandomSalt = library[randomNumberFunctionName]();

console.log("Super secret random salt is: " + superSecretRandomSalt);