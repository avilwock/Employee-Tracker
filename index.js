//adds the inquirer and fs node.js modules
const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employee_db',
  });

  connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected as id ${connection}`);
  });

async function prompt() {
    const beginQuestions = [
        {
            type: 'list',
            name: 'task',
            message: 'What would you like to do?',
            choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"]
        }
    ];
    
    const answers = await inquirer.prompt(beginQuestions);
    console.log(answers.task)
    
    switch (answers.task) {
      case "View All Employees":
        viewAllEmployees();
        break;
    }
}

function viewAllEmployees() {
  connection.query('SELECT * FROM employees', (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
    } else {
      console.log("All employees:", results);
    }
    prompt();
  })
}


prompt();