const mongoose = require('mongoose');

const meetingSchema = mongoose.Schema({
    date:{type:Date},
    time:{type:String},
    createrId:{type:String},
    senderId:{type:String},
    title:{type:String}
})

module.exports = mongoose.model('Meeting',meetingSchema)