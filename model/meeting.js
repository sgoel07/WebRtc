const mongoose = require('mongoose');

const meetingSchema = mongoose.Schema({
    date:{type:String},
    time:{type:String},
    createrId:{type:String},
    senderId:{type:String},
    title:{type:String}
})

module.exports = mongoose.model('Meeting',meetingSchema)