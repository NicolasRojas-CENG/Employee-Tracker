# Employee Tracker
Project 10. Due date: 20th of March 2022.
## Table of Contents

* [Goal of the Project](#Goal)
* [Story of the Project](#Story)
* [Description of the Project](#Description)
* [Install Instructions](#Installation)
* [Usage Instructions](#Usage)
* [Criteria For Completion](#Criteria)
* [Steps For Completion](#Completion)
* [Site/App Preview](#Preview)
* [Questions](#Questions)


# <a name="Goal"> Goal of the Project </a>
To create a simple employee tracker using a database.
# <a name="Story"> Story of the Project </a>
As a business owner, I want to be able to view and manage the departments, roles, and employees in my company so that I can organize and plan my business.
# <a name="Description"> Description of the Project </a>
An application used to add, update, delete, and view different aspects of a company. These aspects include departments, roles, and employees.
# <a name="Installation"> Install Instructions </a>
Run a terminal window within the project file, and write the following command: "npm install" or "npm i".
# <a name="Usage"> Usage Instructions </a>
Select the option you want to execute, and answer any prompts that may appear.
# <a name="Criteria"> Criteria For Completion </a>
1. Upon application start, the user is presented with the following options
	1. View all departments.
	2. View all roles.
	3. View all employees.
	4. Add a department.
	5. Add a role.
	6. Add an employee.
	7. Update an employee's role.
2. Choosing "View all departments" shows a table with department names and department ids.
3. Choosing "View all roles" shows a table with job title, role id, the department that role belongs to, and the salary for that role.
4. Choosing "View all employees" shows a table with employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to.
5. Choosing "Add a department" prompts the user to enter the name of the department and that department is added to the database.
6. Choosing "Add a role" prompts the user to enter the name, salary, and department for the role and that role is added to the database.
7. Choosing "Add an employee" prompts the user to enter the employee????????s first name, last name, role, and manager, and that employee is added to the database.
8. Choosing "Update an employee's role" prompts the user to select an employee to update and their new role and this information is updated in the database.
# <a name="Completion"> Steps For Completion </a>
- Created the initial repository.
- Created the database.
   - Created the database, tables and added initial entries.
- Created the initial setup for the prompts.
- Created simple queries for the view "table" options.
- Created the flow of the app.
   - Created a function that designates wich parts of the code will run at any given time.
- Contined adding prompts.
- Recreated queries to better fit the requirements.
- Refactored some prompts to be list type prompts
   - This was accomplished by gathering data from a table to use as choices in the prompt.
- Added more prompts.
- Finished the basic criteria for the application.
- Worked on the bonus criteria.
- Cleaned up the code.
   - Deleted unused code and minor code enhancments.
- Documented the code.
   - Commented the use of each function.
   - Updated the README.md file.
- Added walkthrough videos of the application.

# <a name="Preview"> Site/App Preview </a>
View "table" Options.


https://user-images.githubusercontent.com/55503463/158305677-005cc0da-daa3-451b-bf60-a31b55061024.mp4


Add to "table" Options.


https://user-images.githubusercontent.com/55503463/158305838-dfdc3c37-32f2-4bda-aa52-dfbdb12a16c0.mp4


View Employee By Options


https://user-images.githubusercontent.com/55503463/158306101-cdceffc7-7817-4c31-bde4-97b63d3334d5.mp4


Update Employee's Options


https://user-images.githubusercontent.com/55503463/158306236-32e4a940-59a1-4dee-9838-e00cc7760a7e.mp4


Utilized Budget of Department Option


https://user-images.githubusercontent.com/55503463/158306346-3c1fd5ab-855e-4132-a206-598fbb5e54ab.mp4


Delete From "table" Options


https://user-images.githubusercontent.com/55503463/158306731-2418ca33-1b41-4c47-9e32-16ff556fd7e4.mp4


Cascade Deletion


https://user-images.githubusercontent.com/55503463/158306835-adfd1ad9-2d69-41ab-b5fe-778176ffd402.mp4


Exit Option


https://user-images.githubusercontent.com/55503463/158306934-612a5a75-14fe-44c0-9f80-ce0270708634.mp4




# <a name="Questions"> Questions </a>
  If you have any questions, feel free to contact me through GitHub at
  [nicolasrojas-ceng](https://github.com/nicolasrojas-ceng). <br>
  Alternatively, you can contact me at my email: [lucanrojas@gmail.com](mailto:lucanrojas@gmail.com)
  
  Note: In the employee table, the id 10 is missing and skips to 11. That entry existed before the auto_increament reset functions for the table IDs. That is not a problem with a fresh database.
