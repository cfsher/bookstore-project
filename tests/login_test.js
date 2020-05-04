const fetch = require('node-fetch');
url = 'http://localhost:3000/login';

login = {
  email: 'chris.fisher015@gmail.com',
  password: 'password'
};

fetch(url, {
  method: 'post',
  body: JSON.stringify(login),
  headers: { 'Content-Type': 'application/json' }
})
.then(res => res.json())
.then(json => console.log(json))
.catch(err => console.log(err));

console.log('expected: 9');
