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

const options = () => {
    inquirer.prompt(initialQuestion).then(answer => {
        switch (answer.action) {
            case promptOptions.viewAllDepartments:
                viewAll("departments");
                break;

            case promptOptions.viewAllRoles:
                viewAll('roles');
                break;

            case promptOptions.viewAllEmployees:
                viewAll("employees");
                break;

            case promptOptions.addDepartment:
                add("department");
                break;

            case promptOptions.addRole:
                add("role");
                break;

            case promptOptions.addEmployee:
                add("employee");
                break;

            case promptOptions.updateEmployeeRole:
                updateEmployeeRole();
                break;

            case promptOptions.exit:
                endSession();
                break;
        }
    });
}

const viewAll = branch => {
    switch (branch) {
        case "departments":
            console.log("departments.\n");
            break;
        case "roles":
            console.log("roles.\n");
            break;

        case "employees":
            console.log("employees.\n");
            break;
    }
    options();
}

const add = branch => {
    switch (branch) {
        case "department":
            console.log("department.\n");
            break;
        case "role":
            console.log("role.\n");
            break;

        case "employee":
            console.log("employee.\n");
            break;
    }
    options();
}

const updateEmployeeRole = () => {
    console.log("updating...\n");
    options();
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