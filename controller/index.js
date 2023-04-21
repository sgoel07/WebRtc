const Meeting = require('../model/meeting');
const catchAsyncAwait = require('../middleware/catchAsyncAwait');
const socket = require('../socket')
const User = require('../model/user');
const {jwtSign} = require('../utils/token');
const Token = require('../model/token');
const path = require('path')


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
    const creatorId =  req.params.id
    const { date, time, senderId, title } = req.body
    try {
        let data;
        let token = await Token.find({userId:creatorId});
        let userExists = await User.find({_id:senderId});
        console.log(userExists,"Check user exists or not")
        if(userExists.length ==1){
            data = await Meeting.create({
                date: date,
                time: time,
                title: title,
                senderId: senderId,
                creatorId: creatorId,
                meetingLink:`http://${req.headers.host}/webrtc/v1/joinMeeting/${encodeURIComponent(token[0].token)}`
            });
        }
        else{
            console.log("id does not exits")
        }
       
        res.status(200).send({
            data: data,
            code: 200,
            // message:"Meeting created Successfully.",
            status: "SUCCESS"
        })
    } catch (error) {
        // console.log(error, "Error")
        res.status(400).send({
            // error: error.message,
            error:"This sender id does not exits",
            code: 400,
            status: "Error"
        })
    }
});


exports.updateMeeting = catchAsyncAwait(async (req, res) => {
    const creatorId = req.params.id
    const { date, time } = req.body
    try {
        await Meeting.updateOne(
            { _id: creatorId },
            { $set: { date: date, time: time } },
            { new: true }
        )
        let updatedData = await Meeting.find({ _id: creatorId })
        res.status(200).send({
            date: updatedData,
            code: 200,
            message:"Meeting updated Successfully",
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
    const creatorId = req.params.id
    try {
        await Meeting.findOneAndDelete({ _id: creatorId })
        res.status(200).send({
            message:"Meeting deleted Successfully.",
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

exports.joinMeeting = async(req,res)=>{
    const meetingLink = req.params.meetingLink
    try {
        let data = await Meeting.find({meetingLink:meetingLink});
        console.log(data)
        // res.sendFile('../public/index.html', {root: __dirname })
        res.sendFile(path.resolve('public/index.html'));
        // res.status(200).send({
        //     message:"Meeting join Successfully.",
        //     code: 200,
        //     status: "SUCCESS"
        // })
    } catch (error) {
        console.log(error,"Error")
        res.status(400).send({
            error: error.message,
            code: 400,
            status: "Error"
        })
    }
}