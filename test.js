const fetch = require('node-fetch');

user = {
  firstname: 'test',
  lastname: 'user',
  email: 'chris.fisher015@gmail.com',
  password: 'password',
  phone: '555-555-5555',
  address: '555 sunset blvd. athens, ga 30601',
  cardtype: 'visa',
  cardnumber: '123456789',
  cardexp: '12/24'
};

fetch('http://localhost:3000/user', {
        method: 'post',
        body: JSON.stringify(user),
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => console.log(res))
    .catch(err => console.log(err));

console.log('done');

process.exit();
