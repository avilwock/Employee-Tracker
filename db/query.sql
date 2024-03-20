-- Connect department to role
SELECT department.name AS department_name, role.title AS department_title
FROM department
INNER JOIN role ON role.department_id = department.id;

-- Show department names, for View All Departments
SELECT name AS department_name
FROM department;

-- Connect department to role to employee View All Employees
SELECT  employee.id,
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

-- View All Roles
SELECT  
        role.id, 
        role.title, 
        department.name,
        role.salary
FROM    
        role
JOIN
        department ON role.department_id = department.id;

-- Update Managers
SELECT 
        id, CONCAT (first_name, ' ', last_name) 
AS 
        employee 
FROM 
        employee;

-- Add more deparments
INSERT INTO department(name)
VALUES name;

-- Add more roles
INSERT INTO roles;

-- Add more employees
INSERT INTO employees;

-- Show employees by manager
SELECT
    manager.id AS manager_id,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name,
    employee.id AS employee_id,
    CONCAT(employee.first_name, ' ', employee.last_name) AS employee_name
FROM
    employee
INNER JOIN
    employee AS manager ON employee.manager_id = manager.id;

-- Show  employees by department
SELECT 
    department.name AS department_name,
    employee.id,
    CONCAT (employee.first_name, ' ', employee.last_name) AS employee_name
FROM 
    employee
JOIN    
    role ON employee.role_id = role.id
JOIN
    department ON role.department_id = department.id;

-- view all sales
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
    department.name;