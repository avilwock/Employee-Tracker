//adds the inquirer and mysql2 modules
const inquirer = require('inquirer');
const mysql = require('mysql2');

//create a connection with mysql to the local host, with a username of root, a password of root, and a database called employee_db
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employee_db',
  });

  //checks for error connecting
  connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected to the database`);
    startUp();

    function startUp() {
      console.log(" ---------------------------------- ")
      console.log("|                                  |")
      console.log("|           Employee Tracker       |")
      console.log("|                                  |")
      console.log(" ---------------------------------- ")
      prompt();
    };
  });

//gives the first question in the nodejs to ask for which action the user wishes to perform
async function prompt() {
    const beginQuestions = [
        {
            type: 'list',
            name: 'task',
            message: 'What would you like to do?',
            choices: ["View All Employees", "View Employees By Manager", "View Employees By Department", "Add Employee", "Update Employee Role", "Update Employee Manager", "View All Roles", "Add Role", "View Salary By Department", "View All Departments", "Add Department", "Delete Employee", "Delete Role", "Delete Department", "Quit"]
        }
    ];
    
    const answers = await inquirer.prompt(beginQuestions);
    console.log(answers.task)
    
    switch (answers.task) {
      case "View All Employees":
        viewAllEmployees();
        break;
      case "View Employees By Manager":
        viewManagersEmployees();
        break;
      case "View Employees By Department":
        viewEmployeeDept();
        break;
      case "Add Employee":
        addEmployee();
        break;
      case "Update Employee Role":
        updateRole();
        break;
      case "Update Employee Manager":
        updateManager();
        break;
      case "View All Roles":
        viewRole();
        break;
      case "Add Role":
        addRole();
        break;
      case "View Salary By Department":
        viewDeptSalary();
        break;
      case "View All Departments":
        viewDepartments();
        break;
      case "Add Department":
        addDepartment();
        break;
      case "Delete Employee":
        deleteEmployee();
        break;
      case "Delete Role":
        deleteRole();
        break;
      case "Delete Department":
        deleteDepartment();
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

//this formats the text so that any entry into the database is uppercase first letter, and the rest are lowercase
function formatText(text) {
  return text.replace(/\b\w/g, match => match.toUpperCase());
}

// The view all employees function selects the id, name, title, deparmtnet, salary, and manager to display when selected
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

      //ensures the formatting allows the columns to match up neatly
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

//This function allows us to viewRoles, including the id, title, department, and salary of the role
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

//View a list of departments, with id and name of department
function viewDepartments() {
  const query = `
    SELECT 
      id, 
      name AS department
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

function viewManagersEmployees() {
  // Fetch the list of managers with first name and last name combined
  //SELECT DISTINCT to remove duplicates of the item
  const managerQuery = `
    SELECT DISTINCT
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name,
      manager.id AS manager_id
    FROM
      employee AS manager
    INNER JOIN
      employee AS employee ON manager.id = employee.manager_id
    ORDER BY manager_name;
  `;

  connection.query(managerQuery, async (err, managerResults) => {
    if (err) {
      console.error('Error fetching managers:', err);
      prompt(); // Prompt again if there's an error
    } else {
      // Create choices for managers
      const managerChoices = managerResults.map(manager => ({
        value: manager.manager_id,
        name: manager.manager_name
      }));

      // Ask the user to select a manager
      const selectedManager = await inquirer.prompt({
        type: 'list',
        name: 'managerId',
        message: 'Select a manager:',
        choices: managerChoices
      });

      // Fetch employees under the selected manager
      const employeeQuery = `
        SELECT
          CONCAT(employee.first_name, ' ', employee.last_name) AS employee_name
        FROM
          employee
        WHERE
          employee.manager_id = ?;
      `;

      connection.query(employeeQuery, [selectedManager.managerId], (err, employeeResults) => {
        if (err) {
          console.error('Error fetching employees:', err);
        } else {
          // Display the employees' data
          console.log("Employees under selected manager:");
          employeeResults.forEach(employee => {
            console.log(employee.employee_name);
          });
        }
        prompt(); // Prompt again after viewing employees
      });
    }
  });
}

