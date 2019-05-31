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
                const depQuery = "SELECT departments.id, departments.departmentName, departments.overHead," +
                    " SUM(products.salesValue) AS productSales," +
                    " SUM(products.salesValue) - departments.overHead AS totalProfit" +
                    " FROM departments" + 
                    " INNER JOIN products" +
                    " ON products.department = departments.departmentName GROUP BY departmentName";
                var query = connection.query(depQuery, (err, res) => {
                    if (err) throw err;
                    // print out table from query
                    console.log("\nProduct sales by department\n");
                    const lineString = common.underline(77, 5);
                    const printString = "     | %4s | %-20s | %9s | %14s | %14s |";
                    console.log(lineString);
                    console.log(sprintf(printString, "id", "Department name", "Overhead", "Product sales", "Total profit"));
                    console.log(lineString);
                    for (let i = 0; i < res.length; i++) {
                        console.log(sprintf(printString,
                            parseInt(res[i].id),
                            res[i].departmentName,
                            parseFloat(res[i].overHead).toFixed(2),
                            parseFloat(res[i].productSales).toFixed(2),
                            parseFloat(res[i].totalProfit).toFixed(2)
                        ));
                    }
                    console.log(lineString);
                    console.log();  
                    supervisorInput();
                });
                break;
            case "Create new department":
                inquirer.prompt([
                    {
                        type: "input",
                        name: 'newDepartment',
                        message: "Input new department name",
                        validate: (val) => val !== ""
                    },
                    {
                        type: "input",
                        name: 'overhead',
                        message: "Input new department overhead",
                        validate: (val) => (val > 0) && (val !== "")
                    }
                ]).then((answers) => {
                    const newDepQuery = "INSERT INTO departments ( departmentName, overHead)" +
                        " VALUES (\"" + answers.newDepartment + "\", " + answers.overhead + " )";
                    console.log(newDepQuery);
                    var query = connection.query(newDepQuery, (err, res) => {
                        if (err) throw err;
                        console.log("\nsuccessfully added department " + answers.newDepartment );
                        console.log("Note - will not appear in sales report because there are no products or sales yet\n");
                        supervisorInput();
                    });
                });
                break;
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
    console.log("Supervisor app started\n");
    supervisorInput();
});