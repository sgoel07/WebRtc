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

