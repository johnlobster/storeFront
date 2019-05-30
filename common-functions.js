// common functions and objects for storefront

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



// console.log(connection);

module.exports.underline = underline;