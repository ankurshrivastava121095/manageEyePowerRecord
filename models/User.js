const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    userName : {
        type : String,
        required : true,
        unique: true
    },
    phone : {
        type : Number,
        required : true
    },
    firmName : {
        type : String,
        required : true,
        default: 'None',
    },
    email : {
        type : String,
        required : true,
        unique: true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        required : true,
        default: 'Super Admin',
    },
    city : {
        type : String,
        required : true,
        default: 'Gwalior',
    },
    address : {
        type : String,
        required : true,
        default: 'Gwalior',
    },
    status : {
        type : String,
        required : true,
        default: 'active',
    },
    isDeleted : {
        type : Number,
        required : true,
        default: 0,
    },
},{ timestamps : true })

const UserModel = mongoose.model('users',UserSchema)

module.exports = UserModel