const router = require('express').Router()
const index = require('../controller/index')
const socket = require('../socket')

router.post('/createUser',index.createUser)
router.post('/scheduleMeeting',index.scheduleMeeting);
router.post('/updateMeeting/:id',index.updateMeeting);
router.post('/deleteMeeting/:id',index.deleteMeeting);

//create socket room 
router.post('/createRoom',socket.createRoom)

module.exports = router;