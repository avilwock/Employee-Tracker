//adds the inquirer and fs node.js modules
const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password: 'root',
    database: 'employee_db'
})

connection.connect();

inquirer.prompt([
    {
        type: 'list',
        name: 'task',
        message: 'What would you like to do?'
    },
    {
        type: 'list',
        name: 'department_name',
        message: 'What is the name of the department?'
    },
]);