SELECT department.name AS department_name, role.title AS department_title
FROM department
INNER JOIN role ON role.department_id = department.id;


SELECT name AS department_name
FROM department;

SELECT 
        employee.first_name, 
        employee.last_name, 
        role.title, 
        department.name AS department, 
        role.salary, 
        manager.first_name AS manager_first_name, 
        manager.last_name AS manager_last_name
FROM 
        employee
JOIN 
        role ON employee.role_id = role.id
JOIN 
        department ON role.department_id = department.id 
LEFT JOIN 
        employee AS manager ON employee.manager_id = manager.id;

