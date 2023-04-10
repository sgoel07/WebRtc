const Meeting = require('../model/meeting');
const catchAsyncAwait = require('../middleware/catchAsyncAwait')


exports.scheduleMeeting = catchAsyncAwait(async(req,res)=>{
    const {date,time,senderId,createrId,title} = req.body
    try {
        let data = await Meeting.create({
            date:date,
            time:time,
            title:title,
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
        res.status(400).send({
            error:error,
            code:400,
            status:"Error"
        })
    }
});

exports.updateMeeting = catchAsyncAwait(async(req,res)=>{
    const createrId = req.params.id
    const {date,time} = req.body
    try {
         await Meeting.updateOne(
            {createrId:createrId},
            {$set:{date:date,time:time}},
            {new:true}
        )
        let updatedData = await Meeting.find({createrId:createrId})
        res.status(200).send({
            date:updatedData,
            code:200,
            status:"SUCCESS"
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            error:error,
            code:400,
            status:"Error"
        })
    }
});

exports.deleteMeeting = catchAsyncAwait(async(req,res)=>{
    const createrId = req.params.id
    try {
        await Meeting.findOneAndDelete({createrId:createrId})
        res.status(200).send({
            code:200,
            status:"SUCCESS"
        })
    } catch (error) {
        res.status(400).send({
            error:error,
            code:400,
            status:"Error"
        })
    }
})