const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.post('/user', (req, res) => {
  user = req.body;
  console.log(user);
  res.status(200).send('request successful');
});

// POST request to handle login authentication
app.post('/login', (req, res) => {
  login = JSON.parse(req.body.login);
  console.log(login);
});

// POST request to handle edit profile actions
app.post('editProfile', (req, res) => {
  edits = JSON.parse(req.body.edits);
  console.log(edits);
})

// listening on port 3000
app.listen(3000, () => {
  console.log('listening on port 3000')
});
