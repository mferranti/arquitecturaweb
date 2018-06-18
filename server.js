const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');
const socket= require('socket.io');
const history = require('connect-history-api-fallback');
const superagent = require('superagent')

const APP_NAME = 'vue';
const INTEGRATOR_BASE = 'https://awebchat-integration.herokuapp.com';
const postToIntegrator = async (body, endpoint) => superagent.post(`${INTEGRATOR_BASE}${endpoint}`)
  .send(body)
  .set('Accept', 'application/json')

function response(res, statusCode, value) {
  res.status(statusCode);
  res.json(value);
}

function receiveMessage(envelope, target) {
  return {
    target,
    nick: envelope.from.name,
    message: envelope.msg
  };
}

function buildExternalPrivateMessage(envelope, targetApp) {
  return {
    ...buildExternalPublicMessage(envelope),
    to: {
      id: `id-${envelope.target}`,
      name: envelope.target,
    },
    targetApp,
  }
}
function buildExternalMessage(envelope) {
  return {
    from: {
      id: `id-${envelope.nick}`,
      name: envelope.nick,
    },
    msg: envelope.message,
    to: null,
    sourceApp: APP_NAME,
    targetApp: null,
    attachment: null,
  };
}

function _sendPrivate(envelop) {
  const target = users.get(envelop.target);
  const source = users.get(envelop.nick);

  Array.from(new Set([
    ...(source ? source.sockets : []),
    ...(target ? target.sockets : []),
  ])).map(socketId => io.to(socketId).emit('chat', envelop));
  console.log(`Private message to ${envelop.target}`, envelop);
}

function _sendPublic(envelop) {
  io.emit('chat', envelop);
  console.log('Global message: ', envelop);
}

function registerExternalUser(envelop) {
  users.set(envelop.from.name, {sockets: [], app: envelop.sourceApp});
}

let app = express();

let users = new Map;

app.get('/api/contacts', (req, res) => {
  const _users = Array.from(users.keys())
  response(res, 200, _users.map(u => ({id: `id-${u}`, name: u})))
});

app.post('/api/public/send', (req, res) => {
  try {
    const envelop = receiveMessage(req.body, 'global');
    _sendPublic(envelop);
    registerExternalUser(envelop);
    response(res, 200, {});
  } catch (err) {
    response(res, err.status, {msg: err.message});
  }
});

app.post('/api/private/send', (req, res) => {
  try {
    const envelop = receiveMessage(req.body, req.body.to.name);
    _sendPrivate(envelop);
    registerExternalUser(envelop);
    response(res, 200, {});
  } catch (err) {
    response(res, err.status, {msg: err.message});
  }
});

app.use(history());
app.use(serveStatic(__dirname + "/dist"));

const port = process.env.PORT || 5000;

let server = app.listen(port, () => {
  console.log('Server listening on port ' + port)
});

const io = socket(server);
io.on('connection', (socket) => {
  console.log('made socket connection', socket.id);
  socket.on('connected', function(data) {
    let value;
    if (users.has(data.nick)) {
      value = {
        sockets: [...((users.get(data.nick)).sockets), socket.id],
        app: APP_NAME,
      };
    } else {
      value = {
        sockets: [socket.id],
        app: 'vue',
      };
    }
    users.set(data.nick, value);
  });
  socket.on('disconnect', function(data) {
    console.log('disconnect: ', data);
    users = new Map([...users.entries()].map(([nick, sockets]) => [nick, sockets.filter(s => s !== socket.id)]));
  });
  socket.on('chat', async (data) => {
    if (data.target === 'global') {
      _sendPublic(data);
      await postToIntegrator(buildExternalMessage(data), '/public/send');
    } else {
      _sendPrivate(data);
      if ((users.get(data.target)).app !== APP_NAME) {
        await postToIntegrator(buildExternalMessage(data, data.target), '/private/send');
      }
    }
  });
});


