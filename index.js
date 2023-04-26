const express = require('express');
const app = express()
const database = require('./config')
// const socket = require('./socket')
require('dotenv').config()
const cors = require('cors')
const Meeting = require('./model/meeting')
const User = require('./model/user')
const path = require('path')




const socketio = require('socket.io');
const ngrok = require('ngrok');

let PORT=process.env.PORT || 8000


app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(express.static('public'));
app.set('view engine', 'hbs');
app.use('/webRtc/v1',require('./routers/index'))


const server = app.listen(process.env.PORT, () => {
    console.log('Server running!')
   
});

var twilio = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  
  
  app.use(express.static(path.resolve(__dirname, 'public')));
app.use(cors())
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
  });


  io.on('connection', function(socket){
  
    socket.on('join', async function(room) {
      console.log("hi")
      console.log('Room:', room);
  
  
      // save data in db
      let date,time,title,inviteId,creatorId;
      let data = await Meeting.create({
        date: room.date,
        time: room.time,
        title: room.title,
        inviteId: room.inviteId,
        creatorId: room.creatorId
    });
  
    console.log(data.creatorId,"Cehck user data")
    let checkId = await User.find({userId:data.creatorId});
    console.log(checkId,"Check id",checkId.length == 0)
  
   if(checkId.length == 0){
    socket.on('join', function (){
      socket.Disconnect(0);
  });
   }
  
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
  