//fetch a it of departments, and when selected, show the employees in the department
async function viewEmployeeDept() {
  try {
    // Fetch departments
    const [departmentResults] = await connection.promise().query(`
      SELECT DISTINCT
        department.name AS department_name,
        department.id AS department_id
      FROM
        department
      ORDER BY
        department_name;
    `);

    // Create choices for departments
    const departmentChoices = departmentResults.map(department => ({
      value: department.department_id,
      name: department.department_name
    }));

    // Ask user to select a department
    const selectedDepartment = await inquirer.prompt({
      type: 'list',
      name: 'departmentId',
      message: 'Select a department:',
      choices: departmentChoices
    });

    // Fetch employees in the selected department
    const [employeeResults] = await connection.promise().query(`
      SELECT
        CONCAT(employee.first_name, ' ', employee.last_name) AS employee_name
      FROM
        employee
      INNER JOIN
        role ON employee.role_id = role.id
      WHERE
        role.department_id = ?;
    `, [selectedDepartment.departmentId]);

    // Display employees in the selected department
    console.log('\nEmployees in the selected department:');
    employeeResults.forEach(employee => {
      console.log(employee.employee_name);
    });

    prompt(); // Prompt again after viewing employees
  } catch (err) {
    console.error('Error fetching departments or employees:', err);
    prompt(); // Prompt again if there's an error
  }
}

//view the department salary, as a sum for the employees in each department
function viewDeptSalary() {
  const query = `
    SELECT
        department.name AS department_name,
        SUM(role.salary) AS total_department_salary
    FROM
        employee
    JOIN
        role ON employee.role_id = role.id
    JOIN
        department ON role.department_id = department.id
    GROUP BY
        department.name;`

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

      prompt(); // Prompt again after viewing salary
    }
  });
}

//update the role for an employee
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

//update the manager for an employee
async function updateManager() {
  // Fetch employees and roles from the database
  let employees;
  try {
      // Fetch employees
      employees = await connection.promise().query("SELECT id, CONCAT(first_name, ' ', last_name) AS employee FROM employee");
  } catch (err) {
      console.error('Error fetching employees:', err);
      prompt(); // Prompt again if there's an error
      return;
  }

  const managerChoices = employees[0].map(employee => ({ value: employee.id, name: employee.employee }));
  
  inquirer.prompt([
      {
          type: 'list',
          name: 'employee_id',
          message: 'Select the employee whose manager you want to update:',
          choices: managerChoices,
      },
      {
          type: 'list',
          name: 'manager_id',
          message: 'Select the new manager for the employee',
          choices: managerChoices,
      },
  ]).then(async (answers) => {
      try {
          await connection.promise().query('UPDATE employee SET manager_id = ? WHERE id = ?', [answers.manager_id, answers.employee_id]);
          console.log("Employee manager updated successfully!");
      } catch (err) {
          console.error('Error updating manager role:', err);
      }

      prompt(); // Prompt again after updating the employee role
  });
}

//add a new employee, call a prompt to input the new employee information, 
async function addEmployee() {
  // Fetch employees and roles from the database
  try {
      // Fetch employees
      const [roles, managers] = await Promise.all([
        connection.promise().query("SELECT id, title FROM role"),
        connection.promise().query("SELECT id, CONCAT(first_name, ' ', last_name) AS manager FROM employee"),
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
        name: 'role_id',
        message: "Please select the employees role at the company",
        choices: roles[0].map(role => ({ value: role.id, name: role.title})),
      },
      {
        type: 'list',
        name:'manager_id',
        message: "Please select this employee's manager",
        choices: managers[0].map(manager => ({ value: manager.id, name: manager.manager})),
      }
      ])

      employeeDetails.first_name = formatText(employeeDetails.first_name);
      employeeDetails.last_name = formatText(employeeDetails.last_name);

      await connection.promise().query('INSERT INTO employee SET ?', employeeDetails);
      console.log(`Added ${employeeDetails.first_name}, ${employeeDetails.last_name} to the database`)
    } catch (err) {
      console.error('Error adding Employee:', err);// Prompt again if there's an error
      return;
    }
    prompt();
}

