const fetch = require('node-fetch');
url = 'http://localhost:3000/editProfile';

edits = {
  id: 9,
  firstname: 'test_edited',
  lastname: 'user_edited',
  email: 'test@gmail.com',
  password: 'password',
  number: '555-555-5555',
  address: '555 sunset blvd. athens, ga 30601',
  cardtype: 'visa',
  cardnumber: '123456789'
};

fetch(url, {
  method: 'post',
  body: JSON.stringify(edits),
  headers: { 'Content-Type': 'application/json' }
})
.then(res => res.json())
.then(json => console.log(json))
.catch(err => console.log(err));
