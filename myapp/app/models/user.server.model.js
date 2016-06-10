var mongoose = require('mongoose');

// var NewsSchema = new mongoose.Schema({
//     title: String,
//     content: String,
//     createTime: {
//         type: Date,
//         default: Date.now
//     }
// })
  
var UserSchema = new mongoose.Schema({
    status: { type: Number, default: 0 },
    phone: Number,
    password: String,
    token:String,
    role: { type: Number, default: 0 },
    reg_time: {
        type: Date,
        default: Date.now
    },
    last_time: {
        type: Date,
        default: Date.now
    },
    last_address: { type: String, default: ''},
    login_count: { type: Number, default: 0 },
})  

var ActivitySchema = new mongoose.Schema({
  userid :Number,
  uuid :Number,
  title :String,
  content :String,
  last_modify_date:  {
        type: Date,
        default: Date.now
    },
  startdate: Date,
  enddate: Date,
  location: String,
  publish_territory: String,
  status:Boolean,
  participants:Number,
  personlimits:Number, 
  createdate:{
        type: Date,
        default: Date.now
    },
  category:String,
  sex:Boolean,
})



// var News = mongoose.model('News', NewsSchema);
var User = mongoose.model('User', UserSchema);
var User = mongoose.model('Publish_Activity', ActivitySchema);
