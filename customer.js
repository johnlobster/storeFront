// app for customer use - buy things from storefront

const mysql = require("mysql");
const inquirer = require("inquirer");
const sprintf = require("sprintf-js").sprintf;
const chalk = require("chalk");
require("dotenv").config();


const common = require("./common-functions");

// global variables

// functions

promiseQuery = function (queryString, queryArgs) {
    return new Promise ( (resolve, reject) => {
        if (! queryArgs) {
            queryArgs = [];
        }
        connection.query(queryString, queryArgs, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

promiseInquire = function (prompt) {
    return new Promise ( (resolve, reject) => {
        inquirer.prompt(prompt).then( (answers) => {
            resolve(answers);
        });
    });
}

function customerInput() {
    // variables have to be in function scope because no longer passing through callback chain
    let itemId = 0;
    let itemName = "";
    let inquirerPrompt = [];
    let queryResult = {};
    let quantity = 0;
    // create a list of items for customer to select 
    let mysqlPrompt = "SELECT id,productName,price FROM products";
    promiseQuery(mysqlPrompt,[])
    .then( (res) => {
        // print out table of items
        console.log("\nItems for sale\n");
        const lineString = common.underline(42,5);
        const printString = "     | %4s | %-20s | %8s |";
        console.log(lineString);
        console.log(sprintf(printString, "id", "Description", "price"));
        console.log(lineString);
        for ( let i = 0 ; i < res.length ; i++) {
            console.log(sprintf(printString, 
                parseInt(res[i].id), 
                res[i].productName, 
                parseFloat(res[i].price).toFixed(2)));
        } 
        console.log(lineString + "\n");
        queryResult = res;
        // prompt user to choose an item - restricts numbers through "validate"
        inquirerPrompt = [
            {
                type: "input",
                name: 'itemId',
                message: "What is the id of the item you want (1-" + res.length + ") (q to exit) ?",
                validate: (val) => ((parseInt(val) > 0) && (parseInt(val) <= res.length)) || (val.toLowerCase() === "q")
            }  
        ];
        return promiseInquire(inquirerPrompt)
    })
    .then( (answers) => {
        // check for quit
        if (answers.itemId.toLowerCase() === "q") {
            common.cleanExit(connection, "Exiting customer app");
        } 
        // save answers before next question
        itemName = queryResult[answers.itemId - 1].productName;
        itemId = answers.itemId;
        // didn't quit so find out how many the customer wants
        inquirerPrompt = [
            {
                type: "input",
                name: "quantity",
                message: "How many " + itemName + " do you want ?",
                validate: (val) => parseInt(val) > 0
            }
        ];
        return promiseInquire(inquirerPrompt);
    }
    )
    .then( (answers) => {
        quantity = answers.quantity;
        mysqlPrompt = "SELECT stock, salesValue, price FROM products WHERE id=" + itemId + " LIMIT 1";
        // check stock
        return promiseQuery(mysqlPrompt, []);
    })
    .then( (res) => {
        if ( parseInt(res[0].stock) > parseInt(quantity)){
            let newStock = parseInt(res[0].stock) - parseInt(quantity);
            let newSalesValue = parseFloat(res[0].salesValue) + (parseInt(quantity)* parseFloat(res[0].price));
            // update stock information and add to salesValue
            mysqlPrompt = "UPDATE products SET stock=" + newStock + 
            ", salesValue=" + newSalesValue +
            " WHERE id=" + itemId; 
            promiseQuery(mysqlPrompt,[])
            .then( (res) => {
                console.log("\nPurchase was succesful");
                console.log("You bought " + quantity + " " + itemName);
            })
            .catch( (err) => {
                throw err;
            });    
        }
        else {
            console.log();
            console.log(chalk.red("Not enough of item " + itemId + " (" + itemName +") in stock"));
            console.log(chalk.red("Alter quantity or try another item\n"));
        }
    })
    .then( () => customerInput())
    // if any prommise in chain fails, catch it here
    .catch( (err) => {
    });

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////

// Main program starts

// console.log(common.connection);


// connect to the database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: String(process.env.MYSQL_PASSWORD),
    database: "bamazon_DB"
});

connection.connect((err) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    customerInput();
});