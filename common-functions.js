// common functions and objects for storefront

const mysql = require("mysql");

// produce a string that will underline in a table with count number of _
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

function cleanExit(connection, message) {
    if (message) {
        console.log(message);
    }
    console.log("\nexiting customer app\n");
    // close DB connection
    connection.end();
    process.exit();
}



// console.log(connection);

module.exports.underline = underline;
module.exports.cleanExit = cleanExit;