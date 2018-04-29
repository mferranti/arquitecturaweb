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
let users = new Map;
io.on('connection', (socket) => {
  console.log('made socket connection', socket.id);
  socket.on('connected', function(data) {
    const value = users.has(data.nick) ? [...users.get(data.nick), socket.id] : [socket.id];
    users.set(data.nick, value);
  });
  socket.on('disconnect', function(data) {
    console.log('disconnect: ', data);
    users = new Map([...users.entries()].map(([nick, sockets]) => [nick, sockets.filter(s => s !== socket.id)]));
  });
  socket.on('chat', function(data) {
    if (data.target === 'global') {
      io.emit('chat', data);
      console.log('Global message: ', data);
    } else {
      const targetSockets = users.get(data.target) || [];
      const sourceSockets = users.get(data.nick) || [];
      Array.from(new Set([...sourceSockets, ...targetSockets])).map(socketId => io.to(socketId).emit('chat', data));
      console.log(`Private message to ${data.target}`, data);
    }
  });
});
