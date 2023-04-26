const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{type:String},
    email:{type:String},
    password:{type:String},
    type:{type:String,enum:['creator','receiver']},
    userId:{type:String}

})

module.exports = mongoose.model('User',userSchema);