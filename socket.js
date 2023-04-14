const express = require('express');
const app = express()
require('dotenv').config()
const socketio = require('socket.io');
const path = require('path')
const uuid = require("uuid");
const cors = require('cors')
const catchAsyncAwait = require('./middleware/catchAsyncAwait')
const Meeting = require('./model/meeting')

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
  let arr=[] 
  arr.push("socket",socket)
 
  socket.on('join', async function(room) {
    console.log("hi")
    console.log('Room:', room);

    //save data in db
    await Meeting.create({
      date: room.date,
      time: room.time,
      title: room.title,
      inviteId: room.inviteId,
      creatorId: room.creatorId
  });

    var clientsInRoom = io.sockets.adapter.rooms[room] || { length: 0 };
    var numClients = clientsInRoom.length;
    console.log(clientsInRoom,numClients)

    if (numClients === 0) {
      socket.join(room);
      console.log('Client joined room:0', room);
    } else if (numClients === 1) {
      socket.join(room);
      console.log('Client joined room:1', room);
      io.sockets.in(room).emit('start');
    } else {
      console.log('Room is full:', room);
      socket.emit('full', room);
    }
  })
  socket.on('error', function(errorMsg) {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = errorMsg;
});



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


// create room 
exports.createRoom = catchAsyncAwait(async (req, res) => {
  const { creatorId ,roomName} = req.body;
  try {

      io.on('connection', (socket) => {
        console.log('a user connected');
      
        // Create a new room
        socket.on('createRoom', (creatorId, roomName) => {
          const roomId = Math.random().toString(36).substring(2, 8); // generate a unique room id
          const room = {
            id: roomId,
            name: roomName,
            creator: creatorId,
            users: [],
          };
          console.log(room,"Room created")
      
          // Join the room as the creator
          socket.join(roomId);
          room.users.push(socket.id);
      
          // // Store the room data in a map
          // rooms.set(roomId, room);
      
          // Emit a success message to the creator
          socket.emit('roomCreated', roomId);
      
          console.log(`Room created: ${roomId}`);
        });
      });
      
      res.status(200).send({
          date: "Room created Successfully.",
          code: 200,
          status: "SUCCESS"
      })
  } catch (error) {
      console.log(error, "Error")
      res.status(400).send({
          error: error,
          code: 400,
          status: "Error"
      })
  }
})


// join same room by two user 
// exports.joinRoom = catchAsyncAwait(async (req, res) => {
//   try {
//       const { createrId, userId } = req.body;

//       // Join the user to the room
//       const room = io.sockets.adapter.rooms.get(roomId);
//       console.log(room)
//       if (room) {
//           io.to(roomId).emit('user-connected', userId);
//           socket.join(roomId);
//           res.status(200).send({ message: 'Successfully joined room.' });
//       }

//       res.status(200).send({
//           date: data,
//           code: 200,
//           status: "SUCCESS"
//       })
//   } catch (error) {
//       console.log(error, "Error")
//       res.status(400).send({
//           error: error,
//           code: 400,
//           status: "Error"
//       })
//   }
// })
