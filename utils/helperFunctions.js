//Importing the inquirer module.
const inquirer = require('inquirer');

//Prompt Questions.
const promptQuestions = {
    departmentName: "What is the department name?",
    roleName: "What is the role name?",
    roleSalary: "What is the salary for this role?",
    roleDepartment: "What is the role's department id?",
    employeeFirstName: "What is the employee's first name?",
    employeeLastName: "What is the employee's last name?",
    employeeRole: "What is the employee's role?",
    employeeManager: "What is the employee's manager name?",
    employee: "Select the employee to update."
};

//List of options to interact with the database.
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
        "Delete a department",
        "Delete a role",
        "Delete an employee",
        "Utilized budget of a department",
        "Exit"
    ]
}

//Function used to validate the answer for the salary.
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

//Function used to designate where in the code to go after the user gives its answer.
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

            case "Delete a department":
                del("department", db);
                break;

            case "Delete a role":
                del("role", db);
                break;

            case "Delete an employee":
                del("employee", db);
                break;

            case "Utilized budget of a department":
                budget(db);
                break;

            case "Exit":
                endSession();
                break;
        }
    });
}

//Function used for the View "table" options.
const viewAll = (branch, db) => {
    let query = "";
    switch (branch) {
        case "departments":
            query = 'Select id, name As Department From department Order By id;';
            break;
        case "roles":
            query =`Select role.id As "Role Id", role.title As Title,
            department.name As Department, role.salary As Salary From role
            Join department On (role.department_id = department.id) Order By role.id;`;
            break;
        case "employees":
            query =`Select e.id As "Employee Id", concat(e.first_name, " ", e.last_name) As "Employee Name",
            title As Role, name As Department, salary As Salary,
            concat(employee.first_name, " ", employee.last_name) As "Manager Name"
            From employee As e
            Left Join employee On (e.manager_id = employee.id)
            Join role As r On (e.role_id = r.id)
            Join department As d On (r.department_id = d.id)
            Order By e.id;`;
            break;
    }
    db.execute(`${query}`,
        function(err, result) {
            if (result.length === 0) console.log("There are no entries.\n");
            else console.table(result);
            (options(db));
        }
    )
}

//Function used for the View by "parameter" options.
const viewBy = async (branch, db) => {
    let query = "";
    let input = [];
    switch (branch) {
        case "byManager":
            input.push(await listPrompt(promptQuestions.employeeManager, db, 'Select id, concat(first_name, " ", last_name) As name From employee;'));
            query = `Select e.id As Id, concat(e.first_name, " ", e.last_name) As Employee,
            concat(employee.first_name, " ", employee.last_name) As Manager From employee As e
            Join employee On (e.manager_id = employee.id) Where e.manager_id = ?;`
            break;

        case "byDepartment":
            input.push(await listPrompt(promptQuestions.departmentName, db, "Select * From department;"));
            query = `Select employee.id As Id, concat(first_name, " ", last_name) as Employee,
             name As Department From employee Join role on (employee.role_id = role.id)
             Join department on (role.department_id = department.id) where department_id = ?`;
            break;
    }
    db.execute(query, input,
        (err, result) => {
            if (err) err;
            if (result.length === 0) console.log("There are no entries.\n");
            else console.table(result);
            options(db);
        }
    )
}

//Function used for the Add to "table" options.
const add = async (branch, db) => {
    let query = "";
    let input = [];
    switch (branch) {
        case "department":
            input.push(await namePrompt(promptQuestions.departmentName));
            query = `Insert Into department (name) Values (?)`;
            break;
        case "role":
            input.push(await namePrompt(promptQuestions.roleName));
            input.push(await salaryPrompt(promptQuestions.roleSalary));
            input.push(await listPrompt(promptQuestions.departmentName, db, "Select * From department;"));
            query = `Insert Into role (title, salary, department_id) Values (?, ?, ?)`;
            break;

        case "employee":
            input.push(await namePrompt(promptQuestions.employeeFirstName));
            input.push(await namePrompt(promptQuestions.employeeLastName));
            input.push(await listPrompt(promptQuestions.employeeRole, db, 'Select id, title As name From role;'));
            let manId = await listPrompt(promptQuestions.employeeManager, db, 'Select id, concat(first_name, " ", last_name) as name From employee;');
            if (manId == 0) {
                manId = null;
            }
            input.push(manId);
            query = `Insert Into employee (first_name, last_name, role_id, manager_id) Values (?, ?, ?, ?)`;
            break;
    }
    db.execute(query, input,
        (err, result) => {
            if (err) err;
            else console.log("Query added successfully.\n");
            options(db);
        }
    )
}

