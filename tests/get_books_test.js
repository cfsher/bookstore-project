const fetch = require('node-fetch');
const url = 'http://localhost:3000/books/5';

fetch(url)
.then(res => res.json())
.then(json => console.log(json))
.catch(err => console.log(err));
