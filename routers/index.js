const router = require('express').Router()
const index = require('../controller/index')
const socket = require('../socket')
const path = require("path")

router.post('/createUser',index.createUser)
router.post('/scheduleMeeting',index.scheduleMeeting);
router.post('/updateMeeting/:id',index.updateMeeting);
router.post('/deleteMeeting/:id',index.deleteMeeting);
router.get('/joinMeeting',index.joinMeeting)

//create socket room 
router.post('/createRoom',socket.createRoom)
router.get("/:token", (req, res) => {
    console.log("kfjkgj", req.query.token)
    let pathx = path.join(__dirname, "public", "index.html");
    pathx= pathx.replace("routers/",'')
    res.sendFile(pathx);
});
  
// router.get("/:token", (req, res) => {
//     console.log("kfjkgj", req.query.token)
//     let pathx = path.join(__dirname, "public", "index.html");
//     pathx= pathx.replace("routers/",'')
//     res.sendFile(pathx);
// });

module.exports = router;