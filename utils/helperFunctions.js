const { reject } = require('bluebird');
const inquirer = require('inquirer');

const promptQuestions = {
    departmentName: "What is the department name?",
    roleName: "What is the role name?",
    roleSalary: "What is the salary for this role?",
    roleDepartment: "What is the role's department id?",
    employeeFirstName: "What is the employee's first name?",
    employeeLastName: "What is the employee's last name?",
    employeeRole: "What is the employee's role",
    employeeManager: "What is the employee's manager id (0 if none)",
    employee: "Select the employee to update."
};

const initialQuestion = {
    name: 'options',
    type: 'list',
    message: 'What would you like to do?',
    loop: false,
    choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "View employees by manager",
        "View employees by department",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee's role",
        "Update an employee's manager",
        "Exit"
    ]
}

const validateAnswerNums = checks => ({
    validate: input => {
        if (input === '') {
            return 'The answer must be greater than -1.'
        }
        return checks ? checks(input) : true
    },
    filter: input => {
        // clear the invalid input
        return (Number.isNaN(input) || Number(input) < 0 ? '' : Number(input))
    },
})

const options = (db) => {
    inquirer.prompt(initialQuestion).then(answer => {
        switch (answer.options) {
            case "View all departments":
                viewAll("departments", db);
                break;

            case "View all roles":
                viewAll('roles', db);
                break;

            case "View all employees":
                viewAll("employees", db);
                break;

            case "View employees by manager":
                viewBy("byManager", db);
                break;

            case "View employees by department":
                viewBy("byDepartment", db);
                break;

            case "Add a department":
                add("department", db);
                break;

            case "Add a role":
                add("role", db);
                break;

            case "Add an employee":
                add("employee", db);
                break;

            case "Update an employee's role":
                updateEmployee("role", db);
                break;

            case "Update an employee's manager":
                updateEmployee("manager", db);
                break;

            case "Exit":
                endSession();
                break;
        }
    });
}

function viewAll (branch, db) {
    let query = "";
    switch (branch) {
        case "departments":
            query = 'Select id, name As Department From department;';
            break;
        case "roles":
            query =`Select role.id As "Role Id", role.title As Title,
            department.name As Department, role.salary As Salary From role
            Join department on (role.department_id = department.id) order by role.id;`;
            break;
        case "employees":
            query =`Select e.id As "Employee Id", concat(e.first_name, " ", e.last_name) as "Employee Name",
            title as Role, name as Department, salary as Salary,
            concat(employee.first_name, " ", employee.last_name) as "Manager Name"
            from employee as e
            LEFT join employee on (e.manager_id = employee.id)
            join role as r on (e.role_id = r.id)
            join department as d on (r.department_id = d.id)
            order by e.id;`;
            break;
    }
    db.execute(`${query}`,
        function(err, results) {
            console.log("\n");
            console.table(results);
            (options(db));
        }
    )
}

const viewBy = async (branch, db) => {
    let query = "";
    let input = [];
    switch (branch) {
        case "byManager":
            break;

        case "byDepartment":
            input.push(await listPrompt(promptQuestions.departmentName, db, "Select * From department;"));
            query = `Select employee.id As Id, concat(first_name, " ", last_name) as Employee,
             name As Department From employee Join role on (employee.role_id = role.id)
             Join department on (role.department_id = department.id) where department_id = ?`;
            break;
    }

    console.log(query, input);
    db.execute(query, input,
        (err, result) => {
            if (err) err;
            options(db);
        }
    )
}

const add = async (branch, db) => {
    let query = "";
    let input = [];
    switch (branch) {
        case "department":
            input.push(await namePrompt(promptQuestions.departmentName));
            query = `INSERT INTO department (name) VALUES (?)`;
            break;
        case "role":
            input.push(await namePrompt(promptQuestions.roleName));
            input.push(await salaryPrompt(promptQuestions.roleSalary));
            input.push(await listPrompt(promptQuestions.departmentName, db, "Select * From department;"));
            query = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            break;

        case "employee":
            input.push(await namePrompt(promptQuestions.employeeFirstName));
            input.push(await namePrompt(promptQuestions.employeeLastName));
            input.push(await idPrompt(promptQuestions.employeeRole));
            let manId = await idPrompt(promptQuestions.employeeManager);
            if (manId == 0) {
                manId = null;
            }
            input.push(manId);
            query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
            break;
    }
    console.log(query, input);
    db.execute(query, input,
        (err, result) => {
            if (err) err;
            options(db);
        }
    )
}

const updateEmployee = async (branch, db) => {
    let input = [];
    let query = ""
    let employee = ""
switch (branch) {
    case "role":
        employee = await listPrompt(promptQuestions.employee, db, 'Select id, concat(first_name, " ", last_name) as name From employee;');
        input.push(await listPrompt(promptQuestions.employeeRole, db, 'Select id, title As name From role;'));
        input.push(employee);
        query = 'Update employee Set role_id = ? Where id = ?;'
        break;

    case "manager":
        employee = await listPrompt(promptQuestions.employee, db, 'Select id, concat(first_name, " ", last_name) as name From employee;');
        input.push(await listPrompt(promptQuestions.employeeRole, db, 'Select id, concat(first_name, " ", last_name) as name From employee;'));
        input.push(employee);
        query = 'Update employee Set manager_id = ? Where id = ?;'
        break;
}
    // const employee = await listPrompt(promptQuestions.employee, db, 'Select id, concat(first_name, " ", last_name) as name From employee;');
    // input.push(await listPrompt(promptQuestions.employeeRole, db, 'Select id, title As name From role;'));
    // input.push(employee);
    console.log(query, input);
    db.execute(query, input,
        (err, result) => {
            if (err) err;
            options(db);
        }
    )
}

const endSession = () => {
    console.log("");
    console.log("------------------------------------------------");
    console.log("");
    console.log("The application has ended.");
    console.log("");
    process.exit();
}

const namePrompt = async (question) => {
    const answer = await inquirer.prompt({
        name: 'name',
        type: 'input',
        message: question,
        validate: nameInput => {
            if (nameInput) {
                return true;
            } else {
                console.log('You need to enter a name.\n');
                return false;
            }
        }
    });
    return answer.name;
}

const salaryPrompt = async (question) => {
    const answer = await inquirer.prompt({
        name: "salary",
        type: "input",
        message: question,
        ...validateAnswerNums(),
    });
    return answer.salary;
}

const idPrompt = async (question) => {
    const answer = await inquirer.prompt({
        name: "id",
        type: "input",
        message: question,
        ...validateAnswerNums(),
    });
    return answer.id;
}

const listPrompt = async (question, db, query) => {
    const departments =  await gatherInfo(db, query);
   const answer = await inquirer.prompt({
       name: "department",
       type: "list",
       choices: departments,
       message: question,
       loop: false
   });
   return answer.department;
}

async function gatherInfo(db, query) {
    const data = await new Promise((resolve, reject) => {
        db.execute(query,
        function(err, results) {
            if (err) throw err;
            resolve(results)
        })
    })
    const departments = data.map((department) => {
        return {name: department.name, value: department.id}
    })
    return departments;
}

module.exports = {options};