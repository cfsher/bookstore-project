const fetch = require('node-fetch');
url = 'http://localhost:3000/editPromo';

promo_changes = {
  id: 9,
  status: 1
};

fetch(url, {
  method: 'post',
  body: JSON.stringify(promo_changes),
  headers: { 'Content-Type': 'application/json' }
})
.then(res => res.json())
.then(json => console.log(json))
.catch(err => console.log(err));
