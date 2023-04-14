const express = require('express');
const app = express()
require('dotenv').config()
const socketio = require('socket.io');
const path = require('path')
const uuid = require("uuid");
const cors = require('cors')
const catchAsyncAwait = require('./middleware/catchAsyncAwait')
const Meeting = require('./model/meeting');
const User = require('./model/user')

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
// io.on('connection', function(socket){
  
//   socket.on('join', async function(room) {
//     console.log("hi")
//     console.log('Room:', room);


//     // save data in db
    
//     let data = await Meeting.create({
//       date: room.date,
//       time: room.time,
//       title: room.title,
//       inviteId: room.inviteId,
//       creatorId: room.creatorId
//   });

//   console.log(data.creatorId,"Cehck user data")
//   let checkId = await User.find({userId:data.creatorId});
//   console.log(checkId,"Check id",checkId.length == 0)

//  if(checkId.length == 0){
//   socket.on('join', function (){
//     socket.Disconnect(0);
// });
//  }

//     var clientsInRoom = io.sockets.adapter.rooms[room] || { length: 0 };
//     var numClients = clientsInRoom.length;
//     console.log(clientsInRoom,numClients)

//     if (numClients === 0) {
//       socket.join(room);
//       console.log('Client joined room:0', room);
//     } else if (numClients === 1) {
//       socket.join(room);
//       console.log('Client joined room:1', room);
//       io.sockets.in(room).emit('start');
//     } else {
//       console.log('Room is full:', room);
//       socket.emit('full', room);
//     }
//   })
//   socket.on('error', function(errorMsg) {
//   const errorDiv = document.getElementById('error');
//   errorDiv.textContent = errorMsg;
// });



//   // When receiving the token message, use the Twilio REST API to request an
//   // token to get ephemeral credentials to use the TURN server.
//   socket.on('token', function(){
//     twilio.tokens.create(function(err, response){
//       if(err){
//         console.log(err);
//       }else{
//         // Return the token to the browser.
//         // console.log(response,"Response frokm token")
//         socket.emit('token', response);
//       }
//     });
//   });

//   // Relay candidate messages
//   socket.on('candidate', function(candidate){
//     socket.broadcast.emit('candidate', candidate);
//   });

//   // Relay offers
//   socket.on('offer', function(offer){
//     socket.broadcast.emit('offer', offer);
//   });

//   // Relay answers
//   socket.on('answer', function(answer){
//     socket.broadcast.emit('answer', answer);
//   });
// });

// Listen for a 'connection' event
io.on('connection', function(socket){

  // Listen for a 'join' event from the client
  socket.on('join', async function(room) {
    
    // Save room data to the database using Mongoose ORM
    let data = await Meeting.create({
      date: room.date,
      time: room.time,
      title: room.title,
      inviteId: room.inviteId,
      creatorId: room.creatorId
    });

    // Check if the creatorId exists in the User collection
    let checkId = await User.find({userId:data.creatorId});
    console.log(checkId,"Check id")
    if(checkId.length == 0){

      // If creatorId does not exist, disconnect the socket
      socket.disconnect();

    } 
    else {

      // Get the number of clients in the room
      var clientsInRoom = io.sockets.adapter.rooms[room] || { length: 0 };
      var numClients = clientsInRoom.length;

      // Check the number of clients in the room
      if (numClients === 0) {
        // If no clients in the room, join the socket to the room
        socket.join(room);
        console.log('Client joined room:0', room);
      } else if (numClients === 1) {
        // If one client in the room, join the socket to the room and emit a 'start' event
        socket.join(room);
        console.log('Client joined room:1', room);
        io.sockets.in(room).emit('start');
      } else {
        // If two clients in the room, emit a 'full' event
        console.log('Room is full:', room);
        socket.emit('full', room);
      }
    }
  });

  // Listen for 'error' event and display the error message on the client-side
  socket.on('error', function(errorMsg) {
    console.log("Error",errorMsg)
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = errorMsg;
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
