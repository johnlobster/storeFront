// storeFront app for manager

const mysql = require("mysql");
const inquirer = require("inquirer");
const sprintf = require("sprintf-js").sprintf;
const chalk = require("chalk");
require("dotenv").config();


const common = require("./common-functions");

// global variables

const lowStockThreshold = 5;

// functions


function managerInput () {
    inquirer.prompt([
        
        {
            type: "list",
            name: 'action',
            message: "Select action",
            choices: ["Exit","Products for sale", "View low inventory", "Add to inventory", "Add new product"]
        }
    ]).then( (answer) => {
        switch( answer.action) {
            case "Exit":
                common.cleanExit(connection, "\nleaving manager app\n");
            case "Products for sale":
                var query = connection.query("SELECT id, productName, price, stock FROM products", (err, res) => {
                    if (err) throw err;
                    // print out a table
                    // print out table of items
                    console.log("\nAll products for sale\n");
                    const lineString = common.underline(51, 5);
                    const printString = "     | %4s | %-20s | %8s | %6s |";
                    console.log(lineString);
                    console.log(sprintf(printString, "id", "Description", "price", "Stock"));
                    console.log(lineString);
                    for (let i = 0; i < res.length; i++) {
                        console.log(sprintf(printString,
                            parseInt(res[i].id),
                            res[i].productName,
                            parseFloat(res[i].price).toFixed(2),
                            parseInt(res[i].stock)
                            ));
                    }
                    console.log(lineString);
                    console.log();
                    managerInput();
                });
                break;
            case "View low inventory":
                var query = connection.query("SELECT id, productName, price, stock FROM products WHERE stock<" + lowStockThreshold, (err, res) => {
                    if (err) throw err;
                    // print out a table
                    // print out table of items
                    console.log("\nLow stock items\n");
                    const lineString = common.underline(51, 5);
                    const printString = "     | %4s | %-20s | %8s | %6s |";
                    console.log(lineString);
                    console.log(sprintf(printString, "id", "Description", "price", "Stock"));
                    console.log(lineString);
                    for (let i = 0; i < res.length; i++) {
                        console.log(sprintf(printString,
                            parseInt(res[i].id),
                            res[i].productName,
                            parseFloat(res[i].price).toFixed(2),
                            parseInt(res[i].stock)
                        ));
                    }
                    console.log(lineString);
                    console.log();
                    managerInput();
                });
                break;
            default:
                common.cleanExit(connection, "Manager input code not completed");
        }
    });
}


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
    console.log("Manager app started\n");
    managerInput();
});