const { query } = require('express');
const inquirer = require('inquirer');

const promptQuestions = {
    departmentName: "What is the department name?",
    roleName: "What is the role name?",
    roleSalary: "What is the salary for this role?",
    roleDepartment: "What is the role's department id?",
    employeeFirstName: "What is the employee's first name?",
    employeeLastName: "What is the employee's last name?",
    employeeRole: "What is the employee's role id",
    employeeManager: "What is the employee's manager id (null if none)",
    addEmployee: "Add an employee",
    updateEmployeeRole: "Update an employee role",
    exit: "Exit"
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

const options = (db) => {
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
            query = 'Select * From department Order By id;';
            break;
        case "roles":
            query ='Select * From role Order By id;';
            break;
        case "employees":
            query ='Select * From employee Order By id;';
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

const add = (branch, db) => {
    let query = "";
    switch (branch) {
        case "department":
            const input = namePrompt(promptQuestions.departmentName);
            console.log(input);
            console.log("Here");
            //query = `INSERT INTO department (name) VALUES ("?"), (${input});`;
            break;
        case "role":
            console.log("role.\n");
            break;

        case "employee":
            console.log("employee.\n");
            break;
    }
    // db.execute(`${query}`,
    //     function(err, results) {
    //         console.log("\n");
    //         console.table(results);
    //         (options(db));
    //     }
    // )
}

const updateEmployeeRole = db => {
    console.log("updating...\n");
    options(db);
}

const endSession = () => {
    console.log("");
    console.log("------------------------------------------------");
    console.log("");
    console.log("The application has ended.");
    console.log("");
    process.exit();
}

const namePrompt = (question) => {
    inquirer.prompt({
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
    }).then(answer => {
        console.log("answer:" + answer);
    });
    console.log("shut");
}

module.exports = {options};