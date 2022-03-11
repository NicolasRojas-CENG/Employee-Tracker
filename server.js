//const express = require('express');
const mysql = require('mysql2');
const {options} = require('./utils/helperFunctions');
//const inputCheck = require('./utils/inputCheck');

// const PORT = process.env.PORT || 3000;
// const app = express();

//Express middleware
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'luca256789',
      database: 'company'
    },
    console.log('Connected to the election database.')
  );

const main = () => {
    console.log("Welcome to the Employee Tracker App.");
    options();
}

main();

// app.listen(PORT, () => {
//     //console.log(`Server running on port ${PORT}`);
// });