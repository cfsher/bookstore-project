const fetch = require('node-fetch');
const url = 'http://localhost:3000/promo';

promo = {
  percentage: 10,
  start_date: '2020-05-10',
  end_date: '2020-05-12',
  code: 'SAVE5'
};

fetch(url, {
  method: 'post',
  body: JSON.stringify(promo),
  headers: { 'Content-Type': 'application/json' }
})
.then(res => res.json())
.then(json => console.log(json))
.catch(err => console.log(err));
