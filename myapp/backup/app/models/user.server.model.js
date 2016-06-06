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
    phone: Number ,
    password: String ,
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

// var News = mongoose.model('News', NewsSchema);
var User = mongoose.model('User', UserSchema);
