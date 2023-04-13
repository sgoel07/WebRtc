const express = require('express');
const app = express()
const database = require('./config')
const socket = require('./socket')
require('dotenv').config()

const socketio = require('socket.io');




app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(express.static('public'));
app.set('view engine', 'hbs');
app.use('/webRtc/v1',require('./routers/index'))


const server = app.listen(7000, () => {
    console.log('Server running!')
});

// const io = socketio(server)


// io.on('connection', (socket) => {
//     console.log('a user connected');
  
//     socket.on('createRoom', ({creatorId, roomName}, callback) => {
//       const roomId = Math.random().toString(36).substring(2, 8);; // generate a unique room id
//       const room = {
//         id: roomId,
//         name: roomName,
//         creator: creatorId,
//         users: [],
//       };
//       console.log(room, "Room created",roomId);
  
//       // Join the room as the creator
//       socket.join(roomId);
//       room.users.push(socket.id);
  
//       // Store the room data in a map
//     //  rooms.set(roomId, room);
  
//       // Emit a success message to the creator
//       socket.emit('roomCreated', roomId);
  
//       // Return the room id to the client
//     //   callback(roomId);
  
//       console.log(`Room created: ${roomId}`);
//     });
//   });
  
//   app.post('/createRoom', (req, res) => {
//     const { creatorId, roomName } = req.body;
//     try {
//       // Trigger 'createRoom' event on socket connection
//       io.emit('createRoom', { creatorId, roomName }, (roomId) => {
//         res.status(200).send({
//           roomId,
//           code: 200,
//           status: 'SUCCESS',
//         });
//       });
//     } catch (error) {
//       res.status(500).send({
//         code: 500,
//         status: 'ERROR',
//         error: error.message,
//       });
//     }
//   });
  
  

