const inquirer = require('inquirer');

const promptQuestions = {
    departmentName: "What is the department name?",
    roleName: "What is the role name?",
    roleSalary: "What is the salary for this role?",
    roleDepartment: "What is the role's department id?",
    employeeFirstName: "What is the employee's first name?",
    employeeLastName: "What is the employee's last name?",
    employeeRole: "What is the employee's role id",
    employeeManager: "What is the employee's manager id (0 if none)",
    employeeId: "What is the id of the employee you want to update."
};

const initialQuestion = {
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    loop: false,
    choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
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
    //departments = gatherInfo();
    inquirer.prompt(initialQuestion).then(answer => {
        switch (answer.action) {
            case "View all departments":
                viewAll("departments", db);
                break;

            case "View all roles":
                viewAll('roles', db);
                break;

            case "View all employees":
                viewAll("employees", db);
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

            case "Update an employee role":
                updateEmployeeRole(db);
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
            query =`Select e.id As "Employee Id", concat(e.first_name, " ", e.last_name) as "Employee Name", title as Role, name as Department, salary as Salary, concat(employee.first_name, " ", employee.last_name) as
            "Manager Name" from employee as e
            LEFT join employee on (e.manager_id = employee.id)
            join role as r on (e.role_id = r.id)
            join department as d on (r.department_id = d.id)
            order by e.id;`;
            break;
        case "employees":
            query =`Select e.id As "Employee Id", concat(e.first_name, " ", e.last_name) as "Employee Name", title as Role, name as Department, salary as Salary, concat(employee.first_name, " ", employee.last_name) as "Manager Name"
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
            input.push(await idPrompt(promptQuestions.roleDepartment));
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

const updateEmployeeRole = async db => {
    let input = [];
    const employee = await idPrompt(promptQuestions.employeeId);
    input.push(await idPrompt(promptQuestions.employeeRole));
    input.push(employee);
    console.log("Update employee Set role_id = ? Where id = ?;", input);
    db.execute("Update employee Set role_id = ? Where id = ?;", input,

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

module.exports = {options};