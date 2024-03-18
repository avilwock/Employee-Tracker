//adds the inquirer and fs node.js modules
const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employee_db',
  });

  connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected to the database`);
    startUp();

    function startUp() {
      console.log("************************************")
      console.log("*                                  *")
      console.log("*         Employee Manager         *")
      console.log("*                                  *")
      console.log("************************************")
      prompt();
    };
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
      case "Add Employee":
        addEmployee();
        break;
      case "Update Employee Role":
        updateRole();
        break;
      case "View All Roles":
        viewRole();
        break;
      case "Add Role":
        addRole();
        break;
      case "View All Departments":
        viewDepartments();
        break;
      case "Add Department":
        addDepartment();
        break;
      case "Quit":
        connection.end();
        break;
    default:
      console.log("Invalid Choice");
      prompt();
      break;
    }
}

function viewAllEmployees() {
  const query = `
    SELECT  
      employee.id,
      employee.first_name, 
      employee.last_name, 
      role.title, 
      department.name AS department, 
      role.salary, 
      CONCAT(manager.first_name,' ', manager.last_name) AS manager
    FROM 
      employee
    JOIN 
      role ON employee.role_id = role.id
    JOIN 
      department ON role.department_id = department.id 
    LEFT JOIN 
      employee AS manager ON employee.manager_id = manager.id;
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      prompt(); // Prompt again if there's an error
    } else {
      // Find the maximum length for each column
      const maxLengths = {};

      results.forEach(employee => {
        for (const key in employee) {
          if (employee.hasOwnProperty(key)) {
            const valueLength = String(employee[key]).length;
            const headerLength = String(key).length;
            maxLengths[key] = Math.max(maxLengths[key] || 0, valueLength, headerLength);
          }
        }
      });

      // Print table headers
      const headers = Object.keys(maxLengths);
      console.log(headers.map(header => header.padEnd(maxLengths[header])).join(' | '));

      // Print separator
      console.log(headers.map(header => '-'.repeat(maxLengths[header])).join(' | '));

      // Print data rows
      results.forEach(employee => {
        console.log(headers.map(header => String(employee[header]).padEnd(maxLengths[header])).join(' | '));
      });

      prompt(); // Prompt again after viewing employees
    }
  });
}

function viewRole() {
  const query = `
      SELECT  
      role.id, 
      role.title, 
      department.name AS department,
      role.salary
    FROM    
      role
    JOIN
      department ON role.department_id = department.id;
      `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching roles:', err);
      prompt(); // Prompt again if there's an error
    } else {
      // Find the maximum length for each column
      const maxLengths = {};

      results.forEach(role => {
        for (const key in role) {
          if (role.hasOwnProperty(key)) {
            const valueLength = String(role[key]).length;
            const headerLength = String(key).length;
            maxLengths[key] = Math.max(maxLengths[key] || 0, valueLength, headerLength);
          }
        }
      });

      // Print table headers
      const headers = Object.keys(maxLengths);
      console.log(headers.map(header => header.padEnd(maxLengths[header])).join(' | '));

      // Print separator
      console.log(headers.map(header => '-'.repeat(maxLengths[header])).join(' | '));

      // Print data rows
      results.forEach(role => {
        console.log(headers.map(header => String(role[header]).padEnd(maxLengths[header])).join(' | '));
      });

      prompt(); // Prompt again after viewing employees
    }
  });
}

function viewDepartments() {
  const query = `
    SELECT id, name AS department
    FROM department;
      `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching roles:', err);
      prompt(); // Prompt again if there's an error
    } else {
      // Find the maximum length for each column
      const maxLengths = {};

      results.forEach(department => {
        for (const key in department) {
          if (department.hasOwnProperty(key)) {
            const valueLength = String(department[key]).length;
            const headerLength = String(key).length;
            maxLengths[key] = Math.max(maxLengths[key] || 0, valueLength, headerLength);
          }
        }
      });

      // Print table headers
      const headers = Object.keys(maxLengths);
      console.log(headers.map(header => header.padEnd(maxLengths[header])).join(' | '));

      // Print separator
      console.log(headers.map(header => '-'.repeat(maxLengths[header])).join(' | '));

      // Print data rows
      results.forEach(department => {
        console.log(headers.map(header => String(department[header]).padEnd(maxLengths[header])).join(' | '));
      });

      prompt(); // Prompt again after viewing employees
    }
  });
}

