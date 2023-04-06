const router = require('express').Router()
const index = require('../controller/index')

router.post('/scheduleMeeting',index.scheduleMeeting)

module.exports = router;