//Function used for updating an employee entry.
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
            input.push(await listPrompt(promptQuestions.employee, db, 'Select id, concat(first_name, " ", last_name) as name From employee;'));
            input.push(employee);
            query = 'Update employee Set manager_id = ? Where id = ?;'
            break;
    }
    db.execute(query, input,
        (err, result) => {
            if (err) err;
            else console.log("Query updated successfully.\n");
            options(db);
        }
    )
}

//Function used for the Delete from "table" options.
const del = async (branch, db) => {
    let input = [];
    let query = ""
    switch (branch ) {
        case "department":
            input.push(await listPrompt(promptQuestions.departmentName, db, 'Select * From department;'));
            query ='Delete From department Where id = ?;';
            break;

        case "role":
            input.push(await listPrompt(promptQuestions.roleName, db, 'Select id, title As name From role;'));
            query ='Delete From role Where id = ?;';
            break;

        case "employee":
            input.push(await listPrompt(promptQuestions.employee, db, 'Select id, concat(first_name, " ", last_name) as name From employee;'));
            query ='Delete From employee Where id = ?;';
            break;
    }
    db.execute(query, input,
        (err, result) => {
            if (err) err;
            else console.log("Query deleted successfully.\n");
            maxId(db, branch);
            options(db);
        }
    )
}

//Function used for the budget of department option.
const budget = async db => {
    let input = [];
    input.push(await listPrompt(promptQuestions.departmentName, db, 'Select * From department;'));
    const query = `Select sum(salary) As "Utilized Budget", name As Department From employee Join role On (employee.role_id = role.id)
     Join department On (role.department_id = department.id) Where department_id = ? Group By department.id;`;
    db.execute(query, input,
        (err, result) => {
            if (err) err;
            if (result.length === 0) console.log("There are no entries.\n");
            else console.table(result);
            options(db);
        }
    )
}

//Function used to exit from the application.
const endSession = () => {
    console.log("");
    console.log("------------------------------------------------");
    console.log("");
    console.log("The application has ended.");
    console.log("");
    process.exit();
}

//Function used for name based prompts.
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

//Function used for the salary prompt.
const salaryPrompt = async (question) => {
    const answer = await inquirer.prompt({
        name: "salary",
        type: "input",
        message: question,
        ...validateAnswerNums(),
    });
    return answer.salary;
}

//Function used for list based prompts.
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

//Function used to gather values from a table for the list based prompts.
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

//Joint function to update the auto_increament after entry deletion.
const maxId = async (db, branch) => {
    let query = "";
    switch (branch) {
        case "department":
            query = "Select max( id ) As Id FROM department;";
            break;

        case "role":
            query = "Select max( id ) As Id FROM role;";
            break;

        case "employee":
            query = "Select max( id ) As Id FROM employee;";
            break;
    }
    const data = await new Promise((resolve, reject) => {
        db.execute(query,
        function(err, results) {
            if (err) throw err;
            resolve(results)
        })
    })
    const max = data.map((id) => {
        return {value: id.Id}
    })
    reset(db, branch, max[0].value);
}

//Joint function to update the auto_increament after entry deletion.
const reset = async (db, branch, number) => {
    let query = ""
    number++;
    switch (branch) {
        case "department":
            query = `Alter Table department AUTO_INCREMENT = ${number}`;
            break;

        case "role":
            query = `Alter Table role AUTO_INCREMENT = ${number}`;
            break;

        case "employee":
            query = `Alter Table employee AUTO_INCREMENT = ${number}`;
            break;
    }
    await db.execute(query);
    return;
}

//Export the options() for use outside the file.
module.exports = {options};