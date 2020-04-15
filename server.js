const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

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
          logger: false,
          debug: false // include SMTP traffic in the logs
        },
        {
          // default message fields

          // sender info
          from: 'Bookstore <no-reply@bookstore.net>',
          headers: {
          }
        }
    );
    let message = {
         // Comma separated list of recipients
         to: `${firstname} ${lastname} <${email}>`,

         // Subject of the message
         subject: 'Bookstore Registration Confirmation',

         // plaintext body
         text: `Thank you ${firstname} for registering for the bookstore!`,

         // An array of attachments
         attachments: []
     };
    let info = await transporter.sendMail(message);

    console.log('Message sent successfully!');
    console.log(nodemailer.getTestMessageUrl(info));
}

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'user'
});

connection.connect();

app.post('/user', (req, res) => {
  user = req.body.user;
  const sql = `INSERT INTO users (firstname, lastname, email, password, phone, address)
          VALUES (${user.firstname}, ${user.lastname}, ${user.email}, ${user.password},
          ${user.phone}, ${user.address})`;
  connection.query(sql, (error, result) => {
    if (error) throw err;
    console.log('1 record inserted');
    res.send('user added');
    mailer(firstname, lastname, email).catch(err => {
      console.error(err.message);
      process.exit(1);
    });
  });
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
