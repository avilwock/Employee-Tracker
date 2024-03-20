 # Employee Tracker   ![License](https://img.shields.io/badge/license-MIT%20license-blue)

## Description

This purpose of this project is to design a database to keep track of employees and data regarding them, roles within the job, salaries, and departments.

## Table of Contents

- [User Story](#user-story)
- [Acceptance Criteria](#acceptance-criteria)
- [Future Implementations](#future-implementations)
- [Access](#access)
- [Usage](#usage)
- [Credits](#credits)
- [Installation](#installation)
- [License](#license)

## User Story

```md
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

## Acceptance Criteria

```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
```

## Future Implementations

* Add more information about the employees, departments, and roles

## Access

To access this site, please visit: https://github.com/avilwock/Employee-Tracker


## Installation

To install, open the integerated terminal, and type in npm install, then open mysql and source in the schema and seed files.

## Usage

To use this repository: To use this program, install the necessary packages in the terminal with npm install, connect to mysql in the command terminal by typing in mysql -u <your username> -p. Then enter your password to run it. Type in source db/schema.sql, and press enter. Wait for the file to show the schema has been imported. Then type in source db/seeds.sql and press enter to retrieve the data populating the tables.  Next, close out mysql by typing quit. Then type in node index.js. The program will start. Answer the questions provided for you.

## Credits

With thanks to:

## Questions

For any questions, please contact: avilwock@gmail.com

## License

MIT license