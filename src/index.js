const express = require('express');
const request = require('request');

const alice = express();
const bob = express();
const eve = express();

[alice, bob, eve].forEach((server) => {
  server.set('views', './src/templates');
  server.set('view engine', 'hbs');
});

alice.get('/', (req, res) => {
  request.post('http://localhost:9997/api/post', (err, resp, body) => {
    console.log(`Alice's server-side call got a ${resp.statusCode}`);
  });
  res.render('same-origin', { name: 'Alice' });
});

alice.all('/api/*', (req, res) => {
  console.log(`request to alice at ${req.originalUrl}:
  - origin ${req.headers.origin}
  - referrer ${req.headers.referrer}`);
  res.end();
});

bob.get('/', (req, res) => {
  request.post('http://localhost:9997/api/post', (err, resp, body) => {
    console.log(`Bob's server-side call got a ${resp.statusCode}`);
  });
  res.render('cross-origin', { name: 'Bob' });
});

eve.get('/', (req, res) => {
  request.post('http://localhost:9997/api/post', (err, resp, body) => {
    console.log(`Eve's server-side call got a ${resp.statusCode}`);
  });
  res.render('cross-origin', { name: 'Eve' });
});

alice.listen(9997);
bob.listen(9998)
eve.listen(9999);
