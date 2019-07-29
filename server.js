const express = require('express');
const chokidar = require('chokidar');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const path = 'dist/';

app.use(express.static(path));

const watcher = chokidar.watch(path);

watcher.on('ready', () => {
  watcher.on('all', () => {
    console.log('Clearing /dist/ module cache from server');
    Object.keys(require.cache).forEach(function(id) {
      if (/[\/\\]dist[\/\\]/.test(id)) delete require.cache[id];
    });
  });
});

const clients = [];

io.on('connection', function(socket) {
  console.log('a user connected');

  clients.push(socket);

  socket.on('player1-move', (coords) => {
    if(clients[0].id === socket.id) {
      socket.broadcast.emit('player1-move', coords);
    }
  });

  socket.on('ball-move', coords => {
    if(clients[0].id === socket.id) {
      socket.broadcast.emit('ball-move', coords);
    }
  });

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
