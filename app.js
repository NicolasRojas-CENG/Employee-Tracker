//Importing the required modules.
const mysql = require('mysql2');
const {options} = require('./utils/helperFunctions');

// Used to connect to the database.
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'luca256789',
      database: 'company'
    },
    console.log('Connected to the company database.')
  );

//Function used for welcome message and start the actual application.
const main = () => {
    console.log("Welcome to the Employee Tracker App.");
    options(db);
}

//Function code to start app.
main();