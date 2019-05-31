// common functions and objects for storefront

const mysql = require("mysql");
const chalk = require("chalk");

// produce a string that will underline in a table with count number of -
function underline (count, leadingSpaces) {
    result = "";
    for (let i = 0; i < leadingSpaces; i++) {
        result += " ";
    }
    for (let i=0 ; i < count; i++) {
        result += "-";
    }
    return result;
}

// clean exit from node, closes connection and prints out a message
function cleanExit(connection, message) {
    if (message) {
        console.log("\n" + message + "\n");
    }
    // close DB connection
    connection.end();
    process.exit();
}


// console.log(connection);

module.exports.underline = underline;
module.exports.cleanExit = cleanExit;
