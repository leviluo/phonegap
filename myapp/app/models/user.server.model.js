var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
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
    token: String,
    role: { type: Number, default: 0 },
    reg_time: {
        type: Date,
        default: Date.now
    },
    last_time: {
        type: Date,
        default: Date.now
    },
    last_address: { type: String, default: '' },
    login_count: { type: Number, default: 0 },
})

var ActivitySchema = new mongoose.Schema({
    uuid: Number,
    title: String,
    content: String,
    user: ObjectId,
    images: [String],
    last_modify_date: {
        type: Date,
        default: Date.now
    },
    startdate: Date,
    enddate: Date,
    location: String,
    publish_territory: Boolean,
    status: Boolean,
    participants: Number,
    personlimits: Number,
    createdate: {
        type: Date,
        default: Date.now
    },
    category: String,
    sex: Boolean,
})


// var News = mongoose.model('News', NewsSchema);
mongoose.model('User', UserSchema);
mongoose.model('Activity', ActivitySchema);
