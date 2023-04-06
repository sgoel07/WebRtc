const express = require('express');
const app = express()
const database = require('./config')
const socket = require('./socket')
require('dotenv').config()
const port=7000


app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(express.static('public'));

app.use('/webRtc/v1',require('./routers/index'))


app.listen(port,()=>{
    console.log("server is running..")
})