USE bamazon_db;
SHOW TABLES;

SELECT departments.id, departments.departmentName, departments.overHead,
SUM(products.salesValue) AS productSales,
SUM(products.salesValue) - departments.overHead AS totalProfit
FROM departments
INNER JOIN products
ON products.department = departments.departmentName GROUP BY departmentName;

SELECT * FROM products;

SELECT * FROM departments;