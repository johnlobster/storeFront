// app for customer use - buy things from storefront

const mysql = require("mysql");
const inquirer = require("inquirer");
const sprintf = require("sprintf-js").sprintf;
const chalk = require("chalk");
require("dotenv").config();


const common = require("./common-functions");

// global variables

// functions

function customerInput() {
    // create a list of items for customer to select 
    var query = connection.query("SELECT id,productName,price FROM products", (err, res) => {
        if (err) throw err;
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
        // prompt user to choose an item - restricts numbers through "validate"
        inquirer.prompt([
            {
                type: "input",
                name: 'itemId',
                message: "What is the id of the item you want (1-" + res.length + ") (q to exit) ?",
                validate: (val) => ((parseInt(val) > 0) && (parseInt(val) <= res.length)) || (val.toLowerCase() === "q") 
            }  
        ]).then( (answers) => {
            // check for quit
            if (answers.itemId.toLowerCase() === "q") {
                common.cleanExit(connection, "Exiting customer app");
            } 
            let itemName = res[answers.itemId - 1].productName;
            let itemId = answers.itemId;
            // didn't quit so find out how many the customer wants
            inquirer.prompt([
                {
                    type: "input",
                    name: "quantity",
                    message: "How many do you want ?",
                    validate: (val) => parseInt(val) > 0
                }
            ]).then ( (answers) => {
                // callback with user responses
                // check stock
                var query = connection.query("SELECT stock, salesValue, price FROM products WHERE id=" + itemId + " LIMIT 1", (err, res) => {
                    if (err) throw err;
                    if ( parseInt(res[0].stock) > parseInt(answers.quantity)){
                        let newStock = parseInt(res[0].stock) - parseInt(answers.quantity);
                        let newSalesValue = parseFloat(res[0].salesValue) + (parseInt(answers.quantity)* parseFloat(res[0].price));
                        // update stock information and add to salesValue
                        var query = connection.query("UPDATE products SET stock=" + newStock + 
                        ", salesValue=" + newSalesValue +
                        " WHERE id=" + itemId, 
                            (err, res) => {
                                if (err) throw err;
                                console.log("\nPurchase was succesful");
                                console.log("You bought " + answers.quantity + " " + itemName);
                                customerInput();
                            });
                            

                    }
                    else {
                        console.log();
                        console.log(chalk.red("Not enough of item " + answers.itemId + " (" + itemName +") in stock"));
                        console.log(chalk.red("Alter quantity or try another item\n"));
                        customerInput();
                    }
                // note callback "Christmas tree"
                });
            });
        });
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