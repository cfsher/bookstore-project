const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
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
    to: `${firstname} ${lastname} ${email}`,
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

// POST route to handle new user registration
app.post('/user', (req, res) => {
  user = req.body;
  console.log(user);
  const sql = `INSERT INTO users (firstname, lastname, email, password, phone, address,
          cardtype, cardnumber)
          VALUES ('${user.firstname}', '${user.lastname}', '${user.email}',
          '${user.password}', '${user.number}', '${user.address}', '${user.cardtype}',
          '${user.cardnumber}')`;
  connection.query(sql, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log(result);
    console.log('New users record created');
    res.status(200).send(JSON.stringify('User created sucessfully!'));
    mailer(user.firstname, user.lastname, user.email).catch(err => {
      console.error(err.message);
      process.exit(1);
    });
  });
});

// POST route to handle user verification
app.post('/verification', (req, res) => {

});

// POST route to handle login authentication
app.post('/login', (req, res) => {
  login = req.body;
  const sql = `SELECT * FROM users WHERE email = '${login.email}' AND
          password = '${login.password}'`;
  connection.query(sql, (err, result) => {
    if (err) {
      return console.log(err);
    }
    if (result.length === 0) {
      res.status(200).send(JSON.stringify('Login unsuccessful!'));
    }
    else {
      res.status(200).send(JSON.stringify(result[0].id));
      console.log(result);
    }
  });
});

// POST route to handle user profile changes
app.post('/editProfile', (req, res) => {
  edits = req.body
  const sql = `UPDATE users SET firstname = '${edits.firstname}',
  lastname = '${edits.lastname}', email = '${edits.email}',
  password = '${edits.password}', phone = '${edits.phone}',
  address = '${edits.address}', cardtype = '${edits.cardtype}',
  cardnumber = '${edits.cardnumber}' WHERE id = '${edits.id}'`;
  connection.query(sql, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log(result);
    console.log('Users record updated');
    res.status(200).send(JSON.stringify(`User updated successfully!`));
  });
});

// POST route to handle promo subscription changes
app.post('/editPromo', (req, res) => {
  promo_changes = req.body;
  const sql = `UPDATE users SET subscribed_promos = '${promo_changes}' where
          id = '${promo_changes.id}'`;
  connection.query(sql, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log(result);
    console.log('Users record updated');
    res.status(200).send(JSON.stringify('User updated sucessfully'));
  });
});

// GET route to retreive some number of books from database
app.get('/books/:amount', (req, res) => {
  amount = req.params.amount;
  const sql = `SELECT ${amount} from books`;
  connection.query(sql, (err, result) => {
    if (err) {
      return console.log(err);
    }
    if (result.length === 0) {
      res.status(200).send(JSON.stringify('No books found!'));
    }
    else {
      console.log(result);
      res.status(200).send(JSON.stringify(result));
      console.log(`${amount} books records successfully retreived`);
    }
  });
});

// POST route to store new book in database
app.post('/book', (req, res) => {

});

// GET route to retreive a promo from database
app.get('/promo/:promoCode', (req, res) => {

});

// POST route to store new promo in database
app.post('/promo', (req, res) => {

});

// POST route to handle shopping cart changes
app.post('/updateShoppingCart', (req, res) => {

});

// POST route to handle new order
app.post('/newOrder', (req, res) => {

});

// GET route to retreive all orders for userId
app.get('/orders/:userId', (req, res) => {

});


// listening on port 3000
app.listen(3000, () => {
  console.log('listening on port 3000')
});
