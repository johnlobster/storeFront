// supervisor app for storeFront
// John Webster

const mysql = require("mysql");
const inquirer = require("inquirer");
const sprintf = require("sprintf-js").sprintf;
const chalk = require("chalk");
require("dotenv").config();


const common = require("./common-functions");

// global variables

// functions

function supervisorInput () {
    inquirer.prompt([

        {
            type: "list",
            name: 'action',
            message: "Select action",
            choices: ["Exit", "View product sales by department", "Create new department"], 
        }
    ]).then((answer) => {
        switch (answer.action) {
            case "Exit":
                common.cleanExit(connection, "\nExiting supervisor app\n");
                break;
            case "View product sales by department":

                break;
            case "Create new department":

                break;
        }
    });
}

// View Product Sales by Department

//     * Create New Department

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
    supervisorInput();
});