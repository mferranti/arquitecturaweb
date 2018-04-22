const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');

const history = require('connect-history-api-fallback');
let server = express();

server.use(history());
server.use(serveStatic(__dirname + "/dist"));

const serverPort = process.env.SERVER_PORT || 5000;

server.listen(serverPort, () => {
  console.log('Server listening on port ' + serverPort)
});

let api = express();
api.get('/messages', (req, res) => res.json([
  { nick: 'dino', message: 'Hola, como andas?' },
  { nick: 'raul', message: 'Bien, y vos?' },
  { nick: 'dino', message: 'bien, al pedooooo' },
  { nick: '_klifort_', message: 'Que onda viejoooooo' },
  { nick: 'autobot', message: 'We can use the v-for directive to render a list of items based on an array. The v-for directive requires a special syntax in the form of item in items, where items is the source data array and item is an alias for the array element being iterate' },
  { nick: '_klifort_', message: 'jaja quien te conoce bot' },
]));

const apiPort = process.env.API_PORT || 5001;

api.listen(apiPort, () => {
  console.log('API listening on port ' + apiPort)
});
