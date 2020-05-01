const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

app.use(bodyParser.json());
app.use(cors());

async function mailer(firstname, lastname, email) {
  let account = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport(
    {
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass
      },
      logger: true,
      debug: false
    },
    {
      from: 'Bookstore <no-reply@bookstore.net>',
    }
  );
  let message = {
    to: `${firstname} ${lastname} <${email}>`,
    subject: 'Bookstore Registration Confirmation',
    text: `Thank you ${firstname} for registering with the bookstore!`,
    attachments: []
  }
  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log('Error occurred sending mail');
      console.log(err.message);
    }
    console.log('Message sent successfully!');

  });
}

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'bookstore'
});

connection.connect();

app.post('/user', (req, res) => {
  user = req.body;
  const sql = `INSERT INTO users (firstname, lastname, email, password, number, address,
          cardtype, cardnumber)
          VALUES (${user.firstname}, ${user.lastname}, ${user.email}, ${user.password},
          ${user.number}, ${user.address}), ${user.cardtype}, ${user.cardnumber}`;
  connection.query(sql, (error, result) => {
    if (error) throw err;
    console.log('1 record inserted');
    res.status(200).send('user added');
    mailer(firstname, lastname, email).catch(err => {
      console.error(err.message);
      process.exit(1);
    });
  });
});

// POST request to handle login authentication
app.post('/login', (req, res) => {
  login = req.body.login;
  console.log(login);
  // TODO pass in login information
  // send query checking if user/pass is in db
  // send back if authenticated
});

// POST request to handle edit profile actions
app.post('editProfile', (req, res) => {
  edits = req.body.edits;
  console.log(edits);
  // TODO pass in modified information
  // send query updating information for user
  //
})

// listening on port 3000
app.listen(3000, () => {
  console.log('listening on port 3000')
});

connection.end();
