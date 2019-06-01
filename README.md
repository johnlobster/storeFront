# storeFront
Online store - node.js applications using mysql database
* customer: allows purchasing of items
* manager: can view products, review low inventory, add stock and add new products
* supervisor: view sales and profit by department and add new departments
Each app is in a separate javascript file

#### Technologies and node modules
* javascript
* GitHub
* node.js
* mysql
* inquirer
* sprintf
* dotenv

#### Github repository
<https://github.com/johnlobster/storeFront.git>

#### Deploying
clone the master repo

`npm install` will install all the node modules

create a `.env` file that contains
`MYSQL_PASSWORD=<sql password>`
This is accessed when setting up the connection to the mysql database. It is not
stored using git because each user will have a different password

Initialize the database - run `DBseed.sql` in mysql environment. This sets up the schemas and seeds some values into the database. Can be run in mysql workbench for instance

Run the app using node, for example
`node customer`.

`customer`, `manager` and `supervisor` apps are available

#### Results
Results can be found in the results sub-directory.
`results/README.txt` has details

#### Design notes

 * For complex SQL queries, I run the query using msql workbench to get it working properly before creating a query string in javascript. The file `queries.sql` is checked in and shows the complex query needed for the supervisor app

 * I created a module of common javascript functions to be shared between the different apps. In the end only two functions were common.

 * Once customer was working, I refactored it to use promises instead of callback chain
 
