const express = require('express');
const app = express()
require('dotenv').config()
const socketio = require('socket.io');
const path = require('path')
const uuid = require("uuid");
const cors = require('cors')

// var http = require('http').createServer(app);
// var io = require('socket.io')(http);

var twilio = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);


app.use(express.static(path.resolve(__dirname, 'public')));
const server = app.listen(4000, () => {
    console.log('Server running in socket!')
});

app.use(cors())
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
  });



// When a socket connects, set up the specific listeners we will use.
io.on('connection', function(socket){
  // socket.on('join', function(room){
  //   console.log(room,"Check room",[...io.sockets.adapter.rooms.values()][0].values())
  //   var clients = io.sockets.adapter.rooms[room];
  //   var numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;
  //   console.log(clients,"Totla clients",numClients)
  //   if(numClients == 0){
  //     console.log("Client zero")
  //     socket.join(room);
  //   }else if(numClients == 1){
  //     socket.join(room);
  //     // When the client is second to join the room, both clients are ready.
  //     console.log("Client one")
  //     socket.emit('ready', room);
  //     socket.broadcast.emit('ready', room);
  //   }else{
  //     socket.emit('full', room);
  //   }
  // });

  socket.on('join', function(room) {
    console.log('Room:', room);

    var clientsInRoom = io.sockets.adapter.rooms[room] || { length: 0 };
    var numClients = clientsInRoom.length;
    console.log(clientsInRoom,numClients)

    if (numClients === 0) {
      socket.join(room);
      console.log('Client joined room:', room);
    } else if (numClients === 1) {
      socket.join(room);
      console.log('Client joined room:', room);
      io.sockets.in(room).emit('start');
    } else {
      console.log('Room is full:', room);
      socket.emit('full', room);
    }
  })


  // When receiving the token message, use the Twilio REST API to request an
  // token to get ephemeral credentials to use the TURN server.
  socket.on('token', function(){
    twilio.tokens.create(function(err, response){
      if(err){
        console.log(err);
      }else{
        // Return the token to the browser.
        // console.log(response,"Response frokm token")
        socket.emit('token', response);
      }
    });
  });

  // Relay candidate messages
  socket.on('candidate', function(candidate){
    socket.broadcast.emit('candidate', candidate);
  });

  // Relay offers
  socket.on('offer', function(offer){
    socket.broadcast.emit('offer', offer);
  });

  // Relay answers
  socket.on('answer', function(answer){
    socket.broadcast.emit('answer', answer);
  });
});

