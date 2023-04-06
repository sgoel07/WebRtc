const express = require('express');
const app = express()
require('dotenv').config()

var http = require('http').createServer(app);
var io = require('socket.io')(http);

var twilio = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// console.log(twilio,"Check twilio")


io.on('connection', function(socket){
    socket.on('join', function(room){
      var clients = io.sockets.adapter.rooms[room];
      var numClients = typeof clients !== 'undefined' ? clients.length : 0;
      if(numClients == 0){
        socket.join(room);
      }else if(numClients == 1){
        socket.join(room);
        socket.emit('ready', room);
        socket.broadcast.emit('ready', room);
      }else{
        socket.emit('full', room);
      }
    });
  });