const Meeting = require('../model/meeting');
const catchAsyncAwait = require('../middleware/catchAsyncAwait')


exports.scheduleMeeting = catchAsyncAwait(async(req,res)=>{
    const {date,time,senderId,createrId} = req.body
    try {
        let data = await Meeting.create({
            date:date,
            time:time,
            senderId:senderId,
            createrId:createrId
        });
        res.status(200).send({
            date:data,
            code:200,
            status:"SUCCESS"
        })
    } catch (error) {
        console.log(error,"Error")
    }
})