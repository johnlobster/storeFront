-- Create and populate database for storefront app
-- John Webster

DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT,
    productName VARCHAR(30) NOT NULL DEFAULT "",
    department VARCHAR(30) NOT NULL DEFAULT "",
    price FLOAT NOT NULL DEFAULT 0,
    stock INT NOT NULL DEFAULT 0,
    salesValue INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT,
    departmentName VARCHAR(30) NOT NULL DEFAULT "",
    overHead INT NOT NULL DEFAULT 500,
    PRIMARY KEY (id)
);

INSERT INTO departments ( departmentName, overHead)
VALUES
    ("cats", 500),
    ("widgets", 500),
    ("gadgets", 500);


-- create some product values, by department
INSERT INTO products (productName, department, price, stock)
VALUES 
    ( "small widget", "widgets", 100, 10),
    ( "medium widget", "widgets", 200, 5),
    ( "large widget", "widgets", 300, 2),
    ("enormous widget", "widgets", 400, 1);

INSERT INTO products (productName, department, price, stock)
VALUES
    ( "small gadget", "gadgets", 100, 10),
    ( "medium gadget", "gadgets", 200, 100),
    ( "large gadget", "gadgets", 400, 25),
    ( "enormous gadget", "gadgets", 800, 5);

INSERT INTO products (productName, department, price, stock)
VALUES
    ("small cat", "cats", 200, 5),
    ("large cat", "cats", 400, 5),
    ("furry cat", "cats", 300, 10),
    ("shy cat", "cats", 100, 2);

    



