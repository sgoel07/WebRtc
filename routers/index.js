const router = require('express').Router()
const index = require('../controller/index')

router.post('/scheduleMeeting',index.scheduleMeeting);
router.post('/updateMeeting/:id',index.updateMeeting);
router.post('/deleteMeeting/:id',index.deleteMeeting)

module.exports = router;