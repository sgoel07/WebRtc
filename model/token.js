const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const tokenSchema = Schema ({
    userId:{type:Schema.Types.ObjectId,require:true,ref:'User'},
    token:{type:String,required:true},
    type: { type: String, default:'Invite' },
    createdAt:{type:Date,required:true,default:Date.now}
});

module.exports = mongoose.model('Token',tokenSchema);