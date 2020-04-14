const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'user'
});

connection.connect();

// POST request to handle user account creation
app.post('/user', (req, res) => {
  
  // TODO pass in data from request
  // sql query with data
  // send confirmation email
  // send back if registration sucessful
});

// POST request to handle login authentication
app.post('/login', (req, res) => {
  // TODO pass in login information
  // send query checking if user/pass is in db
  // send back if authenticated
});

// POST request to handle edit profile actions
app.post('editProfile', (req, res) => {
  // TODO pass in modified information
  // send query updating information for user
  //
})

// listening on port 3000
app.listen(3000, () => {
  console.log('listening on port 3000')
});

connection.end();
