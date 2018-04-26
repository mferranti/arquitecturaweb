const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');
const socket= require('socket.io');
const history = require('connect-history-api-fallback');
let app = express();

app.use(history());
app.use(serveStatic(__dirname + "/dist"));

const port = process.env.PORT || 5000;

let server = app.listen(port, () => {
  console.log('Server listening on port ' + port)
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('made socket connection', socket.id);
  socket.on('chat', function(data){
    io.sockets.emit('chat', data);
    console.log('This is the data', data);
  });
});
