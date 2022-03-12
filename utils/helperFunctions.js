const { query } = require('express');
const inquirer = require('inquirer');

const promptOptions = {
    viewAllDepartments: "View all departments",
    viewAllRoles: "View all roles",
    viewAllEmployees: "View all employees",
    addDepartment: "Add a department",
    addRole: "Add a role",
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
        promptOptions.viewAllDepartments,
        promptOptions.viewAllRoles,
        promptOptions.viewAllEmployees,
        promptOptions.addDepartment,
        promptOptions.addRole,
        promptOptions.addEmployee,
        promptOptions.updateEmployeeRole,
        promptOptions.exit
    ]

}

const options = (db) => {
    inquirer.prompt(initialQuestion).then(answer => {
        switch (answer.action) {
            case promptOptions.viewAllDepartments:
                viewAll("departments", db);
                break;

            case promptOptions.viewAllRoles:
                viewAll('roles', db);
                break;

            case promptOptions.viewAllEmployees:
                viewAll("employees", db);
                break;

            case promptOptions.addDepartment:
                add("department", db);
                break;

            case promptOptions.addRole:
                add("role", db);
                break;

            case promptOptions.addEmployee:
                add("employee", db);
                break;

            case promptOptions.updateEmployeeRole:
                updateEmployeeRole(db);
                break;

            case promptOptions.exit:
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

const add = (branch, db, input) => {
    let query = "";
    switch (branch) {
        case "department":
            query = `INSERT INTO department (name) VALUES ("?"), (${input});`;
            break;
        case "role":
            console.log("role.\n");
            break;

        case "employee":
            console.log("employee.\n");
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

module.exports = {options};