async function updateRole() {
  // Fetch employees and roles from the database
  let employees;
  let roles;
  try {
      // Fetch employees
      employees = await connection.promise().query("SELECT id, CONCAT(first_name, ' ', last_name) AS employee FROM employee");
      // Fetch roles
      roles = await connection.promise().query("SELECT id, title FROM role");
  } catch (err) {
      console.error('Error fetching employees and roles:', err);
      prompt(); // Prompt again if there's an error
      return;
  }

  const employeeChoices = employees[0].map(employee => ({ value: employee.id, name: employee.employee }));
  const roleChoices = roles[0].map(role => ({ value: role.id, name: role.title }));

  inquirer.prompt([
      {
          type: 'list',
          name: 'employee_id',
          message: 'Select the employee whose role you want to update:',
          choices: employeeChoices,
      },
      {
          type: 'list',
          name: 'role_id',
          message: 'Select the new role for the employee:',
          choices: roleChoices,
      },
  ]).then(async (answers) => {
      try {
          await connection.promise().query('UPDATE employee SET role_id = ? WHERE id = ?', [answers.role_id, answers.employee_id]);
          console.log("Employee role updated successfully!");
      } catch (err) {
          console.error('Error updating employee role:', err);
      }

      prompt(); // Prompt again after updating the employee role
  });
}

async function addEmployee() {
  // Fetch employees and roles from the database
  try {
      // Fetch employees
      const [roles, managers] = await Promise.all([
        connection.promise().query("SELECT id, title FROM role"),
        connection.promise().query("SELECT id, CONCAT(first_name, ' ', last_name) AS manager FROM employee"),
        connection.promise().query("SELECT id, CONCAT(first_name, ' ', last_name) AS employee FROM employee")
      ]);

      const employeeDetails = await inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: "Please enter employee's first name",
      },
      {
        type: 'input',
        name: 'last_name',
        message: "Please enter employee's last name",
      },
      {
        type: 'list',
        name: 'role',
        message: "Please select the employees role at the company",
        choices: roles[0].map(role => ({ value: role.id, name: role.title})),
      },
      {
        type: 'list',
        name:'manager',
        message: "Please select this employee's manager",
        choices: managers[0].map(manager => ({ value: manager.id, name: manager.manager})),
      }
      ])

      await connection.promise().query('INSERT INTO employee SET ?', employeeDetails);
      console.log(`Added ${first_name}, ${last_name} to the database`)
    } catch (err) {
      console.error('Error adding Employee:', err);// Prompt again if there's an error
      return;
    }
    prompt();
}

async function addDepartment() {
  try {
    const departmentName = await inquirer.prompt([
      {
        type: 'input',
        name: 'new_department',
        message: 'What is the name of the department?',
      }
    ])

    await connection.promise().query('INSERT INTO department SET ?', departmentName);

    console.log(`Added ${departmentName} to the database`);
  } catch (err) {
    console.error('Error adding new department:', err);
    return
  }
  prompt();
}

async function addRole() {
  // Fetch employees and roles from the database
  try {
      // Fetch employees
      const [departments] = await Promise.all([
        connection.promise().query("SELECT id, name FROM department"),

      ]);

      const newRole = await inquirer.prompt([
      {
        type: 'input',
        name: 'role',
        message: "What is the name of the role?",
      },
      {
        type: 'input',
        name: 'salary',
        message: "What is the salary of the role?",
      },
      {
        type: 'list',
        name: 'department',
        message: "What department does the role belong to?",
        choices: departments[0].map(department => ({ value: department.id, name: department.name})),
      },
      ])

      await connection.promise().query('INSERT INTO role SET ?', newRole);
      console.log(`Added ${newRole.role} to the database`)
    } catch (err) {
      console.error('Error adding Employee:', err);// Prompt again if there's an error
      return;
    }
    prompt();
}



