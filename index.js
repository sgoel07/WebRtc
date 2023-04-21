const express = require('express');
const app = express()
const database = require('./config')
const socket = require('./socket')
require('dotenv').config()

const socketio = require('socket.io');
const ngrok = require('ngrok');




app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(express.static('public'));
app.set('view engine', 'hbs');
app.use('/webRtc/v1',require('./routers/index'))


const server = app.listen(7000, () => {
    console.log('Server running!')
});

ngrok.connect({
    proto : 'http',
    addr : 7000,
}, (err, url) => {
    if (err) {
        console.error('Error while connecting Ngrok',err);
        return new Error('Ngrok Failed');
    }
});

