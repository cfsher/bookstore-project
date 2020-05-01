const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/user', (req, res) => {
  user = req.body;
  console.log(user);
  res.status(200).send('request successful');
});

// POST request to handle login authentication
app.post('/login', (req, res) => {
  login = req.body;
  console.log(login);
  res.status(200).send('request successful');
});

// POST request to handle edit profile actions
app.post('editProfile', (req, res) => {
  edits = req.body;
  console.log(edits);
  res.status(200).send('request successful');
})

// listening on port 3000
app.listen(3000, () => {
  console.log('listening on port 3000')
});
