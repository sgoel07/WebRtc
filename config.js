const mongoose=require('mongoose')


mongoose.connect('mongodb+srv://developerinfostride:Zuwo6DmBrw2CXQei@cluster0.ch5j4y0.mongodb.net/WebRtc',{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>{
    console.log("Database is connected..")
}).catch(()=>{
    console.log("There is error in your mongodb connection..")
})




// username :developerinfostride 
//password :Zuwo6DmBrw2CXQei


