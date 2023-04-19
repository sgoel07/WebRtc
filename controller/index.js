const Meeting = require('../model/meeting');
const catchAsyncAwait = require('../middleware/catchAsyncAwait');
const socket = require('../socket')
const User = require('../model/user');
const {jwtSign} = require('../utils/token');
const Token = require('../model/token')

exports.createUser = catchAsyncAwait(async(req,res)=>{
    const {name,type,userId} = req.body
    try {
        let data = await User.create({
            name:name,
            type:type,
            userId:userId
        });
        const token = jwtSign({ _id: data._id, name: User.data });
        await Token.create({
            userId: data._id,
            token: token,
            type: 'Invite'
          });
        res.status(200).send({
            date: data,
            code: 200,
            status: "SUCCESS"
        })
    } catch (error) {
        res.status(400).send({
            error: error,
            code: 400,
            status: "Error"
        })
    }
})

exports.scheduleMeeting = catchAsyncAwait(async (req, res) => {
    const { date, time, senderId, createrId, title } = req.body
    try {
        let token = await Token.find({userId:createrId});
        console.log(token,"Check token")
        let data = await Meeting.create({
            date: date,
            time: time,
            title: title,
            senderId: senderId,
            createrId: createrId,
            meetingLink:`http://${req.headers.host}/webrtc/v1/meetingLink/${encodeURIComponent(token[0].token)}`
        });
        res.status(200).send({
            data: data,
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
});


exports.updateMeeting = catchAsyncAwait(async (req, res) => {
    const createrId = req.params.id
    const { date, time } = req.body
    try {
        await Meeting.updateOne(
            { createrId: createrId },
            { $set: { date: date, time: time } },
            { new: true }
        )
        let updatedData = await Meeting.find({ createrId: createrId })
        res.status(200).send({
            date: updatedData,
            code: 200,
            status: "SUCCESS"
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            error: error,
            code: 400,
            status: "Error"
        })
    }
});

exports.deleteMeeting = catchAsyncAwait(async (req, res) => {
    const createrId = req.params.id
    try {
        await Meeting.findOneAndDelete({ createrId: createrId })
        res.status(200).send({
            code: 200,
            status: "SUCCESS"
        })
    } catch (error) {
        res.status(400).send({
            error: error,
            code: 400,
            status: "Error"
        })
    }
})