//add department function, input name of department and add to list
async function addDepartment() {
  try {
    const departmentName = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the department?',
      }
    ])

    departmentName.name = formatText(departmentName.name);

    await connection.promise().query('INSERT INTO department SET ?', departmentName);

    console.log(`Added ${departmentName.name} to the database`);
  } catch (err) {
    console.error('Error adding new department:', err);
    return
  }
  prompt();
}

//add a role function. input name of role and add to list
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
        name: 'title',
        message: "What is the name of the role?",
      },
      {
        type: 'input',
        name: 'salary',
        message: "What is the salary of the role?",
      },
      {
        type: 'list',
        name: 'department_id',
        message: "What department does the role belong to?",
        choices: departments[0].map(department => ({ value: department.id, name: department.name})),
      },
      ])

      newRole.title = formatText(newRole.title);

      await connection.promise().query('INSERT INTO role SET ?', newRole);
      console.log(`Added ${newRole.title} to the database`)
    } catch (err) {
      console.error('Error adding Role:', err);// Prompt again if there's an error
      return;
    }
    prompt();
}

//delete employee function, select employee from a list, and select to delete
function deleteEmployee() {
  connection.query(`SELECT id, CONCAT(first_name, ' ', last_name) AS full_name FROM employee`, (err, results) => {
    if (err) {
        console.error('Error fetching employees:', err);
        prompt();
    } else {
        const employeeChoices = results.map(employee => ({
            name: `${employee.id}: ${employee.full_name}`,
            value: employee.id
        }));
  inquirer.prompt([
    {
      type: 'list',
      name: 'employeeId',
      message: 'Select an employee to delete',
      choices: employeeChoices
  }
]).then(answer => {
  const selectedEmployeeId = answer.employeeId;
  connection.query(`DELETE FROM employee WHERE id = ?`, [selectedEmployeeId], (err, deleteResult) => {
      if (err) {
          console.error('Error deleting employee:', err);
      } else {
          console.log('Employee deleted successfully');
      }
      prompt();
    })
});
}
});
}

//a role to delete a specific role from the database
function deleteRole() {
  connection.query(`SELECT id, title FROM role`, (err, results) => {
    if (err) {
        console.error('Error fetching roles:', err);
        prompt();
    } else {
        const roleChoice = results.map(role => ({
            name: `${role.id}: ${role.title}`,
            value: role.id
        }));
  inquirer.prompt([
    {
      type: 'list',
      name: 'roleId',
      message: 'Select a role to delete',
      choices: roleChoice
  }
]).then(answer => {
  const selectedRoleId = answer.roleId;
  connection.query(`DELETE FROM role WHERE id = ?`, [selectedRoleId], (err, deleteResult) => {
      if (err) {
          console.error('Error deleting role:', err);
      } else {
          console.log('Role deleted successfully');
      }
      prompt();
    })
});
}
});
}

//function to delete a specific department from a database
function deleteDepartment() {
  connection.query(`SELECT id, name FROM department`, (err, results) => {
    if (err) {
        console.error('Error fetching departments:', err);
        prompt();
    } else {
        const departmentChoice = results.map(department => ({
            name: `${department.id}: ${department.name}`,
            value: department.id
        }));
  inquirer.prompt([
    {
      type: 'list',
      name: 'departmentId',
      message: 'Select a department to delete',
      choices: departmentChoice
    }
]).then(answer => {
  const selectedDeptId = answer.departmentId;
  connection.query(`DELETE FROM department WHERE id = ?`, [selectedDeptId], (err, deleteResult) => {
      if (err) {
          console.error('Error deleting department:', err);
      } else {
          console.log('Department deleted successfully');
      }
      prompt();
    })
});
}
});
}