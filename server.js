const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const app = express();

const algorithm = 'aes-192-cbc';
const password = 'password';
const key = crypto.scryptSync(password, 'salt', 24);
const iv = Buffer.alloc(16, 0);

const encrypted = 'fab96a9897603949fbe28db05dc16f5e';
const decipher = crypto.createDecipheriv(algorithm, key, iv);
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');

app.use(bodyParser.json());
app.use(cors());

const random_code_generator = () => Math.floor(Math.random() * Math.floor(999999));
const stringify = (obj) => JSON.stringify(obj);

async function mailer(firstname, lastname, email, message) {
  let account = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport(
    {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'chris.fisher015@gmail.com',
        pass: decrypted
      },
      logger: true,
      debug: false
    },
    {
      from: 'Bookstore <no-reply@bookstore.net>',
    }
  );
  let msg = {
    to: `${firstname} ${lastname} ${email}`,
    subject: 'Bookstore Registration Confirmation',
    html: message,
    attachments: []
  }
  transporter.sendMail(msg, (err, info) => {
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

  verification_code = random_code_generator();
  email_message = `<h2>Thank you ${user.firstname} for registering with the bookstore!</h2>
<br><p>In order to purchase books, you will need to verify your email
by entering the following code at the verification page:</p>
<b>${verification_code}</b>`;

  const sql = `INSERT INTO users (firstname, lastname, email, password, phone, address,
          cardtype, cardnumber, status, subscribed_promos, verification_code)
          VALUES ('${user.firstname}', '${user.lastname}', '${user.email}',
          '${user.password}', '${user.number}', '${user.address}', '${user.cardtype}',
          '${user.cardnumber}', '0', '1', '${verification_code}')`;
  connection.query(sql, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log('New users record created\n');
    console.log(result);
    res.status(200).send(stringify('User created successfully!'));
    mailer(user.firstname, user.lastname, user.email, email_message).catch(err => {
      console.error(err.message);
      process.exit(1);
    });
  });
});

// POST route to handle user verification
app.get('/verify/:code', (req, res) => {
  code = req.params.code;
  let sql = `SELECT id FROM users WHERE verification_code = '${code}' AND status = '0'`;
  connection.query(sql, (err, result) => {
    if (err) {
      return console.log(err);
    }
    if (result.length == 0) {
      res.status(200).send(stringify('Verification unsuccessful!'));
    }
    else {
      res.status(200).send(stringify(result[0]));
      sql = `UPDATE users SET status = '1' WHERE id = '${result[0].id}'`;
      connection.query(sql, (err, result) => {
        if (err) {
          return console.log(err);
        }
      });
    }
  });
});

// POST route to handle login authentication
app.post('/login', (req, res) => {
  login = req.body;
  const sql = `SELECT id FROM users WHERE email = '${login.email}' AND
          password = '${login.password}'`;
  connection.query(sql, (err, result) => {
    if (err) {
      return console.log(err);
    }
    if (result.length === 0) {
      res.status(200).send(stringify('Login unsuccessful!'));
    }
    else {
      res.status(200).send(stringify(result[0]));
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
    console.log('Users record profile changes updated successfully!\n');
    res.status(200).send(stringify('Profile updated successfully!'));
  });
});

// POST route to handle promo subscription changes
app.post('/editPromo', (req, res) => {
  promo_changes = req.body;
  const sql = `UPDATE users SET subscribed_promos = '${promo_changes.status}' WHERE
          id = '${promo_changes.id}'`;
  connection.query(sql, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log('Users record promo status updated successfully!\n');
    res.status(200).send(stringify('Promo status updated sucessfully!'));
  });
});

// GET route to retreive some number of books from database
app.get('/books/:amount', (req, res) => {
  amount = req.params.amount;
  const sql = `SELECT * FROM books LIMIT ${amount}`;
  connection.query(sql, (err, result) => {
    if (err) {
      return console.log(err);
    }
    if (result.length === 0) {
      res.status(200).send(stringify('No books found!'));
    }
    else {
      res.status(200).send(stringify(result));
      console.log(`${result.length} books records successfully retreived!\n`);
    }
  });
});

// POST route to store new book in database
app.post('/book', (req, res) => {

});

// GET route to retreive a promo from database
app.get('/promo/:promoCode', (req, res) => {
  promoCode = req.params.promoCode;
  const sql = `SELECT * FROM promos WHERE code = '${promoCode}'`;
  connection.query(sql, (err, result) => {
    if (err) {
      return console.log(err);
    }
    if (result.length == 0) {
      res.status(200).send(stringify('No promos found!'));
    }
    else {
      console.log(result);
      res.status(200).send(stringify(result[0]));
      console.log('Promo code successfully retreived\n');
    }
  })
});

// POST route to store new promo in database
app.post('/promo', (req, res) => {
  promo = req.body;
  const sql = `INSERT INTO promos (percentage, start_date, end_date, code)
          VALUES ('${promo.percentage}', '${promo.start_date}', '${promo.end_date}',
          '${promo.code}')`;
  connection.query(sql, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log('Promos record added successfully!\n');
    res.status(200).send(stringify('Promo added successfully!'));
  });
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
